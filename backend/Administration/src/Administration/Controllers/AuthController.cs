using System.Security.Claims;
using Administration.Application.Common.Interfaces;
using Administration.Application.Common.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Administration.Controllers;

public class AuthController : ApiControllerBase
{
    private readonly IAuthService _authService;
    private readonly ITwoFactorAuthService _twoFactorAuthService;
    private readonly ICurrentUserService _currentUserService;
    public AuthController(IAuthService authService, ICurrentUserService currentUserService, ITwoFactorAuthService twoFactorAuthService)
    {
        _authService = authService;
        _currentUserService = currentUserService;
        _twoFactorAuthService = twoFactorAuthService;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest loginRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid client request");
        }

        var result = await _authService.LoginAsync(loginRequest);
        if (result == null || !result.Succeeded) {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("ResendTwoFactorCode")]
    public async Task<IActionResult> ResendTwoFactorCodeAsync([FromBody] LoginRequest loginRequest)
    {
        if (!ModelState.IsValid)
            return BadRequest("Invalid client request");

        var result = await _twoFactorAuthService.ResendTwoFactoreCodeAsync(loginRequest);
        if (result == null || !result.Succeeded)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreshTokenAsync([FromBody] TokenRequest tokenRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var result = await _authService.RefreshTokenAsync(tokenRequest);
        if (result == null || !result.Succeeded)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpDelete("RefreshToken")]
    public async Task<IActionResult> DeleteRefreshTokenAsync([FromHeader] string refreshToken) {
        var result = await _authService.DeleteRefreshTokenAsync(refreshToken);
        if (result == null || !result.Succeeded) {
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpGet("TestAuthorize")]
    public async Task<IActionResult> TestAuthorize()
    {
        await Task.CompletedTask;
        return Ok(new { data = "Secret data !" });
    }

}
