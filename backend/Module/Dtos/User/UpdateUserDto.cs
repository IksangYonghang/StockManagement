using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.User
{
    public class UpdateUserDto
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }

        [StringLength(10, MinimumLength = 10)]
        public string Phone { get; set; }
        public UserType UserType { get; set; }

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Email is not in a valid format.")]
        public string Email { get; set; }
        public string Password { get; set; }
       
    }
}
