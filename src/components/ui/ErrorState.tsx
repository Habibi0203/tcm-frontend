import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Maaf, data tidak dapat dimuat. Silakan coba lagi.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border-main bg-card px-6 py-16 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <h3 className="mb-2 font-display text-xl font-semibold text-text-main">{title}</h3>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <RefreshCcw size={16} />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
