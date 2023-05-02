using System.Net.Http.Json;
using System.Text;
using Administration.Application.Common.Interfaces;
using Administration.Application.Companies.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Administration.Application.Companies.Commands;

public class VerifyCompanyCommand:IRequest<bool>
{
    public long CompanyId { get; set; }
}

public class VerifyCompanyCommandHandler : IRequestHandler<VerifyCompanyCommand,bool>
{
    private readonly IApplicationDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly HttpClient _httpClient;
    private readonly KybSettings _settings;
    public VerifyCompanyCommandHandler(IApplicationDbContext context, IHttpClientFactory httpClientFactory,
        Microsoft.Extensions.Options.IOptions<KybSettings> settings)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _httpClient = _httpClientFactory.CreateClient();
        _settings = settings.Value;
    }

    public async Task<bool> Handle(VerifyCompanyCommand request, CancellationToken cancellationToken)
    {
        var company = await _context.Companies.FirstAsync(x => x.Id == request.CompanyId,cancellationToken);
        var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(_settings.ClientId + ":" + _settings.ClientSecret));
        _httpClient.DefaultRequestHeaders.Authorization = new("Basic", token);
        var payload = new {
            reference = Guid.NewGuid(),
            company_name = company.Name,
        };

        var content = JsonContent.Create(payload);
        // var response = await _httpClient.PostAsync(_settings.BaseUrl, content,cancellationToken);
        //response.EnsureSuccessStatusCode();
        company.IsVerified = true;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
