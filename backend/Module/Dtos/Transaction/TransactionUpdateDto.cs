using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos
{
    public class TransactionUpdateDto
    {
        
        public DateOnly Date { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public long LedgerId { get; set; }       
        public long ProductId { get; set; }   
        public int Piece { get; set; }
        public TransactionType TransactionType { get; set; }
        public TransactionMethod TransactionMethod { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public string? Narration { get; set; }
    }
}
