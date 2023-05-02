using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Payments.Application.Common.Models;
using Payments.Application.Transactions.Commands;
using Payments.Application.Transactions.Commands.ChangeStatus;
using Payments.Application.Transactions.Commands.Webhook;
using Payments.Application.Transactions.Dto;
using Payments.Application.Transactions.Queries.GetTransactionsWithPagination;

namespace Payments.Controllers;

public class WebhooksController : ApiControllerBase
{

    [HttpPost("plaid")]
    public async Task<IActionResult> PlaidPostAsync([FromBody]WebhookCommand webhook)
    {
        var result = await Mediator.Send(webhook);
        if (result.Succeeded)
        {
            return Ok();
        }

        return StatusCode(StatusCodes.Status500InternalServerError);
    }

    [HttpPost("transactionStatus")]
    public async Task<IActionResult> ChangeStatus()
    {
        var result = await Mediator.Send(new ChangeTransactionStatusCommand());
        return Ok();
    }
}