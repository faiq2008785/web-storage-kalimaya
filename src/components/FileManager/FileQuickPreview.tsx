
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { FileItem } from "./types";

interface FileQuickPreviewProps {
  open: boolean;
  onClose: () => void;
  file: FileItem | null;
}

const getPreviewUrl = (file: FileItem) => {
  // Simulasi url contoh, bisa diintegrasi storage asli jika tersedia.
  if (!file) return "";
  if (file.type === "image")
    return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=900&q=80";
  if (file.type === "video")
    return "https://www.w3schools.com/html/mov_bbb.mp4";
  if (file.type === "music" || file.type === "audio")
    return "https://www.w3schools.com/html/horse.mp3";
  if (
    file.extension &&
    (file.extension.toLowerCase() === "pdf" || file.type === "pdf")
  )
    return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  return undefined;
};

export const FileQuickPreview: React.FC<FileQuickPreviewProps> = ({
  open,
  onClose,
  file
}) => {
  if (!file) return null;

  const url = getPreviewUrl(file);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl w-full h-[clamp(300px,60vw,600px)] flex flex-col items-center justify-center relative p-0 bg-background"
        onPointerDownOutside={onClose}
      >
        <button className="absolute top-3 right-3 z-10 rounded p-2 bg-background/70 hover:bg-accent transition" onClick={onClose} aria-label="Tutup">
          <X size={20} />
        </button>
        <div className="w-full h-full flex items-center justify-center p-6">
          {file.isFolder ? (
            <span className="text-muted-foreground font-medium">Tidak bisa preview folder.</span>
          ) : file.type === "image" && url ? (
            <img
              src={url}
              alt={file.name}
              className="max-h-[60vh] max-w-full rounded shadow border bg-background"
              style={{ objectFit: "contain" }}
            />
          ) : (file.type === "video" && url) ? (
            <video controls className="w-full rounded max-h-[60vh] bg-black">
              <source src={url} type="video/mp4" />
              Browser tidak mendukung video.
            </video>
          ) : ((file.type === "music" || file.type === "audio") && url) ? (
            <div className="w-full flex flex-col items-center">
              <audio controls className="w-full">
                <source src={url} type="audio/mpeg" />
                Browser tidak mendukung audio.
              </audio>
              <div className="text-muted-foreground text-xs mt-2">{file.name}</div>
            </div>
          ) : (file.extension && (file.extension.toLowerCase() === "pdf" || file.type === "pdf") && url) ? (
            <iframe
              src={url}
              title="Preview PDF"
              className="w-full h-[55vh] rounded border bg-background"
            />
          ) : (file.extension && ["txt", "md", "js", "ts", "json", "log"].includes(file.extension.toLowerCase())) ? (
            <div className="bg-muted p-4 rounded w-full h-[40vh] overflow-auto text-xs font-mono border">
              <em>Preview konten text.</em>
            </div>
          ) : (
            <div className="text-muted-foreground font-medium">Preview tidak tersedia untuk jenis file ini.</div>
          )}
        </div>
        <div className="text-xs text-center text-muted-foreground px-4 pb-4 w-full truncate">
          {file.name}
        </div>
      </DialogContent>
    </Dialog>
  );
};
