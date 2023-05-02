using Invoicing.Application.QuickActions.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Invoicing.Controllers;

public class QuickActionsController : ApiControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetQuickActions()
    {
        return Ok(await Mediator.Send(new QuickActionsQuery()));
    }
}
