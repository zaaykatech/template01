import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Loader2, Upload, RefreshCw } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { TemporaryRecord } from '@/types/data-management';

interface Props {
  onCancel: () => void;
  onDataExtracted: (records: TemporaryRecord[]) => void;
}

export default function CameraOCR({ onCancel, onDataExtracted }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseExtractedText = (text: string) => {
    // Best-effort extraction: split by lines
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
    
    const records: TemporaryRecord[] = [];
    let currentCategory = 'Uncategorized';

    // Very basic heuristic:
    // If line has numbers, it's an item with a price
    // If line has no numbers, it MIGHT be a category name or a description
    const priceRegex = /[\d.,]+/;

    lines.forEach((line, index) => {
      const priceMatch = line.match(priceRegex);
      
      if (priceMatch) {
        // Line has a price, likely an item
        const priceStr = priceMatch[0].replace(/[^0-9.]/g, '');
        const price = parseFloat(priceStr);
        const nameStr = line.replace(priceMatch[0], '').replace(/[$₹€£]/g, '').trim();
        
        if (nameStr.length > 2) {
          records.push({
            _tempId: `ocr_${Date.now()}_${index}`,
            name: nameStr.substring(0, 50),
            description: '',
            category: currentCategory,
            price: isNaN(price) ? 0 : price,
            _status: 'valid',
            _errors: [],
            _warnings: []
          });
        }
      } else if (line.length < 20 && !line.toLowerCase().includes('menu')) {
        // Short line without numbers, assume it's a category header
        currentCategory = line;
      }
    });

    return records;
  };

  const processImage = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const result = await Tesseract.recognize(
        selectedImage,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const extractedRecords = parseExtractedText(result.data.text);
      
      if (extractedRecords.length === 0) {
        setError('No menu items or prices could be found in the image. Please try another clearer photo.');
        setIsProcessing(false);
      } else {
        // Successfully parsed some records
        onDataExtracted(extractedRecords);
      }

    } catch (err: any) {
      setError(`Failed to extract text: ${err.message}`);
      setIsProcessing(false);
    }
  }, [selectedImage, onDataExtracted]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Camera size={18} className="text-gray-500" /> 
          Camera / Image OCR
        </h3>
        <button onClick={onCancel} className="p-1 hover:bg-gray-200 rounded text-gray-500">
          <X size={18} />
        </button>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-6">
          Upload a clear photo of a printed menu. We will use OCR (Optical Character Recognition) to extract the items. 
          <strong> Note: Extraction is best-effort. You will need to review and edit the data in the next step.</strong>
        </p>

        {!selectedImage ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={28} />
            </div>
            <h4 className="text-gray-900 font-medium mb-1">Take a Photo or Upload Image</h4>
            <p className="text-gray-500 text-sm">Supports JPG, PNG</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedImage} alt="Menu preview" className="max-h-[400px] object-contain" />
              
              {!isProcessing && (
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {isProcessing ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <Loader2 size={32} className="animate-spin mx-auto text-blue-500 mb-3" />
                <h4 className="font-medium text-gray-900 mb-1">Scanning Menu...</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4 max-w-xs mx-auto overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress}% completed</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} /> Try Another Image
                </button>
                <button 
                  onClick={processImage}
                  className="flex-1 px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Extract Data
                </button>
              </div>
            )}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          capture="environment" // Suggests to mobile browsers to open rear camera directly
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}
