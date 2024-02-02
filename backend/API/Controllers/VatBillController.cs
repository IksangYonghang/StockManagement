using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Module.Dtos.Dash;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VatBillController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public VatBillController(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet("GetVatPanNumber")]
        public async Task<ActionResult<PanVatGetDto>> GetVatPanNumber()
        {
            var vatNumber = await _dbContext.Offices.FirstOrDefaultAsync(); 

            if (vatNumber == null)
            {
                return NoContent();
            }

            var convertedVatNumber = _mapper.Map<PanVatGetDto>(vatNumber);

            return Ok(convertedVatNumber);
        }


    }
}
