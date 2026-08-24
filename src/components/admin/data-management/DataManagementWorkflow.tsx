import React, { useState, useEffect } from 'react';
import { WorkflowStep, TemporaryRecord } from '@/types/data-management';

import DataManagementDashboard from './DataManagementDashboard';
import ImportSource from './ImportSource';
import DataMapping from './DataMapping';
import DataEditor from './DataEditor';
import ConflictResolution from './ConflictResolution';
import FinalReview from './FinalReview';
import ExportData from './ExportData';
import { useMenuData } from '@/hooks/useMenuData';

export default function DataManagementWorkflow({ restaurantId }: { restaurantId: string }) {
  const { items: existingItems, categories: existingCategories } = useMenuData(restaurantId);
  const [step, setStep] = useState<WorkflowStep>('DASHBOARD');
  const [tempRecords, setTempRecords] = useState<TemporaryRecord[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [draftExists, setDraftExists] = useState(false);

  // Check for local storage draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(`import_draft_${restaurantId}`);
    if (draft) {
      setDraftExists(true);
    }
  }, [restaurantId]);

  const saveDraft = (records: TemporaryRecord[]) => {
    setTempRecords(records);
    localStorage.setItem(`import_draft_${restaurantId}`, JSON.stringify(records));
    setDraftExists(true);
  };

  const startNewImport = () => {
    setTempRecords([]);
    setRawData([]);
    localStorage.removeItem(`import_draft_${restaurantId}`);
    setDraftExists(false);
    setStep('IMPORT_SOURCE');
  };

  const resumeDraft = () => {
    const draft = localStorage.getItem(`import_draft_${restaurantId}`);
    if (draft) {
      setTempRecords(JSON.parse(draft));
      setStep('EDIT'); // Jump straight to edit
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(`import_draft_${restaurantId}`);
    setDraftExists(false);
    setTempRecords([]);
    setRawData([]);
  };

  return (
    <div className="w-full h-full min-h-[500px]">
      {step === 'DASHBOARD' && (
        <DataManagementDashboard 
          restaurantId={restaurantId}
          draftExists={draftExists}
          onStartNew={startNewImport}
          onResume={resumeDraft}
          onClearDraft={clearDraft}
          onExport={() => setStep('EXPORT')}
        />
      )}
      
      {step === 'IMPORT_SOURCE' && (
        <ImportSource 
          restaurantId={restaurantId}
          onCancel={() => setStep('DASHBOARD')}
          onDataParsed={(raw) => {
            setRawData(raw);
            setStep('MAPPING');
          }}
        />
      )}
      
      {/* Placeholder steps */}
      {step === 'MAPPING' && (
        <DataMapping 
          rawData={rawData}
          onCancel={() => setStep('DASHBOARD')}
          onMapped={(records) => {
            saveDraft(records);
            setStep('EDIT');
          }}
        />
      )}
      {step === 'EDIT' && (
        <DataEditor 
          records={tempRecords}
          onCancel={() => setStep('MAPPING')}
          onUpdate={(records) => saveDraft(records)}
          onComplete={() => setStep('CONFLICT_RESOLUTION')}
        />
      )}
          {step === 'CONFLICT_RESOLUTION' && (
        <ConflictResolution 
          records={tempRecords}
          existingItems={existingItems}
          existingCategories={existingCategories}
          onCancel={() => setStep('EDIT')}
          onResolved={(resolvedRecords) => {
            saveDraft(resolvedRecords);
            setStep('FINAL_REVIEW');
          }}
        />
      )}
      {step === 'FINAL_REVIEW' && (
        <FinalReview 
          restaurantId={restaurantId}
          records={tempRecords}
          existingCategories={existingCategories}
          onCancel={() => setStep('CONFLICT_RESOLUTION')}
          onComplete={() => {
            clearDraft();
            setStep('DASHBOARD');
          }}
        />
      )}
          {step === 'EXPORT' && (
        <ExportData 
          items={existingItems}
          categories={existingCategories}
          onCancel={() => setStep('DASHBOARD')}
        />
      )}
    </div>
  );
}
