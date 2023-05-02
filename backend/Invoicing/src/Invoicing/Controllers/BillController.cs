using AutoMapper;
using Invoicing.Application.Bills.Queries.ExportSentBills;
using Invoicing.Application.Bills.Queries.SentBills;
using Invoicing.Application.Common.Models.Request;
using Invoicing.Application.Invoicing.Commands.CreateInvoice;
using Microsoft.AspNetCore.Mvc;

namespace Invoicing.Controllers;

public class BillController : ApiControllerBase
{
    private readonly IMapper _mapper;
    public BillController(IMapper mapper) {
        _mapper = mapper;
    }

    [HttpGet("sentbills")]
    public async Task<IActionResult> SentBills([FromQuery] PaginatedRequestDto request)
    { 
        return Ok(await Mediator.Send(_mapper.Map<SentBillsQuery>(request)));
    }

    [HttpGet("receivedbills")]
    public async Task<IActionResult> ReceivedBills([FromQuery] PaginatedRequestDto request)
    {
        return Ok(await Mediator.Send(_mapper.Map<ReceivedBillsQuery>(request)));
    }

    [HttpGet("exportbills")]
    public async Task<IActionResult> ExportBills([FromQuery] RequestDto request)
    {
        return Ok(await Mediator.Send(_mapper.Map<ExportSentBillsQuery>(request)));
    }
}
