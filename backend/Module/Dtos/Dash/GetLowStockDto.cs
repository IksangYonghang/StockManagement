using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Dash
{
    public class GetLowStockDto
    {      
        public string CategoryName { get; set; }     
        public string ProductName { get; set; }
        public string ProductSize { get; set; }
        public int OpeningStock { get; set; }
        public int TotalPurchased { get; set; }
        public int TotalSold { get; set; }
        public int CurrentStock { get; set; }
        public int? TotalStockBalance { get; set; }
        public decimal StockValue { get; set; }
    }
}
