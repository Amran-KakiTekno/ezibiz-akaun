import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
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
  Wallet,
  X,
  RotateCcw,
  Search,
  Download,
  Settings,
  MoreHorizontal,
  XCircle
} from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import FinancialDataGrid from './components/FinancialDataGrid';
import VoucherDrawer from './components/VoucherDrawer';
import { useSettings } from './utils/useSettings';

export const formatRM = (n) => 'RM ' + Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const COMPANY_INFO = {
  name: 'PUNCAK UTAMA SDN BHD',
  address: 'LEVEL 12, MENARA BANGSAR, NO. 8 JALAN BANGSAR UTAMA 1, 59000 KUALA LUMPUR',
  contact: 'Tel: +60 3-2282 1199 | E-mel: kewangan@puncakutama.com.my | No. Pendaftaran: 202301038192 (1508821-M)',
  regNo: '202301038192 (1508821-M)',
  location: 'Kuala Lumpur, Malaysia',
  email: 'kewangan@puncakutama.com.my'
};

export default function App() {
  const { theme, setTheme, language, setLanguage, t } = useSettings();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const [drawerState, setDrawerState] = useState({ isOpen: false, record: null, type: 'sale' });
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('tab');
      if (param && ['jualan', 'belian', 'perbelanjaan', 'inventori', 'penghutang', 'voucher', 'laporan'].includes(param)) {
        return param;
      }
    }
    return 'jualan';
  });
  const [selectedVoucherId, setSelectedVoucherId] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [voidTarget, setVoidTarget] = useState(null); // { type: 'sale' | 'purchase' | 'expense', item: Object }
  const [salesSearchQuery, setSalesSearchQuery] = useState('');
  const [expSearchQuery, setExpSearchQuery] = useState('');

  const handleOpenDrawer = (record, type = 'sale') => {
    setDrawerState({ isOpen: true, record, type });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const param = new URLSearchParams(window.location.search).get('tab');
      if (param && ['jualan', 'belian', 'perbelanjaan', 'inventori', 'penghutang', 'voucher', 'laporan'].includes(param)) {
        setActiveTab(param);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const exportToCSV = (rows, filename) => {
    if (!rows || rows.length === 0) {
      showToast('Amaran: Tiada data untuk dieksport.');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          let cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
          cell = cell.replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
          return cell;
        }).join(',')
      )
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Fail CSV ${filename} berjaya dimuat turun!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Keyboard shortcut (Escape) to dismiss Confirmation Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setVoidTarget(null);
      }
    };
    if (voidTarget) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voidTarget]);

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
    { id: 1, date: '2026-09-01', category: 'Sewa Premis / Pajakan', desc: 'Sewa Pejabat & Premis Perniagaan Bangsar', amount: 3200.00, method: 'Maybank', ref: 'PV-001', voucherNo: 'PV-2026-001', status: 'Dibayar' },
    { id: 2, date: '2026-09-05', category: 'Gaji dan Upah', desc: 'Gaji Pekerja Operasi (4 Staf)', amount: 6800.00, method: 'Maybank', ref: 'PV-002', voucherNo: 'PV-2026-002', status: 'Dibayar' },
    { id: 3, date: '2026-09-05', category: 'KWSP & SOCSO', desc: 'Caruman KWSP & PERKESO Bulan Ogos', amount: 1420.00, method: 'Maybank', ref: 'PV-003', voucherNo: 'PV-2026-003', status: 'Dibayar' },
    { id: 4, date: '2026-09-06', category: 'Elektrik dan Air / Utiliti', desc: 'Bil TNB & Syabas Bulan Ogos', amount: 840.00, method: 'JomPAY', ref: 'PV-004', voucherNo: 'PV-2026-004', status: 'Dibayar' },
    { id: 5, date: '2026-09-07', category: 'Promosi, Iklan & Pemasaran', desc: 'Facebook & TikTok Ads Kempen Merdeka', amount: 650.00, method: 'Kad Korporat', ref: 'PV-005', voucherNo: 'PV-2026-005', status: 'Dibayar' },
    { id: 6, date: '2026-09-09', category: 'Petrol, Tol & Pengangkutan', desc: 'Kos Penghantaran Lori 3 Tan', amount: 380.00, method: 'Tunai', ref: 'PV-006', voucherNo: 'PV-2026-006', status: 'Dibayar' }
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

  // Balance Sheet Calculations
  const stockValue = calculateTotalInventoryValue();
  const receivables = calculateTotalDebtors();
  const payables = calculateTotalCreditors();
  const capital = 80000;
  const retainedEarnings = netProfit;
  const cashInBank = sales.reduce((sum, s) => sum + (s.bayaran || 0), 0) - purchases.reduce((sum, p) => sum + (p.bayaran || 0), 0) - totalExpenses;
  const cash = cashInBank;
  const assets = stockValue + receivables + cashInBank;
  const liabilitiesAndEquity = payables + capital + retainedEarnings;
  const balanced = Math.abs(assets - liabilitiesAndEquity) < 0.01;

  const filteredSales = sales.filter(s => 
    s.customer.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
    s.ref.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
    s.itemCode.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(salesSearchQuery.toLowerCase())
  );

  const filteredExpenses = expenses.filter(e =>
    e.desc.toLowerCase().includes(expSearchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(expSearchQuery.toLowerCase()) ||
    (e.voucherNo && e.voucherNo.toLowerCase().includes(expSearchQuery.toLowerCase())) ||
    e.ref.toLowerCase().includes(expSearchQuery.toLowerCase())
  );

  // Selected Product & Stock Balance for Oversell Guardrail
  const selectedProduct = inventory.find(i => i.code === saleForm.itemCode) || inventory[0];
  const currentStockBalance = selectedProduct 
    ? (selectedProduct.awal + selectedProduct.masuk - selectedProduct.keluar) 
    : 0;
  const isOversell = Number(saleForm.qty) > currentStockBalance;

  // Add Sale Handler (With Stock Guardrails)
  const handleAddSale = (e) => {
    e.preventDefault();
    const product = inventory.find(i => i.code === saleForm.itemCode);
    if (!product) return;

    const availableStock = product.awal + product.masuk - product.keluar;
    const requestedQty = Number(saleForm.qty);

    if (requestedQty <= 0) {
      showToast('Amaran: Sila masukkan kuantiti jualan yang sah.');
      return;
    }

    // Stock Guardrails & Oversell Warning
    if (requestedQty > availableStock) {
      showToast(`Amaran: Kuantiti melebihi baki stok semasa (${availableStock} unit)!`);
      return;
    }

    const total = requestedQty * product.harga;
    const paid = Number(saleForm.depositPaid);
    const newSale = {
      id: Date.now(),
      date: saleForm.date,
      customer: saleForm.customer,
      itemCode: saleForm.itemCode,
      qty: requestedQty,
      price: product.harga,
      total: total,
      bayaran: paid,
      status: paid >= total ? 'Lunas' : 'Baki Hutang',
      method: saleForm.method,
      ref: `INV-2026-00${sales.length + 1}`
    };

    // 1. Deduct Stock in Inventory
    setInventory(prevInventory => prevInventory.map(item => 
      item.code === saleForm.itemCode ? { ...item, keluar: item.keluar + requestedQty } : item
    ));

    // 2. Add to Sales
    setSales(prevSales => [newSale, ...prevSales]);
    showToast(`Jualan ${newSale.ref} direkodkan! Stok ${product.name} dikemaskini.`);
    setSaleForm({ ...saleForm, customer: '', qty: 1, depositPaid: 0 });
  };

  // Add Expense Handler
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expForm.desc || !expForm.amount) return;

    const newId = Date.now();
    const count = expenses.length + 1;
    const newExp = {
      id: newId,
      date: expForm.date,
      category: expForm.category,
      desc: expForm.desc,
      amount: Number(expForm.amount),
      method: expForm.method,
      ref: `PV-00${count}`,
      voucherNo: `PV-2026-00${count}`,
      status: 'Dibayar'
    };

    setExpenses(prevExpenses => [newExp, ...prevExpenses]);
    setSelectedVoucherId(newId);
    showToast(`Perbelanjaan RM${newExp.amount.toFixed(2)} direkodkan! Baucar Bayaran dijana.`);
    setExpForm({ ...expForm, desc: '', amount: '' });
  };

  // Void Sale Handler (Don Norman & Jakob Nielsen Heuristic #3: Transaction Reversibility)
  const handleVoidSale = (saleId) => {
    const saleToVoid = sales.find(s => s.id === saleId);
    if (!saleToVoid) return;

    // Immediately restore deducted quantity back to the inventory item
    setInventory(prevInventory => prevInventory.map(item => {
      if (item.code === saleToVoid.itemCode) {
        return {
          ...item,
          keluar: Math.max(0, item.keluar - saleToVoid.qty)
        };
      }
      return item;
    }));

    // Remove sale from sales (automatically recalculates totalSales, debtors, grossProfit, netProfit)
    setSales(prevSales => prevSales.filter(s => s.id !== saleId));
    showToast(`Jualan ${saleToVoid.ref} telah di-Void! ${saleToVoid.qty} unit dipulangkan ke baki stok.`);
  };

  // Void Purchase Handler
  const handleVoidPurchase = (purchaseId) => {
    const purchaseToVoid = purchases.find(p => p.id === purchaseId);
    if (!purchaseToVoid) return;

    // Decrement corresponding stock from inventory if applicable
    setInventory(prevInventory => prevInventory.map(item => {
      if (item.code === purchaseToVoid.itemCode) {
        return {
          ...item,
          masuk: Math.max(0, item.masuk - purchaseToVoid.qty)
        };
      }
      return item;
    }));

    // Remove purchase from purchases (automatically updates creditors and P&L)
    setPurchases(prevPurchases => prevPurchases.filter(p => p.id !== purchaseId));
    showToast(`Belian ${purchaseToVoid.ref} telah di-Void! Stok masuk dilaraskan.`);
  };

  // Void Expense Handler
  const handleVoidExpense = (expId) => {
    const expToVoid = expenses.find(e => e.id === expId);
    if (!expToVoid) return;

    const remainingExpenses = expenses.filter(e => e.id !== expId);
    setExpenses(remainingExpenses);

    if (selectedVoucherId === expId) {
      setSelectedVoucherId(remainingExpenses.length > 0 ? remainingExpenses[0].id : null);
    }

    showToast(`Perbelanjaan ${expToVoid.voucherNo || expToVoid.ref} telah di-Void.`);
  };

  // Quick Status Edit Handlers
  const handleToggleSaleStatus = (saleId) => {
    setSales(prevSales => prevSales.map(s => {
      if (s.id === saleId) {
        const isLunas = s.status === 'Lunas';
        const newStatus = isLunas ? 'Baki Hutang' : 'Lunas';
        const newBayaran = isLunas ? 0 : s.total;
        showToast(`Status ${s.ref} ditukar ke "${newStatus}". Lejar Penghutang dikira semula.`);
        return { ...s, status: newStatus, bayaran: newBayaran };
      }
      return s;
    }));
  };

  const handleTogglePurchaseStatus = (purchaseId) => {
    setPurchases(prevPurchases => prevPurchases.map(p => {
      if (p.id === purchaseId) {
        const isLunas = p.status === 'Lunas';
        const newStatus = isLunas ? 'Baki Pemiutang' : 'Lunas';
        const newBayaran = isLunas ? 0 : p.total;
        showToast(`Status ${p.ref} ditukar ke "${newStatus}". Lejar Pemiutang dikira semula.`);
        return { ...p, status: newStatus, bayaran: newBayaran };
      }
      return p;
    }));
  };

  const handleToggleExpenseStatus = (expId) => {
    setExpenses(prevExpenses => prevExpenses.map(e => {
      if (e.id === expId) {
        const isPaid = (e.status || 'Dibayar') === 'Dibayar';
        const newStatus = isPaid ? 'Tertangguh' : 'Dibayar';
        showToast(`Status baucar ${e.voucherNo || e.ref} ditukar ke "${newStatus}".`);
        return { ...e, status: newStatus };
      }
      return e;
    }));
  };

  const currentVoucher = expenses.find(e => e.id === selectedVoucherId) || expenses[0] || null;

  const tabsList = [
    { id: 'jualan', label: t('tabSales'), icon: ShoppingBag },
    { id: 'belian', label: t('tabPurchases'), icon: Boxes },
    { id: 'perbelanjaan', label: t('tabExpenses'), icon: Wallet },
    { id: 'inventori', label: t('tabInventory'), icon: Layers },
    { id: 'penghutang', label: t('tabDebtors'), icon: Users },
    { id: 'voucher', label: t('tabVouchers'), icon: FileText },
    { id: 'laporan', label: t('tabReports'), icon: PieChart }
  ];

  const salesColumns = [
    { header: t('colRef'), accessor: 'ref', isMono: true },
    { header: t('colDate'), accessor: 'date' },
    { header: t('colCustomer'), accessor: 'customer' },
    { header: t('colQty'), accessor: 'qty', align: 'right', isMono: true },
    { header: t('colTotal'), accessor: 'total', align: 'right', isCurrency: true },
    { header: t('colPaid'), accessor: 'bayaran', align: 'right', isCurrency: true },
    { header: t('colPaymentMethod'), accessor: 'method' },
    { header: t('colStatus'), accessor: 'status', align: 'center', isStatus: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300">
      
      {/* DESKTOP SIDEBAR (Visible >= 768px) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 p-4 justify-between select-none print:hidden">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            
            {/* Branding */}
            <div>
              <div className="flex items-center gap-3 px-1 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight block truncate">
                      EziBiz Akaun
                    </span>
                    <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      XLS-Compliant
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    Financial Studio â€¢ SME
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (7 vertical tab navigation buttons) */}
            <nav className="space-y-1">
              {tabsList.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-400'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-sm shadow-emerald-500/50 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Desktop Sidebar Footer: Settings trigger (âš™ï¸) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 px-1">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer min-h-[44px]"
              title={t('settings')}
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{t('settings')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR (Visible < 768px) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight truncate">
            EziBiz Akaun
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t('settings')}
            title={t('settings')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0 pb-24 md:pb-8 py-6">
        <main className="flex-1 max-w-7xl w-full mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
          
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 kpi-row print:hidden">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('kpiGrossSales')}</span>
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">RM {totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{t('kpiGrossSalesSub')}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('kpiPurchases')}</span>
              <div className="text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">RM {totalPurchases.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{t('kpiPurchasesSub')}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('kpiExpenses')}</span>
              <div className="text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">RM {totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{t('kpiExpensesSub')}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('kpiInventoryValue')}</span>
              <div className="text-lg font-bold font-mono tabular-nums text-cyan-600 dark:text-cyan-300">RM {calculateTotalInventoryValue().toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{t('kpiInventoryValueSub')}</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('kpiNetProfit')}</span>
              <div className={`text-lg font-bold font-mono tabular-nums ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                RM {netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400/90 font-medium font-mono">{netProfit >= 0 ? t('kpiSurplus') : t('kpiDeficit')}</p>
            </div>
          </div>

        {/* TAB 1: JUALAN */}
        {activeTab === 'jualan' && (
          <div className="space-y-6">
            {/* Borang Tambah Jualan */}
            <form onSubmit={handleAddSale} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t('registerNewSale')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('registerNewSaleSub')}
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  Auto-Deduct Stock
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label htmlFor="sale-date" className="text-slate-700 dark:text-slate-300 font-medium">{t('colDate')}</label>
                  <input 
                    id="sale-date"
                    type="date"
                    value={saleForm.date}
                    onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="sale-customer" className="text-slate-700 dark:text-slate-300 font-medium">
                    {t('customerNameOrDetail')}
                  </label>
                  <input 
                    id="sale-customer"
                    type="text"
                    required
                    placeholder={t('customerPlaceholder')}
                    value={saleForm.customer}
                    onChange={(e) => setSaleForm({ ...saleForm, customer: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="sale-item" className="text-slate-700 dark:text-slate-300 font-medium">
                    {t('selectInventoryProduct')}
                  </label>
                  <select
                    id="sale-item"
                    value={saleForm.itemCode}
                    onChange={(e) => setSaleForm({ ...saleForm, itemCode: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="sale-qty" className="text-slate-700 dark:text-slate-300 font-medium">{t('colQty')}</label>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                      currentStockBalance <= (selectedProduct?.reorder || 0)
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                    }`}>
                      {t('currentBalance')}: {currentStockBalance} {selectedProduct?.unit || 'unit'}
                    </span>
                  </div>
                  <input 
                    id="sale-qty"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={saleForm.qty}
                    onChange={(e) => setSaleForm({ ...saleForm, qty: e.target.value })}
                    className={`w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border text-slate-900 dark:text-white text-base sm:text-xs transition-colors ${
                      isOversell 
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-500 dark:text-red-300' 
                        : 'border-slate-300 dark:border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                  />
                  {isOversell && (
                    <div className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 p-2 rounded-lg mt-1 animate-in fade-in">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                      <span>{t('warningExceedsStock', { balance: currentStockBalance })}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="sale-method" className="text-slate-700 dark:text-slate-300 font-medium">{t('colPaymentMethod')}</label>
                  <select
                    id="sale-method"
                    value={saleForm.method}
                    onChange={(e) => setSaleForm({ ...saleForm, method: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option>Maybank</option>
                    <option>CIMB Bank</option>
                    <option>Bank Islam</option>
                    <option>Tunai di Tangan</option>
                    <option>Kad Kredit / Stripe</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="sale-deposit" className="text-slate-700 dark:text-slate-300 font-medium">
                    {t('paymentDepositReceived')}
                  </label>
                  <input 
                    id="sale-deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    placeholder="0.00"
                    value={saleForm.depositPaid}
                    onChange={(e) => setSaleForm({ ...saleForm, depositPaid: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    disabled={isOversell || currentStockBalance <= 0 || Number(saleForm.qty) <= 0}
                    className="w-full py-2.5 sm:py-2 min-h-[44px] rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs transition-colors shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    {t('saveSalesRecord')}
                  </button>
                </div>
              </div>
            </form>

            {/* Jadual Jualan DataGrid Card */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-3 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>{t('salesLedgerTitle')}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {filteredSales.length} {t('recordsCount')}
                    </span>
                  </h4>
                  <span className="text-xs font-mono tabular-nums text-emerald-600 dark:text-emerald-400">Total: {formatRM(totalSales)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                    <input 
                      type="text"
                      aria-label="Cari pelanggan / rujukan"
                      placeholder={t('searchSalesPlaceholder')}
                      value={salesSearchQuery}
                      onChange={(e) => setSalesSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[31px] rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-base sm:text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full sm:w-56"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => exportToCSV(filteredSales, 'jualan_ezibiz')}
                    className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 min-h-[44px] rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-zinc-800 text-xs text-slate-700 dark:text-zinc-200 transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('exportCsv')}</span>
                  </button>
                </div>
              </div>

              <FinancialDataGrid 
                columns={salesColumns}
                data={filteredSales}
                onSelectRow={(row) => handleOpenDrawer(row, 'sale')}
                onVoidRow={(row) => setVoidTarget({ type: 'sale', item: row })}
                emptyMessage={salesSearchQuery ? t('noExpenseSearchFound', { query: salesSearchQuery }) : (language === 'ms' ? "Tiada rekod jualan aktif." : "No active sales records.")}
                t={t}
              />
            </div>
          </div>
        )}

        {/* TAB 2: BELIAN */}
        {activeTab === 'belian' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {language === 'ms' ? 'Buku Rekod Belian & Pembekal (Purchases Ledger)' : 'Supplier & Purchases Ledger'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ms' ? 'Belian stok masuk automatik meningkatkan baki inventori semasa.' : 'Incoming stock purchases automatically increase current inventory balance.'}
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">Total: {formatRM(totalPurchases)}</span>
              </div>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
                    <tr>
                      <th className="p-3.5">No. Ruj</th>
                      <th className="p-3.5">Tarikh</th>
                      <th className="p-3.5">Nama Pembekal</th>
                      <th className="p-3.5">Kod Produk</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Kuantiti</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Jumlah Belian</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Bayaran Dibuat</th>
                      <th className="p-3.5 text-center">Status Pemiutang</th>
                      <th className="p-3.5 text-center w-36">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-400 space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                              {language === 'ms' ? 'Tiada Rekod Belian Ditemui' : 'No Purchase Records Found'}
                            </p>
                            <p className="text-xs text-slate-500 max-w-sm">
                              {language === 'ms' ? 'Semua transaksi belian telah di-Void atau belum didaftarkan dalam lejar belian pembekal.' : 'All purchases have been voided or not yet registered.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      purchases.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                          <td className="p-3.5 font-mono text-slate-900 dark:text-white font-medium">{p.ref}</td>
                          <td className="p-3.5 text-slate-500 dark:text-slate-400">{p.date}</td>
                          <td className="p-3.5 text-slate-900 dark:text-white font-medium">{p.supplier}</td>
                          <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">{p.itemCode}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums">{p.qty} unit</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400 font-bold">RM {p.total.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">RM {p.bayaran.toFixed(2)}</td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              p.status === 'Lunas' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleTogglePurchaseStatus(p.id)}
                                title={p.status === 'Lunas' ? 'Tukar Status: Baki Pemiutang' : 'Tukar Status: Lunas'}
                                aria-label={`Tukar status belian ${p.ref}`}
                                className={`px-2.5 py-1.5 min-h-[44px] rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                  p.status === 'Lunas'
                                    ? 'border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                    : 'border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                }`}
                              >
                                {p.status === 'Lunas' ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Hutang</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Lunas</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setVoidTarget({ type: 'purchase', item: p })}
                                title="Batal Transaksi Belian (Void & Tolak Stok Masuk)"
                                aria-label={`Void belian ${p.ref}`}
                                className="p-2 min-h-[44px] min-w-[44px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-500/30 transition-colors inline-flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
                {purchases.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 dark:text-slate-400 text-xs">
                    {language === 'ms' ? 'Tiada Rekod Belian Ditemui' : 'No Purchase Records Found'}
                  </div>
                ) : (
                  purchases.map(p => (
                    <div key={p.id} className="p-4 space-y-3 bg-white dark:bg-slate-900/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{p.ref}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">â€¢ {p.date}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{p.supplier}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border flex-shrink-0 ${
                          p.status === 'Lunas' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Jumlah Belian</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">RM {p.total.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Bayaran Dibuat</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">RM {p.bayaran.toFixed(2)}</span>
                        </div>
                        <div className="col-span-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-900">
                          <span>Produk: </span><span className="font-mono text-slate-800 dark:text-slate-300">{p.itemCode}</span> ({p.qty} unit)
                        </div>
                      </div>

                      {/* Mobile Actions with comfortable 44px tap targets */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePurchaseStatus(p.id)}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors min-h-[44px] cursor-pointer ${
                            p.status === 'Lunas'
                              ? 'border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                              : 'border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                          }`}
                        >
                          {p.status === 'Lunas' ? (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Tukar: Hutang</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tukar: Lunas</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setVoidTarget({ type: 'purchase', item: p })}
                          aria-label={`Void belian ${p.ref}`}
                          className="px-4 py-2.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-500/30 transition-colors min-h-[44px] flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Void</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERBELANJAAN */}
        {activeTab === 'perbelanjaan' && (
          <div className="space-y-6">
            <form onSubmit={handleAddExpense} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {language === 'ms' ? 'Daftar Perbelanjaan Operasi (OPEX)' : 'Record Operating Expense (OPEX)'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label htmlFor="exp-date" className="text-slate-700 dark:text-slate-300 font-medium">{t('colDate')}</label>
                  <input 
                    id="exp-date"
                    type="date"
                    value={expForm.date}
                    onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="exp-category" className="text-slate-700 dark:text-slate-300 font-medium">
                    {language === 'ms' ? 'Kategori Perbelanjaan (Ezi-Akaun)' : 'Expense Category'}
                  </label>
                  <select
                    id="exp-category"
                    value={expForm.category}
                    onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                  <label htmlFor="exp-desc" className="text-slate-700 dark:text-slate-300 font-medium">
                    {language === 'ms' ? 'Keterangan / Butiran' : 'Description / Remarks'}
                  </label>
                  <input 
                    id="exp-desc"
                    type="text"
                    required
                    placeholder={language === 'ms' ? 'e.g. Pembelian toner dan kertas pencetak A4' : 'e.g. Office stationery & printer cartridges'}
                    value={expForm.desc}
                    onChange={(e) => setExpForm({ ...expForm, desc: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label htmlFor="exp-amount" className="text-slate-700 dark:text-slate-300 font-medium">
                    {language === 'ms' ? 'Jumlah Bayaran (RM)' : 'Payment Amount (RM)'}
                  </label>
                  <input 
                    id="exp-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    required
                    placeholder="0.00"
                    value={expForm.amount}
                    onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs font-mono focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="exp-method" className="text-slate-700 dark:text-slate-300 font-medium">{t('colPaymentMethod')}</label>
                  <select
                    id="exp-method"
                    value={expForm.method}
                    onChange={(e) => setExpForm({ ...expForm, method: e.target.value })}
                    className="w-full px-3 py-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-base sm:text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
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
                    className="w-full py-2.5 sm:py-2 min-h-[44px] rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    {language === 'ms' ? 'Rekod Perbelanjaan' : 'Record Expense'}
                  </button>
                </div>
              </div>
            </form>

            {/* Jadual Perbelanjaan */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {language === 'ms' ? 'Buku Rekod Perbelanjaan (Expense Ledger)' : 'Expense Ledger Records'}
                  </h4>
                  <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">Total: {formatRM(totalExpenses)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                    <input 
                      type="text"
                      aria-label="Cari keterangan / kategori"
                      placeholder={language === 'ms' ? 'Cari keterangan / kategori...' : 'Search description / category...'}
                      value={expSearchQuery}
                      onChange={(e) => setExpSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[31px] rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-base sm:text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 w-full sm:w-56"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => exportToCSV(filteredExpenses, 'perbelanjaan_ezibiz')}
                    className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 min-h-[44px] rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>{t('exportCsv')}</span>
                  </button>
                </div>
              </div>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
                    <tr>
                      <th className="p-3.5">Tarikh</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Keterangan</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Jumlah</th>
                      <th className="p-3.5">Kaedah</th>
                      <th className="p-3.5 font-mono">No. Baucar</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-center w-36">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-400 space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                              <DollarSign className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                              {language === 'ms' ? 'Tiada Rekod Perbelanjaan Ditemui' : 'No Expense Records Found'}
                            </p>
                            <p className="text-xs text-slate-500 max-w-sm">
                              {language === 'ms' ? 'Semua rekod perbelanjaan telah di-Void. Gunakan borang di atas untuk mendaftar perbelanjaan operasi syarikat yang baharu.' : 'All expenses have been voided. Use the form above to register new operational expenses.'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-400 space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                              <Search className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                              {language === 'ms' ? 'Tiada padanan carian' : 'No Matching Records'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                              {language === 'ms' ? `Tiada rekod perbelanjaan ditemui untuk "${expSearchQuery}". Sila semak ejaan atau tetapkan semula carian.` : `No records found for "${expSearchQuery}". Please check spelling or reset search.`}
                            </p>
                            <button
                              type="button"
                              onClick={() => setExpSearchQuery('')}
                              className="px-3 py-2 min-h-[44px] rounded-lg bg-rose-50 dark:bg-red-600/20 text-rose-700 dark:text-red-300 border border-rose-200 dark:border-red-500/30 text-xs font-medium hover:bg-rose-100 dark:hover:bg-red-600/30 transition-colors mt-2 cursor-pointer"
                            >
                              {language === 'ms' ? 'Set Semula Carian' : 'Reset Search'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map(e => (
                        <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                          <td className="p-3.5 text-slate-500 dark:text-slate-400">{e.date}</td>
                          <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-medium">{e.category}</td>
                          <td className="p-3.5 text-slate-900 dark:text-white">{e.desc}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-rose-600 dark:text-red-400 font-bold">RM {e.amount.toFixed(2)}</td>
                          <td className="p-3.5 text-slate-500 dark:text-slate-400">{e.method}</td>
                          <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{e.voucherNo}</td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                              (e.status || 'Dibayar') === 'Dibayar'
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400'
                            }`}>
                              {e.status || 'Dibayar'}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleExpenseStatus(e.id)}
                                title={(e.status || 'Dibayar') === 'Dibayar' ? 'Tukar Status: Tertangguh' : 'Tukar Status: Dibayar'}
                                aria-label={`Tukar status baucar ${e.voucherNo}`}
                                className={`px-2.5 py-1.5 min-h-[44px] rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                  (e.status || 'Dibayar') === 'Dibayar'
                                    ? 'border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                    : 'border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                }`}
                              >
                                {(e.status || 'Dibayar') === 'Dibayar' ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Tangguh</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Dibayar</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setVoidTarget({ type: 'expense', item: e })}
                                title="Batal Perbelanjaan (Void & Padam dari OPEX)"
                                aria-label={`Void perbelanjaan ${e.voucherNo}`}
                                className="p-2 min-h-[44px] min-w-[44px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-500/30 transition-colors inline-flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
                {expenses.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 dark:text-slate-400 text-xs">
                    {language === 'ms' ? 'Tiada Rekod Perbelanjaan Ditemui' : 'No Expense Records Found'}
                  </div>
                ) : filteredExpenses.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                    {language === 'ms' ? `Tiada rekod perbelanjaan ditemui untuk "${expSearchQuery}".` : `No records found for "${expSearchQuery}".`}
                  </div>
                ) : (
                  filteredExpenses.map(e => (
                    <div key={e.id} className="p-4 space-y-3 bg-white dark:bg-slate-900/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{e.voucherNo}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">â€¢ {e.date}</span>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{e.category}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border flex-shrink-0 ${
                          (e.status || 'Dibayar') === 'Dibayar'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          {e.status || 'Dibayar'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-200">{e.desc}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Jumlah Bayaran</span>
                          <span className="font-mono font-bold text-rose-600 dark:text-red-400 text-sm">RM {e.amount.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Kaedah Pembayaran</span>
                          <span className="text-slate-800 dark:text-slate-200">{e.method}</span>
                        </div>
                      </div>

                      {/* Mobile Actions with comfortable 44px tap targets */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleToggleExpenseStatus(e.id)}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors min-h-[44px] cursor-pointer ${
                            (e.status || 'Dibayar') === 'Dibayar'
                              ? 'border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                              : 'border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                          }`}
                        >
                          {(e.status || 'Dibayar') === 'Dibayar' ? (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Tukar: Tangguh</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tukar: Dibayar</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setVoidTarget({ type: 'expense', item: e })}
                          aria-label={`Void perbelanjaan ${e.voucherNo}`}
                          className="px-4 py-2.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-500/30 transition-colors min-h-[44px] flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Void</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORI */}
        {activeTab === 'inventori' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-950/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {language === 'ms' ? 'Trek Rekod Inventori (Stok Siap & Bahan Mentah)' : 'Inventory Records (Finished Goods & Materials)'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ms' ? 'Baki Stok = Stok Awal + Stok Masuk - Stok Keluar | Nilaian = Baki Ã— Kos' : 'Balance = Opening + In - Out | Valuation = Balance Ã— Cost'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 font-bold">
                    {language === 'ms' ? 'Nilaian Keseluruhan' : 'Total Valuation'}: RM {calculateTotalInventoryValue().toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
                    <tr>
                      <th className="p-3.5">Kod</th>
                      <th className="p-3.5">Nama Produk / Bahan</th>
                      <th className="p-3.5">Jenis</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Stok Awal</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Masuk (In)</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Keluar (Out)</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Baki Stok</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Kos / Unit</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Harga Jual</th>
                      <th className="p-3.5 text-right font-mono tabular-nums">Nilaian Semasa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {inventory.map(item => {
                      const baki = item.awal + item.masuk - item.keluar;
                      const nilaian = baki * item.kos;
                      const isLow = baki <= item.reorder;
                      return (
                        <tr key={item.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                          <td className="p-3.5 font-mono text-slate-900 dark:text-white font-medium">{item.code}</td>
                          <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                          <td className="p-3.5 text-slate-500 dark:text-slate-400">{item.category}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">{item.awal}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">+{item.masuk}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-rose-600 dark:text-red-400">-{item.keluar}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center justify-end gap-1.5">
                              <span>{baki} {item.unit}</span>
                              {isLow && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                                  {language === 'ms' ? 'Rendah' : 'Low'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">RM {item.kos.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">RM {item.harga.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono tabular-nums text-cyan-700 dark:text-cyan-300 font-bold">RM {nilaian.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
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
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {language === 'ms' ? 'Rekod Penghutang (Pelanggan Belum Bayar)' : 'Debtors Ledger (Accounts Receivable)'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ms' ? 'Baki hutang jualan yang perlu dituntut.' : 'Outstanding customer balances to be collected.'}
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                  Baki: RM {calculateTotalDebtors().toFixed(2)}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {sales.filter(s => s.total > s.bayaran).length === 0 ? (
                  <div className="p-6 text-center text-slate-400 dark:text-slate-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400/80 mx-auto" />
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                      {language === 'ms' ? 'Tiada Baki Penghutang Tertunggak' : 'No Outstanding Debtors'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {language === 'ms' ? 'Semua invois jualan pelanggan telah dijelaskan sepenuhnya (Lunas).' : 'All sales invoices have been paid in full.'}
                    </p>
                  </div>
                ) : (
                  sales.filter(s => s.total > s.bayaran).map(s => (
                    <div key={s.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{s.customer}</p>
                        <p className="text-slate-500 dark:text-slate-400">{s.ref} â€¢ {s.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-rose-600 dark:text-red-400 font-mono font-bold">
                          {language === 'ms' ? 'Hutang' : 'Due'}: RM {(s.total - s.bayaran).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-500">{language === 'ms' ? 'Jumlah' : 'Total'}: RM {s.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rekod Pemiutang (AP) */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {language === 'ms' ? 'Rekod Pemiutang (Hutang Kepada Pembekal)' : 'Creditors Ledger (Accounts Payable)'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ms' ? 'Baki belian yang perlu dibayar kepada supplier.' : 'Outstanding purchase bills to be paid to suppliers.'}
                  </p>
                </div>
                <span className="text-xs font-mono text-rose-600 dark:text-red-400 font-bold">
                  Baki: RM {calculateTotalCreditors().toFixed(2)}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {purchases.filter(p => p.total > p.bayaran).length === 0 ? (
                  <div className="p-6 text-center text-slate-400 dark:text-slate-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400/80 mx-auto" />
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                      {language === 'ms' ? 'Tiada Baki Pemiutang Tertunggak' : 'No Outstanding Creditors'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {language === 'ms' ? 'Semua belian pembekal telah dijelaskan sepenuhnya.' : 'All supplier purchases have been settled in full.'}
                    </p>
                  </div>
                ) : (
                  purchases.filter(p => p.total > p.bayaran).map(p => (
                    <div key={p.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{p.supplier}</p>
                        <p className="text-slate-500 dark:text-slate-400">{p.ref} â€¢ {p.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-rose-600 dark:text-red-400 font-mono font-bold">
                          {language === 'ms' ? 'Perlu Bayar' : 'Payable'}: RM {(p.total - p.bayaran).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-500">{language === 'ms' ? 'Jumlah' : 'Total'}: RM {p.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT VOUCHER */}
        {activeTab === 'voucher' && (
          <div className="voucher-container-grid grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2 voucher-sidebar no-print print:hidden">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'ms' ? 'Pilih Baucar Bayaran' : 'Select Payment Voucher'}
              </span>
              <div className="space-y-2 text-xs" role="tablist" aria-label="Pilih Baucar Bayaran">
                {expenses.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs shadow-sm">
                    {language === 'ms' ? 'Tiada baucar bayaran' : 'No payment vouchers'}
                  </div>
                ) : (
                  expenses.map(e => (
                    <button
                      key={e.id}
                      type="button"
                      role="tab"
                      aria-selected={selectedVoucherId === e.id}
                      onClick={() => setSelectedVoucherId(e.id)}
                      className={`text-left w-full focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none p-3.5 rounded-xl border cursor-pointer transition-all min-h-[44px] ${
                        selectedVoucherId === e.id 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-slate-900 dark:text-white shadow-sm' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{e.voucherNo}</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatRM(e.amount)}</span>
                      </div>
                      <p className="truncate mt-1 text-slate-600 dark:text-slate-300">{e.desc}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Official Printable Voucher Display */}
            {currentVoucher ? (
              <div className="lg:col-span-8 rounded-2xl bg-white text-slate-900 p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-xl border border-slate-200 printable-voucher overflow-x-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-300 pb-4 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight voucher-header-title">{COMPANY_INFO.name}</h3>
                    <p className="text-xs text-slate-600">{COMPANY_INFO.address}</p>
                    <p className="text-xs text-slate-600">{COMPANY_INFO.contact}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xl font-extrabold text-slate-900">BAUCAR BAYARAN</span>
                    <p className="text-xs font-mono text-slate-600 font-semibold">{currentVoucher.voucherNo}</p>
                    <p className="text-xs text-slate-500">Tarikh: {currentVoucher.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border border-slate-200 p-4 rounded-lg bg-slate-50">
                  <div>
                    <span className="text-slate-500 font-medium">Dibayar Kepada / Kategori:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{currentVoucher.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Kaedah / Bank:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{currentVoucher.method}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 min-w-[340px]">
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
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-2">
                  <span className="text-xs text-slate-500">Ringgit Malaysia: Sah diperakui untuk audit syarikat.</span>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-medium text-slate-600">JUMLAH KESELURUHAN:</span>
                    <span className="text-xl font-bold font-mono text-slate-900 ml-2">RM {currentVoucher.amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Signature Blocks */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-8 sm:pt-12 border-t border-slate-200 text-center text-xs">
                  <div>
                    <div className="border-b border-slate-400 mb-2"></div>
                    <p className="font-semibold text-slate-800 text-[11px] sm:text-xs">Disediakan Oleh</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Kerani / Akaun</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 mb-2"></div>
                    <p className="font-semibold text-slate-800 text-[11px] sm:text-xs">Diluluskan Oleh</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Pengurus / Pengarah</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 mb-2"></div>
                    <p className="font-semibold text-slate-800 text-[11px] sm:text-xs">Diterima Oleh</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Penerima Bayaran</p>
                  </div>
                </div>

                <div className="pt-2 text-right no-print print:hidden">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors inline-flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{language === 'ms' ? 'Cetak Baucar Bayaran' : 'Print Payment Voucher'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 space-y-3 shadow-sm">
                <FileText className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {language === 'ms' ? 'Tiada Baucar Bayaran Disediakan' : 'No Payment Voucher Available'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {language === 'ms' 
                    ? 'Semua rekod perbelanjaan telah di-Void. Sila daftarkan perbelanjaan baharu di tab Perbelanjaan untuk menjana baucar rasmi.'
                    : 'All expense records have been voided. Please register a new expense in the Expenses tab to generate a voucher.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PENYATA KEWANGAN (P&L & KUNCI KIRA-KIRA) */}
        {activeTab === 'laporan' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Penyata Untung Rugi (P&L) */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Penyata Kewangan</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Penyata Untung Rugi (P&L)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bagi tempoh berakhir 31 Disember 2026</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                  <span>Jualan Bersih</span>
                  <span className="font-mono">RM {totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 pl-3">
                  <span>(-) Kos Belian & Pengeluaran Stok</span>
                  <span className="font-mono">RM {totalPurchases.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                  <span>UNTUNG KASAR</span>
                  <span className="font-mono">RM {grossProfit.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-300">Tolak: Perbelanjaan Operasi</span>
                  <div className="space-y-1.5 mt-2 pl-3 text-slate-600 dark:text-slate-400">
                    {expenses.length === 0 ? (
                      <p className="text-slate-400 dark:text-slate-400 italic text-xs py-1">Tiada perbelanjaan operasi direkodkan.</p>
                    ) : (
                      expenses.map(e => (
                        <div key={e.id} className="flex justify-between">
                          <span>{e.category} ({e.desc})</span>
                          <span className="font-mono">RM {e.amount.toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-semibold text-rose-600 dark:text-red-400">
                  <span>Jumlah Perbelanjaan</span>
                  <span className="font-mono">RM {totalExpenses.toFixed(2)}</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-900 dark:text-white">UNTUNG BERSIH SEMASA</span>
                  <span className={`font-mono text-base ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-red-400'}`}>
                    RM {netProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Kunci Kira-Kira (Balance Sheet) */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold uppercase">Imbangan Kunci Kira-Kira</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Kunci Kira-Kira (Balance Sheet)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Persamaan Perakaunan: Aset = Liabiliti + Ekuiti Pemilik</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Aset Semasa</span>
                  <div className="pl-3 mt-1 space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Stok Akhir Inventori</span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-300">{formatRM(stockValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penghutang Dagangan</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">{formatRM(receivables)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Baki Bank & Tunai di Tangan</span>
                      <span className="font-mono">{formatRM(cashInBank)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-cyan-700 dark:text-cyan-300">
                  <span>JUMLAH ASET</span>
                  <span className="font-mono">{formatRM(assets)}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-white">Liabiliti & Ekuiti Pemilik</span>
                  <div className="pl-3 mt-1 space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Pemiutang Dagangan (Hutang Supplier)</span>
                      <span className="font-mono text-rose-600 dark:text-red-400">{formatRM(payables)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modal Awal Pemilik</span>
                      <span className="font-mono">{formatRM(capital)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Untung Bersih Terkumpul</span>
                      <span className="font-mono">{formatRM(retainedEarnings)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>JUMLAH LIABILITI & EKUITI</span>
                  <span className="font-mono">{formatRM(liabilitiesAndEquity)}</span>
                </div>

                <div className="pt-1">
                  {balanced ? (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex justify-between items-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>âœ“ Imbang Tepat</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 flex justify-between items-center text-xs font-bold text-amber-700 dark:text-amber-300">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Selisih: {formatRM(assets - liabilitiesAndEquity)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
      </div>

      {/* Confirmation Modal for Voiding Actions (Don Norman & Jakob Nielsen Heuristic #3: Error Recovery & User Control) */}
      {voidTarget && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 no-print modal-backdrop print:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setVoidTarget(null);
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Sahkan Pembatalan Transaksi (Void)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kawalan Pengguna & Pemulihan Ralat
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVoidTarget(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Adakah anda pasti mahu membatalkan (Void) rekod ini? Data transaksi akan dilaraskan semula secara automatik:
              </p>

              {/* Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Jenis Transaksi:</span>
                  <span className="font-semibold text-slate-900 dark:text-white uppercase font-mono">
                    {voidTarget.type === 'sale' ? 'Jualan (Sales)' : voidTarget.type === 'purchase' ? 'Belian (Purchases)' : 'Perbelanjaan (OPEX)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">No. Rujukan / Baucar:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {voidTarget.item.ref || voidTarget.item.voucherNo}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Pihak / Keterangan:</span>
                  <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
                    {voidTarget.item.customer || voidTarget.item.supplier || voidTarget.item.desc}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Jumlah Nilai:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">
                    RM {(voidTarget.item.total || voidTarget.item.amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Impact Alert */}
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 text-[11px] space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-red-700 dark:text-red-400">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Kesan Pembalikan Transaksi:
                </p>
                {voidTarget.type === 'sale' && (
                  <p className="text-slate-700 dark:text-slate-300">
                    Kuantiti <strong className="text-slate-900 dark:text-white">{voidTarget.item.qty} unit</strong> akan dikembalikan semula ke baki stok <span className="font-mono text-emerald-600 dark:text-emerald-400">{voidTarget.item.itemCode}</span>, dan lejar jualan serta penghutang akan dilaraskan.
                  </p>
                )}
                {voidTarget.type === 'purchase' && (
                  <p className="text-slate-700 dark:text-slate-300">
                    Kuantiti <strong className="text-slate-900 dark:text-white">{voidTarget.item.qty} unit</strong> stok masuk akan ditolak daripada inventori <span className="font-mono text-amber-600 dark:text-amber-400">{voidTarget.item.itemCode}</span>, dan lejar pemiutang serta kos belian akan dikurangkan.
                  </p>
                )}
                {voidTarget.type === 'expense' && (
                  <p className="text-slate-700 dark:text-slate-300">
                    Perbelanjaan bernilai <strong className="text-slate-900 dark:text-white">RM {voidTarget.item.amount.toFixed(2)}</strong> akan dipadam daripada Lejar OPEX, Baucar Bayaran, dan Penyata Untung Rugi (P&L).
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={() => setVoidTarget(null)}
                className="px-4 py-2.5 min-h-[44px] rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Batal (Esc)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (voidTarget.type === 'sale') {
                    handleVoidSale(voidTarget.item.id);
                  } else if (voidTarget.type === 'purchase') {
                    handleVoidPurchase(voidTarget.item.id);
                  } else if (voidTarget.type === 'expense') {
                    handleVoidExpense(voidTarget.item.id);
                  }
                  setVoidTarget(null);
                }}
                className="px-4 py-2.5 min-h-[44px] rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/20 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sahkan Batal (Void)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible < 768px) */}
      <nav 
        aria-label="Mobile Bottom Navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 h-16 pb-[env(safe-area-inset-bottom)] flex items-center justify-around px-2 shadow-lg transition-colors print:hidden"
      >
        {[
          { id: 'jualan', label: t('tabSales'), icon: ShoppingBag },
          { id: 'belian', label: t('tabPurchases'), icon: Boxes },
          { id: 'perbelanjaan', label: t('tabExpenses'), icon: Wallet },
          { id: 'inventori', label: t('tabInventory'), icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-0 transition-colors cursor-pointer ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 truncate max-w-[64px]">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}

        {/* 5th Tab: More (â‹¯) Trigger */}
        <button
          type="button"
          onClick={() => setShowMoreDrawer(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-0 transition-colors cursor-pointer ${
            ['penghutang', 'voucher', 'laporan'].includes(activeTab) || showMoreDrawer
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-1 truncate max-w-[64px]">
            {language === 'ms' ? 'Lain-lain' : 'More'}
          </span>
        </button>
      </nav>

      {/* MOBILE MORE DRAWER (Slide-up Bottom Sheet) */}
      {showMoreDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end md:hidden animate-in fade-in duration-200 print:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMoreDrawer(false);
          }}
        >
          <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
            {/* Drawer Handle */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ms' ? 'Menu & Laporan Lanjut' : 'More Menu & Reports'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'ms' ? 'Modul lanjutan & tetapan sistem' : 'Advanced modules & settings'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreDrawer(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { 
                  id: 'penghutang', 
                  label: t('tabDebtors'), 
                  icon: Users,
                  desc: language === 'ms' ? 'Lejar belum terima (AR) & belum bayar (AP)' : 'Accounts receivable & accounts payable'
                },
                { 
                  id: 'voucher', 
                  label: t('tabVouchers'), 
                  icon: FileText,
                  desc: language === 'ms' ? 'Jana & cetak baucar bayaran rasmi' : 'Official payment vouchers'
                },
                { 
                  id: 'laporan', 
                  label: t('tabReports'), 
                  icon: PieChart,
                  desc: language === 'ms' ? 'Penyata Untung Rugi & Kunci Kira-Kira' : 'P&L and Balance Sheet'
                }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleTabChange(item.id);
                      setShowMoreDrawer(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all min-h-[48px] cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Settings Trigger Item */}
              <button
                type="button"
                onClick={() => {
                  setShowMoreDrawer(false);
                  setShowSettingsModal(true);
                }}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all min-h-[48px] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs block">{t('settings')}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {language === 'ms' ? 'Tukar tema, bahasa & konfigurasi syarikat' : 'Change theme, language & company config'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (() => {
        const isWarning = toastMessage.startsWith('Amaran:');
        const isError = toastMessage.startsWith('Error:') || toastMessage.startsWith('Ralat:');

        return (
          <div 
            role="status" 
            aria-live="polite"
            className={`fixed bottom-20 md:bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 toast-notification no-print print:hidden ${
              isError
                ? 'bg-slate-900 border border-rose-500/40 text-rose-300'
                : isWarning
                ? 'bg-slate-900 border border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isError ? (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : isWarning ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage}</span>
          </div>
        );
      })()}

      {/* SLIDE-OUT VOUCHER & INVOICE DRAWER */}
      <VoucherDrawer 
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState(prev => ({ ...prev, isOpen: false }))}
        record={drawerState.record}
        type={drawerState.type}
      />

      {/* UNIFIED SETTINGS MODAL */}
      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
    </div>
  );
}

