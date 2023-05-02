using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Payments.Domain.Entities;

namespace Payments.Infrastructure.Persistence.Configurations;
public class PaymentStatisticConfiguration : IEntityTypeConfiguration<PaymentStatistic>
{
    public void Configure(EntityTypeBuilder<PaymentStatistic> builder)
    {
        builder.HasKey(o => new { o.CompanyId, o.Tab });
        builder.HasOne(p => p.Company)
            .WithMany(c => c.PaymentStatistics);

        builder.Property(d => d.Tab).HasConversion(new EnumToStringConverter<TabType>());
    }

}
