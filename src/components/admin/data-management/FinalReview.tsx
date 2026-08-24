import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { TemporaryRecord } from '@/types/data-management';
import { db } from '@/lib/firebase/config';
import { collection, doc, writeBatch, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { generateSlug } from '@/lib/utils'; // Assuming this exists or we can write a local one

interface Props {
  restaurantId: string;
  records: TemporaryRecord[];
  existingCategories: any[];
  onCancel: () => void;
  onComplete: () => void;
}

const getSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function FinalReview({ restaurantId, records, existingCategories, onCancel, onComplete }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toCreate = records.filter(r => r._conflictAction === 'ADD_NEW' || !r._conflictAction);
  const toUpdate = records.filter(r => r._conflictAction === 'UPDATE');
  const toSkip = records.filter(r => r._conflictAction === 'SKIP');
  const hasErrors = records.some(r => r._status === 'error');

  const handleConfirmSave = async () => {
    if (hasErrors) return;
    setIsSaving(true);
    setError(null);

    try {
      // 1. Process Categories
      // Find all unique category names in the items we are actually saving
      const activeRecords = [...toCreate, ...toUpdate];
      const uniqueCategoryNames = Array.from(new Set(activeRecords.map(r => r.category.trim())));
      
      const categoryIdMap: Record<string, string> = {}; // categoryName -> categoryId
      const batch = writeBatch(db);
      
      let sortOrderCounter = existingCategories.length;

      for (const catName of uniqueCategoryNames) {
        const existingCat = existingCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
        if (existingCat) {
          categoryIdMap[catName.toLowerCase()] = existingCat.id;
        } else {
          // Create new category
          const newCatRef = doc(collection(db, `restaurants/${restaurantId}/categories`));
          batch.set(newCatRef, {
            name: catName,
            description: '',
            sortOrder: sortOrderCounter++,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          categoryIdMap[catName.toLowerCase()] = newCatRef.id;
        }
      }

      // 2. Process Items
      for (const record of toCreate) {
        const itemRef = doc(collection(db, `restaurants/${restaurantId}/items`));
        const catId = categoryIdMap[record.category.trim().toLowerCase()];
        batch.set(itemRef, {
          name: record.name,
          description: record.description || '',
          price: Number(record.price),
          categoryId: catId,
          isActive: record.isAvailable !== false,
          isVeg: record.isVeg !== false,
          sortOrder: 999, // default
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      for (const record of toUpdate) {
        if (!record._matchedItemId) continue;
        const itemRef = doc(db, `restaurants/${restaurantId}/items`, record._matchedItemId);
        const catId = categoryIdMap[record.category.trim().toLowerCase()];
        batch.update(itemRef, {
          name: record.name,
          description: record.description || '',
          price: Number(record.price),
          categoryId: catId,
          isActive: record.isAvailable !== false,
          isVeg: record.isVeg !== false,
          updatedAt: serverTimestamp()
        });
      }

      // 3. Save History (Audit Trail)
      const historyRef = doc(collection(db, `restaurants/${restaurantId}/importHistory`));
      batch.set(historyRef, {
        timestamp: new Date().toISOString(),
        operationType: 'IMPORT',
        recordsProcessed: records.length,
        recordsCreated: toCreate.length,
        recordsUpdated: toUpdate.length,
        recordsSkipped: toSkip.length,
        status: 'Completed',
        errors: []
      });

      // 4. Commit all
      await batch.commit();
      
      onComplete();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during saving.');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Final Review</h2>
          <p className="text-sm text-gray-500 mt-1">Review the final summary before permanently updating the database.</p>
        </div>
      </div>

      {hasErrors && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-semibold text-red-800">Unresolved Errors Detected</h4>
            <p className="text-sm text-red-700 mt-1">
              Some records still have validation errors. Please go back to the Editor step and resolve them before saving.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-semibold text-red-800">Database Save Failed</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500 text-sm font-medium mb-2">Total Records</p>
          <p className="text-3xl font-bold text-gray-900">{records.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm text-center">
          <p className="text-green-700 text-sm font-medium mb-2">To Create</p>
          <p className="text-3xl font-bold text-green-900">{toCreate.length}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm text-center">
          <p className="text-blue-700 text-sm font-medium mb-2">To Update</p>
          <p className="text-3xl font-bold text-blue-900">{toUpdate.length}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-gray-500 text-sm font-medium mb-2">To Skip</p>
          <p className="text-3xl font-bold text-gray-700">{toSkip.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Important Notes</h3>
        </div>
        <div className="p-5 space-y-3 text-sm text-gray-600">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Categories:</strong> Any categories that don't currently exist will be created automatically.</li>
            <li><strong>Audit Trail:</strong> This import operation will be recorded in the restaurant's history logs.</li>
            <li><strong>Database Mutability:</strong> Clicking 'Confirm & Save' will overwrite existing items marked for update. This action cannot be undone.</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          onClick={onCancel} 
          disabled={isSaving}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Conflicts
        </button>
        <button 
          onClick={handleConfirmSave}
          disabled={hasErrors || isSaving}
          className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <><Loader2 size={18} className="animate-spin" /> Saving to Database...</>
          ) : (
            <><CheckCircle2 size={18} /> Confirm & Save</>
          )}
        </button>
      </div>
    </div>
  );
}
