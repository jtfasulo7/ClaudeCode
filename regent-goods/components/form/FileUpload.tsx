"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_TOTAL_UPLOAD,
} from "@/lib/inquiry-schema";

type UploadFile = {
  id: string;
  file: File;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  files,
  onChange,
  label = "Photos or documents",
  hint = "JPG, PNG, WEBP, or PDF. Up to 10 MB per file.",
  required = false,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
  hint?: string;
  required?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = (incoming: FileList | File[]) => {
    setError(null);
    const incomingArr = Array.from(incoming);
    const accepted: File[] = [];
    let totalSize = files.reduce((s, f) => s + f.size, 0);

    for (const file of incomingArr) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError(`Unsupported file type: ${file.name}`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File exceeds 10 MB: ${file.name}`);
        continue;
      }
      if (totalSize + file.size > MAX_TOTAL_UPLOAD) {
        setError("Total upload exceeds 25 MB. Remove a file and try again.");
        break;
      }
      totalSize += file.size;
      accepted.push(file);
    }

    if (accepted.length) {
      onChange([...files, ...accepted]);
    }
  };

  const removeAt = (index: number) => {
    const next = files.slice();
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-ink">
          {label}
          {required ? (
            <span className="ml-1 text-navy" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
        <span className="text-[12px] text-text-soft">{hint}</span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-2 flex w-full flex-col items-center justify-center gap-3 border border-dashed bg-paper px-6 py-8 text-center transition-colors cursor-pointer hover:border-ink hover:bg-paper-soft",
          dragOver ? "border-ink bg-paper-soft" : "border-border",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
      >
        <Upload size={20} strokeWidth={1.75} className="text-text" />
        <p className="text-[14px] text-text">
          <span className="text-navy underline-offset-2 hover:underline">
            Click to browse
          </span>{" "}
          or drag &amp; drop files here
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_MIME_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </button>

      {error ? (
        <p className="mt-2 text-[12.5px] text-[#a51c1c]" role="alert">
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="mt-4 divide-y divide-line border border-line">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={16} className="shrink-0 text-text" />
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] text-ink">{file.name}</p>
                  <p className="text-[12px] text-text-soft">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="inline-flex h-7 w-7 items-center justify-center text-text-soft hover:text-ink"
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
