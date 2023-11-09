using Module.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Module.IRepositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Category> Category { get; }
        IGenericRepository<Company> Company { get; }
        IGenericRepository<Product> Product { get; }
        IGenericRepository<Ledger> Ledger { get; }
        IGenericRepository<Transaction> Transaction { get; }
       
        Task SaveAsync();
    }
}
