using Going.Plaid;
using Going.Plaid.Entity;
using Going.Plaid.Transfer;
using Microsoft.Extensions.Options;
using Payments.Application.Common.Extensions;
using Payments.Application.Common.Interfaces;
using Payments.Application.Common.Models;
using Payments.Domain.Entities;

namespace Payments.Services;

public class PlaidService : IPlaidService
{
    private readonly PlaidClient _plaidClient;
    private readonly PlaidConfigModel _plaidConfigModel;
    private readonly IApplicationDbContext _context;

    public PlaidService(PlaidClient plaidClient, IOptions<PlaidConfigModel> plaidConfigModel,
        IApplicationDbContext contex)
    {
        _plaidClient = plaidClient;
        _plaidConfigModel = plaidConfigModel.Value;
        _context = contex;
    }
    
    private async Task<TransferAuthorizationCreateResponse> CreateTransferAuth(TransferAuthCreateModel transferAuthCreateModel)
    {
        TransferAuthorizationCreateRequest
            transferAuthorizationCreateRequest = new TransferAuthorizationCreateRequest()
            {
                AccessToken = transferAuthCreateModel.AccessToken,
                AccountId = transferAuthCreateModel.AccountId,
                Type = transferAuthCreateModel.Type,
                ClientId = _plaidConfigModel.ClientId,
                Secret = _plaidConfigModel.Secret,
                Amount = transferAuthCreateModel.Amount,
                Network = transferAuthCreateModel.Network,
                User = new TransferAuthorizationUserInRequest()
                {
                    LegalName = transferAuthCreateModel.LegalName
                },
                AchClass = transferAuthCreateModel.AchClass,
                Device = new TransferAuthorizationDevice()
                {
                    UserAgent = transferAuthCreateModel.UserAgent,
                    IpAddress = transferAuthCreateModel.IpAddress,
                },
            };
        
        var transferAuthorization =
            await _plaidClient.TransferAuthorizationCreateAsync(transferAuthorizationCreateRequest);
        
        return transferAuthorization;
    }

    private async Task<TransferCreateResponse> CreateTransfer(TransferCreateModel transferCreateModel)
    {
        TransferCreateRequest transferCreate = new TransferCreateRequest()
        {
            ClientId = _plaidConfigModel.ClientId,
            Secret = _plaidConfigModel.Secret,
            AccessToken = transferCreateModel.AccessToken,
            AccountId = transferCreateModel.AccountId,
            AuthorizationId = transferCreateModel.AuthorizationId,
            Amount = transferCreateModel.Amount,
            Description = transferCreateModel.Description
        };
        
        var responseTransfer = await _plaidClient.TransferCreateAsync(transferCreate);
        return responseTransfer;
    }

    private async Task<TransferCreateResponse> CreateTransactionAsync(PlaidTransferOperationDto model, TransferType transferType)
    {
        var transferAuthModel = new TransferAuthCreateModel()
        {
            Type = transferType,
            Network = TransferNetwork.Ach,
            AchClass = AchClass.Ccd,

            AccessToken = model.ClientInformation.AccessToken,
            AccountId = model.ClientInformation.AccountId,
            Amount = model.Amount.ConvertDecimalToMoney(),
            LegalName = model.ClientInformation.CompanyName,
            IpAddress = model.IpAddress,
            UserAgent = model.UserAgent,
        };

        var transferAuthorization = await CreateTransferAuth(transferAuthModel);
        var transferAuthorizationId = transferAuthorization.Authorization.Id;

        var transferModel = new TransferCreateModel()
        {
            AccessToken = model.ClientInformation.AccessToken,
            AccountId = model.ClientInformation.AccountId,
            AuthorizationId = transferAuthorizationId,
            Amount = model.Amount.ConvertDecimalToMoney(),
            Description = model.Description,
        };

        return await CreateTransfer(transferModel);
    }

    public async Task MakeDepositTransactionAsync(PlaidTransferOperationDto model)
    {
        var trans = await CreateTransactionAsync(model, TransferType.Debit);

        _context.PlaidTransfers.Add(new PlaidTransfer()
        {
            Buyer = true,
            Transaction = model.Transaction,
            PlaidTransferEventType = PlaidTransferEventType.Pending,
            TransferId = trans.Transfer.Id
        });

        await _context.SaveChangesAsync();
    }


    public async Task MakeWithdrawalTransactionAsync(PlaidTransferOperationDto model)
    {
        var trans = await CreateTransactionAsync(model, TransferType.Credit);

        _context.PlaidTransfers.Add(new PlaidTransfer()
        {
            Buyer = false,
            Transaction = model.Transaction,
            PlaidTransferEventType = PlaidTransferEventType.Pending,
            TransferId = trans.Transfer.Id
        });

        await _context.SaveChangesAsync();
    }
}