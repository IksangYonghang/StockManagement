using Shared.Enums;

namespace Module.Dtos.Company
{
    public class CompanyCreateDto
    {
        public string CompanyName { get; set; }
        public CompanySize CompanySize { get; set; }
    }
}
