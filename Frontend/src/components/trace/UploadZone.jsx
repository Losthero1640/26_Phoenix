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

const CircularProgress = ({ progress }) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-6 w-6 transform -rotate-90">
        <circle
          className="text-muted/20"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="12"
          cy="12"
        />
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="12"
          cy="12"
        />
      </svg>
      <span className="absolute text-[8px] font-bold text-primary">{Math.round(progress)}</span>
    </div>
  );
};

export function UploadZone({ files, onFilesChange, className, onUpload }) {
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

  const handleFiles = useCallback((newFiles) => {
    const uploadedFiles = newFiles.map((rawFile) => ({
      id: crypto.randomUUID(),
      name: rawFile.name,
      type: getFileType(rawFile.type),
      status: "uploading",
      progress: 0,
      size: rawFile.size,
      _raw: rawFile,
    }));

    const combined = [...files, ...uploadedFiles];
    onFilesChange(combined);

    if (onUpload && typeof onUpload === "function") {
      uploadedFiles.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file._raw);
        
        // Use ingest with progress callback
        onUpload(formData, file.id, (percent) => {
          onFilesChange((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress: percent } : f
            )
          );
        })
          .then((result) => {
            onFilesChange((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: "ready", progress: 100, result }
                  : f
              )
            );
          })
          .catch(() => {
            onFilesChange((prev) =>
              prev.map((f) =>
                f.id === file.id ? { ...f, status: "error", progress: 0 } : f
              )
            );
          });
      });
    }
  }, [files, onFilesChange, onUpload]);

  const removeFile = (id) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone - Darker Style */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center text-center cursor-pointer group min-h-[140px]",
          "rounded-xl border-2 border-dashed transition-all duration-300",
          isDragging 
            ? "border-primary bg-primary/10 scale-[1.02] shadow-lg" 
            : "border-border/60 bg-secondary/80 hover:border-primary/50 hover:bg-secondary"
        )}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.mp3,.wav,.mp4,.webm"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="relative z-0 flex flex-col items-center gap-2">
          <div className={cn(
            "p-3 rounded-full transition-all duration-300",
            isDragging ? "bg-primary text-primary-foreground" : "bg-background shadow-sm text-primary"
          )}>
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              or drag and drop files
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-card border border-border/50 shadow-sm animate-in slide-in-from-left-2 duration-300"
              >
                <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
                   <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-medium truncate text-foreground pr-2">{file.name}</p>
                    <span className="text-2xs text-muted-foreground flex-shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  
                  {/* Progress Bar / Status */}
                  <div className="flex items-center gap-2">
                    {file.status === "uploading" && (
                       <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary transition-all duration-300 ease-out"
                           style={{ width: `${file.progress || 0}%` }}
                         />
                       </div>
                    )}
                     {file.status === "ready" && (
                       <p className="text-2xs text-green-600 font-medium">Ready</p>
                    )}
                    {file.status === "error" && (
                       <p className="text-2xs text-red-500 font-medium">Failed</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                  {file.status === "uploading" ? (
                    <CircularProgress progress={file.progress || 0} />
                  ) : file.status === "ready" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : file.status === "error" ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : null}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                        e.preventDefault();
                        removeFile(file.id);
                    }}
                  >
                    <X className="h-4 w-4" />
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
