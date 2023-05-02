using Payments.Application.Common.Interfaces;

namespace Payments.Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.Now;
    }
}