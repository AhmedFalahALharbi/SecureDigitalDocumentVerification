using System;
using System.Linq;
using ElmDocVerify.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ElmDocVerify.Data
{
    public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                // Check if the database is already seeded
                if (context.Users.Any())
                {
                    return; // DB has been seeded
                }
                
                // Seed users
                var users = new User[]
                {
                    new User
                    {
                        Name = "Admin User",
                        Email = "admin@elm.sa",
                        Password = "Admin@123", 
                        Role = "Admin"
                    },
                    new User
                    {
                        Name = "Normal User",
                        Email = "user@elm.sa",
                        Password = "User@123", 
                        Role = "User"
                    }
                };
                
                foreach (var user in users)
                {
                    context.Users.Add(user);
                }
                context.SaveChanges();
                
                // Seed documents
                var documents = new Document[]
                {
                    new Document
                    {
                        UserId = users[0].Id,
                        Title = "Sample Document 1",
                        FilePath = "/uploads/sample1.pdf",
                        VerificationCode = GenerateVerificationCode(),
                        Status = "Pending",
                        CreatedAt = DateTime.Now.AddDays(-5)
                    },
                    new Document
                    {
                        UserId = users[1].Id,
                        Title = "Sample Document 2",
                        FilePath = "/uploads/sample2.pdf",
                        VerificationCode = GenerateVerificationCode(),
                        Status = "Verified",
                        CreatedAt = DateTime.Now.AddDays(-2)
                    }
                };
                
                foreach (var document in documents)
                {
                    context.Documents.Add(document);
                }
                context.SaveChanges();
                
                // Seed verification logs
                var verificationLogs = new VerificationLog[]
                {
                    new VerificationLog
                    {
                        DocumentId = documents[1].Id,
                        VerifiedBy = "admin@elm.sa",
                        Timestamp = DateTime.Now.AddDays(-1),
                        Status = "Success"
                    }
                };
                
                foreach (var log in verificationLogs)
                {
                    context.VerificationLogs.Add(log);
                }
                context.SaveChanges();
            }
        }
        
        private static string GenerateVerificationCode()
        {
            // Generate a random 8-character code
            return Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }
    }
}
