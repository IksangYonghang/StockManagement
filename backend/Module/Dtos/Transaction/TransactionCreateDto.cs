using Module.Entities;
using Shared.Enums;

namespace Module.Dtos.Transaction
{
    public class TransactionCreateDto
    {
        public long UserId { get; set; }
        public DateOnly Date { get; set; }
        public DateOnly EngDate { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;       
        public long? LedgerId { get; set; }
        public long? ProductId { get; set; }
        public int? Piece { get; set; }
        public TransactionType TransactionType { get; set; }
        public TransactionMethod TransactionMethod { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public string? Narration { get; set; }
        
    }

   
}
