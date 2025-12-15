import { Injectable } from '@angular/core';
import { DESIGN_DOCUMENT } from '../../data/design-doc.data';
import { DesignDocument } from '../../models/design-doc.models';

@Injectable({ providedIn: 'root' })
export class DesignDocService {
  getDocument(): DesignDocument {
    return DESIGN_DOCUMENT;
  }
}
