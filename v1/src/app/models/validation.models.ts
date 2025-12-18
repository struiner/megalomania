export type ValidationSeverity = 'info' | 'warning' | 'error';

export interface ValidationNotice {
  path: string;
  message: string;
  severity: ValidationSeverity;
  suggestion?: string;
  code?: string;
}
