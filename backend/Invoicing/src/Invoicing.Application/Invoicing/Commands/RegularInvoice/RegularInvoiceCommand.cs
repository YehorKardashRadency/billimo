using Invoicing.Application.Common.Jobs;
using MediatR;
using Quartz;

namespace Invoicing.Application.Invoicing.Commands.RegularInvoice;

public class RegularInvoiceCommand: IRequest
{
    public long InvoiceId { get; set; }
    public int DayOfMounth { get; set; }
}

public class RegularInvoiceCommandHandler : IRequestHandler<RegularInvoiceCommand>
{
    private readonly IScheduler _scheduler;

    public RegularInvoiceCommandHandler(IScheduler scheduler)
    {
        _scheduler = scheduler;
    }

    public async Task<Unit> Handle(RegularInvoiceCommand request, CancellationToken cancellationToken)
    {
        var jobData = new JobDataMap
        {
            ["InvoiceId"] = request.InvoiceId
        };

        var jobDetail = JobBuilder.Create<RegularInvoiceJob>()
                .WithIdentity(nameof(RegularInvoiceJob) + request.InvoiceId.ToString(), "InvoiceGroup")
                .UsingJobData(jobData)
                .Build();

        var trigger = TriggerBuilder.Create()
               .WithIdentity(nameof(RegularInvoiceJob) + request.InvoiceId.ToString(), "InvoiceGroup")
               .WithSimpleSchedule(x => x.WithIntervalInSeconds(5).RepeatForever())
               .Build();

        await _scheduler.ScheduleJob(jobDetail, trigger, cancellationToken);
        await _scheduler.Start(cancellationToken);
        return Unit.Value;
    }
}
