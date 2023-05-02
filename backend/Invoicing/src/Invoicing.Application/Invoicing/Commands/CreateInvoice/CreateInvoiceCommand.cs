using AutoMapper;
using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Mapping;
using Invoicing.Application.Common.Models;
using Invoicing.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Invoicing.Application.Invoicing.Commands.CreateInvoice;

public class CreateInvoiceCommand : IRequest<CreateInvoiceResult>, IMapFrom<Invoice>
{
    public long? Id { get; set; }
    public long Number { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; }
    public string Notes { get; set; }
    public ICollection<InvoiceItemDto> Items { get; set; }
    public long? BuyerId { get; set; }
    public string? BuyerEmail { get; set; }
    public long SellerId { get; set; }
    public bool IsTemplate { get; set; }
    public bool Send { get; set; }
    public Currency Currency { get; set; }
    public bool IsRegular { get; set; }
    public DateTime? RegularCreatingDate { get; set; }
    public string? TemplatePreview { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<Invoice, CreateInvoiceCommand>()
            .ForMember(d => d.Currency, opt => opt.MapFrom(i => (int)i.Currency))
            .ReverseMap();

        profile.CreateMap<CreateInvoiceCommand, Invoice>()
            .ForMember(i => i.DueDate, opt => opt.MapFrom(d => d.DueDate.ToUniversalTime()))
            .ForMember(i => i.CreatedDate, opt => opt.MapFrom(d => d.CreatedDate.ToUniversalTime()))
            .ForMember(i => i.TemplatePreview,
                opt => opt.MapFrom(d =>
                    d.TemplatePreview == null
                        ? null
                        : Convert.FromBase64String(
                            d.TemplatePreview.Replace("data:image/png;base64,", string.Empty))));
    }
}

public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, CreateInvoiceResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUser;
    private readonly IAdministrationApi _administrationApi;
    private readonly IBillsExternalData _billsExternalData;

    public CreateInvoiceCommandHandler(IApplicationDbContext context, IMapper mapper, ICurrentUserService currentUser, IAdministrationApi administrationApi, IBillsExternalData billsExternalData)
    {
        _context = context;
        _mapper = mapper;
        _currentUser = currentUser;
        _administrationApi = administrationApi;
        _billsExternalData = billsExternalData;
    }

    public async Task<CreateInvoiceResult> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        Invoice invoice;
        if (request.Id is null)
        {
            invoice = _mapper.Map<Invoice>(request);
        }
        else
        {
            invoice = await _context.Invoices
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken)
                ?? throw new NotFoundException();
        }
        
       // var paymentMethods = await _billsExternalData.GetPaymentMethodsForCheck();
       //
       //  if (!paymentMethods.Any())
       //  {
       //      throw new NotFoundException("No payment methods found");
       //  }
        
        invoice.Total = invoice.Items.Select(i => i.Subtotal).Sum();
        invoice.Type = InvoiceType.Current;
        var seller = await _context.Companies.FirstAsync(c => c.RefId == request.SellerId);
        invoice.SellerId = seller.Id;
        var buyer = await _context.Companies.FirstOrDefaultAsync(c => c.RefId == request.BuyerId);
        if (buyer != null) invoice.BuyerId = buyer.Id;
        
        if (request.Id is null)
        {
            _context.Invoices.Add(invoice);
        }
        else
        {
            invoice.DueDate = new(request.DueDate.Ticks, DateTimeKind.Utc);
            invoice.CreatedDate = new(request.CreatedDate.Ticks, DateTimeKind.Utc);
            invoice.Currency = request.Currency;
            invoice.BuyerId = request.BuyerId;
            invoice.Notes = request.Notes;
            invoice.Items = _mapper.Map<ICollection<InvoiceItem>>(request.Items);
            invoice.Total = invoice.Items.Select(i => i.Subtotal).Sum();
            invoice.BuyerEmail = request.BuyerEmail;
        }
    
        var approvalSettings = await _administrationApi.GetApprovalSettings(invoice.SellerId);
        bool passesThreshold = approvalSettings.OnSendingAllInvoices == false &&
                               (approvalSettings.OnSendingInvoicesHigherThan == false ||
                                invoice.Total < approvalSettings.SendingInvoicesThreshold);
        bool hasRights = _currentUser.Role is (Role.Admin or Role.Director);
        invoice.ApprovalStatus = (passesThreshold || hasRights) ? ApprovalStatus.Approved : ApprovalStatus.Pending;
        
        var isNotTemplateAlready = request.Id is null || invoice.Type != InvoiceType.Template;
        if (request.IsTemplate && isNotTemplateAlready)
        {
            var template = _mapper.Map<Invoice>(request);
            template.Type = InvoiceType.Template;
            template.Total = template.Items.Select(i => i.Subtotal).Sum();
            await _context.Invoices.AddAsync(template, cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return _mapper.Map<CreateInvoiceResult>(invoice);
    }
}