using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.User
{
    public class UserGetDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public GenderType Gender { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public UserType UserType { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
