using Data.DataContext;
using Module.Entities;
using Module.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Implementations
{
    public class LedgerRepository : GenericRepository<LedgerRepository>, ILedgerRepository
    {
        public LedgerRepository(AppDbContext context) : base(context)
        {
        }
    }
}
