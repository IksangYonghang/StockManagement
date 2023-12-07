using Module.Dtos.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Reports
{
    public class StockReportDto
    {
       
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public string CostPrice { get; set; }
        public string WholeSalePrice { get; set; }
        public string RetailPrice { get; set; }
        public string ProductSize { get; set; }
        public int OpeningStock { get; set; }
        public int CurrentStock { get; set; }
        public int? TotalStockBalance { get; set; }      
        public decimal StockValue { get; set; }
        

    }
}
