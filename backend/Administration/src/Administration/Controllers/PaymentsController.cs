
using Administration.Application.PaymentMethods.Commands;
using Administration.Application.PaymentMethods.Dto;
using Administration.Application.PaymentMethods.Queries;
using Administration.Application.PaymentMethods.Queries.CheckPaymentMethods;
using Going.Plaid.Link;
using Microsoft.AspNetCore.Mvc;

namespace Administration.Controllers;

public class PaymentsController: ApiControllerBase
{

    [HttpGet("methods")]
    public async Task<ActionResult<List<PaymentMethodModel>>> GetPaymentMethodsAsync([FromQuery] GetPaymentMethodsQuery request)
    {
        return await Mediator.Send(request);
    }

    [HttpGet("methodsInfo")]
    public async Task<ActionResult<List<PaymentMethodDto>>> GetPaymentMethodsAsync([FromQuery] GetPaymentsMethodInfoQuery request)
    {
        return Ok(await Mediator.Send(request));
    }
    
    [HttpGet("check-methods")]
    
    public async Task<IActionResult> GetCheckPaymentMethodsAsync()
    {
        return Ok(await Mediator.Send(new CheckPaymentMethodsQuery()));
    }
    

    [HttpGet("createLinkToken")]
    public async Task<ActionResult<LinkTokenCreateResponse>> CreateLinkToken()
    {
        return await Mediator.Send(new CreateLinkTokenQuery());
    }

    [HttpPost("exchangePublicToken")]
    public async Task<IActionResult> ExchangePublicToken([FromBody] AddPaymentMethodsCommand command)
    {
        await Mediator.Send(command);
        return NoContent();
    }
}