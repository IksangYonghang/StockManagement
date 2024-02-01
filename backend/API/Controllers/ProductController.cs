using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Candidate;
using Module.Entities;
using Module.IRepositories;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<ProductGetDto>> CreateProduct([FromForm] ProductCreateDto productCreateDto, IFormFile imageFile)
        {
            var fiveMegaByte = 5 * 1024 * 1024;
            var allowedImageTypes = new[] { "image/jpeg", "image/jpg", "image/png" };

            if (imageFile == null || imageFile.Length > fiveMegaByte || !allowedImageTypes.Contains(imageFile.ContentType))
            {
                return BadRequest("Image file is not valid. Please provide a valid JPEG, JPG, or PNG file (maximum 5MB).");
            }

            var imageUrl = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "Images", imageUrl);

            var directoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Documents", "Images");

            // Check if the directory exists, create it if not
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            var existingProduct = await _unitOfWork.Product.AnyAsync(c => c.ProductName == productCreateDto.ProductName);

            if (existingProduct)
            {
                // Delete the uploaded file if a product with the same name already exists
                System.IO.File.Delete(filePath);
                return Conflict("Product already exists");
            }

            var newProduct = _mapper.Map<Product>(productCreateDto);
            newProduct.ImageUrl = imageUrl;
            newProduct.CreatedAt = DateTime.UtcNow;
            newProduct.UserId = productCreateDto.UserId;
            await _unitOfWork.Product.AddAsync(newProduct);
            await _unitOfWork.SaveAsync();

            var convertedProduct = _mapper.Map<ProductGetDto>(newProduct);
            return Ok(convertedProduct);
        }


        [HttpGet("GetById")]
        public async Task<ActionResult<ProductGetDto>> GetById(long id)
        {
            /* Using include method to include Category Name and Company Name in the get method that is mapped from automapper for frontend Product Grid */
            var product = await _unitOfWork.Product.Include(c => c.Category).FirstOrDefaultAsync(c => c.Id == id);
            if (product == null)
            {
                return NotFound("Product you are looking for not found");
            }
            var convertedProduct = _mapper.Map<ProductGetDto>(product);
            return Ok(convertedProduct);
        }

        [HttpGet("Get")]
        public async Task<ActionResult<List<ProductGetDto>>> GetProducts()
        {
            var products = await _unitOfWork.Product.Include(j => j.Category, c => c.Company).OrderByDescending(c => c.CreatedAt).ToListAsync();
            if (products == null)
            {
                return NotFound();
            }
            var convertedProducts = _mapper.Map<List<ProductGetDto>>(products);
            return Ok(convertedProducts);
        }
        [HttpGet("download/{url}")]
        public IActionResult DownloadFile(string url)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "Images", url);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found");
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);

            // Determine the content type based on the file extension
            var contentTypeProvider = new FileExtensionContentTypeProvider();
            contentTypeProvider.TryGetContentType(url, out var contentType);

            return File(fileBytes, contentType ?? "application/octet-stream", url);
        }


        [HttpPut("Update")]
        public async Task<ActionResult<ProductGetDto>> UpdateProduct(long id, [FromForm] ProductUpdateDto productUpdateDto, IFormFile? imageFile)
        {
            var existingProduct = await _unitOfWork.Product.GetByIdAsync(id);

            if (existingProduct == null)
            {
                return NotFound("Product you are looking for not found");
            }

            var nameConflict = await _unitOfWork.Product.AnyAsync(p => p.ProductName == productUpdateDto.ProductName && p.Id != id &&
                         p.ProductName != existingProduct.ProductName);
            var sizeConflict = await _unitOfWork.Product.AnyAsync(p => p.ProductSize == productUpdateDto.ProductSize && p.Id != id &&
                         p.ProductSize != existingProduct.ProductSize);

            if (nameConflict || sizeConflict)
            {
                return Conflict("Product already exists");
            }


            // Check for file upload, validate it, and update the image URL if a file is provided.
            if (imageFile != null)
            {
                var fiveMegaByte = 5 * 1024 * 1024;
                var allowedImageTypes = new[] { "image/jpeg", "image/jpg", "image/png" };

                if (imageFile.Length > fiveMegaByte || !allowedImageTypes.Contains(imageFile.ContentType))
                {
                    return BadRequest("Image file is not valid. Please provide a valid JPEG, JPG, or PNG file (maximum 5MB).");
                }

                // If a new file is provided, delete the old file first.
                if (!string.IsNullOrEmpty(existingProduct.ImageUrl))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "Images", existingProduct.ImageUrl);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Generate a new image URL and save the file.
                var imageUrl = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "Images", imageUrl);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                // Update the product's image URL.
                existingProduct.ImageUrl = imageUrl;
            }

            _mapper.Map(productUpdateDto, existingProduct);
            await _unitOfWork.SaveAsync();

            var updatedProduct = _mapper.Map<ProductGetDto>(existingProduct);
            return Ok(updatedProduct);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            var productToDelete = await _unitOfWork.Product.GetByIdAsync(id);

            if (productToDelete == null)
            {
                return NotFound("Product to be deleted not found");
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Documents", "Images", productToDelete.ImageUrl);

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            var isInTransaction = await _unitOfWork.Transaction.AnyAsync(product => product.ProductId == id);
            if (isInTransaction)
            {
                return BadRequest("Cannot delete product as its transaction is present in transaction table.");
            }

            await _unitOfWork.Product.DeleteAsync(id);
            await _unitOfWork.SaveAsync();

            return Ok("Product and associated file deleted successfully");
        }

    }
}
