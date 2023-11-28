namespace Module.Dtos.Reports
{
    public class ProductStockReportDto
    {
        public DateOnly Date { get; set; }
        public int TransactionId { get; set; }
        public string TransactionType { get; set; }       
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public int Piece { get; set; }
        public int StockBalance { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public string Narration { get; set; }
        public decimal  TotalCost { get; set; }
        public decimal StockValue { get; set;}
    }
}
