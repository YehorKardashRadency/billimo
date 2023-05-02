using _Template.Application.Common.Interfaces;

namespace _Template.Infrastructure.Services;

public class DateTimeService : IDateTime
{
    public DateTime Now => DateTime.Now;
}
