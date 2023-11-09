using Data.DataContext;
using Module.IRepositories;

namespace Data.Implementations
{
    public class ProductRepository : GenericRepository<ProductRepository>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        {
        }
    }
}
