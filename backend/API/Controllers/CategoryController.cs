using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Job;
using Module.Entities;
using Module.IRepositories;
using System.Runtime.InteropServices;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
  
    public class CategoryController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;      
        private readonly IMapper _mapper;

        public CategoryController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;        
            _mapper = mapper;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<CategoryGetDto>> CreateCategory([FromBody]CategoryCreateDto categoryCreatedDto)
        {
            var existingCategory =await _unitOfWork.Category.AnyAsync(j=>j.CategoryName == categoryCreatedDto.CategoryName);
            if (existingCategory)
            {
                return Conflict("Category already exists");
            }
            Category newCategory = _mapper.Map<Category>(categoryCreatedDto);
            newCategory.CreatedAt = DateTime.UtcNow;
            await _unitOfWork.Category.AddAsync(newCategory);
            await _unitOfWork.SaveAsync();
            var convertedCategory = _mapper.Map<CategoryGetDto>(newCategory);
            return Ok(convertedCategory);

        }

        [HttpGet("GetById")]
        public async Task<ActionResult<CategoryGetDto>> GetById(long id)
        {
            var category = await _unitOfWork.Category.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound("Category not found");
            }
            var convertedCategory = _mapper.Map<CategoryGetDto>(category);
            return Ok(convertedCategory);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<IEnumerable<CategoryGetDto>>> GetCategories()
        {
            var categories = await _unitOfWork.Category.GetAllAsync();
            categories= categories.OrderByDescending(c => c.CreatedAt);
            if (categories == null)
            { 
                return NotFound("No categories in the list");
            }
            var convertedCategories = _mapper.Map<List<CategoryGetDto>>(categories);
            return Ok(convertedCategories);
        }

        [HttpPut("Update")]
        public async Task<ActionResult<CategoryGetDto>> UpdateCategory(CategoryUpdateDto categoryUpdateDto, long id)
        {
            var categoryToUpdate = await _unitOfWork.Category.GetByIdAsync(id);
            if(categoryToUpdate == null)
            {
                return NotFound("Category to update not found");
            }

            var nameConflict = await _unitOfWork.Category.AnyAsync(c=>c.CategoryName== categoryUpdateDto.CategoryName && c.Id !=id);
            if (nameConflict)
            {
                return Conflict("Category already exists");
            }
            _mapper.Map(categoryUpdateDto, categoryToUpdate);
            categoryToUpdate.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveAsync();            
            var convertedCategory= _mapper.Map<CategoryGetDto>(categoryToUpdate);
            return Ok(convertedCategory);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCategory(long id)
        {
            var categoryToDelete = await _unitOfWork.Category.GetByIdAsync(id);
            if (categoryToDelete == null)
            {
                return NotFound("Category to delete not found");
            }

            //Checking if category id esists in product table or not.
            var categoryInProduct = await _unitOfWork.Product.AnyAsync(product => product.CategoryId == id);
            if (categoryInProduct)
            {
                return BadRequest("Can not delete category because it is associated to product table");
            }
            await _unitOfWork.Category.DeleteAsync(id);
            await _unitOfWork.SaveAsync();
            return Ok("Category deleted successfully");
        }
    }
}
