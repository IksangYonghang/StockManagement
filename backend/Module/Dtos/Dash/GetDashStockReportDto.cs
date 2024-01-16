namespace Module.Dtos.Dash
{
    public class GetDashStockReportDto
    {
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public string CostPrice { get; set; }
        public string WholeSalePrice { get; set; }
        public string RetailPrice { get; set; }
        public string ProductSize { get; set; }
        public int? TotalStockBalance { get; set; }

    }
}
