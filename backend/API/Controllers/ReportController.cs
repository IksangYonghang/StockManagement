using Data.DataContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Reports;
using Shared.Enums;
using Module.Entities;


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

                var report = new List<ProductReportDto>();

                // Add opening balance row if there are transactions before fromDate
                if (openingStock != 0)
                {
                    var openingBalanceReportDto = new ProductReportDto
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

                    var reportDto = new ProductReportDto
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

                productsQuery = productsQuery.OrderBy(p => p.CategoryId)
                    .ThenBy(p => p.Category.CategoryName)
                    .ThenBy(p => p.ProductName)
                    .ThenBy(p => p.ProductSize);

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

                    var totalPurchased = _dbContext.Transactions
                       .Where(t => t.ProductId == product.Id && t.Date >= fromDateOnly && t.Date <= toDateOnly && t.TransactionType == TransactionType.Purchase)
                       .Sum(t => t.Piece) ?? 0;

                    var totalSold = _dbContext.Transactions
                        .Where(t => t.ProductId == product.Id && t.Date >= fromDateOnly && t.Date <= toDateOnly && t.TransactionType == TransactionType.Sale)
                        .Sum(t => t.Piece) ?? 0;


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
                        TotalPurchased = totalPurchased,
                        TotalSold = totalSold,
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

                var isLiabilities = ledger.MasterAccount == MasterAccount.Liabilities;
                var isAssetss = ledger.MasterAccount == MasterAccount.Assets;
                var isIncomes = ledger.MasterAccount == MasterAccount.Incomes;
                var isExpenses = ledger.MasterAccount == MasterAccount.Expenses;

                var ledgerName = ledger.LedgerName;
                var report = new List<LedgerReportDto>();

                if (isLiabilities)
                {
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
                }
                else if (isAssetss)
                {
                    var prevTransactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date < fromDateOnly).ToList();

                    decimal openingBal = 0;

                    foreach (var transaction in prevTransactions)
                    {
                        if (transaction.TransactionType == TransactionType.Sale || transaction.TransactionType == TransactionType.Payment)
                        {
                            openingBal += transaction.Debit ?? 0;
                        }
                        else if (transaction.TransactionType == TransactionType.Receipt)
                        {
                            openingBal -= transaction.Credit ?? 0;
                        }
                    }

                    var transactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date >= fromDateOnly && t.Date <= toDateOnly)
                        .OrderBy(t => t.Date)
                        .ThenBy(t => t.TransactionId).ToList();



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
                        if (transaction.TransactionType == TransactionType.Sale || transaction.TransactionType == TransactionType.Payment)
                        {
                            currentBal += transaction.Debit ?? 0;
                        }
                        else if (transaction.TransactionType == TransactionType.Receipt)
                        {
                            currentBal -= transaction.Credit ?? 0;
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

                }
                else if (isIncomes)
                {
                    var prevTransactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date < fromDateOnly).ToList();

                    decimal openingBal = 0;

                    foreach (var transaction in prevTransactions)
                    {
                        if (transaction.TransactionType == TransactionType.Payment)
                        {
                            openingBal -= transaction.Debit ?? 0;
                        }
                        else if (transaction.TransactionType == TransactionType.Receipt)
                        {
                            openingBal += transaction.Credit ?? 0;
                        }
                    }

                    var transactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date >= fromDateOnly && t.Date <= toDateOnly)
                        .OrderBy(t => t.Date)
                        .ThenBy(t => t.TransactionId).ToList();



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
                        if (transaction.TransactionType == TransactionType.Payment)
                        {
                            openingBal -= transaction.Debit ?? 0;
                        }
                        else if (transaction.TransactionType == TransactionType.Receipt)
                        {
                            openingBal += transaction.Credit ?? 0;
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

                }
                else
                {
                    var prevTransactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date < fromDateOnly).ToList();

                    decimal openingBal = 0;

                    foreach (var transaction in prevTransactions)
                    {
                        if (transaction.TransactionType == TransactionType.Payment)
                        {
                            openingBal += transaction.Debit ?? 0;
                        }
                        else if (transaction.TransactionType == TransactionType.Receipt)
                        {
                            openingBal -= transaction.Credit ?? 0;
                        }
                    }

                    var transactions = _dbContext.Transactions.Where(t => t.LedgerId == ledgerId && t.Date >= fromDateOnly && t.Date <= toDateOnly)
                        .OrderBy(t => t.Date)
                        .ThenBy(t => t.TransactionId).ToList();



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
                        if (transaction.TransactionType == TransactionType.Payment)
                        {
                            openingBal += transaction.Debit ?? 0;
                        }
                        else if (transaction.TransactionType == TransactionType.Receipt)
                        {
                            openingBal -= transaction.Credit ?? 0;
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

                }
                return Ok(report);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("LedgerClosingBalance")]
        public IActionResult GetLedgerClosingBalance([FromQuery] string? master, [FromQuery] long? parentId, [FromQuery] long? ledgerId, [FromQuery] string fromDate, [FromQuery] string toDate)
        {
            try
            {
                if (!DateTime.TryParse(fromDate, out DateTime fromDateValue) || !DateTime.TryParse(toDate, out DateTime toDateValue))
                {
                    return BadRequest("Provide dates in YYYY-MM-DD format");
                }

                var fromDateOnly = new DateOnly(fromDateValue.Year, fromDateValue.Month, fromDateValue.Day);
                var toDateOnly = new DateOnly(toDateValue.Year, toDateValue.Month, toDateValue.Day);



                var ledgersQuery = _dbContext.Ledgers.AsQueryable();


                if (!string.IsNullOrEmpty(master))
                {
                    if (Enum.TryParse(master, out MasterAccount masterAccount))
                    {

                        ledgersQuery = ledgersQuery.Where(t => t.MasterAccount == masterAccount);

                    }
                    else
                    {
                        return BadRequest("Invalid master account value");
                    }
                }

                if (parentId.HasValue)
                {
                    ledgersQuery = ledgersQuery.Where(t => t.ParentId == parentId);
                }
                else if (ledgerId.HasValue)
                {
                    ledgersQuery = ledgersQuery.Where(t => t.Id == ledgerId);
                }

                ledgersQuery = ledgersQuery.OrderBy(p => p.Id)
                   .ThenBy(p => p.LedgerName)
                   .ThenBy(p => p.ParentId);

                var ledgers = ledgersQuery.ToList();

                var report = new List<LedgerClosingReportDto>();

                foreach (var ledger in ledgers)
                {

                    var isAssets = ledger.MasterAccount == MasterAccount.Assets;
                    var isLiabilities = ledger.MasterAccount == MasterAccount.Liabilities;
                    var isExpenses = ledger.MasterAccount == MasterAccount.Expenses;
                    var isIncomes = ledger.MasterAccount == MasterAccount.Incomes;

                    decimal openingBalance = 0;
                    decimal totalCurrent = 0;


                    if (isLiabilities)
                    {
                        openingBalance = _dbContext.Transactions
                         .Where(t => t.LedgerId == ledger.Id && t.Date < fromDateOnly)
                         .ToList()
                         .Sum(transaction =>
                         {
                             if (transaction.TransactionType == TransactionType.Purchase || transaction.TransactionType == TransactionType.Receipt)
                             {
                                 return +transaction.Credit ?? 0;
                             }
                             else if (transaction.TransactionType == TransactionType.Payment)
                             {
                                 return -transaction.Debit ?? 0;
                             }
                             return 0;
                         });

                        totalCurrent = _dbContext.Transactions
                         .Where(t => t.LedgerId == ledger.Id && t.Date >= fromDateOnly && t.Date <= toDateOnly)
                         .ToList()
                         .Sum(transaction =>
                         {
                             if (transaction.TransactionType == TransactionType.Purchase || transaction.TransactionType == TransactionType.Receipt)
                             {
                                 return +transaction.Credit ?? 0;
                             }
                             else if (transaction.TransactionType == TransactionType.Payment)
                             {
                                 return -transaction.Debit ?? 0;
                             }
                             return 0;
                         });

                    }
                    else if (isAssets)
                    {
                        openingBalance = _dbContext.Transactions
                         .Where(t => t.LedgerId == ledger.Id && t.Date < fromDateOnly)
                         .ToList()
                         .Sum(transaction =>
                         {
                             if (transaction.TransactionType == TransactionType.Sale || transaction.TransactionType == TransactionType.Payment)
                             {
                                 return +transaction.Debit ?? 0;
                             }
                             else if (transaction.TransactionType == TransactionType.Receipt)
                             {
                                 return -transaction.Credit ?? 0;
                             }
                             return 0;
                         });

                        totalCurrent = _dbContext.Transactions
                         .Where(t => t.LedgerId == ledger.Id && t.Date >= fromDateOnly && t.Date <= toDateOnly)
                         .ToList()
                         .Sum(transaction =>
                         {
                             if (transaction.TransactionType == TransactionType.Sale || transaction.TransactionType == TransactionType.Payment)
                             {
                                 return +transaction.Debit ?? 0;
                             }
                             else if (transaction.TransactionType == TransactionType.Receipt)
                             {
                                 return -transaction.Credit ?? 0;
                             }
                             return 0;
                         });

                    }
                    else if (isIncomes)
                    {
                        openingBalance = _dbContext.Transactions
                           .Where(t => t.LedgerId == ledger.Id && t.Date < fromDateOnly)
                           .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                        totalCurrent = _dbContext.Transactions
                            .Where(t => t.LedgerId == ledger.Id && t.Date >= fromDateOnly && t.Date <= toDateOnly && t.TransactionType == TransactionType.Purchase)
                            .Sum(t => t.Piece) ?? 0;

                    }
                    else
                    {
                        openingBalance = _dbContext.Transactions
                           .Where(t => t.LedgerId == ledger.Id && t.Date < fromDateOnly)
                           .Sum(t => t.TransactionType == TransactionType.Purchase ? t.Piece : -t.Piece) ?? 0;

                        totalCurrent = _dbContext.Transactions
                            .Where(t => t.LedgerId == ledger.Id && t.Date >= fromDateOnly && t.Date <= toDateOnly && t.TransactionType == TransactionType.Purchase)
                            .Sum(t => t.Piece) ?? 0;


                    }

                    var parentLedger = _dbContext.Ledgers.FirstOrDefault(c => c.Id == ledger.ParentId);
                    string parentName = parentLedger != null ? parentLedger.LedgerName : string.Empty;

                    var reportDto = new LedgerClosingReportDto
                    {
                        Master = ledger.MasterAccount.ToString(),
                        ParentId = ledger.ParentId,
                        ParentName = parentName,
                        LedgerId = ledger.Id,
                        LedgerName = ledger.LedgerName,
                        OpeningBal = openingBalance,
                        TotalCurrent = totalCurrent,
                        Balance = openingBalance + totalCurrent,
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

        [HttpGet("GetDailySummary")]
        public async Task<Dictionary<string, Dictionary<long, DailySummaryDto>>> GetDailySummary([FromQuery]List<long> userIds, bool isDuration, DateOnly fromDate, DateOnly toDate)
        {
            if (!isDuration)
            {
                fromDate = toDate;
            }

            var dailySummaryQuery = _dbContext.Transactions
                .Where(ds => ds.Date >= fromDate && ds.Date <= toDate);

            if (userIds != null && userIds.Any())
            {
                dailySummaryQuery = dailySummaryQuery.Where(ds => userIds.Contains(ds.UserId));
            }
            try
            {
                var dailySummaries = await dailySummaryQuery.ToListAsync();

                var aggregateBalancesByAccountType = new Dictionary<string, Dictionary<long, DailySummaryDto>>();

                foreach (var dailySummary in dailySummaries)
                {
                    var ledgerId = dailySummary.LedgerId ?? 0;

                    var ledger = await _dbContext.Ledgers.FirstOrDefaultAsync(l => l.Id == ledgerId);


                    if (ledger != null)
                    {
                        var masterAccount = ledger.MasterAccount.ToString();

                        aggregateBalancesByAccountType.TryGetValue(masterAccount, out var aggregateBalances);

                        if (aggregateBalances == null)
                        {
                            aggregateBalances = new Dictionary<long, DailySummaryDto>();
                            aggregateBalancesByAccountType[masterAccount] = aggregateBalances;
                        }

                        if (!aggregateBalances.ContainsKey(ledgerId))
                        {
                            var dailySummaryDto = new DailySummaryDto
                            {
                                Title = $"({dailySummary.Ledger.LedgerCode}) {dailySummary.Ledger.LedgerName}",
                                Debit = 0,
                                Credit = 0
                            };
                            aggregateBalances.Add(ledgerId, dailySummaryDto);
                        }

                        var existingBalance = aggregateBalances[ledgerId];

                        if (dailySummary.Ledger.MasterAccount == MasterAccount.Assets || dailySummary.Ledger.MasterAccount == MasterAccount.Expenses)
                        {

                            existingBalance.Debit += dailySummary.Debit ?? 0;
                            existingBalance.Credit += dailySummary.Credit ?? 0;
                        }
                        else if (dailySummary.Ledger.MasterAccount == MasterAccount.Incomes || dailySummary.Ledger.MasterAccount == MasterAccount.Liabilities)
                        {

                            existingBalance.Debit += dailySummary.Debit ?? 0;
                            existingBalance.Credit += dailySummary.Credit ?? 0;
                        }

                        aggregateBalances[ledgerId] = existingBalance;

                    }
                    else
                    {
                        Console.WriteLine("Warning: dailySummary.Ledger is null for LedgerId " + ledgerId);
                  
                    }

                }

                return aggregateBalancesByAccountType;
            }

            catch (Exception ex)
            {

                Console.WriteLine(ex);
                throw;
            }


        }

    }

}