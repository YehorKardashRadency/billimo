using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Payments.Domain.Entities;

namespace Payments.Infrastructure.Persistence
{
    public class ApplicationDbContextInitialiser
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger;
        private readonly ApplicationDbContext _context;

        public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger, ApplicationDbContext context)
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
                var companies = new List<Company> {
                    new Company {
                        Id = 1,
                        Name = "Figma",
                    },
                    new Company {
                        Id = 2,
                        Name = "Amazon",
                    },
                    new Company {
                        Id = 3,
                        Name = "UpWork",
                    },
                    new Company {
                        Id = 4,
                        Name = "Youtube",
                    },
                    new Company {
                        Id = 5,
                        Name = "ABC Company",
                    }
                };

                _context.AddRange(companies);
                await _context.SaveChangesAsync();
            }

            if (!_context.Transactions.Any()) {
                var transactions = new List<Transaction> {
                    new Transaction {
                        BillId = 1,
                        BuyerId = 2,
                        SellerId = 1,
                        Amount = 1000,
                        CreatedDate = DateTime.UtcNow.AddMinutes(-10),
                    },
                    new Transaction {
                        BillId = 2,
                        BuyerId = 2,
                        SellerId = 3,
                        Amount = 3000,
                        CreatedDate = DateTime.UtcNow.AddMinutes(-20),
                    },
                    new Transaction {
                        BillId = 3,
                        BuyerId = 2,
                        SellerId = 1,
                        Amount = 5000,
                        CreatedDate = DateTime.UtcNow.AddMinutes(-30),
                    },
                    new Transaction {
                        BillId = 4,
                        BuyerId = 1,
                        SellerId = 2,
                        Amount = 7000,
                        CreatedDate = DateTime.UtcNow.AddDays(-30),
                    },
                    new Transaction {
                        BillId = 5,
                        BuyerId = 1,
                        SellerId = 2,
                        Amount = 7000,
                        CreatedDate = DateTime.UtcNow.AddDays(-40),
                    },
                    new Transaction {
                        BillId = 6,
                        BuyerId = 1,
                        SellerId = 3,
                        Amount = 18000,
                        CreatedDate = DateTime.UtcNow.AddDays(-50),
                    },
                };

                _context.AddRange(transactions);
                await _context.SaveChangesAsync();
            }

            if (!_context.PaymentStatistics.Any())
            {
                var paymentStatistics = new List<PaymentStatistic> {
                    new PaymentStatistic {
                        CompanyId = 1,
                        Tab = TabType.Send,
                        Paid = 3000,
                        ForPayment = 2000
                    },
                    new PaymentStatistic {
                        CompanyId = 1,
                        Tab = TabType.Receive,
                        Paid = 1000,
                        ForPayment = 2000
                    },
                    new PaymentStatistic {
                        CompanyId = 2,
                        Tab = TabType.Send,
                        Paid = 4000,
                        ForPayment = 1000
                    },
                    new PaymentStatistic {
                        CompanyId = 2,
                        Tab = TabType.Receive,
                        Paid = 4000,
                        ForPayment = 2000
                    },
                    new PaymentStatistic {
                        CompanyId = 3,
                        Tab = TabType.Send,
                        Paid = 2000,
                        ForPayment = 2000
                    },
                    new PaymentStatistic {
                        CompanyId = 3,
                        Tab = TabType.Receive,
                        Paid = 1000,
                        ForPayment = 2000
                    },
                };

                _context.AddRange(paymentStatistics);
                await _context.SaveChangesAsync();
            }
        }
    }
}