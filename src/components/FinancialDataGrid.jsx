import React from 'react';
import { ArrowUpRight, RotateCcw, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function FinancialDataGrid({
  columns = [],
  data = [],
  onSelectRow,
  onVoidRow,
  emptyMessage = 'Tiada rekod lejar ditemui.'
}) {
  const getStatusBadge = (status) => {
    if (!status) return null;
    const lower = String(status).toLowerCase();
    
    if (lower.includes('lunas') || lower.includes('paid')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-rim">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{status}</span>
        </span>
      );
    }
    if (lower.includes('hutang') || lower.includes('pending') || lower.includes('pemiutang')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-rim">
          <Clock className="w-3 h-3" />
          <span>{status}</span>
        </span>
      );
    }
    if (lower.includes('batal') || lower.includes('void')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-rim">
          <XCircle className="w-3 h-3" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-white/10">
        {status}
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-black/70 shadow-sm dark:shadow-rim">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-zinc-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {col.header}
                </th>
              ))}
              <th className="py-3.5 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 dark:text-zinc-500 font-mono">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const isVoided = row.status?.toLowerCase().includes('batal');
                return (
                  <tr
                    key={row.id || row.code || rowIdx}
                    onClick={() => onSelectRow && onSelectRow(row)}
                    className={`group transition-colors duration-150 cursor-pointer ${
                      isVoided 
                        ? 'opacity-50 hover:bg-rose-50 dark:hover:bg-rose-950/10' 
                        : 'hover:bg-slate-50/80 dark:hover:bg-zinc-900/60'
                    }`}
                  >
                    {columns.map((col, colIdx) => {
                      const val = row[col.accessor];
                      const isMoney = col.isCurrency;
                      const isStatus = col.isStatus;

                      return (
                        <td
                          key={colIdx}
                          className={`py-3 px-4 text-slate-700 dark:text-zinc-300 ${
                            col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                          }`}
                        >
                          {isStatus ? (
                            getStatusBadge(val)
                          ) : isMoney ? (
                            <span className="font-mono tabular-nums text-slate-900 dark:text-zinc-100 font-medium">
                              RM {Number(val || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          ) : col.isMono ? (
                            <span className="font-mono text-slate-500 dark:text-zinc-400 text-[11px]">{val}</span>
                          ) : (
                            <span className="font-medium text-slate-800 dark:text-zinc-200">{val}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {onSelectRow && (
                          <button
                            type="button"
                            onClick={() => onSelectRow(row)}
                            className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Buka Baucar / Invois"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        {onVoidRow && !isVoided && (
                          <button
                            type="button"
                            onClick={() => onVoidRow(row)}
                            className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Batalkan (Void Transaksi)"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-zinc-600 group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors shrink-0 ml-1" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
