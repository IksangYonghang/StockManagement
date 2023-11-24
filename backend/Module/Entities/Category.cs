using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Entities
{
    public class Category  : BaseEntity
    {
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public long UserId { get; set; }

        //Relations
        public List<Product> Products { get; set; }
    }
}
