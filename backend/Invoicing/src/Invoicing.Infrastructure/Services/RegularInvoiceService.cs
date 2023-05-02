using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Invoicing.Infrastructure.Services;

public class RegularInvoiceService : IRegularInvoiceService
{
    private IApplicationDbContext _context;
    private readonly IDateTime _dateTimeProvider;
    private readonly IServiceScopeFactory _serviceProvider;
    public RegularInvoiceService(IDateTime dateTimeProvider, IServiceScopeFactory serviceProvider)
    {
        _dateTimeProvider = dateTimeProvider;
        _serviceProvider = serviceProvider;
    }

    public async Task CreateNextInvoice(long rootInvoiceId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        _context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var rootInvoice = await _context.Invoices
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == rootInvoiceId, cancellationToken)
            ?? throw new NotFoundException();

        var items = GetNewItems(rootInvoice.Items);
        var newInvoice = new Invoice()
        {
            CreatedDate = new DateTime(_dateTimeProvider.Now.Ticks, DateTimeKind.Utc),
            Currency = rootInvoice.Currency,
            ApprovalStatus = rootInvoice.ApprovalStatus,
            BuyerEmail = rootInvoice.BuyerEmail,
            BuyerId = rootInvoice.BuyerId,
            DueDate = new DateTime(_dateTimeProvider.Now.AddMonths(1).Ticks, DateTimeKind.Utc),
            IsRegular = true,
            PaymentStatus = rootInvoice.PaymentStatus,
            Type = InvoiceType.Current,
            Total = rootInvoice.Total,
            Notes = rootInvoice.Notes,
            SellerId = rootInvoice.SellerId,
            Items = items.ToList(),
            TemplatePreview = rootInvoice.TemplatePreview,
        };

        _context.Invoices.Add(newInvoice);
        await _context.SaveChangesAsync(cancellationToken);
        newInvoice.Number = newInvoice.Id;
        //we need to increment invoice number on a db layer, not on bl layer, but we don't have any time to fix that
        await _context.SaveChangesAsync(cancellationToken);

    }

    private IEnumerable<InvoiceItem> GetNewItems(ICollection<InvoiceItem> items)
    {
        foreach (var item in items)
        {
            yield return new()
            {
                Count = item.Count,
                Description = item.Description,
                Metric = item.Metric,
                Price = item.Price,
                Subtotal = item.Subtotal,
            };
        }
    }
}
