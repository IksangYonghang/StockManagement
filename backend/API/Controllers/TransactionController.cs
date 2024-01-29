using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos;
using Module.Dtos.Transaction;
using Module.Entities;
using Module.IRepositories;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly AppDbContext _dbContext;

        public TransactionController(IUnitOfWork unitOfWork, IMapper mapper, AppDbContext dbContext)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _dbContext = dbContext;
        }


        [HttpPost("Create")]
        public async Task<ActionResult<IEnumerable<TransactionGetDto>>> CreateTransactions(IEnumerable<TransactionCreateDto> transactionsCreateDto)
        {
            int transactionId = await GenerateUniqueTransactionId(); // Generate a single transaction ID for all related transactions

            var transactionsToCreate = new List<Transaction>();

            foreach (var transactionCreateDto in transactionsCreateDto)
            {
                var newTransaction = new Transaction
                {
                    UserId = transactionCreateDto.UserId,
                    CreatedAt = DateTime.UtcNow,
                    TransactionId = transactionId, // Assign the same transaction ID to all related transactions                   
                    Piece = transactionCreateDto.Piece,
                    TransactionMethod = transactionCreateDto.TransactionMethod,
                    TransactionType = transactionCreateDto.TransactionType,
                    Debit = transactionCreateDto.Debit,
                    Credit = transactionCreateDto.Credit,
                    Narration = transactionCreateDto.Narration,
                    LedgerId = transactionCreateDto.LedgerId,
                    ProductId = transactionCreateDto.ProductId,
                    InvoiceNumber = transactionCreateDto.InvoiceNumber,
                    Date = transactionCreateDto.Date,
                    EngDate = transactionCreateDto.EngDate,
                    TransactionDetails = new List<TransactionDetail>() // Initialize the list of transaction details
                };

                transactionsToCreate.Add(newTransaction);
            }

            await _unitOfWork.Transaction.AddRangeAsync(transactionsToCreate);
            await _unitOfWork.SaveAsync();

            var convertedTransactions = _mapper.Map<IEnumerable<TransactionGetDto>>(transactionsToCreate);
            return Ok(convertedTransactions);
        }

        private int currentTransactionId = 0;

        private async Task<int> GenerateUniqueTransactionId()
        {
            if (currentTransactionId == 0)
            {
                var maxTransactionId = await GetMaxTransactionIdFromDatabase();
                currentTransactionId = maxTransactionId + 1;
            }
            else
            {
                currentTransactionId++;
            }

            if (currentTransactionId >= 100000)
            {
                currentTransactionId = 1;
            }

            return currentTransactionId;
        }

        private async Task<int> GetMaxTransactionIdFromDatabase()
        {
            var transactions = await _unitOfWork.Transaction.GetAllAsync();

            if (transactions != null && transactions.Any())
            {
                int maxTransactionId = transactions.Max(t => t.TransactionId);
                return maxTransactionId;
            }
            else
            {
                return 0;
            }
        }


        [HttpGet("GetById")]
        public async Task<ActionResult<List<TransactionGetDto>>> GetById(int id)
        {
            /* Using include method to include Ledger Name and Product Name in the get method that is mapped from automapper for frontend Transaction Grid */
            var transaction = await _unitOfWork.Transaction.Include(c => c.Ledger, p => p.Product).Where(c => c.TransactionId == id).ToListAsync();
            if (transaction == null || !transaction.Any())
            {
                return NotFound("Transaction you are looking for not found");
            }
            var convertedTransaction = _mapper.Map<List<TransactionGetDto>>(transaction);
            return Ok(convertedTransaction);
        }


        [HttpGet("Get")]
        public async Task<ActionResult<List<TransactionGetDto>>> GetTransactions()
        {
            var transactions = await _unitOfWork.Transaction.Include(l => l.Ledger, p => p.Product).OrderByDescending(c => c.CreatedAt).ToListAsync();

            if (transactions == null)
            {
                NotFound("No transactions found");
            }

            var convertedTransactions = transactions
                .Select(transaction => _mapper.Map<TransactionGetDto>(transaction))
                .ToList();

            return Ok(convertedTransactions);
        }


        [HttpPut("Update")]
        public async Task<ActionResult<TransactionGetDto>> UpdateTransactions(List<TransactionUpdateDto> transactionUpdateDtos)
        {
            var updatedTransactions = new List<TransactionGetDto>();

            foreach (var transactionUpdateDto in transactionUpdateDtos)
            {
                var transactionId = transactionUpdateDto.TransactionId;
                var rowId = transactionUpdateDto.Id;

                var existingTransaction = await _unitOfWork.Transaction
                    .Include(c => c.Ledger)
                    .Include(p => p.Product)
                    .Where(t => t.TransactionId == transactionId && t.Id== rowId)
                    .ToListAsync();

                if (existingTransaction == null || !existingTransaction.Any())
                {
                    return NotFound("Transaction not found");
                }

                foreach (var transaction in existingTransaction)
                {
                    transaction.TransactionId = transactionId;
                    transaction.Date = transactionUpdateDto.Date;
                    transaction.InvoiceNumber = transactionUpdateDto.InvoiceNumber;
                    transaction.LedgerId = transactionUpdateDto.LedgerId;
                    transaction.ProductId = transactionUpdateDto.ProductId;
                    transaction.Piece = transactionUpdateDto.Piece;
                    transaction.TransactionType = transactionUpdateDto.TransactionType;
                    transaction.TransactionMethod = transactionUpdateDto.TransactionMethod;
                    transaction.Debit = transactionUpdateDto.Debit;
                    transaction.Credit = transactionUpdateDto.Credit;
                    transaction.Narration = transactionUpdateDto.Narration;
                }

                await _unitOfWork.SaveAsync();

                var updatedTransactionDtoList = existingTransaction
                                            .Select(transaction => _mapper.Map<TransactionGetDto>(transaction))
                                            .ToList();

                updatedTransactions.AddRange(updatedTransactionDtoList);


            }

            return Ok(updatedTransactions);
        }



        [HttpDelete("transactionId")]
        public async Task<IActionResult> DeleteTransaction(int transactionId)
        {
            var transactionsToDelete = await _dbContext.Transactions.Where(t => t.TransactionId == transactionId).ToListAsync();
            if (transactionsToDelete == null || !transactionsToDelete.Any())
            {
                return NotFound("Transactions to be deleted not found");
            }

            var productId = transactionsToDelete.First().ProductId;

           
            var hasLaterTransactions = await _unitOfWork.Transaction.AnyAsync(t =>
                t.ProductId == productId && t.TransactionId > transactionId);

            if (hasLaterTransactions)
            {
                return BadRequest("Cannot delete the transactions as there are later transactions for the same product.");
            }

            _dbContext.Transactions.RemoveRange(transactionsToDelete);
            _dbContext.SaveChanges();
            return Ok("Transaction deleted successfully");
        }

    }
}
