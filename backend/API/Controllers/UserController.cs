using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Module.Dtos.User;
using Module.Entities;
using Module.IRepositories;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpPost("CreateUser")]
        public async Task<ActionResult<UserDto>> CreateUser(UserDto request)
        {
            try
            {
                var user = await _userRepository.CreateUser(request);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(LoginDto request)
        {
            try
            {
                var token = await _userRepository.Login(request);
                return Ok(token);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdatePassword/{username}")]
        public async Task<IActionResult> UpdatePassword(string username, UpdatePasswordDto newPassword)
        {
            try
            {
                await _userRepository.UpdatePassword(username, newPassword);
                return Ok("Password updated successfully");
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("Get")]
        public async Task<ActionResult<IEnumerable<UserGetDto>>> GetUsers()
        {
            var users = await _userRepository.GetUsers();
            var convertedUsers = _mapper.Map<List<UserGetDto>>(users);
            return Ok(convertedUsers);
        }

        [HttpGet("GetById")]
        public async Task<ActionResult<UserGetDto>> GetUser(long id)
        {
            try
            {
                var user = await _userRepository.GetUser(id);
                var convertedUser = _mapper.Map<UserGetDto>(user);
                return Ok(convertedUser);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteUser(long id)
        {
            try
            {
                await _userRepository.DeleteUser(id);
                return Ok("User deleted");
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPut("Update")]
        public async Task<ActionResult<UserGetDto>> EditUser(UpdateUserDto updateUserDto, long id)
        {
            try
            {
                var updatedUser = await _userRepository.EditUser(updateUserDto, id);
                return Ok(updatedUser);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Failed to update user. Please try again later.");
            }
        }

        [HttpGet("GetByUsername")]
        public async Task<ActionResult<User>> GetUserByUsername(string username)
        {
            try
            {
                var user = await _userRepository.GetUserByUsername(username);
                return Ok(user);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
