using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Administration.Domain.Entities;

namespace Administration.Infrastructure.Persistence.Configurations;
public class PaymentMethodConfiguration: IEntityTypeConfiguration<PaymentMethod>
{
    public void Configure(EntityTypeBuilder<PaymentMethod> builder)
    {
        builder.HasOne(x => x.PlaidBankAccount).WithOne(x => x.PaymentMethod)
            .HasForeignKey<PlaidBankAccount>(x => x.PaymentMethodId);
    }
}
