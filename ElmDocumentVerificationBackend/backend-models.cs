using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ElmDocVerify.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Password { get; set; } // In production, this would be hashed
        
        [Required]
        [StringLength(20)]
        public string Role { get; set; } // Admin, User, etc.
        
        // Navigation property
        public virtual ICollection<Document> Documents { get; set; }
    }
    
    public class Document
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        [Required]
        [StringLength(500)]
        public string FilePath { get; set; }
        
        [Required]
        [StringLength(50)]
        public string VerificationCode { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } // Pending, Verified, Rejected
        
        [Required]
        public DateTime CreatedAt { get; set; }
        
        // Foreign key relationship
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        
        // Navigation property
        public virtual ICollection<VerificationLog> VerificationLogs { get; set; }
    }
    
    public class VerificationLog
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int DocumentId { get; set; }
        
        [Required]
        public string VerifiedBy { get; set; } // Could be user ID or email or name
        
        [Required]
        public DateTime Timestamp { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } // Success, Failed
        
        // Foreign key relationship
        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }
    }
}
