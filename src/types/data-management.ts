export type ImportStatus = 'Processing' | 'Completed' | 'Partially Completed' | 'Failed';
export type WorkflowStep = 'DASHBOARD' | 'IMPORT_SOURCE' | 'MAPPING' | 'EDIT' | 'CONFLICT_RESOLUTION' | 'FINAL_REVIEW';

export interface TemporaryRecord {
  _tempId: string; // Internal temporary ID
  id?: string; // Real Firestore ID (if updating)
  name: string;
  description?: string;
  category: string;
  price: number | string;
  image?: string;
  isVeg?: boolean;
  isAvailable?: boolean;
  
  // Validation State
  _status: 'valid' | 'warning' | 'error';
  _errors: string[];
  _warnings: string[];
  _isModified?: boolean; // True if edited in the DataGrid
  _conflictAction?: 'ADD_NEW' | 'UPDATE' | 'SKIP';
  _matchedItemId?: string;
}

export interface ImportHistoryRecord {
  id: string;
  timestamp: string; // ISO string
  operationType: 'IMPORT' | 'OCR' | 'EXPORT';
  sourceFileName?: string;
  format?: string;
  userId: string;
  
  // Stats
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  
  errors: string[];
  status: ImportStatus;
}

export interface ImportTemplate {
  id: string;
  restaurantId: string;
  name: string;
  mapping: Record<string, string>; // Source Column Header -> App Field Name
}
