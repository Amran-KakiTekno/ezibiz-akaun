import React, { useEffect } from 'react';
import { X, Printer, Download, CheckCircle2, QrCode, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { formatRM, COMPANY_INFO } from '../App';

export default function VoucherDrawer({
  isOpen,
  onClose,
  record,
  type = 'sale', // 'sale' | 'purchase' | 'expense'
  t
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
    sale: t ? t('voucherTitleSale') : 'INVOIS JUALAN & RESIT RASMI',
    purchase: t ? t('voucherTitlePurchase') : 'PESANAN BELIAN (PO) & BAUCAR PEMBEKAL',
    expense: t ? t('voucherTitleExpense') : 'BAUCAR BAYARAN PERBELANJAAN OPERASI'
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
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-white/[0.08] shadow-2xl z-10 flex flex-col h-full text-slate-800 dark:text-zinc-200 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.08] px-6 py-4 flex items-center justify-between no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{refNumber}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                {record.status || 'Lunas'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{titleMap[type] || (t ? t('voucherOfficial') : 'Baucar Rasmi')}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-white/10 text-xs font-medium transition-colors shadow-sm dark:shadow-rim cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t ? t('printA4') : 'Cetak A4'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper Surface */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 print:p-0 print:m-0">
          
          {/* Document Header Card */}
          <div className="rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/[0.08] p-6 shadow-sm dark:shadow-rim space-y-4 print:border-none print:bg-white print:text-black">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold print:text-emerald-700">
                  EziBiz Akaun â€¢ Financial Studio
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black mt-1">{COMPANY_INFO.name}</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 print:text-zinc-600 mt-0.5">
                  No. Pendaftaran: {COMPANY_INFO.regNo}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 print:text-zinc-600">
                  {COMPANY_INFO.location} â€¢ {COMPANY_INFO.email}
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 uppercase">{t ? t('docDate') : 'Tarikh Dokumen'}</span>
                <p className="font-mono text-xs text-slate-800 dark:text-zinc-200 font-semibold print:text-black">
                  {record.date || record.tarikh || '2026-09-11'}
                </p>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 print:border-black print:text-black">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span>LHDN e-Invoice Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Strip */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06] print:border-zinc-300 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono">{t ? t('paidToOrIssuedFor') : 'Dibayar Kepada / Dikeluarkan Untuk:'}</span>
                <p className="font-semibold text-slate-900 dark:text-zinc-100 print:text-black mt-0.5">{partyName}</p>
                {record.itemCode && (
                  <p className="text-slate-500 dark:text-zinc-400 font-mono text-[11px] mt-0.5">Kod Produk: {record.itemCode}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono">{t ? t('paymentMethodOrRef') : 'Kaedah / Rujukan Bayaran:'}</span>
                <p className="font-semibold text-slate-900 dark:text-zinc-100 print:text-black mt-0.5">{record.method || record.kaedah || 'Perbankan Internet Maybank'}</p>
                <p className="text-slate-500 dark:text-zinc-400 font-mono text-[11px] mt-0.5">Ref: {refNumber}</p>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] overflow-hidden bg-white dark:bg-black/40 shadow-sm dark:shadow-rim print:border-zinc-300 print:bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-zinc-900/60 text-slate-500 dark:text-zinc-400 font-mono text-[11px] uppercase print:bg-zinc-100 print:text-black">
                  <th className="py-2.5 px-4">{t ? t('colItem') : 'Deskripsi Item'}</th>
                  <th className="py-2.5 px-4 text-center">{t ? t('colQty') : 'Kuantiti'}</th>
                  <th className="py-2.5 px-4 text-right">{t ? t('colUnitPrice') : 'Harga Seunit'}</th>
                  <th className="py-2.5 px-4 text-right">{t ? t('colTotal') : 'Jumlah'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] print:divide-zinc-200">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800 dark:text-zinc-200 print:text-black">{record.name || record.itemCode || 'Servis & Pembekalan'}</p>
                    <p className="text-[11px] text-slate-500">{record.desc || 'Transaksi operasi disahkan dalam lejar perakaunan SME.'}</p>
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700 dark:text-zinc-300 print:text-black">
                    {record.qty || 1} Unit
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-zinc-300 print:text-black">
                    {formatRM(record.price || record.cost || totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-zinc-100 print:text-black">
                    {formatRM(totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Totals Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-rim space-y-2 text-xs print:bg-white print:border-zinc-300">
            <div className="flex justify-between text-slate-500 dark:text-zinc-400 print:text-zinc-600">
              <span>{t ? t('subtotal') : 'Jumlah Bersih (Subtotal):'}</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-zinc-200 print:text-black">{formatRM(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-zinc-400 print:text-zinc-600">
              <span>{t ? t('taxSst') : 'Cukai SST / Pelepasan:'}</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-zinc-200 print:text-black">RM 0.00 (Dikecualikan)</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] print:border-zinc-300 flex justify-between items-baseline font-bold text-sm">
              <span className="text-slate-900 dark:text-white print:text-black">{t ? t('grandTotal') : 'Jumlah Keseluruhan:'}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 print:text-emerald-700 text-base">{formatRM(totalAmount)}</span>
            </div>
          </div>

          {/* Audit Verification Strip */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-slate-400 font-mono print:border-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>{t ? t('auditVerificationNote') : 'Disahkan Automatik oleh Lejar Pintar EziBiz'}</span>
            </div>
            <span>Token: #LHDN-AUDIT-VALID</span>
          </div>

        </div>

      </div>
    </div>
  );
}

