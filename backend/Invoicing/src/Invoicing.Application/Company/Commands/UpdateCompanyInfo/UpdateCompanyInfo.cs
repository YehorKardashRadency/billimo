using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventBus.Messages.Events;
using Invoicing.Application.Common.Exceptions;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Common.Models;
using Invoicing.Application.Invoicing.Commands.UpdateBuyerInvoices;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Invoicing.Application.Company.Commands.UpdateCompanyInfo;
public record UpdateCompanyInfoCommand(UpdateCompanyInfoEvent updateCompanyInfoEvent) : IRequest<Result>;

public class UpdateCompanyInfoCommandHandler : IRequestHandler<UpdateCompanyInfoCommand, Result>
{
    private readonly IApplicationDbContext _context;

    public UpdateCompanyInfoCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result> Handle(UpdateCompanyInfoCommand request, CancellationToken cancellationToken)
    {
        var company = await _context.Companies.Where(x => x.RefId == request.updateCompanyInfoEvent.RefId).FirstOrDefaultAsync();
        if (company != null)
        {
            company.Name = request.updateCompanyInfoEvent.Name;
            await _context.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }

        var newCompany = new Domain.Entities.Company() { RefId = request.updateCompanyInfoEvent.RefId, Name = request.updateCompanyInfoEvent.Name};
        await _context.Companies.AddAsync(newCompany);
        await _context.SaveChangesAsync(cancellationToken);
        
        return Result.Success();
    }
}