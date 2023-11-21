using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Module.Entities;
using System.Text.RegularExpressions;

namespace Data.DataContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Ledger> Ledgers { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>().ToTable("companies", schema: "stock");
            modelBuilder.Entity<Category>().ToTable("categories", schema: "stock");
            modelBuilder.Entity<Product>().ToTable("products", schema: "stock");
            modelBuilder.Entity<Ledger>().ToTable("ledgers", schema: "stock");
            modelBuilder.Entity<User>().ToTable("users", schema: "stock");
            modelBuilder.Entity<Transaction>().ToTable("transactions", schema: "stock");

            modelBuilder.ApplyConfiguration(new CaseInsensitiveColumnNameConvention<Company>());
            modelBuilder.ApplyConfiguration(new CaseInsensitiveColumnNameConvention<Category>());
            modelBuilder.ApplyConfiguration(new CaseInsensitiveColumnNameConvention<Product>());
            modelBuilder.ApplyConfiguration(new CaseInsensitiveColumnNameConvention<Ledger>());
            modelBuilder.ApplyConfiguration(new CaseInsensitiveColumnNameConvention<Transaction>());
            modelBuilder.ApplyConfiguration(new CaseInsensitiveColumnNameConvention<User>());

            // Fluent API for relationships          

            modelBuilder.Entity<Product>()
                .HasOne(product => product.Category)
                .WithMany(category => category.Products)                
                .HasForeignKey(candidate => candidate.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Product>()
                .HasOne(product => product.Company)
                .WithMany(company => company.Products)
                .HasForeignKey(product => product.CompanyId)
                .OnDelete(DeleteBehavior.Restrict); 
            
           
            // Changing enum indexing int to string

            modelBuilder.Entity<Company>().Property(company => company.CompanySize).HasConversion<string>();
            modelBuilder.Entity<Product>().Property(company => company.ProductSize).HasConversion<string>();
            modelBuilder.Entity<Ledger>().Property(ledger => ledger.MasterAccount).HasConversion<string>();
            modelBuilder.Entity<Transaction>().Property(transaction => transaction.TransactionType).HasConversion<string>();
            modelBuilder.Entity<Transaction>().Property(transaction => transaction.TransactionMethod).HasConversion<string>();

          
        }      

        public class CaseInsensitiveColumnNameConvention<TEntity> : IEntityTypeConfiguration<TEntity> where TEntity : class
        {
            public void Configure(EntityTypeBuilder<TEntity> builder)
            {
                foreach (var property in builder.Metadata.GetProperties())
                {
                    var newName = SplitByUppercase(property.Name);
                    builder.Property(property.Name).HasColumnName(newName.ToLowerInvariant());
                }
            }

            private string SplitByUppercase(string input)
            {
                // Using a regular expression to split by uppercase letters
                return string.Join("_", Regex.Split(input, @"(?<!^)(?=[A-Z])"));
            }
        }
    }
}
