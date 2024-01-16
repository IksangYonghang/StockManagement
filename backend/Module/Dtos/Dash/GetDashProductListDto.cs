using Shared.Enums;

namespace Module.Dtos.Dash
{
    public class GetDashProductListDto
    {

        public string ProductName { get; set; }
        public ProductSize ProductSize { get; set; }
        public decimal MarkedPrice { get; set; }
        public decimal CostPrice { get; set; }
        public decimal WholeSalePrice { get; set; }
        public decimal RetailPrice { get; set; }
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }

    }
}
