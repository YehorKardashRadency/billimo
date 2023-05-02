using Invoicing.Application.Bills.Queries.GetInvoiceNumber;
using Invoicing.Application.Common.Interfaces;
using Invoicing.Application.Invoicing.Commands.CreateInvoice;
using Invoicing.Application.Invoicing.Commands.SendInvoice;
using Invoicing.Application.Invoicing.Commands.ArchiveInvoice;
using Invoicing.Application.Invoicing.Queries;
using Invoicing.Application.Invoicing.Commands.DeleteInvoice;
using Invoicing.Application.Invoicing.Commands.ManagePendingInvoice;
using Invoicing.Application.Invoicing.Queries.GetCurrentInvoices;
using Invoicing.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Invoicing.Application.Invoicing.Commands.RegularInvoice;

namespace Invoicing.Controllers;

public class InvoiceController : ApiControllerBase
{
    private readonly ICurrentUserService _currentUserService;

    public InvoiceController(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    [HttpPost]
    [Route("create-or-edit")]
    public async Task<IActionResult> Create([FromBody]CreateInvoiceCommand command)
    {
        var result = await Mediator.Send(command);
        if(command.Send && (ApprovalStatus)result.ApprovalStatus == ApprovalStatus.Approved)
        {
            await Mediator.Send(new SendInvoiceCommand(result.Id));
        }

        if (command.IsRegular)
        {
            var regularInvoiceCommand = new RegularInvoiceCommand()
            {
                InvoiceId = result.Id,
                DayOfMounth = command.RegularCreatingDate!.Value.Day,
            };

            await Mediator.Send(regularInvoiceCommand);
        }
        return Ok(result);
    }

    [HttpPost("send/{invoiceId:long}")]
    public async Task<IActionResult> Send(long invoiceId)
    {
        await Mediator.Send(new SendInvoiceCommand(invoiceId));
        return Ok();
    }
    [HttpPut("accept/{invoiceId:long}")]
    public async Task<IActionResult> AcceptPendingInvoice(long invoiceId)
    {
        await Mediator.Send(new AcceptInvoiceCommand(invoiceId));
        await Mediator.Send(new SendInvoiceCommand(invoiceId));
        return Ok();
    }
    [HttpPut("decline/{invoiceId:long}")]
    public async Task<IActionResult> DeclinePendingInvoice(long invoiceId)
    {
        await Mediator.Send(new DeclineInvoiceCommand(invoiceId));
        return Ok();
    }

    [HttpPut("ToArchive/{id:long}")]
    public async Task<IActionResult> InvoiceToArchive(long id)
    {
        return Ok(await Mediator.Send(new ArchiveInvoiceCommand { InvoiceId = id}));
    }
    
    [HttpDelete]
    [Route("delete/{invoiceId}")]
    public async Task<IActionResult> DeleteInvoice(int invoiceId)
    {
        var command = new DeleteInvoiceCommand() { InvoiceId = invoiceId };
        await Mediator.Send(command);
        return Ok();
    }
    [HttpGet]
    [Route("current")]
    public async Task<IActionResult> GetCurrentInvoices()
    {
        var query = new GetCurrentInvoicesQuery(InvoiceType.Current);

        return Ok(await Mediator.Send(query));
    }

    [HttpGet]
    [Route("regular")]
    public async Task<IActionResult> GetRegularInvoices()
    {
        var query = new GetCurrentInvoicesQuery(InvoiceType.Current, true);

        return Ok(await Mediator.Send(query));
    }

    [HttpGet]
    [Route("archived")]
    public async Task<IActionResult> GetArchivedInvoices()
    {
        var query = new GetCurrentInvoicesQuery(InvoiceType.Archived);
        return Ok(await Mediator.Send(query));
    }
    [HttpGet]
    [Route("templates")]
    public async Task<IActionResult> GetTemplates()
    {
        var query = new GetCurrentInvoicesQuery(InvoiceType.Template);

        return Ok(await Mediator.Send(query));
    }
    [HttpGet]
    [Route("requests")]
    public async Task<IActionResult> GetRequestsInvoices()
    {
        var query = new GetCurrentInvoicesQuery(InvoiceType.Current);
        return Ok(await Mediator.Send(query));
    }
    
    [HttpGet("invoice-number")]
    
    public async Task<IActionResult> GetInvoiceNumber()
    {
        return Ok(await Mediator.Send(new GetInvoiceNumberRequest()));
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        return Ok(await Mediator.Send(new GetInvoiceByIdRequest(id)));
    }
}