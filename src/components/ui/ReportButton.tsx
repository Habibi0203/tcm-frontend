"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

type ReportReason = "medical_claim" | "spam" | "fraud" | "harassment" | "illegal_product" | "privacy" | "other";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "medical_claim", label: "Klaim medis berbahaya/menyesatkan" },
  { value: "illegal_product", label: "Produk ilegal/tidak aman" },
  { value: "fraud", label: "Penipuan/transaksi mencurigakan" },
  { value: "spam", label: "Spam/promosi berlebihan" },
  { value: "harassment", label: "Pelecehan/ujaran kebencian" },
  { value: "privacy", label: "Data pribadi/medis sensitif" },
  { value: "other", label: "Lainnya" },
];

interface ReportButtonProps {
  targetType: "thread" | "reply";
  targetId: string;
  className?: string;
  compact?: boolean;
}

export default function ReportButton({ targetType, targetId, className = "", compact = false }: ReportButtonProps) {
  const { isAuthenticated, access_token } = useAuthStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("medical_claim");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleOpen() {
    if (!isAuthenticated) {
      toast("Login terlebih dahulu untuk melaporkan konten.", "error");
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!access_token) return;
    setSubmitting(true);
    const path = targetType === "thread" ? `/threads/${targetId}/report` : `/replies/${targetId}/report`;
    const res = await apiFetch<{ id: string; message: string }>(path, {
      method: "POST",
      token: access_token,
      body: { reason, details: details.trim() || undefined },
    });
    setSubmitting(false);

    if (!res.success) {
      toast(res.error.message || "Gagal mengirim laporan.", "error");
      return;
    }

    setOpen(false);
    setDetails("");
    setReason("medical_claim");
    toast("Laporan diterima. Moderator akan meninjau konten ini.", "success");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1 transition-colors hover:text-red-600 ${className}`}
        aria-label={`Laporkan ${targetType === "thread" ? "thread" : "balasan"}`}
      >
        <Flag size={compact ? 13 : 14} />
        {compact ? "Laporkan" : "Laporkan"}
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Laporkan Konten" size="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted">
            Gunakan laporan untuk klaim medis berbahaya, penipuan, produk ilegal, spam, pelecehan, atau data pribadi sensitif.
            Jangan gunakan untuk perbedaan pendapat biasa.
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">Alasan</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full rounded-xl border border-border-main bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">Detail tambahan <span className="text-muted">(opsional)</span></label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1000}
              rows={4}
              className="w-full resize-none rounded-xl border border-border-main bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="Contoh: klaim menyembuhkan penyakit serius tanpa dasar, link pembayaran mencurigakan, dsb."
            />
            <p className="mt-1 text-right text-xs text-muted">{details.length}/1000</p>
          </div>
          <div className="flex justify-end gap-2 border-t border-border-main pt-4">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border-main px-4 py-2 text-sm text-muted hover:bg-surface">
              Batal
            </button>
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Mengirim…</> : "Kirim Laporan"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
