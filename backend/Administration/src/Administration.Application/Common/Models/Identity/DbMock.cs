using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Administration.Application.Common.Models.Identity;

namespace Administration.Application.Common.Models.Identity;
public class DbMock
{
    public IEnumerable<UserMock> Users { get; set; } =new List<UserMock>
        {
            new() {Id = 1, Email = "user1@gmail.com", Company_id = 1, Role = UserRole.Admin, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw=="},
            new() {Id = 2, Email = "user2@gmail.com", Company_id = 1, Role = UserRole.Director, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw=="},
            new() { Id = 3, Email = "user3@gmail.com", Company_id = 1, Role = UserRole.Manager, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw==" },
            new() { Id = 4, Email = "user4@gmail.com", Company_id = 2, Role = UserRole.Admin, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw==" },
            new() { Id = 5, Email = "user5@gmail.com", Company_id = 2, Role = UserRole.Director, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw==" },
            new() { Id = 6, Email = "user6@gmail.com", Company_id = 2, Role = UserRole.Manager, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw==" },
            new() { Id = 7, Email = "user7@gmail.com", Company_id = 3, Role = UserRole.Admin, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw==" },
            new() { Id = 8, Email = "user8@gmail.com", Company_id = 3, Role = UserRole.Director, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw==" },
            new() { Id = 9, Email = "user9@gmail.com", Company_id = 3, Role = UserRole.Manager, PasswordHash = "AQAAAAEAACcQAAAAEMczowh7GDFSTsV9l9817ztwgVFcriK17TN6nTRGcP+AnFqsESTKAJr6OK60gXM8Xw==" }

        };

    public IEnumerable<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public Task AddAsync()
    {
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync()
    {
        return Task.CompletedTask;
    }

}