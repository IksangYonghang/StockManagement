using AutoMapper;
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

        public TransactionController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
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
                    Debit = transactionCreateDto.Debit,
                    Credit = transactionCreateDto.Credit,
                    Narration = transactionCreateDto.Narration,
                    LedgerId = transactionCreateDto.LedgerId,
                    ProductId = transactionCreateDto.ProductId,
                    InvoiceNumber = transactionCreateDto.InvoiceNumber,
                    Date = transactionCreateDto.Date,
                    TransactionDetails = new List<TransactionDetail>() // Initialize the list of transaction details
                };

                foreach (var transactionDetailDto in transactionCreateDto.TransactionDetails)
                {
                    var newTransactionDetail = _mapper.Map<TransactionDetail>(transactionDetailDto);
                    newTransactionDetail.TransactionId = transactionId; // Set the same TransactionId for each detail
                    newTransaction.TransactionDetails.Add(newTransactionDetail); // Add each detail to the transaction
                }

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
        public async Task<ActionResult<TransactionGetDto>> GetById(long id)
        {
            /* Using include method to include Ledger Name and Product Name in the get method that is mapped from automapper for frontend Transaction Grid */
            var transaction = await _unitOfWork.Transaction.Include(c => c.Ledger, p => p.Product).FirstOrDefaultAsync(c => c.Id == id);
            if (transaction == null)
            {
                return NotFound("Transaction you are looking for not found");
            }
            var convertedTransaction = _mapper.Map<TransactionGetDto>(transaction);
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
            var convertedTransactions = _mapper.Map<List<TransactionGetDto>>(transactions);
            return Ok(transactions);
        }


        [HttpPut("Update")]
        public async Task<ActionResult<TransactionGetDto>> UpdateTransaction(long id, TransactionUpdateDto transactionUpdateDto)
        {

            var existingTransaction = await _unitOfWork.Transaction.GetByIdAsync(id);

            if (existingTransaction == null)
            {
                return NotFound("Transaction you are looking for not found");
            }


            _mapper.Map(transactionUpdateDto, existingTransaction);
            await _unitOfWork.SaveAsync();
            var updatedTransaction = _mapper.Map<TransactionGetDto>(existingTransaction);
            return Ok(updatedTransaction);
        }


        [HttpDelete]
        public async Task<IActionResult> DeleteTransaction(long id)
        {
            var transactionToDelete = await _unitOfWork.Transaction.GetByIdAsync(id);
            if (transactionToDelete == null)
            {
                return NotFound("Transaction to be deleted not found");
            }

            // Check if there are other transactions with the same productId and ID greater than the current transaction
            var hasLaterTransactions = await _unitOfWork.Transaction.AnyAsync(t =>
                t.ProductId == transactionToDelete.ProductId && t.Id > id);

            if (hasLaterTransactions)
            {
                return BadRequest("Cannot delete the transaction as there are later transactions for the same product.");
            }

            await _unitOfWork.Transaction.DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return Ok("Transaction deleted successfully");
        }

    }
}
