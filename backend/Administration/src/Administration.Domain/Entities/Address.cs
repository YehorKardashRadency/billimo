using Administration.Domain.Common;

namespace Administration.Domain.Entities
{
    public class Address : BaseEntity
    {
        public string Title { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Apartment { get; set; }
        public string ZipCode { get; set; }
        public Company Company { get; set; }
        public long CompanyId { get; set; }
    }
}