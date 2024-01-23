using Shared.Enums;

namespace Module.Dtos.Dash
{
    public class GetFrequentSalesProductDto
    {
        public string CategoryName { get; set; }       
        public string ProductName { get; set; }
        public ProductSize ProductSize { get; set; }
        public int TotalSoldInLast90Days { get; set; }
    }
}
