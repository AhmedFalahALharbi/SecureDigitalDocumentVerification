using ElmDocVerify.Models;
using Microsoft.EntityFrameworkCore;

namespace ElmDocVerify.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<VerificationLog> VerificationLogs { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure relationships
            modelBuilder.Entity<Document>()
                .HasOne(d => d.User)
                .WithMany(u => u.Documents)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<VerificationLog>()
                .HasOne(v => v.Document)
                .WithMany(d => d.VerificationLogs)
                .HasForeignKey(v => v.DocumentId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Configure constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
                
            modelBuilder.Entity<Document>()
                .HasIndex(d => d.VerificationCode)
                .IsUnique();
        }
    }
}
