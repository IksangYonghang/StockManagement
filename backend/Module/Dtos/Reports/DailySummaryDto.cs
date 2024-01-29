namespace Module.Dtos.Reports
{
    public class DailySummaryDto
    {
        public string Title { get; set; }       
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
    }
}
