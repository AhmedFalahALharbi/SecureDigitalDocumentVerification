using System;
using System.IO;
using System.Threading.Tasks;
using ElmDocVerify.Data;
using ElmDocVerify.DTOs;
using ElmDocVerify.Models;
using ElmDocVerify.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ElmDocVerify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly DocumentService _documentService;
        private readonly ILogger<DocumentsController> _logger;
        
        public DocumentsController(
            DocumentService documentService,
            ILogger<DocumentsController> logger)
        {
            _documentService = documentService;
            _logger = logger;
        }
        
        // POST: api/documents
        [HttpPost]
        public async Task<ActionResult<DocumentResponseDto>> UploadDocument([FromForm] DocumentUploadDto uploadDto)
        {
            try
            {
                _logger.LogInformation($"Uploading document: {uploadDto.Title}");
                
                if (uploadDto.File == null || uploadDto.File.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }
                
                var result = await _documentService.UploadDocument(uploadDto);
                
                _logger.LogInformation($"Document uploaded successfully with ID: {result.Id}");
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading document: {ex.Message}");
                return StatusCode(500, "An error occurred while uploading the document");
            }
        }
        
        // GET: api/documents/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentResponseDto>> GetDocument(int id)
        {
            try
            {
                _logger.LogInformation($"Getting document with ID: {id}");
                
                var document = await _documentService.GetDocumentById(id);
                
                if (document == null)
                {
                    _logger.LogWarning($"Document with ID {id} not found");
                    return NotFound();
                }
                
                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting document: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the document");
            }
        }
    }
}
