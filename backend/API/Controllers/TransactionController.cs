using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos;
using Module.Dtos.Candidate;
using Module.Dtos.Job;
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
        public async Task<ActionResult<TransactionGetDto>> CreateTransaction(TransactionCreateDto transactionCreateDto)
        {
            /* commented it as the validation logic is performed from front end
             
            if (transactionCreateDto.Debit != transactionCreateDto.Credit)
            {
                return BadRequest("Invalid transaction. Debit and credit amounts are not equal.");
            }
            */

            int transactionId = await GenerateUniqueTransactionId();

            
            Transaction newTransaction = _mapper.Map<Transaction>(transactionCreateDto);
            newTransaction.CreatedAt = DateTime.UtcNow;
            newTransaction.TransactionId = transactionId;

            await _unitOfWork.Transaction.AddAsync(newTransaction);
            await _unitOfWork.SaveAsync();

            var convertedTransaction = _mapper.Map<TransactionGetDto>(newTransaction);
            return Ok(convertedTransaction);
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
