using Administration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Administration.Infrastructure.Persistence.Configurations
{
    public class PendingActionConfiguration : IEntityTypeConfiguration<PendingAction>
    {
        public void Configure(EntityTypeBuilder<PendingAction> builder)
        {
            builder.Property(pa => pa.Type)
                .HasConversion(pat => pat.ToString(), pat => (PendingActionType)Enum.Parse(typeof(PendingActionType), pat));
        }
    }
}