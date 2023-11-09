using AutoMapper;
using Module.Dtos;
using Module.Dtos.Candidate;
using Module.Dtos.Company;
using Module.Dtos.Job;
using Module.Dtos.Ledger;
using Module.Dtos.Transaction;
using Module.Entities;
using System;
using System.Collections.Generic;

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

            CreateMap<TransactionCreateDto, Transaction>();
            CreateMap<Transaction, TransactionGetDto>()
                .ForMember(dest=>dest.LedgerName, opt => opt.MapFrom(src => src.Ledger.LedgerName))
                .ForMember(dest=>dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName));
            CreateMap<TransactionUpdateDto, Transaction>();
           
           
        }
    }
}
