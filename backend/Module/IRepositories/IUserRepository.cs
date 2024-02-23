using Module.Dtos.User;
using Module.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.IRepositories
{
    public interface IUserRepository
    {
        Task<User> CreateUser(UserDto request);
        Task<string> Login(LoginDto request);
        Task<bool> UpdatePassword(string username, UpdatePasswordDto newPassword);
        Task<IEnumerable<UserGetDto>> GetUsers();
        Task<UserGetDto> GetUser(long id);
        Task<bool> DeleteUser(long id);
        Task<UserGetDto> EditUser(UpdateUserDto updateUserDto, long id);
        Task<User> GetUserByUsername(string username);
    }
}
