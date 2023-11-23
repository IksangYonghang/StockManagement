using AutoMapper;
using Data.DataContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Module.Dtos.User;
using Module.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public UserController(AppDbContext dbContext, IConfiguration configuration, IMapper mapper)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost("CreateUser")]
        public async Task<ActionResult<User>> CreateUser(UserDto request)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(n => n.Email == request.Email || n.UserName == request.UserName);
            if (existingUser != null)
            {
                return Conflict("User already exists");
            }
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            User user = new User
            {
                FirstName = request.FirstName ?? "",
                MiddleName = request.MiddleName ?? "",
                LastName = request.LastName ?? "",
                Address = request.Address ?? "",
                Phone = request.Phone ?? "",
                UserType = request.UserType,
                Email = request.Email ?? "",
                UserName = request.UserName ?? "",
                PasswordHash = passwordHash
            };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            return Ok(user);
        }

        [HttpPost("Login")]
        public ActionResult<string> Login(LoginDto request)
        {
            User user = _dbContext.Users.FirstOrDefault(u => u.UserName == request.UserName);

            if (user == null)
            {
                return NotFound("User not found");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("Wrong password");
            }

            var tokenKey = _configuration.GetSection("AppSettings:Token").Value;

            if (tokenKey == null)
            {

                return StatusCode(500, "Token key not found");
            }

            var key = Encoding.UTF8.GetBytes(tokenKey);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                     new Claim(ClaimTypes.NameIdentifier, user.UserName)

                 }),
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(tokenString);
        }

        [HttpPut("UpdatePassword/{username}")]
        public async Task<IActionResult> UpdatePassword(string username, UpdatePasswordDto newPassword)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return NotFound("User not found");
            }

            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword.Password);

            user.PasswordHash = newPasswordHash;
            await _dbContext.SaveChangesAsync();

            return Ok("Password updated successfully");
        }

        [HttpGet("Get")]
        public async Task<ActionResult<IEnumerable<UserGetDto>>> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();
            var convertedUsers = _mapper.Map<List<UserGetDto>>(users);
            return Ok(convertedUsers);
        }

        [HttpGet("GetById")]
        public async Task<ActionResult<UserGetDto>> GetUser(long id)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == id);
            var convertedUser = _mapper.Map<UserGetDto>(user);
            return Ok(convertedUser);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteUser(long id)
        {
            var userToDelete = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (userToDelete == null)
            {
                return NotFound("User to delete does not exist");
            }

            _dbContext.Users.Remove(userToDelete);
            _dbContext.SaveChanges();
            return Ok("User deleted");
        }

        [HttpPut("Update")]
        public async Task<ActionResult<UserGetDto>> EditUser(UpdateUserDto updateUserDto, long id)
        {
            var userToUpdate = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (userToUpdate == null)
            {
                return NotFound("User to be updated not found");
            }

            if (!string.IsNullOrEmpty(updateUserDto.FirstName))
            {
                userToUpdate.FirstName = updateUserDto.FirstName;
            }

            if (!string.IsNullOrEmpty(updateUserDto.MiddleName))
            {
                userToUpdate.MiddleName = updateUserDto.MiddleName;
            }

            if (!string.IsNullOrEmpty(updateUserDto.LastName))
            {
                userToUpdate.LastName = updateUserDto.LastName;
            }
            if (!string.IsNullOrEmpty(updateUserDto.Phone))
            {
                userToUpdate.Phone = updateUserDto.Phone;
            }

            if (!string.IsNullOrEmpty(updateUserDto.Address))
            {
                userToUpdate.Address = updateUserDto.Address;
            }
            if (!string.IsNullOrEmpty(updateUserDto.Email))
            {
                userToUpdate.Email = updateUserDto.Email;
            }
           

            // Check if a new password is provided and hash it
            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                // Hash the new password
                string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);


                userToUpdate.PasswordHash = newPasswordHash;
            }
            userToUpdate.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _dbContext.SaveChangesAsync();


                var convertedUser = _mapper.Map<UserGetDto>(userToUpdate);
                return Ok(convertedUser);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "Failed to update user. Please try again later.");
            }
        }

    }
}
