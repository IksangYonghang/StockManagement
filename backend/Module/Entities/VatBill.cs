using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Module.Entities
{
    public class VatBill : BaseEntity
    {
        public string BillNumber { get; set; }
        public DateOnly Date { get; set; }
        public DateOnly EngDate { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }=string.Empty;
        public string CustomerVatPan { get; set; } = string.Empty;
        public string CustomerContact { get; set; } = string.Empty;
        public Product Product { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public ProductSize  Size { get; set; }
        public int  Quantity { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxableAmount { get; set; }
        public decimal VatRate { get; set; }
        public decimal NetAmount { get; set; }


    }
}
