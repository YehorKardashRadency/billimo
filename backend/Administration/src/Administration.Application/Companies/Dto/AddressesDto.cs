namespace Administration.Application.Companies.Dto;

public class AddressesDTO
{
    public List<AddressDtoRes> Addresses { get; set; }
    public long? DefaultAddressId { get; set; }
}