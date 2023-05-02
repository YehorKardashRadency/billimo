namespace Administration.Application.RegisterCompany.Commands;


public class FirstAddressDTO
{
    public string Country { get; set; } = null!;
    public string City { get; set; } = null!;
    public string Street { get; set; } = null!;
    public string? Apartment { get; set; }
    public string ZipCode { get; set; } = null!;
}

public class ThirdStepDto
{
    public FirstAddressDTO Address { get; set; }
    public FirstStepDto CompanyData { get; set; }
}