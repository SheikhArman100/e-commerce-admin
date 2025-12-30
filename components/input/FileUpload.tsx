'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: File | File[] | null;
  onChange?: (files: File | File[] | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  isMultiple?: boolean;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5, // 5MB default
  placeholder = "Click to upload or drag and drop",
  className,
  disabled = false,
  error,
  isMultiple = false,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create previews when files change
  React.useEffect(() => {
    // Cleanup previous previews
    previews.forEach(preview => URL.revokeObjectURL(preview));
    setPreviews([]);

    if (value) {
      if (isMultiple && Array.isArray(value)) {
        const newPreviews = value.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
      } else if (!isMultiple && value instanceof File) {
        const preview = URL.createObjectURL(value);
        setPreviews([preview]);
      }
    }

    // Cleanup function
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [value, isMultiple]);

  const validateFile = (file: File): boolean => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return false;
    }

    return true;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      onChange?.(isMultiple ? [] : null);
      return;
    }

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      onChange?.(isMultiple ? validFiles : validFiles[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (index?: number) => {
    if (isMultiple && Array.isArray(value) && index !== undefined) {
      const newFiles = value.filter((_, i) => i !== index);
      onChange?.(newFiles);
    } else {
      onChange?.(isMultiple ? [] : null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={isMultiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {previews.length > 0 ? (
          <div className="space-y-2">
            {isMultiple ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {previews.map((previewUrl, index) => {
                  const file = Array.isArray(value) ? value[index] : value;
                  return (
                    <div key={index} className="relative group">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      {!disabled && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <img
                    src={previews[0]}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {value instanceof File && (
                  <p className="text-sm text-muted-foreground">
                    {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}
            {isMultiple && Array.isArray(value) && value.length > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                {value.length} file{value.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-center">
            <FileImage className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{placeholder}</p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF up to {maxSize}MB {isMultiple && '(multiple files allowed)'}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
