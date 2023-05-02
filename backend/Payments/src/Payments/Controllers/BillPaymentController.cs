using Microsoft.AspNetCore.Mvc;
using Payments.Application.BillPayment.Queries;
using Payments.Application.Common.Interfaces;
using Payments.Domain.Entities;

namespace Payments.Controllers;

public class BillPaymentController : ApiControllerBase
{
    [HttpGet("payment-statistic")]
    public async Task<IActionResult> GetPaymentStatistics(TabType tabType)
    {
        var paymentStatistics = await Mediator.Send(new GetPaymentStatistics(tabType));
        return Ok(paymentStatistics);
    }

  
}