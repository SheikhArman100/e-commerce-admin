'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RequiredDimensions {
  width: number;
  height: number;
}

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
  /**
   * When set, every image must match these pixel dimensions exactly.
   * Non-conforming files are rejected at selection time and the admin sees
   * the required vs. actual size in the error toast.
   */
  requiredDimensions?: RequiredDimensions;
}

type ImageDimensions = { width: number; height: number };

/** Reads an image file's intrinsic pixel size via the browser decoder. */
const readImageDimensions = (file: File): Promise<ImageDimensions> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image dimensions'));
    };
    img.src = url;
  });

/** Small overlay badge showing an image's pixel size against the required rule. */
const DimensionBadge = ({
  file,
  dimensions,
  requiredDimensions,
}: {
  file?: File;
  dimensions: Record<string, ImageDimensions>;
  requiredDimensions?: RequiredDimensions;
}) => {
  if (!file || !requiredDimensions) return null;

  const dims = dimensions[`${file.name}-${file.size}`];
  if (!dims) return null;

  const matches =
    dims.width === requiredDimensions.width &&
    dims.height === requiredDimensions.height;

  return (
    <span
      className={`absolute bottom-1 left-1 rounded px-1 py-0.5 text-[10px] font-semibold leading-none text-white ${
        matches ? 'bg-green-600/90' : 'bg-red-600/90'
      }`}
    >
      {dims.width} × {dims.height}
      {matches ? ' ✓' : ' ✕'}
    </span>
  );
};

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
  requiredDimensions,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<Record<string, ImageDimensions>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dimensionKey = (file: File) => `${file.name}-${file.size}`;

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

  const validateFile = async (file: File): Promise<File | null> => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`"${file.name}" is too large — file size must be less than ${maxSize}MB`);
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(`"${file.name}" is not an image file`);
      return null;
    }

    // Validate pixel dimensions (e.g. product images must be exactly 1000×1000)
    if (requiredDimensions) {
      let dims: ImageDimensions;
      try {
        dims = await readImageDimensions(file);
      } catch {
        toast.error(`"${file.name}" could not be read as an image`);
        return null;
      }

      setDimensions((prev) => ({ ...prev, [dimensionKey(file)]: dims }));

      if (
        dims.width !== requiredDimensions.width ||
        dims.height !== requiredDimensions.height
      ) {
        toast.error(
          `"${file.name}" is ${dims.width} × ${dims.height} px — it must be exactly ${requiredDimensions.width} × ${requiredDimensions.height} px`,
        );
        return null;
      }
    }

    return file;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      onChange?.(isMultiple ? [] : null);
      return;
    }

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const validFile = await validateFile(files[i]);
      if (validFile) {
        validFiles.push(validFile);
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
                    <div key={index} className="relative group w-full aspect-square">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <DimensionBadge
                        file={file instanceof File ? file : undefined}
                        dimensions={dimensions}
                        requiredDimensions={requiredDimensions}
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
                    className="w-24 h-24 object-cover rounded-lg aspect-square"
                  />
                  <DimensionBadge
                    file={value instanceof File ? value : undefined}
                    dimensions={dimensions}
                    requiredDimensions={requiredDimensions}
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
              {requiredDimensions && (
                <p className="text-xs font-semibold text-primary">
                  Required: exactly {requiredDimensions.width} × {requiredDimensions.height} px (square)
                </p>
              )}
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
