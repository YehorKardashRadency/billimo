using AutoMapper;
using Payments.Application.Common.Extensions;
using Payments.Application.Common.Mappings;
using Payments.Domain.Entities;

namespace Payments.Application.Transactions.Queries.GetTransactionsWithPagination;
public class TransactionModel
{
    public long Id { get; set; }

    public string Icon { get; set; } = "/assets/images/icons/figma.png";

    public string Company { get; set; }

    public string Date { get; set; }

    public decimal Amount { get; set; }

    public TransactionStatus Status { get; set; }
}