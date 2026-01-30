import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileText, FileImage, FileAudio, FileVideo, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
    case "document":
      return FileText;
    case "image":
      return FileImage;
    case "audio":
      return FileAudio;
    case "video":
      return FileVideo;
    default:
      return FileText;
  }
};

const getFileType = (mimeType) => {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function UploadZone({ files, onFilesChange, className }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = (newFiles) => {
    const uploadedFiles = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: getFileType(file.type),
      status: "uploading",
      size: file.size,
    }));

    const combined = [...files, ...uploadedFiles];
    onFilesChange(combined);

    // Simulate upload/processing with proper state updates
    uploadedFiles.forEach((file) => {
      setTimeout(() => {
        onFilesChange(combined.map((f) =>
          f.id === file.id ? { ...f, status: "processing" } : f
        ));
      }, 500);

      setTimeout(() => {
        onFilesChange(combined.map((f) =>
          f.id === file.id ? { ...f, status: "ready" } : f
        ));
      }, 1500);
    });
  };

  const removeFile = (id) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "upload-zone relative flex flex-col items-center justify-center text-center cursor-pointer group min-h-[120px]",
          isDragging && "dragging"
        )}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.mp3,.wav,.mp4,.webm"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
        />
        <div className="relative">
          <Upload className={cn(
            "h-8 w-8 mb-2 transition-colors duration-200",
            isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )} />
        </div>
        <p className="text-sm font-medium text-foreground">
          Drop files here
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, images, audio, video
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 group animate-fade-in"
              >
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-foreground">{file.name}</p>
                  <p className="text-2xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {file.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {file.status === "processing" && (
                    <span className="text-2xs text-primary animate-pulse-subtle">Processing...</span>
                  )}
                  {file.status === "ready" && (
                    <CheckCircle2 className="h-4 w-4 text-trace-success" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
