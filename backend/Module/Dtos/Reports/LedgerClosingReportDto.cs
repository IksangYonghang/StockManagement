using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Reports
{
    public class LedgerClosingReportDto
    {

        public string Master { get; set; }
        public long? ParentId { get; set; }
        public string ParentName { get; set; }
        public long LedgerId { get; set; }
        public string LedgerName { get; set; }
        public decimal OpeningBal { get; set; }
        public decimal TotalCurrent { get; set; }
        public  decimal Balance { get; set; }
       
            
    }
}
