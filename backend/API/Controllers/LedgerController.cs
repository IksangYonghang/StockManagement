using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Module.Dtos.Ledger;
using Module.Entities;
using Module.IRepositories;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LedgerController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public LedgerController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<LedgerGetDto>> CreateLedger([FromBody] LedgerCreateDto ledgerCreateDto)
        {
            var existingLedger = await _unitOfWork.Ledger.AnyAsync(l => l.LedgerName == ledgerCreateDto.LedgerName || l.LedgerCode == ledgerCreateDto.LedgerCode);
            if (existingLedger)
            {
                return Conflict("Ledger name or code already exists");
            }

            Ledger newLedger = _mapper.Map<Ledger>(ledgerCreateDto);
            newLedger.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.Ledger.AddAsync(newLedger);
            await _unitOfWork.SaveAsync();
            var allLedgers = await _unitOfWork.Ledger.GetAllAsync();
            var convertedLedger = _mapper.Map<LedgerGetDto>(newLedger, opt => opt.Items["LedgerList"] = allLedgers);
            return Ok(convertedLedger);
        }

        [HttpGet("GetById")]
        public async Task<ActionResult<LedgerGetDto>> GetById(long id)
        {
            var ledger = await _unitOfWork.Ledger.GetByIdAsync(id);
            if (ledger == null)
            {
                return NotFound("Ledger you are looking for not found");
            }
            var allLedgers = await _unitOfWork.Ledger.GetAllAsync();
            var convertedLedger = _mapper.Map<LedgerGetDto>(ledger, opt => opt.Items["LedgerList"] =allLedgers);
            return Ok(convertedLedger);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<IEnumerable<LedgerGetDto>>> GetLedgers()
        {
            var ledgers = await _unitOfWork.Ledger.GetAllAsync();
            ledgers=ledgers.OrderByDescending(l=>l.CreatedAt);
          
            if (ledgers == null)
            {
                return NotFound("Ledgers not found");
            }

            var allLedgers = await _unitOfWork.Ledger.GetAllAsync();

            var convertedLedgers = _mapper.Map<List<LedgerGetDto>>(ledgers, opts => opts.Items["LedgerList"] = allLedgers);
            return Ok(convertedLedgers);
        }

        [HttpPut("Update")]
        public async Task<ActionResult<LedgerGetDto>> EditLedger(LedgerUpdateDto ledgerUpdateDto, long id)
        {
            var ledgerToUpdate = await _unitOfWork.Ledger.GetByIdAsync(id);
            if (ledgerToUpdate == null)
            {
                return NotFound("Ledger to be updated not found");
            }

            // Check if the updated ledger name is already used by other ledgers (excluding itself)
            var nameConflict = await _unitOfWork.Ledger.AnyAsync(l =>l.LedgerName == ledgerUpdateDto.LedgerName && l.Id != id );

            var codeConflict = await _unitOfWork.Ledger.AnyAsync(l => l.LedgerCode == ledgerUpdateDto.LedgerCode && l.Id != id );

            if (nameConflict || codeConflict)
            {
                return Conflict("Ledger name or code already exists among other ledgers.");
            }

            _mapper.Map(ledgerUpdateDto, ledgerToUpdate);
            ledgerToUpdate.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveAsync();
            //var convertedLedger = _mapper.Map<LedgerGetDto>(LedgerToUpdate);
            var allLedgers = await _unitOfWork.Ledger.GetAllAsync();
            var convertedLedger = _mapper.Map<LedgerGetDto>(ledgerToUpdate, opt => opt.Items["LedgerList"] = allLedgers);
            return Ok(convertedLedger);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteLedger(long id)
        {
            var LedgerToDelete = await _unitOfWork.Ledger.GetByIdAsync(id);
            if (LedgerToDelete == null)
            {
                return NotFound("Ledger to be deleted not found");
            }

            // Check if the Ledger ID is present in the parentId column
            var isUsedAsParent = await _unitOfWork.Ledger.AnyAsync(ledger => ledger.ParentId == id);
            if (isUsedAsParent)
            {
                return BadRequest("Cannot delete Ledger as it is used as a parent in other ledgers.");
            }
            /* Check if the Ledger ID is present in the Transaction Table */
            var isInTransaction = await _unitOfWork.Transaction.AnyAsync(ledger => ledger.LedgerId == id);
            if (isInTransaction)
            {
                return BadRequest("Cannot delete Ledger as its transaction is present in transaction table.");
            }
            
            await _unitOfWork.Ledger.DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return Ok("Ledger deleted successfully");
        }
    }
}
