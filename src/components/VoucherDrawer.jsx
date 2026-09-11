import React, { useEffect } from 'react';
import { X, Printer, Download, CheckCircle2, QrCode, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function VoucherDrawer({
  isOpen,
  onClose,
  record,
  type = 'sale' // 'sale' | 'purchase' | 'expense'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const titleMap = {
    sale: 'INVOIS JUALAN & RESIT RASMI',
    purchase: 'PESANAN BELIAN (PO) & BAUCAR PEMBEKAL',
    expense: 'BAUCAR BAYARAN PERBELANJAAN OPERASI'
  };

  const refNumber = record.ref || `DOC-${record.id || '2026'}`;
  const partyName = record.customer || record.supplier || record.kategori || 'Penerima Pembayaran';
  const totalAmount = record.total || record.jumlah || record.bayaran || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-xl bg-zinc-950 border-l border-white/[0.08] shadow-2xl z-10 flex flex-col h-full text-zinc-200 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-4 flex items-center justify-between no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 font-semibold">{refNumber}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {record.status || 'Lunas'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{titleMap[type] || 'Baucar Rasmi'}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 text-xs font-medium transition-colors shadow-rim cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper Surface */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 print:p-0 print:m-0">
          
          {/* Document Header Card */}
          <div className="rounded-xl bg-black/60 border border-white/[0.08] p-6 shadow-rim space-y-4 print:border-none print:bg-white print:text-black">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold print:text-emerald-700">
                  EziBiz Akaun • Financial Studio
                </span>
                <h2 className="text-lg font-bold text-white print:text-black mt-1">KakiTekno Global Inc.</h2>
                <p className="text-xs text-zinc-400 print:text-zinc-600 mt-0.5">
                  No. Pendaftaran: 202601008812 (SSM Valid)
                </p>
                <p className="text-xs text-zinc-500 print:text-zinc-600">
                  Kuala Lumpur, Malaysia • support@kakitekno.com
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Tarikh Dokumen</span>
                <p className="font-mono text-xs text-zinc-200 font-semibold print:text-black">
                  {record.date || record.tarikh || '2026-09-11'}
                </p>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400 print:border-black print:text-black">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>LHDN e-Invoice Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Strip */}
            <div className="pt-4 border-t border-white/[0.06] print:border-zinc-300 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-mono">Dibayar Kepada / Dikeluarkan Untuk:</span>
                <p className="font-semibold text-zinc-100 print:text-black mt-0.5">{partyName}</p>
                {record.itemCode && (
                  <p className="text-zinc-400 font-mono text-[11px] mt-0.5">Kod Produk: {record.itemCode}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-[10px] uppercase font-mono">Kaedah / Rujukan Bayaran:</span>
                <p className="font-semibold text-zinc-100 print:text-black mt-0.5">{record.method || record.kaedah || 'Perbankan Internet Maybank'}</p>
                <p className="text-zinc-400 font-mono text-[11px] mt-0.5">Ref: {refNumber}</p>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-black/40 shadow-rim print:border-zinc-300 print:bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-zinc-900/60 text-zinc-400 font-mono text-[11px] uppercase print:bg-zinc-100 print:text-black">
                  <th className="py-2.5 px-4">Deskripsi Item</th>
                  <th className="py-2.5 px-4 text-center">Kuantiti</th>
                  <th className="py-2.5 px-4 text-right">Harga Seunit</th>
                  <th className="py-2.5 px-4 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] print:divide-zinc-200">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-medium text-zinc-200 print:text-black">{record.name || record.itemCode || 'Servis & Pembekalan'}</p>
                    <p className="text-[11px] text-zinc-500">{record.desc || 'Transaksi operasi disahkan dalam lejar perakaunan SME.'}</p>
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-zinc-300 print:text-black">
                    {record.qty || 1} Unit
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-zinc-300 print:text-black">
                    RM {Number(record.price || record.cost || totalAmount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-zinc-100 print:text-black">
                    RM {Number(totalAmount).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Totals Card */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] shadow-rim space-y-2 text-xs print:bg-white print:border-zinc-300">
            <div className="flex justify-between text-zinc-400 print:text-zinc-600">
              <span>Jumlah Bersih (Subtotal):</span>
              <span className="font-mono tabular-nums text-zinc-200 print:text-black">RM {Number(totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400 print:text-zinc-600">
              <span>Cukai SST / Pelepasan:</span>
              <span className="font-mono tabular-nums text-zinc-200 print:text-black">RM 0.00 (Dikecualikan)</span>
            </div>
            <div className="pt-2 border-t border-white/[0.06] print:border-zinc-300 flex justify-between items-baseline font-bold text-sm">
              <span className="text-white print:text-black">Jumlah Keseluruhan:</span>
              <span className="font-mono text-emerald-400 print:text-emerald-700 text-base">RM {Number(totalAmount).toFixed(2)}</span>
            </div>
          </div>

          {/* Audit Verification Strip */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-white/[0.06] text-[11px] text-zinc-500 font-mono print:border-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Disahkan Automatik oleh Lejar Pintar EziBiz</span>
            </div>
            <span>Token: #{Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
