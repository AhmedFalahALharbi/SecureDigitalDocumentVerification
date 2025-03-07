using System;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ElmDocVerify.DTOs
{
    public class DocumentUploadDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        [Required]
        public IFormFile File { get; set; }
        
        public int UserId { get; set; }
    }
    
    public class DocumentResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string VerificationCode { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UploadedBy { get; set; }
    }
    
    public class VerificationRequestDto
    {
        [Required]
        public string VerificationCode { get; set; }
        
        public string VerifiedBy { get; set; }
    }
    
    public class VerificationResponseDto
    {
        public bool IsVerified { get; set; }
        public string Message { get; set; }
        public DocumentResponseDto Document { get; set; }
    }
}
