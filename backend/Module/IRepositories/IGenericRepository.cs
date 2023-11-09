using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Module.IRepositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> AddAsync(T entity);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(long id);        
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
        Task<T> UpdateAsync(T entity);
        Task DeleteAsync(long id);
        IQueryable<T> Include(params Expression<Func<T, object>>[] includes);
    }
}
