using AutoMapper;
using Data.DataContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Module.Dtos.User;
using Module.Entities;
using Module.IRepositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace Data.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserRepository(AppDbContext dbContext, IMapper mapper, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<User> CreateUser(UserDto request)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(n => n.Email == request.Email || n.UserName == request.UserName);
            if (existingUser != null)
            {
                throw new InvalidOperationException("User already exists");
            }
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            User user = new User
            {
                FirstName = request.FirstName ?? "",
                MiddleName = request.MiddleName ?? "",
                LastName = request.LastName ?? "",
                Gender = request.Gender,
                Address = request.Address ?? "",
                Phone = request.Phone ?? "",
                UserType = request.UserType,
                Email = request.Email ?? "",
                UserName = request.UserName ?? "",
                PasswordHash = passwordHash,
                UserId = request.UserId
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<string> Login(LoginDto request)
        {
            User user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);

            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new InvalidOperationException("Wrong password");
            }

            var tokenKey = _configuration.GetSection("AppSettings:Token").Value;

            if (tokenKey == null)
            {
                throw new InvalidOperationException("Token key not found");
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

            UserLogin userLogin = new UserLogin
            {
                UserId = user.Id,
                LogInDT = DateTime.UtcNow,
            };
            _dbContext.UsersLogin.Add(userLogin);
            await _dbContext.SaveChangesAsync();

            return tokenString;
        }

        public async Task<bool> UpdatePassword(string username, UpdatePasswordDto newPassword)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword.Password);

            user.PasswordHash = newPasswordHash;
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<UserGetDto>> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();
            var convertedUsers = _mapper.Map<List<UserGetDto>>(users);
            return convertedUsers;
        }

        public async Task<UserGetDto> GetUser(long id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            var convertedUser = _mapper.Map<UserGetDto>(user);
            return convertedUser;
        }

        public async Task<bool> DeleteUser(long id)
        {
            var userToDelete = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (userToDelete == null)
            {
                throw new InvalidOperationException("User to delete does not exist");
            }

            var userInTransaction = await _dbContext.Transactions.AnyAsync(u => u.UserId == id);
            if (userInTransaction)
            {
                throw new InvalidOperationException("Cannot delete user as its id is present in transaction table.");
            }
            _dbContext.Users.Remove(userToDelete);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<UserGetDto> EditUser(UpdateUserDto updateUserDto, long id)
        {
            var userToUpdate = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (userToUpdate == null)
            {
                throw new InvalidOperationException("User to be updated not found");
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
            if (updateUserDto.Gender != null)
            {
                userToUpdate.Gender = updateUserDto.Gender;
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
                return convertedUser;
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Failed to update user. Please try again later.");
            }
        }

        public async Task<User> GetUserByUsername(string username)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            return user;
        }
    }
}
