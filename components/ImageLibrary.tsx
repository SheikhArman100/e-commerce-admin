import React, { useState, useCallback, useEffect } from 'react';
import type { ImageAsset, Step } from '../types/campaign.types';
import { UploadIcon, XIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CloudUpload, XIcon as XIconLucide } from 'lucide-react';
import { cn } from '../lib/utils';
import Image from 'next/image';

interface ImageLibraryProps {
  imageAssets: ImageAsset[];
  selectedStep?: Step | undefined;
  onAddImageAsset: (asset: ImageAsset) => void;
  onSelectImage: (assetId: string | null) => void;
  onRemoveImageAsset?: (assetId: string) => void;
}

export const ImageLibrary: React.FC<ImageLibraryProps> = ({ imageAssets, selectedStep, onAddImageAsset, onSelectImage, onRemoveImageAsset }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  // Initialize selected image based on current step's background
  useEffect(() => {
    if (selectedStep?.backgroundAssetId) {
      setSelectedImages(new Set([selectedStep.backgroundAssetId]));
    } else {
      setSelectedImages(new Set());
    }
  }, [selectedStep?.backgroundAssetId]);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setUploadErrors(errors);
    }

    // Convert files to base64 and create assets
    for (const file of validFiles) {
      try {
        const base64Url = await convertFileToBase64(file);
        const asset: ImageAsset = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: base64Url,
        };
        onAddImageAsset(asset);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        setUploadErrors(prev => [...prev, `${file.name}: Failed to process file`]);
      }
    }
  }, [onAddImageAsset]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setUploadErrors([]);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadErrors([]);
      processFiles(files);
    }
    // Reset input
    e.target.value = '';
  }, [processFiles]);

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        setUploadErrors([]);
        processFiles(target.files);
      }
    };
    input.click();
  }, [processFiles]);

  const handleAddImage = () => {
    if (newImageUrl && newImageName) {
      const newAsset: ImageAsset = {
        id: `img-${Date.now()}`,
        name: newImageName,
        url: newImageUrl,
      };
      onAddImageAsset(newAsset);
      setNewImageUrl('');
      setNewImageName('');
      setIsAdding(false);
    }
  };

  const handleImageClick = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Single selection: clear all previous selections and select only this one
    setSelectedImages(new Set([assetId]));
    // Set as background
    onSelectImage(assetId);
  };

  const handleRemoveImage = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear the background by setting it to null/undefined
    onSelectImage(null as any);
    setSelectedImages(new Set());
  };

  const handleSelectForBackground = (assetId: string) => {
    onSelectImage(assetId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Image Library</h3>
        <Button onClick={() => setIsAdding(!isAdding)} variant="primary">
          <UploadIcon className="w-4 h-4 mr-2" />
          Add Image Url
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-name">Image Name</Label>
                <Input
                  id="image-name"
                  type="text"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  placeholder="Enter image name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleAddImage} variant="primary">
                  Add Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-border hover:border-primary'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CloudUpload className={cn(
            'w-12 h-12 mb-4 transition-colors',
            isDragging ? 'text-blue-500' : 'text-muted-foreground'
          )} />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isDragging ? 'Drop images here' : 'Drag & drop images here'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse files (max 5MB each)
          </p>
          <Button type="button" variant="outline" size="sm">
            Browse Files
          </Button>
        </CardContent>
      </Card>

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XIconLucide className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {imageAssets.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {imageAssets.map((asset) => {
            const isSelected = selectedImages.has(asset.id);
            return (
              <div
                key={asset.id}
                className={cn(
                  "relative group border-2 rounded-lg overflow-hidden transition-all",
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-border hover:border-primary"
                )}
              >
                {/* Clickable image area for background setting */}
                <div
                  className="cursor-pointer"
                  // onClick={() => {
                  //   console.log('Setting background to asset:', asset.id, asset.name);
                  //   onSelectImage(asset.id);
                  // }}
                >
                  <Image
                    src={asset.url}
                    alt={asset.name}
                    height={96}
                    width={96}
                    className="w-full h-24 object-cover"
                  />
                </div>

                {/* Action buttons overlay */}
                <div className="absolute inset-0  transition-opacity flex items-center justify-center pointer-events-none">
                  {isSelected ? (
                    // Remove button for selected images
                    <Button
                      onClick={(e) => handleRemoveImage(asset.id, e)}
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 pointer-events-auto"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  ) : (
                    // Add button for unselected images
                    <Button
                      onClick={(e) => handleImageClick(asset.id, e)}
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 bg-background hover:bg-muted pointer-events-auto"
                    >
                      <span className="text-foreground font-bold text-lg">+</span>
                    </Button>
                  )}
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}

                {/* Image name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-xs text-white font-medium truncate">{asset.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Add Button */}
      {/* <Button
        onClick={openFileDialog}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-10"
        size="lg"
      >
        <CloudUpload className="w-6 h-6" />
      </Button> */}

      {imageAssets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>No images in library</p>
          <p className="text-sm">Add images to use as backgrounds</p>
        </div>
      )}
    </div>
  );
};
