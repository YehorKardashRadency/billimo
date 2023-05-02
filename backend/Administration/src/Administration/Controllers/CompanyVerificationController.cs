using Administration.Application.Companies.Commands;
using Administration.Application.Companies.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Administration.Controllers;

[ApiController]
public class CompanyVerificationController:ApiControllerBase
{

    [HttpPut]
    [Route("verify/{companyId}")]
    public async Task<IActionResult> VerifyCompany(int companyId)
    {
        var command = new VerifyCompanyCommand()
        {
            CompanyId = companyId,
        };
        
        var verificated = await Mediator.Send(command);
        if (verificated)
        {
            var notification = new NotificationDto()
            {
                CompanyId = companyId, MessageWithoutLinks = "Your company has been verified"
            };
            await Mediator.Send(new AddNotificationCommand(notification));
        }
        return Ok();
    }
}
