using Invoicing.Application.Common.Interfaces;
using MediatR;
using Invoicing.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.QuickActions.Queries;
public class QuickActionsQuery : IRequest<QuickActionsDto>
{
}

public class QuickActionsQueryHandler : IRequestHandler<QuickActionsQuery, QuickActionsDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    public QuickActionsQueryHandler(IApplicationDbContext context, IAdministrationApi administrationApi, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<QuickActionsDto> Handle(QuickActionsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.Companyid;

        var currentInvoices = await _context.Invoices
            .Where(i => i.Type == InvoiceType.Current && i.SellerId == companyId)
            .CountAsync();
        var approveInvoices = await _context.Invoices
            .Where(i => i.ApprovalStatus == ApprovalStatus.Pending && i.SellerId == companyId)
            .CountAsync();
        var approveBills = await _context.Bills
            .Where(b => b.ApprovalStatus == ApprovalStatus.Pending && b.Invoice.BuyerId == companyId)
            .CountAsync();
        var payBills = await _context.Bills.Include(b => b.Invoice)
            .Where(b => b.Status != BillStatus.Paid && b.Invoice.BuyerId == companyId)
            .CountAsync();

        return new QuickActionsDto { 
            ApproveBills = approveBills, 
            CurrentInvoices = currentInvoices, 
            PayBills = payBills, 
            ApproveInvoices = approveInvoices 
        };
    }
}
