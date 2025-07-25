
import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { FileUpload } from '../components/FileUpload';
import { DataTable } from '../components/DataTable';
import { useToast } from '../hooks/use-toast';
import {useUploadExcel} from '../hooks/use-upload';

interface ExcelData {
  sheetName: string;
  numOfSheets: number;
  sheetData: Record<string, any>[];
}

const Index = () => {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const { toast } = useToast();
  const uploadMutation = useUploadExcel();
  const loading = uploadMutation.isPending;

  // Helper function to transform array-of-arrays to array-of-objects
  const transformSheetData = (rawData: any[][]): Record<string, any>[] => {
    if (!rawData || rawData.length < 2) {
      return [];
    }

    const headers = rawData[0];
    const dataRows = rawData.slice(1);

    return dataRows.map((row) => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast({
        title: "Upload a file first",
        description: "you have to upload a file before you continue",
        variant: "destructive"
      })
      return;
    }

    setExcelData(null); // Clear previous data
    console.log(file.name)

     uploadMutation.mutate(file, {
      onSuccess: (data) => {
        console.log('Raw API response:', data);
        
        try {
          // Transform the array-of-arrays data to array-of-objects
          const transformedData = transformSheetData(data.sheetData);
          console.log('Transformed data:', transformedData);
          
          const processedExcelData: ExcelData = {
            sheetName: data.sheetName,
            numOfSheets: data.numOfSheets,
            sheetData: transformedData
          };
          
          setExcelData(processedExcelData);
          toast({
            title: 'Success!',
            description: `Successfully loaded ${transformedData.length} rows from ${file.name}`,
          });
        } catch (error) {
          console.error('Error transforming data:', error);
          toast({
            title: 'Data processing error',
            description: 'Failed to process the Excel data. Please check the file format.',
            variant: 'destructive',
          });
        }
      },
      onError: (error: any) => {
        toast({
          title: error.message || 'Upload failed',
          description: 'Failed to process the file. Please try again.',
          variant: 'destructive',
        });
      },
    });
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
              {/* Header */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {excelData.sheetName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Sheet 1 of {excelData.numOfSheets} • {excelData.sheetData?.length || 0} rows
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {excelData.sheetData?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Records</div>
                  </div>
                </div>
              </Card>

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
