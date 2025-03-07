import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentState, documentAdapter } from './document.state';

export const selectDocumentState = createFeatureSelector<DocumentState>('documents');

const { selectEntities, selectAll } = documentAdapter.getSelectors();

export const selectAllDocuments = createSelector(
  selectDocumentState,
  selectAll
);

export const selectDocumentEntities = createSelector(
  selectDocumentState,
  selectEntities
);

export const selectSelectedDocumentId = createSelector(
  selectDocumentState,
  (state) => state.selectedDocumentId
);

export const selectSelectedDocument = createSelector(
  selectDocumentEntities,
  selectSelectedDocumentId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectDocumentLoading = createSelector(
  selectDocumentState,
  (state) => state.loading
);

export const selectDocumentError = createSelector(
  selectDocumentState,
  (state) => state.error
);

export const selectUploadSuccess = createSelector(
  selectDocumentState,
  (state) => state.uploadSuccess
);