using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models;
using Administration.Domain.Entities;
using AutoMapper;
using EventBus.Messages.Events;
using MassTransit;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Administration.Application.RegisterCompany.Commands;

public record RegisterCommand(ThirdStepDto DTO, long? billId = null) : IRequest<IdResponse>;

public class RegisterHandler : IRequestHandler<RegisterCommand, IdResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public RegisterHandler(IMapper mapper, IApplicationDbContext context, IPublishEndpoint publishEndpoint)
    {
        _mapper = mapper;
        _context = context;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<IdResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var address = _mapper.Map<Address>(request.DTO.Address);
        address.Title = "Default address";

        var hasher = new PasswordHasher<User>();
        var user = new User()
        {
            Email = request.DTO.CompanyData.Email,
            Role = Role.Admin,
            FirstName = request.DTO.CompanyData.FirstName,
            LastName = request.DTO.CompanyData.LastName,
        };
        var passHash = hasher.HashPassword(user, request.DTO.CompanyData.Password);
        user.Password = passHash!;
        var company = new Company()
        {
            Email = user.Email,
            Name = request.DTO.CompanyData.CompanyName,
            Employees = new List<User>() {user},
            Addresses = new List<Address>() {address}
        };
        await _context.Companies.AddAsync(company, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        company.DefaultAddressId = company.Addresses.First().Id;
        await _context.SaveChangesAsync(cancellationToken);

        await _publishEndpoint.Publish(
            new CreatePaymentStatisticEvent {CompanyId = company.Id, CompanyName = company.Name});

        if (request.billId != null && request.billId!=0)
        {
            var eventMessage = new UpdateBuyerInvoicesEvent
            {
                BillId = request.billId!.Value, BuyerId = company.Id, BuyerName = company.Name
            };
            await _publishEndpoint.Publish(eventMessage);
        }
        else
        {
            await _publishEndpoint.Publish(new UpdateCompanyInfoEvent() {RefId = company.Id, Name = company.Name});
        }

        return new IdResponse() {Id = company.Id};
    }
}