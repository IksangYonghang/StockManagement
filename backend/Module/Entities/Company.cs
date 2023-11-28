using Shared.Enums;

namespace Module.Entities
{
    public class Company : BaseEntity
    {
        public string CompanyName { get; set; }
        public CompanySize CompanySize { get; set; }
        public long UserId { get; set; }
        public User User { get; set; }

        //Relation

        public List<Product> Products { get; set; }

    }
}
