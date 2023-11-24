using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.Entities
{
    public class UserLogin
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public DateTime LogInDT { get; set; } = DateTime.UtcNow;
    }
}
