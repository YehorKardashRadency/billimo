using Administration.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using MediatR;

namespace Administration.Infrastructure.Persistence
{
    public class ApplicationDbContextInitialiser
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger;
        private readonly ApplicationDbContext _context;

        public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger,
            ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task InitialiseAsync()
        {
            try
            {
                if (_context.Database.IsNpgsql())
                {
                    await _context.Database.MigrateAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                await TrySeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }

        public async Task TrySeedAsync()
        {
            if (!_context.Companies.Any())
            {
                var companies = new List<Company>
                {
                    new Company
                    {
                        Name = "Figma",
                        Email = "figma@gmail.com",
                        Logo =
                            Convert.FromBase64String(
                                "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"),
                        BusinessType = BusinessType.Corporation,
                        Tax = "GB123456789",
                        Registration = "2016/123123/07",
                        IsVerified = true,
                        Addresses = new List<Address>
                        {
                            new Address
                            {
                                Country = "United States",
                                City = "San Francisco",
                                Street = "760 Market St Fl 5",
                                Title = "Default address",
                                ZipCode = "94102"
                            },
                            new Address
                            {
                                Country = "United States",
                                City = "New York",
                                Street = "755 St Fl 5",
                                Title = "Second address",
                                ZipCode = "12345"
                            }
                        },
                    },
                    new Company
                    {
                        Name = "Amazon",
                        Email = "amazon@gmail.com",
                        Logo = Convert.FromBase64String(
                            "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"),
                        BusinessType = BusinessType.Corporation,
                        Tax = "GB123456789",
                        IsVerified = true,
                        Registration = "2011/123456/01",
                        Addresses = new List<Address>
                        {
                            new Address
                            {
                                Country = "United States",
                                City = "Seattle",
                                Street = "410 Terry Ave North",
                                Title = "Default address",
                                ZipCode = "98109"
                            }
                        },
                    },
                    new Company
                    {
                        Name = "UpWork",
                        Email = "upwork@gmail.com",
                        Logo = Convert.FromBase64String(
                            "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"),
                        BusinessType = BusinessType.Corporation,
                        Tax = "GB123456789",
                        IsVerified = true,
                        Registration = "2011/123456/01",
                        Addresses = new List<Address>
                        {
                            new Address
                            {
                                Country = "United States",
                                City = "San Francisco",
                                Street = "475 Brannan St.",
                                Title = "Default address",
                                ZipCode = "94107"
                            }
                        },
                    },
                    new Company
                    {
                        Name = "Youtube",
                        Email = "youtube@gmail.com",
                        Logo = Convert.FromBase64String(
                            "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"),
                        BusinessType = BusinessType.Corporation,
                        Tax = "GB123456789",
                        IsVerified = true,
                        Registration = "2033/123456/01",
                        Addresses = new List<Address>
                        {
                            new Address
                            {
                                Country = "United States",
                                City = "San Bruno",
                                Street = "901 Cherry Ave",
                                Title = "Default address",
                                ZipCode = "94066"
                            }
                        },
                    },
                    new Company
                    {
                        Name = "ABC Company",
                        Email = "abc@gmail.com",
                        Logo = Convert.FromBase64String(
                            "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"),
                        BusinessType = BusinessType.Corporation,
                        Tax = "GB123456789",
                        IsVerified = true,
                        Registration = "2014/123456/07",
                        Addresses = new List<Address>
                        {
                            new Address
                            {
                                Country = "United States",
                                City = "New York",
                                Street = "77 West 66th Street",
                                Title = "Default address",
                                ZipCode = "10023"
                            }
                        },
                    }
                };
                _context.AddRange(companies);
                await _context.SaveChangesAsync();
                foreach (var company in companies)
                {
                    company.DefaultAddressId = company.Addresses.First().Id;
                }

                await _context.SaveChangesAsync();
            }

            if (!_context.Users.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        Email = "wbrown@gmail.com",
                        FirstName = "William",
                        LastName = "Brown",
                        Role = Role.Admin,
                        CompanyId = 1,
                        Password =
                            "AQAAAAEAACcQAAAAEP73jl6BxUH0oWY0ip7DYjJ+unipViaBQMmPJCqteYS8I/hMq5T1aQoiqu4Wajwo6w==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "emma2199@gmail.com",
                        FirstName = "Emma",
                        LastName = "Jarvis",
                        Role = Role.Director,
                        CompanyId = 1,
                        Password =
                            "AQAAAAEAACcQAAAAECpj0NaYdA3XeZUdkQIPYoWu8qoLfoWHCiikkvVf0falHemmumU2ew87laxqtnm1Hg==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "stephenmar@gmail.com",
                        FirstName = "Stephen",
                        LastName = "Marshall",
                        Role = Role.Manager,
                        CompanyId = 1,
                        Password =
                            "AQAAAAEAACcQAAAAEJ1xMy1iSVgeFRcR2TgOIjEvWolab+/TGx1ymnuURfRBPOawIs8Ts8y/vYYf0TnEWA==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "morrisal@gmail.com",
                        FirstName = "Morris",
                        LastName = "Allan",
                        Role = Role.Manager,
                        CompanyId = 1,
                        Password =
                            "AQAAAAEAACcQAAAAEKPOkTdfhyAJpHZCtjhL8dzLOWFujtKGdiaNrV2y1msyeKdwcAcAQsEBipg5dPjBRw==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "jboughton52@gmail.com",
                        FirstName = "John",
                        LastName = "Boughton",
                        Role = Role.Admin,
                        CompanyId = 2,
                        Password =
                            "AQAAAAEAACcQAAAAENFNX+axQKrVE8iE3rYo619WyC1Ms7/ML5Dg71Ofiu23JQzQveTGIpPK99tnHQ8uLA==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "philclark@gmail.com",
                        FirstName = "Philip",
                        LastName = "Clark",
                        Role = Role.Director,
                        CompanyId = 2,
                        Password =
                            "AQAAAAEAACcQAAAAEFiksSigio0H0HDNOfShsDQh9vRMcHqZPY9Ax0LF0vcCHYp7QC+NOaUBo2kjprPCYA==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "paul712@gmail.com",
                        FirstName = "Paul",
                        LastName = "Downing",
                        Role = Role.Manager,
                        CompanyId = 2,
                        Password =
                            "AQAAAAEAACcQAAAAED6B82iBw0LXO86KRXdmSgDnWz8u0bTLJxTR52iMsy1fEhx0FZe9pWSg6iXZmT/SOQ==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "ecepalmer1319@gmail.com",
                        FirstName = "Ece",
                        LastName = "Palmer",
                        Role = Role.Admin,
                        CompanyId = 3,
                        Password =
                            "AQAAAAEAACcQAAAAEB2V/KwkjU3RBknBjjiRtC63Z9pVpSDYxiBPqFZ5bapGla7csya410Z8CdyUE7xKUQ==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "kpitman92@gmail.com",
                        FirstName = "Andrew",
                        LastName = "Pollard",
                        Role = Role.Director,
                        CompanyId = 3,
                        Password =
                            "AQAAAAEAACcQAAAAEKQ3tEiNpyF6KBIV62RLKlQEVb6Z5wpuwuRURqToL/3vawYZ3P76AthMC4/LmX2jrQ==",
                        NotificationsEnabled = false
                    },
                    new User
                    {
                        Email = "etyson2205@gmail.com",
                        FirstName = "Edmund",
                        LastName = "Tyson",
                        Role = Role.Admin,
                        CompanyId = 4,
                        Password =
                            "AQAAAAEAACcQAAAAEKpJ/oeqiLNL27u7BRuPWJKwnm+6fb/jwjoBRCaSNtygkf4dgWNvp938t6xTdl7FiA==",
                        NotificationsEnabled = false
                    },
                };
                _context.Users.AddRange(users);
                await _context.SaveChangesAsync();
            }

            if (!_context.Notifications.Any())
            {
                var notifications = new List<Notification>()
                {
                    new Notification()
                    {
                        CompanyId = 1,
                        Message = "<a href='#'>ABC Company</a> sent you an Invoice for $1,000.00",
                        MessageWithoutLinks = "ABC Company sent you an Invoice for $1,000.00",
                        Operation = NotificationOperation.InvoiceReceived,
                        ReferenceId = 1,
                    },
                    new Notification()
                    {
                        CompanyId = 1,
                        CreatedDate = DateTime.UtcNow.AddDays(-2),
                        Message = "You sent an Invoice to <a href='#'>ABC Company</a> for $1,000.00",
                        MessageWithoutLinks = "You sent an Invoice to ABC Company for $1,000.00",
                        Operation = NotificationOperation.InvoiceSent,
                        ReferenceId = 2,
                    },
                    new Notification()
                    {
                        CompanyId = 1,
                        CreatedDate = DateTime.UtcNow.AddDays(-3),
                        Message =
                            "Congratulations! Your profile has been verified. You can <a href='https://example.com'>create invoices now</a>.",
                        MessageWithoutLinks =
                            "Congratulations! Your profile has been verified. You can create invoices now.",
                        Operation = NotificationOperation.Message,
                        ReferenceId = null,
                    },
                    new Notification()
                    {
                        CompanyId = 1,
                        CreatedDate = DateTime.UtcNow.AddDays(-4),
                        Message = "You sent an Invoice to <a href='#'>ABC Company</a> for $1,000.00",
                        MessageWithoutLinks = "You sent an Invoice to ABC Company for $1,000.00",
                        Operation = NotificationOperation.InvoiceSent,
                        ReferenceId = 3,
                    },
                };

                _context.Notifications.AddRange(notifications);
                await _context.SaveChangesAsync();
            }
        }
    }
}