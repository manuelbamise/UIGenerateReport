
import React, { useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { FileUpload } from '../components/FileUpload';
import { DataTable } from '../components/DataTable';
import { useToast } from '../hooks/use-toast';

interface ExcelData {
  sheetName: string;
  numOfSheets: number;
  data: Record<string, any>[];
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };


  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {

      const formData = new FormData();
      formData.append('file', selectedFile);



      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json(); // this is your JSON structure
      setExcelData(data);
      console.log('Received JSON:', data);

      toast({
        title: "Success!",
        description: `Successfully loaded ${data.length} rows from ${selectedFile.name}`,
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 transition-all duration-500">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📊</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Excel Viewer Pro
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          {!excelData && (
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Upload Your Excel File
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Transform your Excel data into an interactive, sortable, and filterable table.
                Simply upload your .xlsx or .xls file to get started.
              </p>
            </div>
          )}

          {/* File Upload */}
          {!excelData && (
            <div className="max-w-2xl mx-auto">
              <FileUpload onFileUpload={handleFileUpload} loading={loading} />
            </div>
          )}

          {/* Data Table */}
          {excelData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setExcelData(null)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    ← Upload New File
                  </button>
                </div>
              </div>
              <DataTable excelData={excelData} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Built with React, Vite, Tailwind CSS, and TanStack Table
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
