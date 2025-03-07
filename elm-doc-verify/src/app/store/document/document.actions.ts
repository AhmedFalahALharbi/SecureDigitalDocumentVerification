import { createAction, props } from '@ngrx/store';
import { Document, DocumentUpload, VerificationResult } from '../../core/models';

// Upload document
export const uploadDocument = createAction(
  '[Document] Upload Document',
  props<{ document: DocumentUpload }>()
);

export const uploadDocumentSuccess = createAction(
  '[Document] Upload Document Success',
  props<{ document: Document }>()
);

export const uploadDocumentFailure = createAction(
  '[Document] Upload Document Failure',
  props<{ error: string }>()
);

// Get document
export const getDocument = createAction(
  '[Document] Get Document',
  props<{ id: number }>()
);

export const getDocumentSuccess = createAction(
  '[Document] Get Document Success',
  props<{ document: Document }>()
);

export const getDocumentFailure = createAction(
  '[Document] Get Document Failure',
  props<{ error: string }>()
);

// Verify document
export const verifyDocument = createAction(
  '[Document] Verify Document',
  props<{ verificationCode: string; verifiedBy?: string }>()
);

export const verifyDocumentSuccess = createAction(
  '[Document] Verify Document Success',
  props<{ result: VerificationResult }>()
);

export const verifyDocumentFailure = createAction(
  '[Document] Verify Document Failure',
  props<{ error: string }>()
);

// Reset states
export const resetUploadState = createAction(
  '[Document] Reset Upload State'
);

export const resetDocumentState = createAction(
  '[Document] Reset Document State'
);
