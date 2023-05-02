namespace Administration.Application.Companies.Dto;

public class ResponseCheckDuplicateEmail
{
    public string Email { get; set; }
    
    public bool IsDuplicate { get; set; }
}