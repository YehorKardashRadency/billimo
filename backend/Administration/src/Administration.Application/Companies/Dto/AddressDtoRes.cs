namespace Administration.Application.Companies.Dto;

public class AddressDtoRes
{
    public long? Id { get; set; }
    public string Title { get; set; } = null!;
    public string Country { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Street { get; set; } = null!;
    public string Apartment { get; set; } = null!;
    public string ZipCode { get; set; } = null!;
}