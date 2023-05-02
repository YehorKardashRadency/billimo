using Administration.Application.Common.Interfaces;

namespace Administration.Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.Now;
    }
}