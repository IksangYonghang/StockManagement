using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Candidate
{
    public class ProductGetDto
    {
        public long Id { get; set; }
        public string ProductName { get; set; }
        public string? ProductDescription { get; set; }
        public ProductSize ProductSize { get; set; }
        public decimal MarkedPrice { get; set; }
        public decimal CostPrice { get; set; }
        public decimal WholeSalePrice { get; set; }
        public decimal RetailPrice { get; set; }      
        public string ImageUrl { get; set; }
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public long CompanyId { get; set; }
        public string CompanyName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
