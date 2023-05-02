using Invoicing.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Bill> Bills { get; set; }
    DbSet<BillCancellation> BillCancellations { get; set; }
    DbSet<Invoice> Invoices { get; set; }
    DbSet<InvoiceItem> InvoiceItems { get; set; }
    DbSet<Request> Requests { get; set; }
    DbSet<Domain.Entities.Company> Companies { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
