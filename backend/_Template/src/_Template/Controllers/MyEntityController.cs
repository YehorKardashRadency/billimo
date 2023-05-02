using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using _Template.Application.MyEntity.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace _Template.Controllers;

public class MyEntityController : ApiControllerBase
{
    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<MyEntityDto>> Get(int id)
    {
        return await Mediator.Send(new GetMyEntitiesQuery(id));
    }

    [HttpPost("getToken")]
    public IActionResult Login([FromBody] LoginModel user)
    {
        // TODO: Replace with token provider
        if (user is null)
        {
            return BadRequest("Invalid client request");
        }
        if (user.name == "johndoe" && user.pass == "test")
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "https://localhost:7271",
                audience: "https://localhost:7271",
                claims: new List<Claim> {
                    new Claim(ClaimTypes.NameIdentifier, "john")
                },
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: signinCredentials
            );
            var token = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return Ok(new AuthenticatedResponse(token));
        }
        return Unauthorized();
    }

    public record LoginModel(string name, string pass);

    public record AuthenticatedResponse(string token);
}
