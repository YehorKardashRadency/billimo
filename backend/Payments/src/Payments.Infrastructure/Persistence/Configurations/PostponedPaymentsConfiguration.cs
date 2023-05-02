using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Payments.Domain.Entities;

namespace Payments.Infrastructure.Persistence.Configurations;
public class PostponedPaymentsConfiguration : IEntityTypeConfiguration<PostponedPayment>
{
    public void Configure(EntityTypeBuilder<PostponedPayment> builder)
    {
        builder.Property(x => x.Amount).HasColumnType("Money");
    }
}

