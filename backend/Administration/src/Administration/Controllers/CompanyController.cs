using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Commands;
using Administration.Application.Companies.Commands.UpdateCompanyCommand;
using Administration.Application.Companies.Dto;
using Administration.Application.Companies.Queries;
using Administration.Application.PaymentMethods.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Administration.Controllers;

public class CompanyController : ApiControllerBase
{
    private readonly ICurrentUserService _userService;

    public CompanyController(ICurrentUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses()
    {
        var adresses = await Mediator.Send(new GetAddressesQuery(_userService.Companyid));
        return Ok(adresses);
    }

    [HttpPut("address")]
    public async Task<IActionResult> UpdateAddress(AddressDtoReq dto)
    {
        await Mediator.Send(new UpdateAddressCommand(dto, _userService.Id));
        return Ok();
    }

    [HttpPut("address/toggle/{addressId:long}")]
    public async Task<IActionResult> ToggleDefault(long addressId)
    {
        await Mediator.Send(new ToggleDefaultAddressCommand(addressId));
        return Ok();
    }

    [HttpPost("address")]
    public async Task<IActionResult> AddAddress(AddressDtoReq dto)
    {
        await Mediator.Send(new AddAddressCommand(dto, _userService.Id));
        return Ok();
    }

    [HttpDelete("address/{id:long}")]
    public async Task<IActionResult> DeleteAddress(long id)
    {
        await Mediator.Send(new DeleteAddressCommand(id, _userService.Id));
        return Ok();
    }

    [HttpGet("CurrentCompanyInfo")]
    public async Task<IActionResult> CurrentCompanyInfo()
    {
        return Ok(await Mediator.Send(new GetCompanyQuery()));
    }

    [HttpGet("GetCompanies")]
    public async Task<IActionResult> CompaniesInfo([FromQuery] GetCompaniesQuery request)
    {
        return Ok(await Mediator.Send(request));
    }

    [HttpGet]
    [Route("companies-info")]
    public async Task<IActionResult> GetCompaniesInfo([FromQuery]IEnumerable<long> companyIds)
    {
        var query = new GetCompaniesInfoQuery() { CompanyIds = companyIds };
        return Ok(await Mediator.Send(query));
    }

    [HttpGet("GetCompanyDetails/{companyId}")]
    public async Task<IActionResult> GetCompanyDetails(long companyId)
    {
        var response = await Mediator.Send(new GetCompanyDetailsQuery { CompanyId = companyId });
        return Ok(response);
    }


    [HttpPut("documents")]
    public async Task UpdateDocuments(CompanyDocumentsDto documents)
    {
        await Mediator.Send(new UpdateCompanyCommand() { Documents = documents });
    }

    [HttpGet("documents")]
    public async Task<ActionResult<CompanyDocumentsDto>> GetDocuments()
    {
        return await Mediator.Send(new GetCompanyDocumentsQuery());
    }

    [HttpPut("approvalsettings")]
    public async Task UpdateApprovalSettings(ApprovalSettingsDto approvalSettings)
    {
        await Mediator.Send(new UpdateApprovalSettingsCommand() { ApprovalSettings = approvalSettings });
    }

    [HttpGet("approvalsettings")]
    public async Task<ActionResult<ApprovalSettingsDto>> GetApprovalSettings()
    {
        return await Mediator.Send(new GetApprovalSettingsQuery() { CompanyId = _userService.Companyid });
    }

    [HttpGet("{companyId}/approvalsettings")]
    public async Task<ActionResult<ApprovalSettingsDto>> GetApprovalSettings(long companyId)
    {
        var result = await Mediator.Send(new GetApprovalSettingsQuery() {CompanyId = companyId});
        return result ;
    }

    [HttpGet("{companyId}/get-plaid-data")]
    public async Task<IActionResult> GetPlaidData(long companyId,[FromBody] GetPlaidBody? plaidBody)
    {
        return Ok(await Mediator.Send(new GetPlaidData(companyId, plaidBody?.PaymentMethodId)));
    }
    
    [HttpGet("check-on-duplicate-email")]
    
    public async Task<IActionResult> CheckOnDuplicateEmail([FromQuery] string email)
    {
        return Ok(await Mediator.Send(new CheckOnDuplicateEmailQuery(email)));
    }
    
}