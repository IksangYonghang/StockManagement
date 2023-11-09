using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Company
{
    public class CompanyGetDto
    {
        public long  Id { get; set; }
        public string CompanyName { get; set; }
        public CompanySize CompanySize { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
