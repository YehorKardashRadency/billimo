using Invoicing.Domain.Common;

namespace Invoicing.Domain.Entities
{
    public class Request : BaseEntity
    {
        public long UserId { get; set; }
    }
}