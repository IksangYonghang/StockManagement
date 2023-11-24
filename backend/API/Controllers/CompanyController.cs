using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Company;
using Module.Entities;
using Module.IRepositories;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class CompanyController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CompanyController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<CompanyGetDto>> CreateCompany([FromBody] CompanyCreateDto companyCreateDto)
        {
            var existingCompany = await _unitOfWork.Company.AnyAsync(c => c.CompanyName == companyCreateDto.CompanyName);
            if (existingCompany)
            {
                return Conflict("Company already exists");
            }

            Company newCompany = _mapper.Map<Company>(companyCreateDto);
            newCompany.CreatedAt = DateTime.UtcNow;
            newCompany.UserId = companyCreateDto.UserId;
            await _unitOfWork.Company.AddAsync(newCompany);
            await _unitOfWork.SaveAsync();
            var convertedCompany = _mapper.Map<CompanyGetDto>(newCompany);
            return Ok(convertedCompany);
        }

        [HttpGet("GetById")]
        public async Task<ActionResult<CompanyGetDto>> GetById(long id)
        {
            var company = await _unitOfWork.Company.GetByIdAsync(id);
            if (company == null)
            {
                return NotFound("Company you are looking for not found");
            }

            var convertedCompany = _mapper.Map<CompanyGetDto>(company);
            return Ok(convertedCompany);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<IEnumerable<CompanyGetDto>>> GetCompanies()
        {
            var companies = await _unitOfWork.Company.GetAllAsync();
            companies = companies.OrderByDescending(c => c.CreatedAt);
            if (companies == null)
            {
                return NotFound("Companies not found");
            }

            var convertedCompanies = _mapper.Map<List<CompanyGetDto>>(companies);
            return Ok(convertedCompanies);
        }

        [HttpPut("Update")]
        public async Task<ActionResult<CompanyGetDto>> EditCompany(CompanyUpdateDto companyUpdateDto, long id)
        {
            var companyToUpdate = await _unitOfWork.Company.GetByIdAsync(id);
            if (companyToUpdate == null)
            {
                return NotFound("Company to be updated not found");
            }

            var nameConlfict =await _unitOfWork.Company.AnyAsync(c => c.CompanyName == companyUpdateDto.CompanyName && c.Id != id);

            if (nameConlfict)
            {
                return Conflict("Company name already exists");
            }


            _mapper.Map(companyUpdateDto, companyToUpdate);
            companyToUpdate.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveAsync();
            var convertedCompany = _mapper.Map<CompanyGetDto>(companyToUpdate);
            return Ok(convertedCompany);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCompany(long id)
        {
            var companyToDelete = await _unitOfWork.Company.GetByIdAsync(id);
            if (companyToDelete == null)
            {
                return NotFound("Company to be deleted not found");
            }

            //Checking if company id exists in product table or not.
            var companyInProduct = await _unitOfWork.Product.AnyAsync(p => p.CompanyId == id);
            if (companyInProduct)
            {
                return BadRequest("Can not delete company as it is associated with product table");
            }
            await _unitOfWork.Company.DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return Ok("Company deleted successfully");
        }
    }
}
