using System.Numerics;
using Administration.Application.Users.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Administration.Controllers;

public class CompanyAccountController : ApiControllerBase
{
    [HttpGet("{companyId}/employees")]

    public async Task<IActionResult> GetEmployees(long companyId)
    {
        var employees = await Mediator.Send(new GetEmployees(companyId));
        return Ok(employees);
    }
}


