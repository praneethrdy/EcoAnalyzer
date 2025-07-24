import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  uploadedFiles: File[];
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFiles }) => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    setProcessing(true);
    setTimeout(() => {
      onFileUpload(files);
      setProcessing(false);
    }, 1500);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFileUpload(newFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`h-12 w-12 ${dragActive ? 'text-green-500' : 'text-gray-400'} transition-colors`} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop your files here, or <span className="text-green-600">browse</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Support for PDF, Excel, and image files (up to 10MB each)
            </p>
          </div>
        </div>
      </div>

      {processing && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-800">Processing your documents with AI...</p>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.name)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="text-green-800 font-medium">Analysis Complete!</p>
              <p className="text-green-600 text-sm">Your sustainability data has been extracted and processed.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};