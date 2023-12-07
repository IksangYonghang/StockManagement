using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Reports
{
    public class LedgerReportDto
    {
        public DateOnly Date { get; set; }
        public int TransactionId { get; set; }
        public string InvoiceNumber { get; set; }
        public string TransactionType { get; set; }       
        public long LedgerId { get; set; }
        public string LedgerName { get; set; }                
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public string Narration { get; set; }
        public decimal Balance { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
    }
}
