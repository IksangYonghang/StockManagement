using AutoMapper;
using Module.Dtos;
using Module.Dtos.Candidate;
using Module.Dtos.Company;
using Module.Dtos.Job;
using Module.Dtos.LedgerDto;
using Module.Dtos.Transaction;
using Module.Dtos.User;
using Module.Entities;
using System.Diagnostics;


namespace Module.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<CompanyCreateDto, Company>();
            CreateMap<Company, CompanyGetDto>();
            CreateMap<CompanyUpdateDto, Company>();

            CreateMap<CategoryCreateDto, Category>();
            CreateMap<Category, CategoryGetDto>();
            CreateMap<CategoryUpdateDto, Category>();

            CreateMap<ProductCreateDto, Product>();
            CreateMap<Product, ProductGetDto>()
                .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Company.CompanyName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName));
            CreateMap<ProductUpdateDto, Product>();


            CreateMap<LedgerCreateDto, Ledger>();
            CreateMap<Ledger, LedgerGetDto>()
                .ForMember(dest => dest.ParentAccount, opt => opt.MapFrom((src, _, _, context) =>
                {
                    if (src.ParentId.HasValue)
                    {
                        var parentLedger = context.Items["LedgerList"] as List<Ledger>;
                        if (parentLedger != null)
                        {
                            var parent = parentLedger.FirstOrDefault(ledger => ledger.Id == src.ParentId.Value);
                            if (parent != null)
                            {
                                return parent.LedgerName;
                            }
                        }
                    }
                    return null;
                }));
            CreateMap<LedgerUpdateDto, Ledger>();

            CreateMap<Transaction, TransactionCreateDto>();
            CreateMap<TransactionCreateDto, Transaction>()
            .ForMember(dest => dest.TransactionDetails, opt => opt.Ignore()) // Exclude details for now
            .ForMember(dest => dest.Piece, opt => opt.MapFrom(src => src.Piece))
            .ForMember(dest => dest.Debit, opt => opt.MapFrom(src => src.Debit))
            .ForMember(dest => dest.Credit, opt => opt.MapFrom(src => src.Credit))
            .ForMember(dest => dest.Narration, opt => opt.MapFrom(src => src.Narration))
            .ForMember(dest => dest.LedgerId, opt => opt.MapFrom(src => src.LedgerId))
            .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
            .ForMember(dest => dest.InvoiceNumber, opt => opt.MapFrom(src => src.InvoiceNumber))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
            .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => src.TransactionType))
            .ForMember(dest => dest.TransactionMethod, opt => opt.MapFrom(src => src.TransactionMethod))
            .AfterMap((src, dest) =>
            {
                Debug.WriteLine($"Source: {src} \nDestination: {dest}");
            });
            CreateMap<TransactionGetDto, Transaction>();
            CreateMap<Transaction, TransactionGetDto>()
                .ForMember(dest => dest.LedgerName, opt => opt.MapFrom(src => src.Ledger.LedgerName))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName));
            CreateMap<TransactionUpdateDto, Transaction>();
            CreateMap<Transaction, TransactionUpdateDto>();
            CreateMap<TransactionDetail, TransactionDetailDto>();
            CreateMap<TransactionDetailDto, TransactionDetail>();
            CreateMap<TransactionCreateDto, TransactionGetDto>();
            CreateMap<TransactionGetDto, TransactionCreateDto>();
            CreateMap<TransactionDetail, TransactionGetDto>();
            CreateMap<TransactionDetail, TransactionCreateDto>();
            CreateMap<TransactionUpdateDto, TransactionGetDto> ();
            CreateMap<TransactionUpdateDto, Transaction> ();

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Transaction, TransactionGetDto>();
                // Add additional mappings if needed for nested properties
                // Example: cfg.CreateMap<Ledger, LedgerDto>();
            });

            IMapper mapper = config.CreateMapper();


            CreateMap<User, UserDto>();
            CreateMap<User, UserGetDto>();
            CreateMap<UserGetDto, UserDto>();
            CreateMap<UserGetDto, UserDto>();
            CreateMap<UpdateUserDto, UserGetDto>();
            CreateMap<UpdateUserDto, UserDto>();
            CreateMap<User, UpdateUserDto>();

        }
    }
}
