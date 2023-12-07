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
        public IActionResult GetStockReportForProduct([FromQuery] long productId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            try
            {
                if (!DateTime.TryParse(fromDate, out DateTime fromDateValue) || !DateTime.TryParse(toDate, out DateTime toDateValue))
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
                        openingStock += transaction.Piece ?? 0;
                    }
                    else if (transaction.TransactionType == TransactionType.Sale)
                    {
                        openingStock -= transaction.Piece ?? 0;
                    }
                }
                // Retrieve transactions within the date range and for the specified product
                var transactions = _dbContext.Transactions
                    .Where(t => t.ProductId == productId &&
                                t.Date >= fromDateOnly && t.Date <= toDateOnly)
                    .OrderBy(t => t.Date).ThenBy(t => t.TransactionId)
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
                        TotalCost = 0,
                        StockValue = openingStock * costPrice,
                    };
                    report.Add(openingBalanceReportDto);
                }

                int stockBalance = openingStock; // Initialize stock balance with opening stock

                foreach (var transaction in transactions)
                {
                    if (transaction.TransactionType == TransactionType.Purchase)
                    {
                        stockBalance += transaction.Piece ?? 0;
                    }
                    else if (transaction.TransactionType == TransactionType.Sale)
                    {
                        stockBalance -= transaction.Piece ?? 0;
                    }
                    var transactionUserName = _dbContext.Users
                     .Where(u => u.Id == transaction.UserId)
                     .Select(u => u.UserName)
                     .FirstOrDefault();

                    var reportDto = new ProductStockReportDto
                    {
                        ProductId = productId,
                        ProductName = productName,
                        TransactionId = transaction.TransactionId,
                        InvoiceNumber = transaction.InvoiceNumber,
                        TransactionType = transaction.TransactionType.ToString(),
                        StockBalance = stockBalance,
                        Date = transaction.Date, // Assuming Date property in ProductStockReportDto
                        Piece = transaction.Piece ?? 0,
                        Credit = transaction.Credit,
                        Debit = transaction.Debit,
                        Narration = transaction.Narration,
                        TotalCost = (transaction.Piece ?? 0) * costPrice,
                        StockValue = stockBalance * costPrice, // Update Stock Value directly from stock balance
                        UserName = transactionUserName,
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


        [HttpGet("LedgerReport")]
        public IActionResult GetLedgerReport([FromQuery] long ledgerId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            try
            {
                if (!DateTime.TryParse(fromDate, out DateTime fromDateValue) || !DateTime.TryParse(toDate, out DateTime todateValue))
                {
                    return BadRequest("Invalid date format. Please provice date in YYYY-MM-DD format");
                }
                var fromDateOnly = new DateOnly(fromDateValue.Year, fromDateValue.Month, fromDateValue.Day);
                var toDateOnly = new DateOnly(todateValue.Year, todateValue.Month, todateValue.Day);

                var ledger = _dbContext.Ledgers.FirstOrDefault(l => l.Id == ledgerId);
                if (ledger == null)
                {
                    return BadRequest("Ledger not found");
                }

                var ledgerName = ledger.LedgerName;

                var prevTransactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date < fromDateOnly).ToList();

                decimal openingBal = 0;

                foreach (var transaction in prevTransactions)
                {
                    if (transaction.TransactionType == TransactionType.Purchase || transaction.TransactionType == TransactionType.Receipt)
                    {
                        openingBal += transaction.Credit ?? 0;
                    }
                    else if (transaction.TransactionType == TransactionType.Payment)
                    {
                        openingBal -= transaction.Debit ?? 0;
                    }
                }

                var transactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date >= fromDateOnly && t.Date <= toDateOnly)
                    .OrderBy(t => t.Date)
                    .ThenBy(t => t.TransactionId).ToList();

                var report = new List<LedgerReportDto>();

                if (openingBal != 0)
                {
                    var openingBalReportDto = new LedgerReportDto
                    {
                        LedgerId = ledgerId,
                        LedgerName = ledgerName,
                        TransactionId = 0,
                        TransactionType = "OpeningBalance",
                        Date = fromDateOnly,
                        Credit = 0,
                        Debit = 0,
                        Narration = "Balance b/d",
                        Balance = openingBal,

                    };
                    report.Add(openingBalReportDto);
                }

                decimal currentBal = openingBal;

                foreach (var transaction in transactions)
                {
                    if (transaction.TransactionType == TransactionType.Purchase || transaction.TransactionType == TransactionType.Receipt)
                    {
                        currentBal += transaction.Credit ?? 0;
                    }
                    else if (transaction.TransactionType == TransactionType.Payment)
                    {
                        currentBal -= transaction.Debit ?? 0;
                    }
                    var transactionUserName = _dbContext.Users.Where(u => u.Id == transaction.UserId).Select(u => u.UserName).FirstOrDefault();

                    var reportDto = new LedgerReportDto
                    {
                        LedgerId = ledgerId,
                        LedgerName = ledgerName,
                        TransactionId = transaction.TransactionId,
                        InvoiceNumber = transaction.InvoiceNumber,
                        TransactionType = transaction.TransactionType.ToString(),
                        Date = transaction.Date,
                        Credit = transaction.Credit,
                        Debit = transaction.Debit,
                        Narration = transaction.Narration,
                        Balance = currentBal + openingBal,
                        UserName = transactionUserName,
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

        [HttpGet("StockReport")]
        public IActionResult GetStockReport([FromQuery] long? categoryId, [FromQuery] long? productId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            try
            {
                if (!DateTime.TryParse(fromDate, out DateTime fromDateValue) || !DateTime.TryParse(toDate, out DateTime toDateValue))
                {
                    return BadRequest("Provide in YYYY-MM-DD format");
                }

                var fromDateOnly = new DateOnly(fromDateValue.Year, fromDateValue.Month, fromDateValue.Day);
                var toDateOnly = new DateOnly(toDateValue.Year, toDateValue.Month, toDateValue.Day);

                var productsQuery = _dbContext.Products.AsQueryable();

                if (categoryId.HasValue)
                {
                    productsQuery = productsQuery.Where(p => p.CategoryId == categoryId);
                }

                if (productId.HasValue)
                {
                    productsQuery = productsQuery.Where(p => p.Id == productId);
                }

                var products = productsQuery.ToList();

                var report = new List<StockReportDto>();

                foreach (var product in products)
                {
                    var openingStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.Date < fromDateOnly)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var currentStock = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.Date >= fromDateOnly && t.Date <= toDateOnly)
                        .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                    var totalStockBalance = openingStock + currentStock;

                    var productCategory = _dbContext.Categories.FirstOrDefault(c => c.Id == product.CategoryId);

                    var reportDto = new StockReportDto
                    {
                        ProductId = product.Id,
                        ProductName = product.ProductName,
                        CategoryName = productCategory?.CategoryName,
                        CategoryId = product.CategoryId,
                        CostPrice = product.CostPrice.ToString(),
                        WholeSalePrice = product.WholeSalePrice.ToString(),
                        RetailPrice = product.RetailPrice.ToString(),
                        ProductSize = product.ProductSize.ToString(),
                        OpeningStock = openingStock,
                        CurrentStock = currentStock,
                        TotalStockBalance = totalStockBalance,
                        StockValue = totalStockBalance * product.CostPrice,
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
