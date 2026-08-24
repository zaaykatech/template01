import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import { TemporaryRecord } from '@/types/data-management';

interface Props {
  records: TemporaryRecord[];
  onCancel: () => void;
  onUpdate: (records: TemporaryRecord[]) => void;
  onComplete: () => void;
}

export default function DataEditor({ records, onCancel, onUpdate, onComplete }: Props) {
  const [data, setData] = useState<TemporaryRecord[]>(records);

  useEffect(() => {
    // Run validation on mount and data change
    const validatedData = data.map(record => {
      const errors = [];
      if (!record.name) errors.push('Name is required');
      if (!record.category) errors.push('Category is required');
      if (record.price === undefined || record.price === '' || isNaN(Number(record.price))) errors.push('Price must be a valid number');
      
      return {
        ...record,
        _status: errors.length > 0 ? 'error' : 'valid',
        _errors: errors
      } as TemporaryRecord;
    });
    
    // Only update if something changed to avoid infinite loop
    const hasChanges = validatedData.some((r, i) => r._status !== data[i]._status || r._errors.length !== data[i]._errors.length);
    if (hasChanges) {
      setData(validatedData);
      onUpdate(validatedData);
    }
  }, [data]);

  const handleCellChange = (tempId: string, field: keyof TemporaryRecord, value: any) => {
    const newData = data.map(record => {
      if (record._tempId === tempId) {
        return { ...record, [field]: value, _isModified: true };
      }
      return record;
    });
    setData(newData);
    onUpdate(newData);
  };

  const handleAddRow = () => {
    const newRecord: TemporaryRecord = {
      _tempId: `temp_${Date.now()}`,
      name: '',
      description: '',
      category: 'Uncategorized',
      price: 0,
      isVeg: true,
      isAvailable: true,
      _status: 'error', // invalid until filled
      _errors: ['Name is required', 'Price must be a valid number'],
      _warnings: [],
      _isModified: true
    };
    const newData = [newRecord, ...data];
    setData(newData);
    onUpdate(newData);
  };

  const handleDeleteRow = (tempId: string) => {
    const newData = data.filter(r => r._tempId !== tempId);
    setData(newData);
    onUpdate(newData);
  };

  const hasErrors = data.some(r => r._status === 'error');

  return (
    <div className="w-full flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Data</h2>
          <p className="text-sm text-gray-500 mt-1">Review and correct your imported data before saving.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            Back to Mapping
          </button>
          <button onClick={handleAddRow} className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus size={16} /> Add Row
          </button>
          <button 
            onClick={onComplete}
            disabled={hasErrors}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            Review Conflicts <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {hasErrors && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-sm text-red-700">Please fix highlighted errors before continuing. Hover over red cells to see details.</p>
        </div>
      )}

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 relative">
          <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 font-medium w-8 border-r border-gray-200 text-center">#</th>
                <th className="px-4 py-3 font-medium w-48 border-r border-gray-200">Name*</th>
                <th className="px-4 py-3 font-medium w-64 border-r border-gray-200">Description</th>
                <th className="px-4 py-3 font-medium w-32 border-r border-gray-200">Category*</th>
                <th className="px-4 py-3 font-medium w-24 border-r border-gray-200">Price*</th>
                <th className="px-4 py-3 font-medium w-24 border-r border-gray-200">Veg</th>
                <th className="px-4 py-3 font-medium w-24 border-r border-gray-200">Active</th>
                <th className="px-4 py-3 font-medium w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((row, index) => {
                const nameError = row._errors.find(e => e.toLowerCase().includes('name'));
                const catError = row._errors.find(e => e.toLowerCase().includes('category'));
                const priceError = row._errors.find(e => e.toLowerCase().includes('price'));

                return (
                  <tr key={row._tempId} className={`hover:bg-gray-50 transition-colors ${row._isModified ? 'bg-blue-50/20' : ''}`}>
                    <td className="px-2 py-1 text-center border-r border-gray-100 text-gray-400 text-xs">
                      {index + 1}
                    </td>
                    <td className={`p-0 border-r border-gray-100 ${nameError ? 'bg-red-50 relative group' : ''}`}>
                      <input 
                        type="text" 
                        value={row.name} 
                        onChange={e => handleCellChange(row._tempId, 'name', e.target.value)}
                        className={`w-full h-full px-4 py-2.5 bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-black outline-none ${nameError ? 'text-red-900' : ''}`}
                        placeholder="Item name"
                      />
                      {nameError && <div className="hidden group-hover:block absolute bottom-full left-0 z-20 bg-red-800 text-white text-xs p-1 rounded shadow">{nameError}</div>}
                    </td>
                    <td className="p-0 border-r border-gray-100">
                      <input 
                        type="text" 
                        value={row.description || ''} 
                        onChange={e => handleCellChange(row._tempId, 'description', e.target.value)}
                        className="w-full h-full px-4 py-2.5 bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-black outline-none text-gray-600"
                        placeholder="Description..."
                      />
                    </td>
                    <td className={`p-0 border-r border-gray-100 ${catError ? 'bg-red-50' : ''}`}>
                      <input 
                        type="text" 
                        value={row.category} 
                        onChange={e => handleCellChange(row._tempId, 'category', e.target.value)}
                        className="w-full h-full px-4 py-2.5 bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-black outline-none"
                      />
                    </td>
                    <td className={`p-0 border-r border-gray-100 ${priceError ? 'bg-red-50 relative group' : ''}`}>
                      <div className="flex items-center h-full px-2">
                        <span className="text-gray-400 text-sm">₹</span>
                        <input 
                          type="number" 
                          value={row.price} 
                          onChange={e => handleCellChange(row._tempId, 'price', e.target.value)}
                          className={`w-full h-full px-2 py-2.5 bg-transparent border-0 focus:ring-2 focus:ring-inset focus:ring-black outline-none ${priceError ? 'text-red-900' : ''}`}
                        />
                      </div>
                      {priceError && <div className="hidden group-hover:block absolute bottom-full left-0 z-20 bg-red-800 text-white text-xs p-1 rounded shadow">{priceError}</div>}
                    </td>
                    <td className="p-0 border-r border-gray-100 text-center">
                      <input 
                        type="checkbox" 
                        checked={row.isVeg} 
                        onChange={e => handleCellChange(row._tempId, 'isVeg', e.target.checked)}
                        className="w-4 h-4 text-black focus:ring-black rounded border-gray-300"
                      />
                    </td>
                    <td className="p-0 border-r border-gray-100 text-center">
                      <input 
                        type="checkbox" 
                        checked={row.isAvailable !== false} 
                        onChange={e => handleCellChange(row._tempId, 'isAvailable', e.target.checked)}
                        className="w-4 h-4 text-black focus:ring-black rounded border-gray-300"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button 
                        onClick={() => handleDeleteRow(row._tempId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No data to edit. Add a row to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 border-t border-gray-200 p-3 text-xs flex justify-between items-center text-gray-500">
          <span>{data.length} records total</span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> {data.filter(r => r._status === 'error').length} Errors</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> {data.filter(r => r._status === 'valid').length} Valid</span>
          </span>
        </div>
      </div>
    </div>
  );
}
