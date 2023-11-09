using Module.Entities;
using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Module.Dtos.Ledger
{
    public class LedgerCreateDto
    {
        public string LedgerCode { get; set; }
        public string LedgerName { get; set; }
        public string Contact { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public long? ParentId { get; set; }
        public MasterAccount? MasterAccount { get; set; }
    }
}
