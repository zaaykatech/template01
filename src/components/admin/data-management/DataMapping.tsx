import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { TemporaryRecord } from '@/types/data-management';

interface Props {
  rawData: any[];
  onCancel: () => void;
  onMapped: (records: TemporaryRecord[]) => void;
}

const APP_FIELDS = [
  { id: 'name', label: 'Item Name', required: true },
  { id: 'description', label: 'Description', required: false },
  { id: 'category', label: 'Category', required: true },
  { id: 'price', label: 'Price', required: true },
  { id: 'image', label: 'Image URL', required: false },
  { id: 'isVeg', label: 'Veg / Non-Veg', required: false },
  { id: 'isAvailable', label: 'Availability', required: false },
];

export default function DataMapping({ rawData, onCancel, onMapped }: Props) {
  const [sourceHeaders, setSourceHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rawData && rawData.length > 0) {
      // Extract headers from the first object
      const headers = Object.keys(rawData[0]);
      setSourceHeaders(headers);
      
      // Auto-map based on basic string matching
      const initialMapping: Record<string, string> = {};
      headers.forEach(h => {
        const lowerH = h.toLowerCase().trim();
        APP_FIELDS.forEach(f => {
          if (lowerH === f.id.toLowerCase() || lowerH === f.label.toLowerCase() || lowerH.includes(f.id.toLowerCase())) {
            initialMapping[f.id] = h;
          }
        });
      });
      setMapping(initialMapping);
    }
  }, [rawData]);

  const handleMapChange = (appFieldId: string, sourceHeader: string) => {
    setMapping(prev => ({
      ...prev,
      [appFieldId]: sourceHeader
    }));
  };

  const handleCompleteMapping = () => {
    // Convert rawData to TemporaryRecord based on mapping
    const mappedRecords: TemporaryRecord[] = rawData.map((row, index) => {
      return {
        _tempId: `temp_${Date.now()}_${index}`,
        name: mapping['name'] ? (row[mapping['name']] || '') : '',
        description: mapping['description'] ? (row[mapping['description']] || '') : '',
        category: mapping['category'] ? (row[mapping['category']] || 'Uncategorized') : 'Uncategorized',
        price: mapping['price'] ? (row[mapping['price']] || 0) : 0,
        image: mapping['image'] ? (row[mapping['image']] || '') : '',
        isVeg: mapping['isVeg'] ? String(row[mapping['isVeg']]).toLowerCase() === 'true' || String(row[mapping['isVeg']]).toLowerCase() === 'veg' : true,
        isAvailable: mapping['isAvailable'] ? String(row[mapping['isAvailable']]).toLowerCase() === 'true' || String(row[mapping['isAvailable']]).toLowerCase() === 'yes' : true,
        _status: 'valid',
        _errors: [],
        _warnings: []
      };
    });

    onMapped(mappedRecords);
  };

  const missingRequired = APP_FIELDS.filter(f => f.required && !mapping[f.id]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Map Columns</h2>
          <p className="text-sm text-gray-500 mt-1">Match your imported columns to the correct menu fields.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleCompleteMapping}
            disabled={missingRequired.length > 0}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            Continue to Editor <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {missingRequired.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-semibold text-orange-800">Missing Required Fields</h4>
            <p className="text-sm text-orange-700 mt-1">
              Please map the following required fields before continuing: {missingRequired.map(f => f.label).join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium w-1/3">Application Field</th>
              <th className="px-6 py-4 font-medium w-1/3">Source Column</th>
              <th className="px-6 py-4 font-medium w-1/3">Sample Value (from row 1)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {APP_FIELDS.map(field => {
              const mappedHeader = mapping[field.id] || '';
              const sampleValue = rawData.length > 0 && mappedHeader ? rawData[0][mappedHeader] : '';
              
              return (
                <tr key={field.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{field.label}</span>
                      {field.required && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">Required</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={mappedHeader}
                      onChange={(e) => handleMapChange(field.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black"
                    >
                      <option value="">-- Ignore --</option>
                      {sourceHeaders.map(header => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-xs">
                    {sampleValue || <span className="text-gray-300 italic">No data</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
