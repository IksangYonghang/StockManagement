﻿using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Module.Entities
{
    public class Product : BaseEntity
    {
        public string ProductName { get; set; }
        public string? ProductDescription { get; set; }
        public ProductSize ProductSize { get; set; }
        public decimal MarkedPrice { get; set; }        
        public decimal CostPrice { get; set; }
        public decimal WholeSalePrice { get; set; }
        public decimal RetailPrice { get; set; }
        public string ImageUrl { get; set; }=string.Empty;

        //Relations
        public long CategoryId { get; set; }
        public Category Category { get; set; }

        public long LedgerId { get; set; }
        public Ledger Ledger { get; set; }

        public long CompanyId { get; set; }
        public Company Company { get; set; }
        public long UserId { get; set; }

    }
}
