
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileUpload(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`relative p-8 border-2 border-dashed transition-all duration-300 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 ${
        dragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
          : 'border-gray-300 dark:border-gray-600'
      } ${loading ? 'pointer-events-none opacity-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />
      
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
          </svg>
        </div>
        
        {loading ? (
          <div className="animate-pulse">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Processing your file...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Drop your Excel file here, or{' '}
              <span className="text-blue-600 dark:text-blue-400 hover:underline">browse</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports .xlsx and .xls files
            </p>
          </>
        )}
      </div>
      
      {!loading && (
        <Button 
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          Choose File
        </Button>
      )}
    </Card>
  );
};
