using Payments.Application.Common.Models;

namespace Payments.Application.Common.Interfaces;

public interface IPlaidService
{
    Task MakeDepositTransactionAsync(PlaidTransferOperationDto model);

    Task MakeWithdrawalTransactionAsync(PlaidTransferOperationDto model);
}