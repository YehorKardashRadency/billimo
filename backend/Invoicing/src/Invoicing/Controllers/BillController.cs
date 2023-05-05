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

    
}
