using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Schema;

namespace Module.Dtos.LedgerDto
{
    public class LedgerGetDto
    {
        public long Id { get; set; }
        public string LedgerCode { get; set; }
        public string LedgerName { get; set; }
        public string Contact { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? ParentAccount { get; set; }
        public long? ParentId { get; set; }
        public MasterAccount? MasterAccount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
