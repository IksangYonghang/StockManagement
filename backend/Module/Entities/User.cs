using Shared.Enums;

namespace Module.Entities
{
    public class User : BaseEntity
    {


        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public UserType UserType { get; set; }
        public string Email { get; set; }
        public string? UserName { get; set; }
        public string PasswordHash { get; set; }

    }
}
