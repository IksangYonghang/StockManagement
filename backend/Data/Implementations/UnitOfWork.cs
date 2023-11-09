using Data.DataContext;
using Microsoft.EntityFrameworkCore;
using Module.Entities;
using Module.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
    
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Category= new GenericRepository<Category>(_context);
            Company= new GenericRepository<Company>(_context);
            Product= new GenericRepository<Product>(_context);
            Ledger= new GenericRepository<Ledger>(_context);
            Transaction= new GenericRepository<Transaction>(_context);
          
           
        }

        public IGenericRepository<Category> Category { get; private set; }

        public IGenericRepository<Company> Company { get; private set; }

        public IGenericRepository<Product> Product { get; private set; }

        public IGenericRepository<Ledger> Ledger { get; private set; }

        public IGenericRepository<Transaction> Transaction { get; private set; }

       

        public void Dispose()
        {
            _context.Dispose();
        }

        public async Task SaveAsync()
        {
          await  _context.SaveChangesAsync();
        }
    }
}
