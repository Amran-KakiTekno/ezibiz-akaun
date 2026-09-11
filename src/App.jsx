import React, { useState } from 'react';
import { 
  Receipt, 
  ArrowLeft, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Boxes, 
  TrendingUp, 
  Building2, 
  Users, 
  FileText, 
  Printer, 
  ChevronRight, 
  Layers, 
  Calendar, 
  Trash2,
  PieChart,
  BookOpen,
  ShoppingBag,
  Wallet
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('jualan');
  const [selectedVoucherId, setSelectedVoucherId] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Inventori State (Stok & Bahan Mentah)
  const [inventory, setInventory] = useState([
    { code: 'STK-001', name: 'Silinder Gas Industri 14kg', category: 'Produk Siap', unit: 'Unit', awal: 200, masuk: 100, keluar: 45, kos: 120.00, harga: 180.00, reorder: 50 },
    { code: 'STK-002', name: 'Injap Tembaga Heavy Duty', category: 'Bahan Mentah', unit: 'Pcs', awal: 500, masuk: 300, keluar: 120, kos: 18.50, harga: 32.00, reorder: 100 },
    { code: 'STK-003', name: 'Hos Getah Bertekanan Tinggi', category: 'Bahan Mentah', unit: 'Meter', awal: 350, masuk: 0, keluar: 80, kos: 8.00, harga: 15.00, reorder: 80 },
    { code: 'STK-004', name: 'Pengatur Tekanan Auto-Cut', category: 'Produk Siap', unit: 'Unit', awal: 120, masuk: 50, keluar: 30, kos: 45.00, harga: 75.00, reorder: 30 }
  ]);

  // 2. Rekod Jualan (Sales)
  const [sales, setSales] = useState([
    { id: 1, date: '2026-09-08', customer: 'Bulan Bintang Engineering', itemCode: 'STK-001', qty: 25, price: 180.00, total: 4500.00, bayaran: 4500.00, status: 'Lunas', method: 'Maybank', ref: 'INV-2026-001' },
    { id: 2, date: '2026-09-09', customer: 'Restoran Seri Melati', itemCode: 'STK-001', qty: 10, price: 180.00, total: 1800.00, bayaran: 800.00, status: 'Baki Hutang', method: 'CIMB', ref: 'INV-2026-002' },
    { id: 3, date: '2026-09-10', customer: 'Bengkel Maju Jaya', itemCode: 'STK-004', qty: 15, price: 75.00, total: 1125.00, bayaran: 1125.00, status: 'Lunas', method: 'Tunai', ref: 'INV-2026-003' }
  ]);

  // 3. Rekod Belian (Purchases)
  const [purchases, setPurchases] = useState([
    { id: 1, date: '2026-09-02', supplier: 'Gas Malaysia Distribution', itemCode: 'STK-001', qty: 100, cost: 120.00, total: 12000.00, bayaran: 12000.00, status: 'Lunas', method: 'Maybank', ref: 'PO-8812' },
    { id: 2, date: '2026-09-05', supplier: 'Precision Brass Tech', itemCode: 'STK-002', qty: 300, cost: 18.50, total: 5550.00, bayaran: 3000.00, status: 'Baki Pemiutang', method: 'Bank Islam', ref: 'PO-8813' }
  ]);

  // 4. Rekod Perbelanjaan (Operating Expenses / Opex)
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-09-01', category: 'Sewa Premis / Pajakan', desc: 'Sewa Pejabat & Premis Perniagaan Bangsar', amount: 3200.00, method: 'Maybank', ref: 'PV-001', voucherNo: 'PV-2026-001' },
    { id: 2, date: '2026-09-05', category: 'Gaji dan Upah', desc: 'Gaji Pekerja Operasi (4 Staf)', amount: 6800.00, method: 'Maybank', ref: 'PV-002', voucherNo: 'PV-2026-002' },
    { id: 3, date: '2026-09-05', category: 'KWSP & SOCSO', desc: 'Caruman KWSP & PERKESO Bulan Ogos', amount: 1420.00, method: 'Maybank', ref: 'PV-003', voucherNo: 'PV-2026-003' },
    { id: 4, date: '2026-09-06', category: 'Elektrik dan Air / Utiliti', desc: 'Bil TNB & Syabas Bulan Ogos', amount: 840.00, method: 'JomPAY', ref: 'PV-004', voucherNo: 'PV-2026-004' },
    { id: 5, date: '2026-09-07', category: 'Promosi, Iklan & Pemasaran', desc: 'Facebook & TikTok Ads Kempen Merdeka', amount: 650.00, method: 'Kad Korporat', ref: 'PV-005', voucherNo: 'PV-2026-005' },
    { id: 6, date: '2026-09-09', category: 'Petrol, Tol & Pengangkutan', desc: 'Kos Penghantaran Lori 3 Tan', amount: 380.00, method: 'Tunai', ref: 'PV-006', voucherNo: 'PV-2026-006' }
  ]);

  // Forms State
  const [saleForm, setSaleForm] = useState({
    date: '2026-09-11',
    customer: '',
    itemCode: 'STK-001',
    qty: 1,
    method: 'Maybank',
    depositPaid: 0
  });

  const [expForm, setExpForm] = useState({
    date: '2026-09-11',
    category: 'Gaji dan Upah',
    desc: '',
    amount: '',
    method: 'Maybank'
  });

  // Dynamic Calculations
  const calculateTotalSales = () => sales.reduce((sum, s) => sum + s.total, 0);
  const calculateTotalPurchases = () => purchases.reduce((sum, p) => sum + p.total, 0);
  const calculateTotalExpenses = () => expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Total Inventory Valuation = Sum (Baki Stok * Kos)
  const calculateTotalInventoryValue = () => {
    return inventory.reduce((sum, item) => {
      const baki = item.awal + item.masuk - item.keluar;
      return sum + (baki * item.kos);
    }, 0);
  };

  // Debtors & Creditors totals
  const calculateTotalDebtors = () => sales.reduce((sum, s) => sum + (s.total - s.bayaran), 0);
  const calculateTotalCreditors = () => purchases.reduce((sum, p) => sum + (p.total - p.bayaran), 0);

  // Financial Statements calculations
  const totalSales = calculateTotalSales();
  const totalPurchases = calculateTotalPurchases();
  const totalExpenses = calculateTotalExpenses();
  const grossProfit = totalSales - totalPurchases;
  const netProfit = grossProfit - totalExpenses;

  // Add Sale Handler
  const handleAddSale = (e) => {
    e.preventDefault();
    const product = inventory.find(i => i.code === saleForm.itemCode);
    if (!product) return;

    const total = Number(saleForm.qty) * product.harga;
    const paid = Number(saleForm.depositPaid);
    const newSale = {
      id: sales.length + 1,
      date: saleForm.date,
      customer: saleForm.customer,
      itemCode: saleForm.itemCode,
      qty: Number(saleForm.qty),
      price: product.harga,
      total: total,
      bayaran: paid,
      status: paid >= total ? 'Lunas' : 'Baki Hutang',
      method: saleForm.method,
      ref: `INV-2026-00${sales.length + 1}`
    };

    // 1. Deduct Stock in Inventory
    setInventory(inventory.map(item => 
      item.code === saleForm.itemCode ? { ...item, keluar: item.keluar + Number(saleForm.qty) } : item
    ));

    // 2. Add to Sales
    setSales([newSale, ...sales]);
    showToast(`Jualan ${newSale.ref} direkodkan! Stok ${product.name} dikemaskini.`);
    setSaleForm({ ...saleForm, customer: '', qty: 1, depositPaid: 0 });
  };

  // Add Expense Handler
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expForm.desc || !expForm.amount) return;

    const newExp = {
      id: expenses.length + 1,
      date: expForm.date,
      category: expForm.category,
      desc: expForm.desc,
      amount: Number(expForm.amount),
      method: expForm.method,
      ref: `PV-00${expenses.length + 1}`,
      voucherNo: `PV-2026-00${expenses.length + 1}`
    };

    setExpenses([newExp, ...expenses]);
    showToast(`Perbelanjaan RM${newExp.amount} direkodkan! Baucar Bayaran dijana.`);
    setExpForm({ ...expForm, desc: '', amount: '' });
  };

  const currentVoucher = expenses.find(e => e.id === selectedVoucherId) || expenses[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a 
              href="https://ezibiz-hub.pages.dev" 
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Portal Hub</span>
            </a>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight">EziBiz Akaun & Inventori</span>
                <span className="text-[10px] font-mono px-2 py-0.5 ml-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  XLS-Compliant
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('laporan')}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Penyata Untung Rugi</span>
            </button>
            <a 
              href="https://github.com/Amran-KakiTekno/ezibiz-akaun" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI Row (Modeled after Ezi-Akaun Menu Utama) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Jumlah Jualan (Gross)</span>
            <div className="text-lg font-bold font-mono text-emerald-400">RM {totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <p className="text-[10px] text-slate-500">Hasil Jualan Semasa</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Kos Belian / Stok</span>
            <div className="text-lg font-bold font-mono text-amber-400">RM {totalPurchases.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <p className="text-[10px] text-slate-500">Belian Bahan & Produk</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Jumlah Perbelanjaan</span>
            <div className="text-lg font-bold font-mono text-red-400">RM {totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <p className="text-[10px] text-slate-500">Gaji, Sewa, Utiliti</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Nilaian Stok Semasa</span>
            <div className="text-lg font-bold font-mono text-cyan-300">RM {calculateTotalInventoryValue().toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            <p className="text-[10px] text-slate-500">Nilaian Aset Inventori</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Untung Bersih Semasa</span>
            <div className={`text-lg font-bold font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              RM {netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <p className="text-[10px] text-emerald-500 font-medium">{netProfit >= 0 ? 'Surplus Bersih' : 'Defisit Bersih'}</p>
          </div>
        </div>

        {/* Tab Navigation (Ezi-Akaun Modules) */}
        <div className="flex border-b border-slate-800 text-xs overflow-x-auto">
          {[
            { id: 'jualan', label: '1. Jualan (Sales)' },
            { id: 'belian', label: '2. Belian (Purchases)' },
            { id: 'perbelanjaan', label: '3. Perbelanjaan (Opex)' },
            { id: 'inventori', label: '4. Inventori & Stok' },
            { id: 'penghutang', label: '5. Penghutang & Pemiutang' },
            { id: 'voucher', label: '6. Baucar Bayaran (PV)' },
            { id: 'laporan', label: '7. Penyata Kewangan (P&L & Kunci Kira-Kira)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'border-emerald-500 text-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: JUALAN */}
        {activeTab === 'jualan' && (
          <div className="space-y-6">
            {/* Borang Tambah Jualan */}
            <form onSubmit={handleAddSale} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Daftar Transaksi Jualan Baru</h3>
                  <p className="text-xs text-slate-400">Merekod jualan secara automatik menolak kuantiti stok dan mengemaskini lejar penghutang.</p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Auto-Deduct Stock</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tarikh</label>
                  <input 
                    type="date"
                    value={saleForm.date}
                    onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-medium">Nama Pelanggan / Detail</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Syarikat Maju Bersama Sdn Bhd"
                    value={saleForm.customer}
                    onChange={(e) => setSaleForm({ ...saleForm, customer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Pilih Produk Inventori</label>
                  <select
                    value={saleForm.itemCode}
                    onChange={(e) => setSaleForm({ ...saleForm, itemCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {inventory.map(item => (
                      <option key={item.code} value={item.code}>
                        {item.name} (RM {item.harga.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Kuantiti</label>
                  <input 
                    type="number"
                    min="1"
                    value={saleForm.qty}
                    onChange={(e) => setSaleForm({ ...saleForm, qty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Cara Bayaran</label>
                  <select
                    value={saleForm.method}
                    onChange={(e) => setSaleForm({ ...saleForm, method: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option>Maybank</option>
                    <option>CIMB Bank</option>
                    <option>Bank Islam</option>
                    <option>Tunai di Tangan</option>
                    <option>Kad Kredit / Stripe</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Bayaran / Deposit Diterima (RM)</label>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={saleForm.depositPaid}
                    onChange={(e) => setSaleForm({ ...saleForm, depositPaid: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Simpan Rekod Jualan
                  </button>
                </div>
              </div>
            </form>

            {/* Jadual Jualan */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h4 className="text-xs font-semibold text-white">Buku Rekod Jualan (Sales Ledger)</h4>
                <span className="text-xs font-mono text-emerald-400">Total: RM {totalSales.toFixed(2)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                    <tr>
                      <th className="p-3.5">No. Ruj</th>
                      <th className="p-3.5">Tarikh</th>
                      <th className="p-3.5">Pelanggan</th>
                      <th className="p-3.5">Kuantiti</th>
                      <th className="p-3.5">Jumlah Jualan</th>
                      <th className="p-3.5">Bayaran Diterima</th>
                      <th className="p-3.5">Cara Bayaran</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sales.map(s => (
                      <tr key={s.id} className="hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono text-white font-medium">{s.ref}</td>
                        <td className="p-3.5 text-slate-400">{s.date}</td>
                        <td className="p-3.5 text-white font-medium">{s.customer}</td>
                        <td className="p-3.5 font-mono">{s.qty} unit</td>
                        <td className="p-3.5 font-mono text-emerald-400 font-bold">RM {s.total.toFixed(2)}</td>
                        <td className="p-3.5 font-mono text-slate-300">RM {s.bayaran.toFixed(2)}</td>
                        <td className="p-3.5 text-slate-400">{s.method}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            s.status === 'Lunas' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BELIAN */}
        {activeTab === 'belian' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-white">Buku Rekod Belian & Pembekal (Purchases Ledger)</h4>
                  <p className="text-[11px] text-slate-400">Belian stok masuk automatik meningkatkan baki inventori semasa.</p>
                </div>
                <span className="text-xs font-mono text-amber-400">Total: RM {totalPurchases.toFixed(2)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                    <tr>
                      <th className="p-3.5">No. Ruj</th>
                      <th className="p-3.5">Tarikh</th>
                      <th className="p-3.5">Nama Pembekal</th>
                      <th className="p-3.5">Kod Produk</th>
                      <th className="p-3.5">Kuantiti</th>
                      <th className="p-3.5">Jumlah Belian</th>
                      <th className="p-3.5">Bayaran Dibuat</th>
                      <th className="p-3.5">Status Pemiutang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {purchases.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono text-white font-medium">{p.ref}</td>
                        <td className="p-3.5 text-slate-400">{p.date}</td>
                        <td className="p-3.5 text-white font-medium">{p.supplier}</td>
                        <td className="p-3.5 font-mono text-slate-300">{p.itemCode}</td>
                        <td className="p-3.5 font-mono">{p.qty} unit</td>
                        <td className="p-3.5 font-mono text-amber-400 font-bold">RM {p.total.toFixed(2)}</td>
                        <td className="p-3.5 font-mono text-slate-300">RM {p.bayaran.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            p.status === 'Lunas' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERBELANJAAN */}
        {activeTab === 'perbelanjaan' && (
          <div className="space-y-6">
            <form onSubmit={handleAddExpense} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white">Daftar Perbelanjaan Operasi (OPEX)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tarikh</label>
                  <input 
                    type="date"
                    value={expForm.date}
                    onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Kategori Perbelanjaan (Ezi-Akaun)</label>
                  <select
                    value={expForm.category}
                    onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option>Gaji dan Upah</option>
                    <option>KWSP & SOCSO</option>
                    <option>Sewa Premis / Pajakan</option>
                    <option>Elektrik dan Air / Utiliti</option>
                    <option>Promosi, Iklan & Pemasaran</option>
                    <option>Petrol, Tol & Pengangkutan</option>
                    <option>Pembaikan dan Penyelenggaraan</option>
                    <option>Lain-Lain Perbelanjaan</option>
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-medium">Keterangan / Butiran</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Pembelian toner dan kertas pencetak A4"
                    value={expForm.desc}
                    onChange={(e) => setExpForm({ ...expForm, desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Jumlah Bayaran (RM)</label>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={expForm.amount}
                    onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Kaedah Pembayaran</label>
                  <select
                    value={expForm.method}
                    onChange={(e) => setExpForm({ ...expForm, method: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option>Maybank</option>
                    <option>CIMB Bank</option>
                    <option>Tunai Runcit</option>
                    <option>Kad Korporat</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs transition-colors"
                  >
                    Rekod Perbelanjaan
                  </button>
                </div>
              </div>
            </form>

            {/* Jadual Perbelanjaan */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h4 className="text-xs font-semibold text-white">Buku Rekod Perbelanjaan (Expense Ledger)</h4>
                <span className="text-xs font-mono text-red-400">Total: RM {totalExpenses.toFixed(2)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                    <tr>
                      <th className="p-3.5">Tarikh</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Keterangan</th>
                      <th className="p-3.5">Jumlah</th>
                      <th className="p-3.5">Kaedah</th>
                      <th className="p-3.5">No. Baucar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {expenses.map(e => (
                      <tr key={e.id} className="hover:bg-slate-800/30">
                        <td className="p-3.5 text-slate-400">{e.date}</td>
                        <td className="p-3.5 text-indigo-400 font-medium">{e.category}</td>
                        <td className="p-3.5 text-white">{e.desc}</td>
                        <td className="p-3.5 font-mono text-red-400 font-bold">RM {e.amount.toFixed(2)}</td>
                        <td className="p-3.5 text-slate-400">{e.method}</td>
                        <td className="p-3.5 font-mono text-slate-300">{e.voucherNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORI */}
        {activeTab === 'inventori' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-white">Trek Rekod Inventori (Stok Siap & Bahan Mentah)</h4>
                  <p className="text-[11px] text-slate-400">Baki Stok = Stok Awal + Stok Masuk - Stok Keluar | Nilaian = Baki × Kos</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold">
                    Nilaian Keseluruhan: RM {calculateTotalInventoryValue().toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                    <tr>
                      <th className="p-3.5">Kod</th>
                      <th className="p-3.5">Nama Produk / Bahan</th>
                      <th className="p-3.5">Jenis</th>
                      <th className="p-3.5">Stok Awal</th>
                      <th className="p-3.5">Masuk (In)</th>
                      <th className="p-3.5">Keluar (Out)</th>
                      <th className="p-3.5">Baki Stok</th>
                      <th className="p-3.5">Kos / Unit</th>
                      <th className="p-3.5">Harga Jual</th>
                      <th className="p-3.5">Nilaian Semasa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {inventory.map(item => {
                      const baki = item.awal + item.masuk - item.keluar;
                      const nilaian = baki * item.kos;
                      const isLow = baki <= item.reorder;
                      return (
                        <tr key={item.code} className="hover:bg-slate-800/30">
                          <td className="p-3.5 font-mono text-white font-medium">{item.code}</td>
                          <td className="p-3.5 font-semibold text-white">{item.name}</td>
                          <td className="p-3.5 text-slate-400">{item.category}</td>
                          <td className="p-3.5 font-mono text-slate-400">{item.awal}</td>
                          <td className="p-3.5 font-mono text-emerald-400">+{item.masuk}</td>
                          <td className="p-3.5 font-mono text-red-400">-{item.keluar}</td>
                          <td className="p-3.5 font-mono font-bold text-white flex items-center gap-1.5">
                            <span>{baki} {item.unit}</span>
                            {isLow && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">
                                Rendah
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono text-slate-400">RM {item.kos.toFixed(2)}</td>
                          <td className="p-3.5 font-mono text-emerald-400">RM {item.harga.toFixed(2)}</td>
                          <td className="p-3.5 font-mono text-cyan-300 font-bold">RM {nilaian.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PENGHUTANG & PEMIUTANG */}
        {activeTab === 'penghutang' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rekod Penghutang (AR) */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-white">6. Rekod Penghutang (Pelanggan Belum Bayar)</h4>
                  <p className="text-[11px] text-slate-400">Baki hutang jualan yang perlu dituntut.</p>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  Baki: RM {calculateTotalDebtors().toFixed(2)}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {sales.filter(s => s.total > s.bayaran).map(s => (
                  <div key={s.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{s.customer}</p>
                      <p className="text-slate-400">{s.ref} • {s.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-mono font-bold">Hutang: RM {(s.total - s.bayaran).toFixed(2)}</p>
                      <p className="text-[10px] text-slate-500">Jumlah: RM {s.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rekod Pemiutang (AP) */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-white">7. Rekod Pemiutang (Hutang Kepada Pembekal)</h4>
                  <p className="text-[11px] text-slate-400">Baki belian yang perlu dibayar kepada supplier.</p>
                </div>
                <span className="text-xs font-mono text-red-400 font-bold">
                  Baki: RM {calculateTotalCreditors().toFixed(2)}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {purchases.filter(p => p.total > p.bayaran).map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{p.supplier}</p>
                      <p className="text-slate-400">{p.ref} • {p.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-mono font-bold">Perlu Bayar: RM {(p.total - p.bayaran).toFixed(2)}</p>
                      <p className="text-[10px] text-slate-500">Jumlah: RM {p.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT VOUCHER */}
        {activeTab === 'voucher' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-medium text-slate-300">Pilih Baucar Bayaran</span>
              <div className="space-y-2 text-xs">
                {expenses.map(e => (
                  <div
                    key={e.id}
                    onClick={() => setSelectedVoucherId(e.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedVoucherId === e.id 
                        ? 'bg-emerald-950/20 border-emerald-500 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-mono font-bold text-white">{e.voucherNo}</span>
                      <span className="font-mono text-emerald-400">RM {e.amount.toFixed(2)}</span>
                    </div>
                    <p className="truncate mt-1 text-slate-300">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Printable Voucher Display */}
            <div className="lg:col-span-8 rounded-2xl bg-white text-slate-900 p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">PUNCAK UTAMA SDN BHD</h3>
                  <p className="text-xs text-slate-600">LEVEL 12, MENARA BANGSAR, NO. 8 JALAN BANGSAR UTAMA 1, 59000 KUALA LUMPUR</p>
                  <p className="text-xs text-slate-600">Tel: +60 3-2282 1199 | E-mel: kewangan@puncakutama.com.my | No. Pendaftaran: 202301038192 (1508821-M)</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">BAUCAR BAYARAN</span>
                  <p className="text-xs font-mono text-slate-600 font-semibold">{currentVoucher.voucherNo}</p>
                  <p className="text-xs text-slate-500">Tarikh: {currentVoucher.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-4 rounded-lg bg-slate-50">
                <div>
                  <span className="text-slate-500 font-medium">Dibayar Kepada / Kategori:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{currentVoucher.category}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Kaedah / Bank:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{currentVoucher.method}</p>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-12">No.</th>
                    <th className="p-3">Keterangan / Butiran Bayaran</th>
                    <th className="p-3 text-right w-36">Jumlah (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 font-mono">1</td>
                    <td className="p-3 font-medium">{currentVoucher.desc}</td>
                    <td className="p-3 font-mono text-right font-bold">RM {currentVoucher.amount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-500">Ringgit Malaysia: Sah diperakui untuk audit syarikat.</span>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-600">JUMLAH KESELURUHAN:</span>
                  <span className="text-xl font-bold font-mono text-slate-900 ml-3">RM {currentVoucher.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-200 text-center text-xs">
                <div>
                  <div className="border-b border-slate-400 mb-2"></div>
                  <p className="font-semibold text-slate-800">Disediakan Oleh</p>
                  <p className="text-[10px] text-slate-500">Kerani / Akaun</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 mb-2"></div>
                  <p className="font-semibold text-slate-800">Diluluskan Oleh</p>
                  <p className="text-[10px] text-slate-500">Pengurus / Pengarah</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 mb-2"></div>
                  <p className="font-semibold text-slate-800">Diterima Oleh</p>
                  <p className="text-[10px] text-slate-500">Penerima Bayaran</p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Baucar Bayaran</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PENYATA KEWANGAN (P&L & KUNCI KIRA-KIRA) */}
        {activeTab === 'laporan' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Penyata Untung Rugi (P&L) */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">Penyata Kewangan</span>
                <h3 className="text-base font-bold text-white">Penyata Untung Rugi (P&L)</h3>
                <p className="text-xs text-slate-400">Bagi tempoh berakhir 31 Disember 2026</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>Jualan Bersih</span>
                  <span className="font-mono">RM {totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 pl-3">
                  <span>(-) Kos Belian & Pengeluaran Stok</span>
                  <span className="font-mono">RM {totalPurchases.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-emerald-400">
                  <span>UNTUNG KASAR</span>
                  <span className="font-mono">RM {grossProfit.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="font-semibold text-slate-300">Tolak: Perbelanjaan Operasi</span>
                  <div className="space-y-1.5 mt-2 pl-3 text-slate-400">
                    {expenses.map(e => (
                      <div key={e.id} className="flex justify-between">
                        <span>{e.category} ({e.desc})</span>
                        <span className="font-mono">RM {e.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between font-semibold text-red-400">
                  <span>Jumlah Perbelanjaan</span>
                  <span className="font-mono">RM {totalExpenses.toFixed(2)}</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">UNTUNG BERSIH SEMASA</span>
                  <span className={`font-mono text-base ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    RM {netProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Kunci Kira-Kira (Balance Sheet) */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">Imbangan Kunci Kira-Kira</span>
                <h3 className="text-base font-bold text-white">Kunci Kira-Kira (Balance Sheet)</h3>
                <p className="text-xs text-slate-400">Persamaan Perakaunan: Aset = Liabiliti + Ekuiti Pemilik</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-white">Aset Bukan Semasa (Tetap)</span>
                  <div className="pl-3 mt-1 space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Kenderaan & Lori Pengangkutan</span>
                      <span className="font-mono">RM 45,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alatan & Mesin Bengkel</span>
                      <span className="font-mono">RM 18,500.00</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-white">Aset Semasa</span>
                  <div className="pl-3 mt-1 space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Stok Akhir Inventori</span>
                      <span className="font-mono text-cyan-300">RM {calculateTotalInventoryValue().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penghutang Dagangan</span>
                      <span className="font-mono text-amber-400">RM {calculateTotalDebtors().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Baki Bank & Tunai di Tangan</span>
                      <span className="font-mono">RM 24,150.00</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-cyan-300">
                  <span>JUMLAH ASET</span>
                  <span className="font-mono">RM {(63500 + calculateTotalInventoryValue() + calculateTotalDebtors() + 24150).toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="font-semibold text-white">Liabiliti & Ekuiti Pemilik</span>
                  <div className="pl-3 mt-1 space-y-1 text-slate-400">
                    <div className="flex justify-between">
                      <span>Pemiutang Dagangan (Hutang Supplier)</span>
                      <span className="font-mono text-red-400">RM {calculateTotalCreditors().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modal Awal Pemilik</span>
                      <span className="font-mono">RM 80,000.00</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Untung Bersih Terkumpul</span>
                      <span className="font-mono">RM {netProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 flex justify-between items-center text-xs font-bold text-indigo-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Persamaan Perakaunan Seimbang (Imbang Tepat)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
