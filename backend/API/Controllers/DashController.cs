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

        [HttpGet("GetDashStockReport")]
        public async Task<ActionResult<List<GetDashStockReportDto>>> GetDashStockReportDto()
        {
            try
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.UtcNow);

            

                var productsQuery = _dbContext.Products
                    .OrderBy(p => p.CategoryId)
                    .ThenBy(p => p.Category.CategoryName)
                    .ThenBy(p => p.ProductName)
                    .ThenBy(p => p.ProductSize);

                var products = await productsQuery.ToListAsync();

                var report = new List<GetDashStockReportDto>();

                foreach (var product in products)

                    
                {
                    var openingStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.Date < currentDate)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var currentStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.Date == currentDate)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var totalPurchased = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.Date == currentDate && t.TransactionType == TransactionType.Purchase)
                        .Sum(t => t.Piece) ?? 0;

                    var totalSold = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.Date == currentDate && t.TransactionType == TransactionType.Sale)
                        .Sum(t => t.Piece) ?? 0;

                    var totalStockBalance = openingStock + currentStock;

                    var productCategory = _dbContext.Categories.FirstOrDefault(c => c.Id == product.CategoryId);

                    var convertedReport = new GetDashStockReportDto
                    {
                        ProductId = product.Id,
                        ProductName = product.ProductName,
                        CategoryId = product.CategoryId,
                        CategoryName = productCategory?.CategoryName,
                        CostPrice = product.CostPrice.ToString(),
                        WholeSalePrice = product.WholeSalePrice.ToString(),
                        RetailPrice = product.RetailPrice.ToString(),
                        ProductSize = product.ProductSize.ToString(),
                        TotalStockBalance = totalStockBalance,
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


    }
}
