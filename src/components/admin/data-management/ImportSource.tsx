import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, X, AlertCircle } from 'lucide-react';
import { TemporaryRecord } from '@/types/data-management';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import CameraOCR from './CameraOCR';

interface Props {
  restaurantId: string;
  onCancel: () => void;
  onDataParsed: (records: TemporaryRecord[]) => void;
}

export default function ImportSource({ restaurantId, onCancel, onDataParsed }: Props) {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsParsing(true);
    setError(null);
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          handleParsedData(results.data as any[]);
        },
        error: (err) => {
          setError(`CSV Parsing Error: ${err.message}`);
          setIsParsing(false);
        }
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          handleParsedData(data);
        } catch (err: any) {
          setError(`Excel Parsing Error: ${err.message}`);
          setIsParsing(false);
        }
      };
      reader.readAsBinaryString(file);
    } else if (fileExt === 'json') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const json = JSON.parse(evt.target?.result as string);
          handleParsedData(Array.isArray(json) ? json : [json]);
        } catch (err: any) {
          setError(`JSON Parsing Error: ${err.message}`);
          setIsParsing(false);
        }
      };
      reader.readAsText(file);
    } else {
      setError('Unsupported file format. Please upload CSV, Excel, or JSON.');
      setIsParsing(false);
    }
  };

  const handleParsedData = (rawData: any[]) => {
    // In Phase 3, this will pass raw data to MAPPING.
    // For now, we will do a rough auto-map to show progress.
    const tempRecords: TemporaryRecord[] = rawData.map((row, index) => ({
      _tempId: `temp_${Date.now()}_${index}`,
      name: row['Item Name'] || row['name'] || row['Name'] || '',
      description: row['Description'] || row['description'] || '',
      category: row['Category'] || row['category'] || 'Uncategorized',
      price: row['Price'] || row['price'] || 0,
      _status: 'valid',
      _errors: [],
      _warnings: []
    }));
    
    setIsParsing(false);
    onDataParsed(tempRecords);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Import Data</h2>
          <p className="text-sm text-gray-500 mt-1">Upload a file or use your camera to extract menu data.</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setMode('upload')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors ${mode === 'upload' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Upload size={18} /> File Upload
        </button>
        <button 
          onClick={() => setMode('camera')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors ${mode === 'camera' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Camera size={18} /> Camera OCR
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {mode === 'upload' ? (
        <div 
          onClick={() => !isParsing && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isParsing ? 'border-gray-200 bg-gray-50 opacity-70 cursor-wait' : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50 cursor-pointer'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv,.xlsx,.xls,.json" 
            onChange={handleFileUpload}
            disabled={isParsing}
          />
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{isParsing ? 'Parsing File...' : 'Click to Upload'}</h3>
          <p className="text-sm text-gray-500">Supports CSV, Excel (.xlsx, .xls), and JSON files.</p>
        </div>
      ) : (
        <CameraOCR 
          onCancel={() => setMode('upload')}
          onDataExtracted={(records) => {
            onDataParsed(records);
          }}
        />
      )}
    </div>
  );
}
