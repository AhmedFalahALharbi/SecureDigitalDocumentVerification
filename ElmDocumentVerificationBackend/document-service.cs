using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ElmDocVerify.Data;
using ElmDocVerify.DTOs;
using ElmDocVerify.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace ElmDocVerify.Services
{
    public class DocumentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        
        public DocumentService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }
        
        public async Task<DocumentResponseDto> UploadDocument(DocumentUploadDto uploadDto)
        {
            // Create upload directory if it doesn't exist
            var uploadsFolder = Path.Combine(_environment.ContentRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            
            // Generate a unique filename
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadDto.File.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);
            
            // Save the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadDto.File.CopyToAsync(stream);
            }
            
            // Create the document entity
            var document = new Document
            {
                UserId = uploadDto.UserId,
                Title = uploadDto.Title,
                FilePath = "/uploads/" + fileName,
                VerificationCode = GenerateVerificationCode(),
                Status = "Pending",
                CreatedAt = DateTime.Now
            };
            
            // Save to database
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();
            
            // Get user name for response
            var user = await _context.Users.FindAsync(uploadDto.UserId);
            
            // Return response
            return new DocumentResponseDto
            {
                Id = document.Id,
                Title = document.Title,
                VerificationCode = document.VerificationCode,
                Status = document.Status,
                CreatedAt = document.CreatedAt,
                UploadedBy = user?.Name ?? "Unknown"
            };
        }
        
        public async Task<DocumentResponseDto> GetDocumentById(int id)
        {
            var document = await _context.Documents
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == id);
                
            if (document == null)
            {
                return null;
            }
            
            return new DocumentResponseDto
            {
                Id = document.Id,
                Title = document.Title,
                VerificationCode = document.VerificationCode,
                Status = document.Status,
                CreatedAt = document.CreatedAt,
                UploadedBy = document.User?.Name ?? "Unknown"
            };
        }
        
        private string GenerateVerificationCode()
        {
            // Generate a random 8-character code
            var code = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
            
            // Ensure the code is unique
            while (_context.Documents.Any(d => d.VerificationCode == code))
            {
                code = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
            }
            
            return code;
        }
    }
}
