using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payments.Application.BillPayment.Dto;
public class PaymentStatisticsDto
{
    public decimal Paid { get; set; }
    public decimal ForPayment { get; set; }
}
