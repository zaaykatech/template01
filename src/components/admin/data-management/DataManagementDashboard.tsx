import React from 'react';
import { UploadCloud, FileClock, Trash2, Download } from 'lucide-react';

interface Props {
  restaurantId: string;
  draftExists: boolean;
  onStartNew: () => void;
  onResume: () => void;
  onClearDraft: () => void;
  onExport: () => void;
}

export default function DataManagementDashboard({ restaurantId, draftExists, onStartNew, onResume, onClearDraft, onExport }: Props) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
          <p className="text-sm text-gray-500 mt-1">Import, edit, and export your restaurant menu data.</p>
        </div>
      </div>

      {draftExists && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-orange-800 font-semibold flex items-center gap-2">
              <FileClock size={18} /> You have an unsaved import draft
            </h3>
            <p className="text-orange-700 text-sm mt-1">Resume where you left off, or clear it to start fresh.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={onClearDraft}
              className="flex-1 sm:flex-none px-4 py-2 text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Discard Draft
            </button>
            <button 
              onClick={onResume}
              className="flex-1 sm:flex-none px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg text-sm font-medium transition-colors"
            >
              Resume Import
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={onStartNew}
          className="bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all rounded-xl p-6 flex flex-col items-start gap-4 group text-left"
        >
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
            <UploadCloud size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">Start New Import</h4>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">Import from CSV, Excel, JSON, or extract data from a photo of a physical menu using OCR.</p>
          </div>
        </button>

        <button 
          onClick={onExport}
          className="bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all rounded-xl p-6 flex flex-col items-start gap-4 group text-left"
        >
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
            <Download size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">Export Data</h4>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">Download your entire menu to a CSV, Excel, or PDF file for backup or sharing.</p>
          </div>
        </button>
      </div>

      {/* History section placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Import & Export History</h3>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm bg-gray-50/50">
          No history available yet.
        </div>
      </div>
    </div>
  );
}
