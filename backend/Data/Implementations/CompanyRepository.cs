using Data.DataContext;
using Module.Entities;
using Module.IRepositories;

namespace Data.Implementations
{
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context)
        {
        }
    }
}
