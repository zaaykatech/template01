import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, FileText, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  items: any[];
  categories: any[];
  onCancel: () => void;
}

export default function ExportData({ items, categories, onCancel }: Props) {
  const [isExporting, setIsExporting] = useState(false);

  // Map category IDs to names for export
  const getExportData = () => {
    return items.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      return {
        Name: item.name,
        Description: item.description || '',
        Price: item.price || 0,
        Category: category ? category.name : 'Unknown',
        'Veg/Non-Veg': item.isVeg ? 'Veg' : 'Non-Veg',
        'Is Active': item.isActive ? 'Yes' : 'No'
      };
    });
  };

  const exportExcel = () => {
    setIsExporting(true);
    try {
      const data = getExportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Menu Items");
      XLSX.writeFile(wb, "menu_export.xlsx");
    } finally {
      setIsExporting(false);
    }
  };

  const exportCSV = () => {
    setIsExporting(true);
    try {
      const data = getExportData();
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "menu_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  const exportJSON = () => {
    setIsExporting(true);
    try {
      const data = getExportData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "menu_export.json");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  const exportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const data = getExportData();
      
      doc.text("Menu Export", 14, 15);
      
      const tableColumn = ["Name", "Category", "Price", "Type", "Status"];
      const tableRows = data.map(item => [
        item.Name,
        item.Category,
        item.Price.toString(),
        item['Veg/Non-Veg'],
        item['Is Active']
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
      
      doc.save("menu_export.pdf");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export Menu Data</h2>
          <p className="text-sm text-gray-500 mt-1">Download your menu data in various formats.</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={exportExcel}
          disabled={isExporting}
          className="bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all rounded-xl p-6 flex items-start gap-4 text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Excel (.xlsx)</h4>
            <p className="text-gray-500 text-xs mt-1">Best for editing and sharing with spreadsheet applications.</p>
          </div>
        </button>

        <button 
          onClick={exportCSV}
          disabled={isExporting}
          className="bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all rounded-xl p-6 flex items-start gap-4 text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">CSV (.csv)</h4>
            <p className="text-gray-500 text-xs mt-1">Simple text format, supported by almost all data tools.</p>
          </div>
        </button>

        <button 
          onClick={exportPDF}
          disabled={isExporting}
          className="bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all rounded-xl p-6 flex items-start gap-4 text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
            <Download size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">PDF (.pdf)</h4>
            <p className="text-gray-500 text-xs mt-1">A structured document perfect for printing or reading.</p>
          </div>
        </button>

        <button 
          onClick={exportJSON}
          disabled={isExporting}
          className="bg-white border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all rounded-xl p-6 flex items-start gap-4 text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center shrink-0">
            <FileJson size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">JSON (.json)</h4>
            <p className="text-gray-500 text-xs mt-1">Raw data format used for APIs and integrations.</p>
          </div>
        </button>
      </div>
    </div>
  );
}
