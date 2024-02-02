using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Vat
{
    public class VatCreateDto
    {
        public string BillNumber { get; set; }
        public DateOnly Date { get; set; }     
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; } = string.Empty;
        public string CustomerVatPan { get; set; } = string.Empty;
        public string CustomerContact { get; set; } = string.Empty;
        public string ProductName { get; set; }
        public ProductSize Size { get; set; }
        public int Quantity { get; set; }
        public decimal Rate { get; set; }       
        public decimal Discount { get; set; }        
        public decimal VatRate { get; set; }       
    }
}
