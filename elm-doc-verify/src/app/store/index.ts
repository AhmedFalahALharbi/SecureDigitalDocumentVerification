import { ActionReducerMap } from '@ngrx/store';
import { documentReducer } from './document/document.reducer';
import { DocumentState } from './document/document.state';
import { DocumentEffects } from './document/document.effects';

export interface AppState {
  documents: DocumentState;
}

export const reducers: ActionReducerMap<AppState> = {
  documents: documentReducer,
};

export const effects = [DocumentEffects];