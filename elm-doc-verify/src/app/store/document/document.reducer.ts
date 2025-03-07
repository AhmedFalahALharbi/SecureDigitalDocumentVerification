import { createReducer, on } from '@ngrx/store';
import * as DocumentActions from './document.actions';
import { documentAdapter, initialDocumentState } from './document.state';

export const documentReducer = createReducer(
  initialDocumentState,
  
  // Upload document
  on(DocumentActions.uploadDocument, (state) => ({
    ...state,
    loading: true,
    error: null,
    uploadSuccess: false
  })),
  
  on(DocumentActions.uploadDocumentSuccess, (state, { document }) => 
    documentAdapter.addOne(document, {
      ...state,
      loading: false,
      error: null,
      uploadSuccess: true
    })
  ),
  
  on(DocumentActions.uploadDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    uploadSuccess: false
  })),
  
  // Get document
  on(DocumentActions.getDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentActions.getDocumentSuccess, (state, { document }) => 
    documentAdapter.upsertOne(document, {
      ...state,
      selectedDocumentId: document.id,
      loading: false,
      error: null
    })
  ),
  
  on(DocumentActions.getDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Verify document
  on(DocumentActions.verifyDocument, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentActions.verifyDocumentSuccess, (state, { result }) => {
    if (result.document) {
      return documentAdapter.upsertOne(result.document, {
        ...state,
        loading: false,
        error: null
      });
    }
    return {
      ...state,
      loading: false,
      error: null
    };
  }),
  
  on(DocumentActions.verifyDocumentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Reset states
  on(DocumentActions.resetUploadState, (state) => ({
    ...state,
    uploadSuccess: false,
    error: null
  })),
  
  on(DocumentActions.resetDocumentState, () => initialDocumentState)
);