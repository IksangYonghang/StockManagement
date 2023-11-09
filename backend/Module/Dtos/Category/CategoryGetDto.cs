using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Job
{
    public class CategoryGetDto
    {
        public long Id { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
            
        public DateTime CreatedAt { get; set; }
    }
}
