using System;
using System.Threading.Tasks;
using ElmDocVerify.DTOs;
using ElmDocVerify.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ElmDocVerify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerifyController : ControllerBase
    {
        private readonly VerificationService _verificationService;
        private readonly ILogger<VerifyController> _logger;
        
        public VerifyController(
            VerificationService verificationService,
            ILogger<VerifyController> logger)
        {
            _verificationService = verificationService;
            _logger = logger;
        }
        
        // POST: api/verify
        [HttpPost]
        public async Task<ActionResult<VerificationResponseDto>> VerifyDocument([FromBody] VerificationRequestDto request)
        {
            try
            {
                _logger.LogInformation($"Verifying document with code: {request.VerificationCode}");
                
                // Use Dapper for verification (for performance)
                var result = await _verificationService.VerifyDocumentWithDapper(
                    request.VerificationCode,
                    request.VerifiedBy ?? "Anonymous");
                
                if (!result.IsVerified)
                {
                    return NotFound(result);
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error verifying document: {ex.Message}");
                return StatusCode(500, "An error occurred while verifying the document");
            }
        }
        
        // POST: api/verify/ef (for performance comparison)
        [HttpPost("ef")]
        public async Task<ActionResult<VerificationResponseDto>> VerifyDocumentWithEF([FromBody] VerificationRequestDto request)
        {
            try
            {
                _logger.LogInformation($"Verifying document with EF Core. Code: {request.VerificationCode}");
                
                // Use EF Core for verification (for comparison)
                var result = await _verificationService.VerifyDocumentWithEF(
                    request.VerificationCode,
                    request.VerifiedBy ?? "Anonymous");
                
                if (!result.IsVerified)
                {
                    return NotFound(result);
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error verifying document with EF: {ex.Message}");
                return StatusCode(500, "An error occurred while verifying the document");
            }
        }
    }
}
