// using System;
// using System.Data;
// using System.Data.SqlClient;
// using System.Diagnostics;
// using System.Threading.Tasks;
// using Dapper;
// using ElmDocVerify.Data;
// using ElmDocVerify.DTOs;
// using ElmDocVerify.Models;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Logging;

// namespace ElmDocVerify.Services
// {
//     public class VerificationService
//     {
//         private readonly ApplicationDbContext _context;
//         private readonly IConfiguration _configuration;
//         private readonly ILogger<VerificationService> _logger;
        
//         public VerificationService(
//             ApplicationDbContext context,
//             IConfiguration configuration,
//             ILogger<VerificationService> logger)
//         {
//             _context = context;
//             _configuration = configuration;
//             _logger = logger;
//         }
        
//         public async Task<VerificationResponseDto> VerifyDocumentWithEF(string verificationCode, string verifiedBy)
//         {
//             Stopwatch stopwatch = new Stopwatch();
//             stopwatch.Start();
            
//             // Get document by verification code using EF Core
//             var document = await _context.Documents
//                 .Include(d => d.User)
//                 .FirstOrDefaultAsync(d => d.VerificationCode == verificationCode);
                
//             if (document == null)
//             {
//                 stopwatch.Stop();
//                 _logger.LogInformation($"EF Core verification failed - Code not found: {verificationCode}. Time: {stopwatch.ElapsedMilliseconds}ms");
                
//                 return new VerificationResponseDto
//                 {
//                     IsVerified = false,
//                     Message = "Invalid verification code"
//                 };
//             }
            
//             // Create verification log
//             var log = new VerificationLog
//             {
//                 DocumentId = document.Id,
//                 VerifiedBy = verifiedBy,
//                 Timestamp = DateTime.Now,
//                 Status = "Success"
//             };
            
//             _context.VerificationLogs.Add(log);
            
//             // Update document status if it was pending
//             if (document.Status == "Pending")
//             {
//                 document.Status = "Verified";
//                 _context.Documents.Update(document);
//             }
            
//             await _context.SaveChangesAsync();
            
//             stopwatch.Stop();
//             _logger.LogInformation($"EF Core verification completed for document ID: {document.Id}. Time: {stopwatch.ElapsedMilliseconds}ms");
            
//             return new VerificationResponseDto
//             {
//                 IsVerified = true,
//                 Message = "Document verified successfully",
//                 Document = new DocumentResponseDto
//                 {
//                     Id = document.Id,
//                     Title = document.Title,
//                     VerificationCode = document.VerificationCode,
//                     Status = document.Status,
//                     CreatedAt = document.CreatedAt,
//                     UploadedBy = document.User?.Name ?? "Unknown"
//                 }
//             };
//         }
        
//         public async Task<VerificationResponseDto> VerifyDocumentWithDapper(string verificationCode, string verifiedBy)
//         {
//             Stopwatch stopwatch = new Stopwatch();
//             stopwatch.Start();
            
//             var connectionString = _configuration.GetConnectionString("DefaultConnection");
            
//             using (IDbConnection connection = new SqlConnection(connectionString))
//             {
//                 connection.Open();
                
//                 // Find document with verification code
//                 var query = @"
//                     SELECT d.Id, d.Title, d.VerificationCode, d.Status, d.CreatedAt, u.Name as UploadedBy
//                     FROM Documents d
//                     JOIN Users u ON d.UserId = u.Id
//                     WHERE d.VerificationCode = @VerificationCode";
                
//                 var document = await connection.QueryFirstOrDefaultAsync<dynamic>(query, new { VerificationCode = verificationCode });
                
//                 if (document == null)
//                 {
//                     stopwatch.Stop();
//                     _logger.LogInformation($"Dapper verification failed - Code not found: {verificationCode}. Time: {stopwatch.ElapsedMilliseconds}ms");
                    
//                     return new VerificationResponseDto
//                     {
//                         IsVerified = false,
//                         Message = "Invalid verification code"
//                     };
//                 }
                
//                 using (var transaction = connection.BeginTransaction())
//                 {
//                     try
//                     {
//                         // Insert verification log
//                         var insertLogQuery = @"
//                             INSERT INTO VerificationLogs (DocumentId, VerifiedBy, Timestamp, Status)
//                             VALUES (@DocumentId, @VerifiedBy, @Timestamp, @Status)";
                        
//                         await connection.ExecuteAsync(insertLogQuery, new
//                         {
//                             DocumentId = document.Id,
//                             VerifiedBy = verifiedBy,
//                             Timestamp = DateTime.Now,
//                             Status = "Success"
//                         }, transaction);
                        
//                         // Update document status if pending
//                         if (document.Status == "Pending")
//                         {
//                             var updateQuery = @"
//                                 UPDATE Documents
//                                 SET Status = @Status
//                                 WHERE Id = @Id";
                            
//                             await connection.ExecuteAsync(updateQuery, new
//                             {
//                                 Id = document.Id,
//                                 Status = "Verified"
//                             }, transaction);
                            
//                             document.Status = "Verified";
//                         }
                        
//                         transaction.Commit();
                        
//                         stopwatch.Stop();
//                         _logger.LogInformation($"Dapper verification completed for document ID: {document.Id}. Time: {stopwatch.ElapsedMilliseconds}ms");
                        
//                         return new VerificationResponseDto
//                         {
//                             IsVerified = true,
//                             Message = "Document verified successfully",
//                             Document = new DocumentResponseDto
//                             {
//                                 Id = document.Id,
//                                 Title = document.Title,
//                                 VerificationCode = document.VerificationCode,
//                                 Status = document.Status,
//                                 CreatedAt = document.CreatedAt,
//                                 UploadedBy = document.UploadedBy
//                             }
//                         };
//                     }
//                     catch (Exception ex)
//                     {
//                         transaction.Rollback();
//                         _logger.LogError($"Error during Dapper verification: {ex.Message}");
//                         throw;
//                     }
//                 }
//             }
//         }
//     }
// }
