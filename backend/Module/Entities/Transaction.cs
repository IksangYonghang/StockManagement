using Shared.Enums;

namespace Module.Entities
{
    public class Transaction : BaseEntity
    {

        public int TransactionId { get; set; }
        public DateOnly Date { get; set; }
        public DateOnly EngDate { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public long UserId { get; set; }
        public long? LedgerId { get; set; }
        public Ledger Ledger { get; set; }
        public long? ProductId { get; set; }
        public Product Product { get; set; }
        public int? Piece { get; set; }
        public TransactionType TransactionType { get; set; }
        public TransactionMethod TransactionMethod { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public string? Narration { get; set; }
        public bool IsOpeningBal { get; set; } = false;
        public virtual ICollection<TransactionDetail> TransactionDetails { get; set; }
    }

    public class TransactionDetail 
    {
        public int TransactionDetailId { get; set; }
        public int TransactionId { get; set; }
        public DateOnly Date { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public long UserId { get; set; }
        public long? LedgerId { get; set; }
        public Ledger Ledger { get; set; }
        public long? ProductId { get; set; }
        public Product Product { get; set; }       
        public int? Piece { get; set; }
        public TransactionType TransactionType { get; set; }
        public TransactionMethod TransactionMethod { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public string? Narration { get; set; }
        public virtual Transaction Transaction { get; set; }
    }
}