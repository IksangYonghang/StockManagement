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
        public IActionResult GetStockReportForProduct([FromQuery] long productId, [FromQuery] string fromDate, [FromQuery] string toDate )
        {
            try
            {
                if (!DateTime.TryParse(fromDate, out DateTime fromDateValue) ||   !DateTime.TryParse(toDate, out DateTime toDateValue))
                {
                    return BadRequest("Invalid date format. Please provide dates in YYYY-MM-DD format.");
                }

                var fromDateOnly = new DateOnly(fromDateValue.Year, fromDateValue.Month, fromDateValue.Day);
                var toDateOnly = new DateOnly(toDateValue.Year, toDateValue.Month, toDateValue.Day);

                // Retrieve product details
                var product = _dbContext.Products
                    .FirstOrDefault(p => p.Id == productId);

                if (product == null)
                {
                    return BadRequest("Product not found");
                }

                decimal costPrice = product.CostPrice;
                var productName = product.ProductName;

                // Retrieve transactions before the fromDate for the specified product
                var prevTransactions = _dbContext.Transactions
                    .Where(t => t.ProductId == productId && t.Date < fromDateOnly)
                    .OrderBy(t => t.Date)
                    .ToList();

                int openingStock = 0;

                // Calculate opening stock based on previous transactions
                foreach (var transaction in prevTransactions)
                {
                    if (transaction.TransactionType == TransactionType.Purchase)
                    {
                        openingStock += transaction.Piece;
                    }
                    else if (transaction.TransactionType == TransactionType.Sale)
                    {
                        openingStock -= transaction.Piece;
                    }
                }

                // Retrieve transactions within the date range and for the specified product
                var transactions = _dbContext.Transactions
                    .Where(t => t.ProductId == productId &&
                                t.Date >= fromDateOnly && t.Date <= toDateOnly)
                    .OrderBy(t => t.Date)
                    .ToList();

                var report = new List<ProductStockReportDto>();

                // Add opening balance row if there are transactions before fromDate
                if (openingStock != 0)
                {
                    var openingBalanceReportDto = new ProductStockReportDto
                    {
                        ProductId = productId,
                        ProductName = productName,
                        TransactionId = 0,
                        TransactionType = "Opening Balance",
                        StockBalance = openingStock,
                        Date = fromDateOnly,
                        Piece = 0,
                        Credit = 0,
                        Debit = 0,
                        Narration = "Balance b/d",
                        TotalCost = openingStock * costPrice,
                        StockValue = openingStock*costPrice, 
                    };

                    report.Add(openingBalanceReportDto);
                }

                int stockBalance = openingStock; // Initialize stock balance with opening stock

                foreach (var transaction in transactions)
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
                        StockValue = stockBalance * costPrice // Update Stock Value directly from stock balance
                    };

                    report.Add(reportDto);
                }

                return Ok(report);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                // Logger.LogError(ex, "Error occurred while generating stock report.");

                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }



    }
}
