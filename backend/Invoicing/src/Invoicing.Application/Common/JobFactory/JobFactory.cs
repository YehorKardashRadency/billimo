using System.Collections.Concurrent;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Quartz.Spi;

namespace Invoicing.Application.Common.JobFactory;

public class JobFactory : IJobFactory
{
    private readonly IServiceProvider _serviceProvider;

    public JobFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    private readonly ConcurrentDictionary<IJob, IServiceScope> _jobs = new();
    public IJob NewJob(TriggerFiredBundle bundle, IScheduler scheduler)
    {
        using var scope = _serviceProvider.CreateScope();
        var job = scope.ServiceProvider.GetRequiredService(bundle.JobDetail.JobType) as IJob;
        _jobs.TryAdd(job, scope);
        return job;
    }

    public void ReturnJob(IJob job)
    {
        _jobs.Remove(job, out var scope);
        scope.Dispose();
    }
}
