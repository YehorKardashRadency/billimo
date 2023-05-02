using System.Xml.Serialization;
using AutoMapper;
using Payments.Application.AdministrationApi;
using Payments.Application.Common.Extensions;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Application.InvoiceApi;
using Payments.Application.Transactions.Queries.GetTransactionsWithPagination;
using Payments.Domain.Entities;

namespace Payments.Application.Transactions;

public class Mapping : Profile
{
    private readonly ICurrentUserService _currentUserService;

    public Mapping(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
        var companyId = _currentUserService.Companyid;
        
        CreateMap<Transaction, TransactionModel>()
            .ForMember(dst => dst.Date, opt => opt.MapFrom(src => src.CreatedDate.TimeAgo()))
            .ForMember(dst => dst.Amount,
                opt => opt.MapFrom(src => (companyId == src.BuyerId) ? -src.Amount : src.Amount))
            .ForMember(dst => dst.Company,
                opt => opt.MapFrom(src => (companyId == src.BuyerId) ? src.Seller.Name : src.Buyer.Name));

        CreateMap<Transaction, PlaidTransferOperationDto>()
            .ForMember(x => x.Transaction, o => o.MapFrom(t => t))
            .ForMember(x => x.Description, o => o.MapFrom(t => $"{t.Id}"))
            .ForMember(x => x.IpAddress, o => o.MapFrom(t => _currentUserService.IpAddress))
            .ForMember(x => x.UserAgent, o => o.MapFrom(t => _currentUserService.UserAgent));

        CreateMap<Transaction, PostponedPaymentInfo>()
            .ForMember(x => x.Id, o => o.Ignore())
            .ForMember(x => x.Transaction, o => o.MapFrom(t => t))
            .ForMember(x => x.IpAddress, o => o.MapFrom(t => _currentUserService.IpAddress))
            .ForMember(x => x.UserAgent, o => o.MapFrom(t => _currentUserService.UserAgent));
    }

    public Mapping()
    {
        CreateMap<BillPaymentDto, Transaction>()
            .ForMember(x => x.Id, o => o.Ignore())
            .ForMember(x => x.BillId, o => o.MapFrom(t => t.Id))
            .ForMember(x => x.Amount, o => o.MapFrom(t => t.Invoice.Total))
            .ForMember(x => x.BuyerId, o => o.MapFrom(t => t.Invoice.BuyerId))
            .ForMember(x => x.SellerId, o => o.MapFrom(t => t.Invoice.SellerId))
            .ForMember(x => x.Status, o => o.Ignore());

        CreateMap<GetPlaidDataDto, PostponedPaymentInfo>()
            .ForMember(x => x.AccessToken, o => o.MapFrom(t => t.AccessToken))
            .ForMember(x => x.AccountId, o => o.MapFrom(t => t.AccountId));

        CreateMap<Transaction, PostponedPayment>()
            .ForMember(x => x.Id, o => o.Ignore())
            .ForMember(x => x.Description, o => o.MapFrom(t => $"{t.Id}"));

        CreateMap<PostponedPaymentInfo, PlaidTransferOperationDto>()
            .ForMember(x => x.Transaction, o => o.MapFrom(t => t.Transaction))
            .ForMember(x => x.IpAddress, o => o.MapFrom(t => t.IpAddress))
            .ForMember(x => x.UserAgent, o => o.MapFrom(t => $"{t.UserAgent}"));
    }
}