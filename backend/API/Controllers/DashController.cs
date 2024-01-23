using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Dash;
using Module.Entities;
using Shared.Enums;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public DashController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }



        [HttpGet("GetOfficeNames")]
        public async Task<ActionResult<List<GetOfficeNameDto>>> GetOfficeList()
        {
            var offices = await _dbContext.Offices.ToListAsync();

            if (offices == null || !offices.Any())
            {
                return NoContent();
            }

            var combinedOfficeDetails = offices.Select(office => new GetOfficeNameDto
            {
                CombinedOfficeDetails = $"{office.BranchName}, {office.BranchAddress}"
            }).ToList();

            return Ok(combinedOfficeDetails);
        }


        [HttpGet("GetDashProductList")]
        public async Task<ActionResult<List<GetDashProductListDto>>> GetDashProductList()
        {
            try
            {
                var stocks = await _dbContext.Products.Include(p => p.Category).OrderBy(c => c.Category.CategoryName).ThenBy(p => p.ProductName).ToListAsync();

                if (stocks == null || stocks.Count == 0)
                {
                    return NotFound("Stocks not found");
                }

                var mappedStocks = _mapper.Map<List<Product>, List<GetDashProductListDto>>(stocks);

                return Ok(mappedStocks);
            }
            catch (Exception ex)
            {

                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("GetFrequentySoldProducts")]
        public async Task<ActionResult<List<GetFrequentSalesProductDto>>> GetFrequentlySoldProducts()
        {
            try
            {
                // Setting the start date for the last 90 days
                var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-90));
                // Setting the current date of system date
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.UtcNow);

                // Quering the database to get a list of products including their categories, ordered by category and then by product name
                var productsQuery = _dbContext.Products.Include(c => c.Category)
                    .OrderBy(p => p.Category.CategoryName)
                    .ThenBy(p => p.ProductName);

                // Executing the query to get the list of products
                var products = await productsQuery.ToListAsync();

                // Creating a list to store instances of the GetFrequentSalesProductDto
                var frequentSalesProducts = new List<GetFrequentSalesProductDto>();

                // Looping through each product in the products list
                foreach (var product in products)
                {
                    // Getting the total quantity sold for each product in the last 90 days
                    var totalSold = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate >= startDate && t.EngDate <= currentDate && t.TransactionType == TransactionType.Sale)
                        .Sum(t => t.Piece) ?? 0;

                    // Creating an instance of the GetFrequentSalesProductDto and populate its properties including the TotalSoldInLast90Days recently calculated
                    var frequentSalesProductDto = new GetFrequentSalesProductDto
                    {
                        CategoryName = product.Category.CategoryName,
                        ProductName = product.ProductName,
                        ProductSize = product.ProductSize,
                        TotalSoldInLast90Days = totalSold
                    };

                    // Adding the instance to the frequentSalesProducts list
                    frequentSalesProducts.Add(frequentSalesProductDto);
                }

                // Ordering the frequentSalesProducts list by TotalSoldInLast90Days in descending order
                frequentSalesProducts = frequentSalesProducts.OrderByDescending(p => p.TotalSoldInLast90Days).ToList();

                // Returning the frequentSalesProducts list as the HTTP response
                return Ok(frequentSalesProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("GetDashStockReport")]
        public async Task<ActionResult<List<GetDashStockReportDto>>> GetDashStockReportDto()
        {

            //Make resuable code for this report and GetLowStockProducts and just change the order to display

            try
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.UtcNow);

                var productsQuery = _dbContext.Products

                    .OrderBy(p => p.Category.CategoryName)
                    .ThenBy(p => p.ProductName);

                var products = await productsQuery.ToListAsync();

                var report = new List<GetDashStockReportDto>();

                foreach (var product in products)


                {
                    var openingStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate < currentDate)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var currentStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate == currentDate)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var totalPurchased = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate == currentDate && t.TransactionType == TransactionType.Purchase)
                        .Sum(t => t.Piece) ?? 0;

                    var totalSold = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate == currentDate && t.TransactionType == TransactionType.Sale)
                        .Sum(t => t.Piece) ?? 0;

                    var totalStockBalance = openingStock + currentStock;

                    var productCategory = _dbContext.Categories.FirstOrDefault(c => c.Id == product.CategoryId);

                    var convertedReport = new GetDashStockReportDto
                    {

                        CategoryId = product.CategoryId,
                        CategoryName = productCategory?.CategoryName,
                        ProductId = product.Id,
                        ProductName = product.ProductName,
                        ProductSize = product.ProductSize.ToString(),
                        OpeningStock = openingStock,
                        TotalPurchased = totalPurchased,
                        TotalSold = totalSold,
                        CurrentStock = currentStock,
                        TotalStockBalance = totalStockBalance,
                        StockValue = totalStockBalance * product.CostPrice,
                    };

                    report.Add(convertedReport);
                }
                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("GetLowStockProducts")]
        public async Task<ActionResult<List<GetLowStockDto>>> GetLowStockProducts()
        {

            //Make resuable code for this report and GetDashStockReport and just change the order to display

            try
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.UtcNow);

                var productsQuery = _dbContext.Products

                    .OrderBy(p => p.Category.CategoryName)
                    .ThenBy(p => p.ProductName);

                var products = await productsQuery.ToListAsync();

                var report = new List<GetLowStockDto>();

                foreach (var product in products)


                {
                    var openingStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate < currentDate)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var currentStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate == currentDate)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var totalPurchased = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate == currentDate && t.TransactionType == TransactionType.Purchase)
                        .Sum(t => t.Piece) ?? 0;

                    var totalSold = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.EngDate == currentDate && t.TransactionType == TransactionType.Sale)
                        .Sum(t => t.Piece) ?? 0;

                    var totalStockBalance = openingStock + currentStock;

                    var productCategory = _dbContext.Categories.FirstOrDefault(c => c.Id == product.CategoryId);

                    var convertedReport = new GetLowStockDto
                    {

                        CategoryName = productCategory?.CategoryName,                       
                        ProductName = product.ProductName,
                        ProductSize = product.ProductSize.ToString(),
                        OpeningStock = openingStock,
                        TotalPurchased = totalPurchased,
                        TotalSold = totalSold,
                        CurrentStock = currentStock,
                        TotalStockBalance = totalStockBalance,
                        StockValue = totalStockBalance * product.CostPrice,
                    };

                   report.Add(convertedReport);
                }
                var orderedReport = report.OrderBy(o=>o.TotalStockBalance).ToList();
                return Ok(orderedReport);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
