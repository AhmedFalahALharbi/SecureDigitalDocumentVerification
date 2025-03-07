export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  
  export interface Document {
    id: number;
    title: string;
    verificationCode: string;
    status: string;
    createdAt: string;
    uploadedBy: string;
  }
  
  export interface VerificationResult {
    isVerified: boolean;
    message: string;
    document?: Document;
  }
  
  export interface DocumentUpload {
    title: string;
    file: File;
    userId: number;
  }