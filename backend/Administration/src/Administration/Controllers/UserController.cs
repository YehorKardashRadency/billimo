using Administration.Application.Common.Models;
using Administration.Application.Users.Commands;
using Administration.Application.Users.Commands.UpdateUserEmailSettingsCommand;
using Administration.Application.Users.Commands.UpdateUserPasswordCommand;
using Administration.Application.Users.Commands.UpdateUserProfileCommand;
using Administration.Application.Users.Queries;
using Administration.Application.Users.Queries.GetUserSettingsQuery;
using Administration.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Administration.Controllers;
public class UserController : ApiControllerBase
{
    [HttpGet("CurrentUserInfo")]
    public async Task<IActionResult> CurrentUserInfo()
    {
        return Ok(await Mediator.Send(new GetUserQuery())); 
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserCommand command)
    {
        var result = await Mediator.Send(command);

        if (result.Succeeded) {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(long id)
    {
        return Ok(await Mediator.Send(new GetUserByIdQuery(id)));
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(long id,[FromBody]Role role)
    {
        await Mediator.Send(new PutUserRole(id,role));
        return NoContent();
    }

    [HttpPut("{id}/resend-invitation")]
    public async Task<IActionResult> ResendInvitation(long id)
    {
        return Ok(await Mediator.Send(new ResendEmployeeInvitation(id)));
    }

    [HttpPut("{id}/finish-registration")]
    public async Task<IActionResult> FinishRegistration(long id, [FromBody] FinishUserRegistrationCommand command)
    {
        command.UserId = id;
        var result = await Mediator.Send(command);

        if (result.Succeeded) {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet("settings")]
    public async Task<ActionResult<GetUserSettingsDto>> GetUserSettingsAsync()
    {
        return await Mediator.Send(new GetUserSettingsQuery());
    }

    [HttpPut("settings/email")]
    public async Task<ActionResult> UpdateUserEmailSettings(UpdateUserEmailSettingsDto settings)
    {
        await Mediator.Send(new UpdateUserEmailSettingsCommand() { EmailSettings = settings });

        return NoContent();
    }

    [HttpPut("settings/profile")]
    public async Task<ActionResult> UpdateUserProfile(UpdateUserProfileDto profile)
    {
        await Mediator.Send(new UpdateUserProfileCommand() { Profile = profile });

        return NoContent();
    }

    [HttpPut("settings/password")]
    public async Task<ActionResult<Result>> UpdateUserPassword(UpdateUserPasswordDto password)
    {
        var result = await Mediator.Send(new UpdateUserPasswordCommand() { PasswordDto = password });

        if (result.Succeeded)
            return Ok(result);

        return BadRequest(result);
    }
}
