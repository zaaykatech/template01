import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { TemporaryRecord } from '@/types/data-management';

interface Props {
  records: TemporaryRecord[];
  existingItems: any[];
  existingCategories: any[];
  onCancel: () => void;
  onResolved: (records: TemporaryRecord[]) => void;
}

export default function ConflictResolution({ records, existingItems, onCancel, onResolved }: Props) {
  const [data, setData] = useState<TemporaryRecord[]>([]);
  const [conflictsCount, setConflictsCount] = useState(0);

  useEffect(() => {
    let count = 0;
    const resolvedData = records.map(record => {
      // Find matching item by name (case-insensitive)
      const match = existingItems.find(item => item.name.toLowerCase() === record.name.toLowerCase());
      
      if (match && !record._conflictAction) {
        count++;
        return {
          ...record,
          _matchedItemId: match.id,
          _conflictAction: 'UPDATE' as const
        };
      } else if (!match && !record._conflictAction) {
        return {
          ...record,
          _conflictAction: 'ADD_NEW' as const
        };
      }
      return record;
    });

    setData(resolvedData);
    setConflictsCount(count);
  }, [records, existingItems]);

  const handleActionChange = (tempId: string, action: 'ADD_NEW' | 'UPDATE' | 'SKIP') => {
    setData(prev => prev.map(r => r._tempId === tempId ? { ...r, _conflictAction: action } : r));
  };

  const handleComplete = () => {
    onResolved(data);
  };

  const conflicts = data.filter(r => r._matchedItemId);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resolve Conflicts</h2>
          <p className="text-sm text-gray-500 mt-1">We found {conflictsCount} items that already exist in your menu.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            Back to Editor
          </button>
          <button 
            onClick={handleComplete}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            Continue to Final Review <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">No Conflicts Found!</h3>
          <p className="text-green-700 text-sm">All {data.length} records will be added as new items. You can proceed to the final review.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Imported Price</th>
                <th className="px-6 py-4 font-medium">Existing Item</th>
                <th className="px-6 py-4 font-medium w-64">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {conflicts.map(row => {
                const existing = existingItems.find(i => i.id === row._matchedItemId);
                return (
                  <tr key={row._tempId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.name}</td>
                    <td className="px-6 py-4">₹{row.price}</td>
                    <td className="px-6 py-4 text-gray-500">
                      Found exactly matching name. Current price: ₹{existing?.price || 0}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={row._conflictAction}
                        onChange={(e) => handleActionChange(row._tempId, e.target.value as any)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none ${
                          row._conflictAction === 'SKIP' ? 'bg-gray-100 text-gray-500 border-gray-300' : 
                          row._conflictAction === 'UPDATE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          'bg-green-50 text-green-700 border-green-200'
                        }`}
                      >
                        <option value="UPDATE">Update Existing</option>
                        <option value="ADD_NEW">Add as New (Duplicate)</option>
                        <option value="SKIP">Skip (Do not import)</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="bg-orange-50 border-t border-orange-100 p-4 flex items-center gap-2 text-sm text-orange-800">
            <AlertTriangle size={16} />
            <span>Items not listed above will automatically be added as New Items.</span>
          </div>
        </div>
      )}
    </div>
  );
}
