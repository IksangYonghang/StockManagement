using Data.DataContext;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Reports;
using Shared.Enums;
using System;
using System.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ReportController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpGet("ProductStockReport")]
        public IActionResult GetStockReportForProduct(
              [FromQuery] long productId,
              [FromQuery] string fromDate,
              [FromQuery] string toDate
          )
        {
            try
            {
                if (!DateTime.TryParse(fromDate, out DateTime fromDateValue) ||
                    !DateTime.TryParse(toDate, out DateTime toDateValue))
                {
                    return BadRequest("Invalid date format. Please provide dates in YYYY-MM-DD format.");
                }

                var fromDateOnly = new DateOnly(fromDateValue.Year, fromDateValue.Month, fromDateValue.Day);
                var toDateOnly = new DateOnly(toDateValue.Year, toDateValue.Month, toDateValue.Day);

                // Retrieve transactions within the date range and for the specified product
                var transactions = _dbContext.Transactions
                    .Where(t => t.ProductId == productId &&
                                t.Date >= fromDateOnly && t.Date <= toDateOnly)
                    .ToList();

                // Group transactions by TransactionId
                var transactionsByTransactionId = transactions
                    .GroupBy(t => t.TransactionId) // Group by TransactionId
                    .ToList();

                var report = new List<ProductStockReportDto>();

                var productName = _dbContext.Products
                    .Where(p => p.Id == productId)
                    .Select(p => p.ProductName)
                    .FirstOrDefault();

                var products = _dbContext.Products
                    .Where(p => p.Id == productId)
                    .FirstOrDefault();

                if (products == null)
                {
                    return BadRequest("Product not found");
                }

                decimal costPrice = products.CostPrice;

                var openingBalanceReportDto = new ProductStockReportDto
                {
                    ProductId = productId,
                    ProductName = productName,
                    TransactionId = 0,
                    TransactionType = "Opening Balance",
                    StockBalance = 0,
                    Date = fromDateOnly,
                    Piece = 0,
                    Credit = 0,
                    Debit = 0,
                    Narration = "Opening Balance",
                    TotalCost = 0,
                    StockValue = 0,
                };

                report.Add(openingBalanceReportDto);
                int stockBalance = 0; // Initialize the stock balance outside the loop

                foreach (var transaction in transactions.OrderBy(t => t.Date))
                {
                    if (transaction.TransactionType == TransactionType.Purchase)
                    {
                        stockBalance += transaction.Piece;
                    }
                    else if (transaction.TransactionType == TransactionType.Sale)
                    {
                        stockBalance -= transaction.Piece;
                    }

                    var reportDto = new ProductStockReportDto
                    {
                        ProductId = productId,
                        ProductName = productName,
                        TransactionId = transaction.TransactionId,
                        TransactionType = transaction.TransactionType.ToString(),
                        StockBalance = stockBalance,
                        Date = transaction.Date, // Assuming Date property in ProductStockReportDto
                        Piece = transaction.Piece,
                        Credit = transaction.Credit,
                        Debit = transaction.Debit,
                        Narration = transaction.Narration,
                        TotalCost = stockBalance * costPrice,
                        StockValue = report.Last().StockValue + (stockBalance * costPrice) // Cumulative addition
                    };

                    report.Add(reportDto);
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
