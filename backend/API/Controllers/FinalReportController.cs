using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Reports;
using Module.Entities;
using Shared.Enums;
using System.Xml.Schema;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinalReportController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public FinalReportController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet("GetTrialBalance")]
        public async Task<Dictionary<string, Dictionary<long, TrialBalanceDto>>> GetTrialBalance(bool isDuration, DateOnly fromDate, DateOnly toDate)
        {
            IQueryable<Transaction> trialBalanceQuery;

            if (!isDuration)
            {
                fromDate = toDate;

                trialBalanceQuery = _dbContext.Transactions.Where(tb => tb.EngDate <= fromDate);
            }
            else
            {

                trialBalanceQuery = _dbContext.Transactions.Where(tb => tb.EngDate >= fromDate && tb.EngDate <= toDate);
            }

            try
            {
                var trialBalances = await trialBalanceQuery.ToListAsync();

                var aggregateBalancesByAccountType = new Dictionary<string, Dictionary<long, TrialBalanceDto>>();

                foreach (var trialBalance in trialBalances)
                {
                    var ledgerId = trialBalance.LedgerId ?? 0;
                    var ledger = await _dbContext.Ledgers.FirstOrDefaultAsync(l => l.Id == ledgerId);

                    if (ledger != null)
                    {
                        var masterAccount = ledger.MasterAccount.ToString();

                        var ledgerTransactionsBeforeFromDate = await _dbContext.Transactions
                            .Where(tb => tb.LedgerId == ledgerId && tb.EngDate < fromDate)
                            .ToListAsync();

                        var initialBalance = 0m;

                        if (trialBalance.Ledger.MasterAccount == MasterAccount.Assets || trialBalance.Ledger.MasterAccount == MasterAccount.Expenses)
                        {
                            initialBalance = ledgerTransactionsBeforeFromDate.Sum(tb => tb.Debit ?? 0) - ledgerTransactionsBeforeFromDate.Sum(tb => tb.Credit ?? 0);
                        }
                        else if (trialBalance.Ledger.MasterAccount == MasterAccount.Incomes || trialBalance.Ledger.MasterAccount == MasterAccount.Liabilities)
                        {
                            initialBalance = ledgerTransactionsBeforeFromDate.Sum(tb => tb.Credit ?? 0) - ledgerTransactionsBeforeFromDate.Sum(tb => tb.Debit ?? 0);
                        }

                        aggregateBalancesByAccountType.TryGetValue(masterAccount, out var aggregateBalances);

                        if (aggregateBalances == null)
                        {
                            aggregateBalances = new Dictionary<long, TrialBalanceDto>();
                            aggregateBalancesByAccountType[masterAccount] = aggregateBalances;
                        }

                        if (!aggregateBalances.ContainsKey(ledgerId))
                        {
                            var trialBalanceDto = new TrialBalanceDto
                            {
                                Title = $"({trialBalance.Ledger.LedgerCode}) {trialBalance.Ledger.LedgerName}",
                                Debit = 0,
                                Credit = 0
                            };
                            aggregateBalances.Add(ledgerId, trialBalanceDto);
                        }

                        var existingBalance = aggregateBalances[ledgerId];

                        if (trialBalance.Ledger.MasterAccount == MasterAccount.Assets || trialBalance.Ledger.MasterAccount == MasterAccount.Expenses)
                        {
                            if (trialBalance.Credit > 0)
                            {
                                existingBalance.Debit -= trialBalance.Credit;
                            }
                            existingBalance.Debit += trialBalance.Debit ?? 0;
                        }
                        else if (trialBalance.Ledger.MasterAccount == MasterAccount.Incomes || trialBalance.Ledger.MasterAccount == MasterAccount.Liabilities)
                        {
                            if (trialBalance.Debit > 0)
                            {
                                existingBalance.Credit -= trialBalance.Debit;
                            }
                            existingBalance.Credit += trialBalance.Credit ?? 0;
                        }

                        aggregateBalances[ledgerId] = existingBalance;
                    }
                    else
                    {
                        Console.WriteLine("Warning: TrialBalance Ledger is null for LedgerId " + ledgerId);
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

        [HttpGet("GetProfitLoss")]
        public async Task<Dictionary<string, Dictionary<long, ProfitAndLossDto>>> GetProfitLoss(bool isDuration, DateOnly fromDate, DateOnly toDate)
        {
            IQueryable<Transaction> profitLossQuery;

            if (!isDuration)
            {
                fromDate = toDate;
                profitLossQuery = _dbContext.Transactions.Where(pl => pl.EngDate <= fromDate);
            }
            else
            {
                profitLossQuery = _dbContext.Transactions.Where(pl => pl.EngDate >= fromDate && pl.EngDate <= toDate);
            }

            try
            {
                var profitlosses = await profitLossQuery.ToListAsync();

                var aggregateBalanceByAccountType = new Dictionary<string, Dictionary<long, ProfitAndLossDto>>();

                foreach (var profitloss in profitlosses)
                {
                    var ledgerId = profitloss.LedgerId ?? 0;

                    var ledger = await _dbContext.Ledgers.FirstOrDefaultAsync(l => l.Id == ledgerId);

                    if (ledger != null)

                    {

                        if (ledger.MasterAccount == MasterAccount.Expenses || ledger.MasterAccount == MasterAccount.Incomes)
                        {
                            var masterAccount = ledger.MasterAccount.ToString();

                            var ledgerTransactionBeforeFromDate = await _dbContext.Transactions.Where(pl => pl.LedgerId == ledgerId && pl.EngDate < fromDate).ToListAsync();

                            var initialBalance = 0m;

                            if (profitloss.Ledger.MasterAccount == MasterAccount.Expenses)
                            {
                                initialBalance = ledgerTransactionBeforeFromDate.Sum(pl => pl.Debit ?? 0) - (ledgerTransactionBeforeFromDate.Sum(pl => pl.Credit ?? 0));
                            }
                            else if (profitloss.Ledger.MasterAccount == MasterAccount.Incomes)
                            {
                                initialBalance = ledgerTransactionBeforeFromDate.Sum(pl => pl.Credit ?? 0) - (ledgerTransactionBeforeFromDate.Sum(pl => pl.Debit ?? 0));
                            }
                            aggregateBalanceByAccountType.TryGetValue(masterAccount, out var aggregateBalances);

                            if (aggregateBalances == null)
                            {
                                aggregateBalances = new Dictionary<long, ProfitAndLossDto>();
                                aggregateBalanceByAccountType[masterAccount] = aggregateBalances;
                            }
                            if (!aggregateBalances.ContainsKey(ledgerId))
                            {
                                var profitLossDto = new ProfitAndLossDto
                                {
                                    Title = $"({profitloss.Ledger.LedgerCode}) {profitloss.Ledger.LedgerName}",
                                    Debit = 0,
                                    Credit = 0,
                                };
                                aggregateBalances.Add(ledgerId, profitLossDto);
                            }
                            var existingBalance = aggregateBalances[ledgerId];
                            if (profitloss.Ledger.MasterAccount == MasterAccount.Expenses)
                            {
                                if (profitloss.Credit > 0)
                                {
                                    existingBalance.Debit -= profitloss.Credit ?? 0;
                                }
                                existingBalance.Debit += profitloss.Debit ?? 0;
                            }
                            if (profitloss.Ledger.MasterAccount == MasterAccount.Incomes)
                            {
                                if (profitloss.Debit > 0)
                                {
                                    existingBalance.Credit -= profitloss.Debit ?? 0;
                                }
                                existingBalance.Credit += profitloss.Credit ?? 0;
                            }

                            aggregateBalances[ledgerId] = existingBalance;

                        }

                    }
                    else
                    {
                        Console.WriteLine("Warning: ProfitLoss Ledger is null for LedgerId" + ledgerId);
                    }
                }
                return aggregateBalanceByAccountType;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        [HttpGet("GetBalanceSheet")]
        public async Task<Dictionary<string, Dictionary<long, BalanceSheetDto>>> GetBalanceSheet(bool isDuration, DateOnly fromDate, DateOnly toDate)
        {
            IQueryable<Transaction> balanceSheetQuery;
            if (!isDuration)
            {
                fromDate = toDate;
                balanceSheetQuery = _dbContext.Transactions.Where(bs => bs.EngDate <= fromDate);
            }
            else
            {
                balanceSheetQuery = _dbContext.Transactions.Where(bs => bs.EngDate >= fromDate && bs.EngDate <= toDate);
            }
            try
            {
                var balanceSheets = await balanceSheetQuery.ToListAsync();
                var aggregateBalanceByAccountType = new Dictionary<string, Dictionary<long, BalanceSheetDto>>();

                foreach (var balanceSheet in balanceSheets)
                {
                    var ledgerId = balanceSheet.LedgerId ?? 0;
                    var ledger = await _dbContext.Ledgers.FirstOrDefaultAsync(l => l.Id == ledgerId);

                    if (ledger != null)
                    {
                        if (ledger.MasterAccount == MasterAccount.Assets || ledger.MasterAccount == MasterAccount.Liabilities)
                        {
                            var masterAccount = ledger.MasterAccount.ToString();
                            var ledgerTransactionsBeforeFromDate = await _dbContext.Transactions.Where(bs => bs.LedgerId == ledgerId && bs.EngDate < fromDate).ToListAsync();

                            var initialBalancce = 0m;

                            if (balanceSheet.Ledger.MasterAccount == MasterAccount.Assets)
                            {
                                initialBalancce = ledgerTransactionsBeforeFromDate.Sum(bs => bs.Debit ?? 0) - ledgerTransactionsBeforeFromDate.Sum(bs => bs.Credit ?? 0);
                            }
                            if (balanceSheet.Ledger.MasterAccount == MasterAccount.Liabilities)
                            {
                                initialBalancce = ledgerTransactionsBeforeFromDate.Sum(bs => bs.Credit ?? 0) - ledgerTransactionsBeforeFromDate.Sum(bs => bs.Debit ?? 0);
                            }

                            aggregateBalanceByAccountType.TryGetValue(masterAccount, out var aggregateBalance);

                            if (aggregateBalance == null)
                            {
                                aggregateBalance = new Dictionary<long, BalanceSheetDto>();
                                aggregateBalanceByAccountType[masterAccount] = aggregateBalance;
                            }
                            if (!aggregateBalance.ContainsKey(ledgerId))
                            {
                                var balanceSheetDto = new BalanceSheetDto
                                {
                                    Title = $"({balanceSheet.Ledger.LedgerCode}){balanceSheet.Ledger.LedgerName}",
                                    Debit = 0,
                                    Credit = 0,
                                };
                                aggregateBalance.Add(ledgerId, balanceSheetDto);
                            }
                            var existingBalance = aggregateBalance[ledgerId];
                            if (balanceSheet.Ledger.MasterAccount == MasterAccount.Assets)
                            {
                                if (balanceSheet.Credit > 0)
                                {
                                    existingBalance.Debit -= balanceSheet.Credit ?? 0;
                                }
                                existingBalance.Debit += balanceSheet.Debit ?? 0;
                            }
                            if(balanceSheet.Ledger.MasterAccount==MasterAccount.Liabilities)
                            {
                                if(balanceSheet.Debit > 0)
                                {
                                    existingBalance.Credit -= balanceSheet.Debit ?? 0;
                                }
                                existingBalance.Credit += balanceSheet.Credit ?? 0;
                            }
                            aggregateBalance[ledgerId] = existingBalance;

                        }


                    }
                    else
                    {
                        Console.WriteLine("Warning: Balancesheet Ledger is null for LedgerId" + ledgerId);
                    }
                }
                return aggregateBalanceByAccountType;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }
    }
}
