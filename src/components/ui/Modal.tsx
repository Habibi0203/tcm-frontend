"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Max-width class, e.g. "max-w-lg" (default) or "max-w-2xl" */
  size?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "max-w-lg",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={`relative w-full ${size} rounded-2xl bg-white shadow-2xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border-main px-6 py-4">
            <h2 id="modal-title" className="font-display text-lg font-semibold text-text-main">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-muted transition-colors hover:bg-surface hover:text-text-main"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-lg p-1 text-muted transition-colors hover:bg-surface hover:text-text-main"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        )}

        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
