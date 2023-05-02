using System.Linq;
using Administration.Application.Common.Exceptions;
using Administration.Application.Common.Interfaces;
using Administration.Domain.Entities;
using AutoMapper;
using Going.Plaid;
using Going.Plaid.Auth;
using Going.Plaid.Entity;
using Going.Plaid.Item;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.PaymentMethods.Commands;
public class AddPaymentMethodsCommand: IRequest
{
    public string PublicToken { get; set; } = null!;
}

public class AddPaymentMethodsCommandHandler : IRequestHandler<AddPaymentMethodsCommand>
{
    private readonly ICurrentUserService _userService;
    private readonly PlaidClient _plaidClient;
    private readonly IApplicationDbContext _context;

    public AddPaymentMethodsCommandHandler(IApplicationDbContext context, IMapper mapper,
        ICurrentUserService userService, PlaidClient plaidClient)
    {
        _context = context;
        _userService = userService;
        _plaidClient = plaidClient;
    }

    public async Task<Unit> Handle(AddPaymentMethodsCommand request, CancellationToken cancellationToken)
    {
        var exchangedToken = await _plaidClient.ItemPublicTokenExchangeAsync(new ItemPublicTokenExchangeRequest() { PublicToken = request.PublicToken });
        var accounts = await _plaidClient.AuthGetAsync(new AuthGetRequest() { AccessToken = exchangedToken.AccessToken });
        var item = await _plaidClient.ItemGetAsync(new ItemGetRequest() { AccessToken = exchangedToken.AccessToken });

        if (!exchangedToken.IsSuccessStatusCode || !accounts.IsSuccessStatusCode || !item.IsSuccessStatusCode)
            throw new NotFoundException();

        var bankId = item.Item.InstitutionId;
        string oldAccessToken = null;

        using (var trx = await _context.Database.BeginTransactionAsync())
        {
            var plaidBankIntegration = new PlaidBankIntegration()
            {
                AccessToken = exchangedToken.AccessToken,
                InstitutionId = bankId,
                Accounts = accounts.Accounts.Select((account, index) => new PlaidBankAccount()
                {
                    AccountId = account.AccountId,
                    PaymentMethod = new PaymentMethod()
                    {
                        Title = accounts.Numbers.Ach[index].Routing.ToString(),
                        Additional = accounts.Numbers.Ach[index].Account.ToString(),
                        CompanyId = _userService.Companyid,
                        MethodType = PaymentMethodType.Bank,
                    }
                }).ToList(),
            };

            var toRemove = await _context.PaymentMethods
                .Where(c => c.CompanyId == _userService.Companyid
                    && c.PlaidBankAccount.PlaidBankIntegration.InstitutionId == bankId)
                .Include(x => x.PlaidBankAccount)
                .ThenInclude(x => x.PlaidBankIntegration)
                .ToListAsync();

            if (toRemove.Any()) {
                var integration = toRemove.First().PlaidBankAccount.PlaidBankIntegration;
                oldAccessToken = integration.AccessToken;

                _context.PlaidBankIntegration.Remove(integration);
            }

            _context.PaymentMethods.RemoveRange(toRemove);
            _context.PlaidBankIntegration.Add(plaidBankIntegration);

            await _context.SaveChangesAsync();

            await trx.CommitAsync();
        }

        if (!string.IsNullOrEmpty(oldAccessToken))
            await _plaidClient.ItemRemoveAsync(new ItemRemoveRequest() { AccessToken = oldAccessToken });

        return Unit.Value;
    }
}