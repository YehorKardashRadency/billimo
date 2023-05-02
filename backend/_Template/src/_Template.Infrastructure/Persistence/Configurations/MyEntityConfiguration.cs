using _Template.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace _Template.Infrastructure.Persistence.Configurations;

public class MyEntityConfiguration : IEntityTypeConfiguration<MyEntity>
{
    public void Configure(EntityTypeBuilder<MyEntity> builder)
    {
        builder.Property(t => t.Prop)
            .HasMaxLength(200)
            .IsRequired();
    }
}
