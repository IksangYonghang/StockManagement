using Data.Implementations;
using Module.IRepositories;

namespace API
{
    public static class DiConfig
    {
        public static void ConfigureRepositories(this ServiceCollection services)
        {
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICompanyRepository, CompanyRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ILedgerRepository, LedgerRepository>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();
        }
    }
}
