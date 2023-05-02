namespace Invoicing.Application.Invoicing.Queries
{
    public class CompanyDetailsDto
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public byte[] Logo { get; set; }
        public ICollection<PaymentMethodDto> PaymentMethods { get; set; }
    }
}