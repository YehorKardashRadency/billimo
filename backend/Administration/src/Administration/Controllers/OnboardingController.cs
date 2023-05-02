using Administration.Application.RegisterCompany.Commands;
using Microsoft.AspNetCore.Mvc;

namespace Administration.Controllers;

public class OnboardingController : ApiControllerBase
{
    [HttpPost("validate-company-form")]
    public async Task<IActionResult> ValidateCompanyForm(FirstStepDto dto)
    {
        await Mediator.Send(new ValidateRegistrationDataCommand(dto));
        return Ok();
    }
    
    [HttpPost("register-company")]
    public async Task<IActionResult> RegisterCompany(ThirdStepDto dto, [FromQuery] long billId)
    {
        var id = await Mediator.Send(new RegisterCommand(dto, billId));
        return Ok(id);
    }
}
