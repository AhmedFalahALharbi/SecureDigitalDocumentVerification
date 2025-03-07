import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DocumentService } from '../../core/services/document.service';
import * as DocumentActions from './document.actions';

@Injectable()
export class DocumentEffects {
  uploadDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.uploadDocument),
      mergeMap(({ document }) =>
        this.documentService.uploadDocument(document).pipe(
          map(response => DocumentActions.uploadDocumentSuccess({ document: response })),
          catchError(error => of(DocumentActions.uploadDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  getDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.getDocument),
      mergeMap(({ id }) =>
        this.documentService.getDocument(id).pipe(
          map(document => DocumentActions.getDocumentSuccess({ document })),
          catchError(error => of(DocumentActions.getDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  verifyDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentActions.verifyDocument),
      mergeMap(({ verificationCode, verifiedBy }) =>
        this.documentService.verifyDocument(verificationCode, verifiedBy).pipe(
          map(result => DocumentActions.verifyDocumentSuccess({ result })),
          catchError(error => of(DocumentActions.verifyDocumentFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private documentService: DocumentService
  ) {}
}