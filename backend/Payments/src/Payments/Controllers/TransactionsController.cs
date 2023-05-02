using Microsoft.AspNetCore.Mvc;
using Payments.Application.Common.Models;
using Payments.Application.Transactions.Commands.CancelScheduledBillCommand;
using Payments.Application.Transactions.Commands.PayBillNowCommand;
using Payments.Application.Transactions.Commands.PayBillOnSpecificDateCommand;
using Payments.Application.Transactions.Dto;
using Payments.Application.Transactions.Queries.GetTransactionsWithPagination;

namespace Payments.Controllers;

public class TransactionsController: ApiControllerBase
{
    [HttpGet]
    public async Task<PaginatedList<TransactionModel>> GetTransactionsAsync([FromQuery]GetTransactionsWithPaginationQuery query)
    {
        return await Mediator.Send(query);
    }
    
    [HttpPost("paynow")]
    public async Task<IActionResult> PayBillNow(PayBillDto payBillDto)
    {
        return Ok(await Mediator.Send(new PayBillNowCommand(payBillDto)));
    }

    [HttpPost("payondate")]
    public async Task<IActionResult> PayBillOnDate(PayBillDto payBillDto)
    {
        return Ok(await Mediator.Send(new PayBillOnSpecificDateCommand() { PayBillDto = payBillDto } ));
    }

    [HttpPost("cancel")]
    public async Task<IActionResult> CancelBill(CancelBillDto model)
    {
        return Ok(await Mediator.Send(new CancelScheduledBillCommand () { CancelBillDto = model }));
    }
}