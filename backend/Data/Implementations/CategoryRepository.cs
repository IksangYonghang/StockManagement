using Data.DataContext;
using Module.Entities;
using Module.IRepositories;

namespace Data.Implementations
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }
    }
}
