using Shared.Enums;
using System.ComponentModel.DataAnnotations;

namespace Module.Entities
{
    public class User : BaseEntity
    {


        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public GenderType Gender { get; set; }
        public string Address { get; set; }

        [StringLength(10, MinimumLength = 10)]
        public string Phone { get; set; }
        public UserType UserType { get; set; }

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Email is not in a valid format.")]
        public string Email { get; set; }
        public string? UserName { get; set; }
        public string PasswordHash { get; set; }
        public long UserId { get; set; }

    }
}
