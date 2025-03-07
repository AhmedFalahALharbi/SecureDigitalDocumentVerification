import { Document } from '../../core/models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface DocumentState extends EntityState<Document> {
  selectedDocumentId: number | null;
  loading: boolean;
  error: string | null;
  uploadSuccess: boolean;
}

export const documentAdapter: EntityAdapter<Document> = createEntityAdapter<Document>();

export const initialDocumentState: DocumentState = documentAdapter.getInitialState({
  selectedDocumentId: null,
  loading: false,
  error: null,
  uploadSuccess: false
});