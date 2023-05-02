using AutoMapper;
using Invoicing.Application.Bills.Commands.ApproveRequest;
using Invoicing.Application.Bills.Commands.CreateRequest;
using Invoicing.Application.Bills.Commands.MarkBillAs;
using Invoicing.Application.Bills.Commands.DeclineRequest;
using Invoicing.Application.Bills.Queries.RequetsQuery;
using Invoicing.Application.Bills.Queries.RetrieveBill;
using Invoicing.Application.Common.Models.Request;
using Invoicing.Application.Invoicing.Queries;
using Microsoft.AspNetCore.Mvc;
using Invoicing.Application.Bills.Commands.MarkBillsAs;
using Invoicing.Application.Bills.Commands.CancelBill;

namespace Invoicing.Controllers
{
    public class BillsController : ApiControllerBase
    {
        private readonly IMapper _mapper;
        public BillsController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpGet("{billId}")]
        public async Task<IActionResult> GetBillPaymentDetails(long billId) {
            return Ok(await Mediator.Send(new GetBillPaymentDetailsQuery { BillId = billId }));
        }

        [HttpGet("requests")]
        public async Task<IActionResult> GetRequestsBills([FromQuery] PaginatedRequestDto request)
        {
            return Ok(await Mediator.Send(_mapper.Map<RequestsBillsQuery>(request)));
        }

        [HttpPut("create/request")]
        public async Task<IActionResult> CreateBillRequest([FromBody] long billId)
        {
            return Ok(await Mediator.Send(new CreateBillRequestCommand() { BillId = billId }));
        }

        [HttpPut("markas")]
        public async Task<IActionResult> MarkBillsAs(MarkBillsDto bills)
        {
            await Mediator.Send(new MarkBillsAsCommand() { MarkBills = bills });
            return Ok();
        }

        [HttpGet("{billId}/retrieve")]
        public async Task<IActionResult> RetrieveBill(long billId)
        {
            return Ok(await Mediator.Send(new RetrieveBillQuery() { BillId = billId }));
        }

        [HttpPut("approve/{billId:long}")]
        public async Task<IActionResult> ApprovePendingBill(long billId)
        {
            return Ok(await Mediator.Send(new ApproveBillCommand(billId)));
        }

        [HttpPut("decline/{billId:long}")]
        public async Task<IActionResult> DeclinePendingBill(long billId)
        {
            return Ok(await Mediator.Send(new DeclineBillCommand(billId)));
        }

        [HttpPut("cancel")]
        public async Task<IActionResult> CancelBill(CancelBillDto dto)
        {
            await Mediator.Send(new CancelBillCommand() { CancelBill = dto});
            return Ok();
        }
    }
}
