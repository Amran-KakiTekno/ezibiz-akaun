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
  Copy, 
  ExternalLink, 
  Zap, 
  ShieldAlert, 
  Sliders, 
  BellRing, 
  FileText, 
  TrendingUp,
  CreditCard,
  Building2,
  Trash2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [toastMessage, setToastMessage] = useState('');
  
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // State for Invoices
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2041',
      client: 'Apex Creative Studio',
      amount: 2450.00,
      dueDate: 'Today',
      status: 'due',
      dunningStage: 'Stage 2 (Due Date Reminder)',
      phone: '+1 (555) 392-1049'
    },
    {
      id: 'INV-2038',
      client: 'Kroma Digital Ltd',
      amount: 3800.00,
      dueDate: '4 days ago',
      status: 'overdue',
      dunningStage: 'Stage 3 (SMS Nudge Sent)',
      phone: '+1 (555) 847-2291'
    },
    {
      id: 'INV-2031',
      client: 'Vanguard Logistics',
      amount: 6200.00,
      dueDate: '12 days ago',
      status: 'overdue',
      dunningStage: 'Stage 4 (+2% Late Fee Applied)',
      phone: '+1 (555) 710-4482'
    },
    {
      id: 'INV-2040',
      client: 'Solstice Media',
      amount: 1400.00,
      dueDate: 'Paid (Yesterday)',
      status: 'paid',
      dunningStage: 'Settled via Apple Pay',
      phone: '+1 (555) 293-8810'
    }
  ]);

  // Dunning Cadence Rules
  const [dunningRules, setDunningRules] = useState([
    {
      id: 1,
      trigger: '3 Days Before Due',
      channel: 'Email',
      subject: 'Upcoming Invoice #INV-XXXX',
      body: 'Hi {first_name}, just a friendly courtesy notice that invoice #{invoice_num} for ${amount} is due in 3 days. Pay with 1-click here: {payment_link}',
      enabled: true
    },
    {
      id: 2,
      trigger: 'On Due Date (09:00 AM)',
      channel: 'Email + SMS',
      subject: 'Invoice #INV-XXXX is Due Today',
      body: 'Good morning {first_name}! Your invoice #{invoice_num} is due today. Complete payment in seconds via card or Apple Pay: {payment_link}',
      enabled: true
    },
    {
      id: 3,
      trigger: '3 Days Overdue',
      channel: 'SMS Priority',
      subject: 'Payment Reminder',
      body: 'Quick reminder: Invoice #{invoice_num} is now 3 days past due. Please settle today to avoid late fees: {payment_link}',
      enabled: true
    },
    {
      id: 4,
      trigger: '7 Days Overdue',
      channel: 'Email + SMS',
      subject: 'Urgent: Overdue Notice + Late Fee Applied',
      body: 'Hi {first_name}, invoice #{invoice_num} is 7 days overdue. A 2% late fee has been assessed. Settle balance now: {payment_link}',
      enabled: true
    }
  ]);

  // Invoice Creator Form State
  const [newClient, setNewClient] = useState('');
  const [newTerms, setNewTerms] = useState('Net 15');
  const [lineItems, setLineItems] = useState([
    { desc: 'Brand Design Retainer', qty: 1, rate: 2500 }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { desc: '', qty: 1, rate: 0 }]);
  };

  const removeLineItem = (idx) => {
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  const updateLineItem = (idx, field, val) => {
    const updated = [...lineItems];
    updated[idx][field] = val;
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (Number(item.qty) * Number(item.rate)), 0);
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newClient) return;
    const inv = {
      id: `INV-${Math.floor(2045 + Math.random() * 50)}`,
      client: newClient,
      amount: calculateSubtotal(),
      dueDate: 'Due in 15 days',
      status: 'due',
      dunningStage: 'Stage 1 (Pending)',
      phone: '+1 (555) 000-0000'
    };
    setInvoices([inv, ...invoices]);
    setNewClient('');
    setActiveTab('invoices');
    showToast(`Invoice ${inv.id} created! Dunning cadence activated.`);
  };

  // Bank Match State
  const [bankFeeds, setBankFeeds] = useState([
    { id: 101, sender: 'Apex Creative Studio LLC', amount: 2450.00, date: 'Today, 10:14 AM', matchedInv: 'INV-2041', confidence: '99%' },
    { id: 102, sender: 'Kroma Digital Corp', amount: 3800.00, date: 'Yesterday, 04:30 PM', matchedInv: 'INV-2038', confidence: '98%' }
  ]);

  const handleReconcile = (feedId, invId) => {
    setBankFeeds(bankFeeds.filter(b => b.id !== feedId));
    setInvoices(invoices.map(inv => inv.id === invId ? { ...inv, status: 'paid', dunningStage: 'Auto-Reconciled from Bank Feed' } : inv));
    showToast(`Payment matched to ${invId}! General Ledger auto-balanced.`);
  };

  const handleTriggerNudge = (invId, client) => {
    showToast(`Automated SMS nudge & payment link sent to ${client}!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a 
              href="https://bizops-portal-86i.pages.dev" 
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hub</span>
            </a>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">BizOps Invoicing</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Module 1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>
            <a 
              href="https://github.com/Amran-KakiTekno/bizops-invoicing" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Aging Receivables</span>
            <div className="text-xl font-bold font-mono text-amber-400">$12,450.00</div>
            <p className="text-[11px] text-slate-500">2 invoices currently overdue</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Auto-Collected (30d)</span>
            <div className="text-xl font-bold font-mono text-emerald-400">$32,400.00</div>
            <p className="text-[11px] text-emerald-500 font-medium">100% Zero-touch settlement</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Average Days to Pay</span>
            <div className="text-xl font-bold font-mono text-white">8.2 Days</div>
            <p className="text-[11px] text-indigo-400 font-medium">Down from 34.0 days</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Dunning Recovery Rate</span>
            <div className="text-xl font-bold font-mono text-indigo-300">94.2%</div>
            <p className="text-[11px] text-slate-500">Paid within 7 days of nudge</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 text-xs">
          {[
            { id: 'invoices', label: 'Invoices & Aging AR' },
            { id: 'dunning', label: 'Automated Dunning Rules' },
            { id: 'create', label: 'Zero-Click Invoice Creator' },
            { id: 'bank', label: 'Bank Feed Auto-Matcher' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-emerald-500 text-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Invoices Table */}
        {activeTab === 'invoices' && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Accounts Receivable Ledger</h3>
                <p className="text-xs text-slate-400">Automated dunning handles all follow-ups via scheduled SMS/Email links.</p>
              </div>
              <span className="text-xs font-mono text-slate-500">Auto-Dunning Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Dunning Automation Stage</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-mono text-white font-medium">{inv.id}</td>
                      <td className="p-3.5 font-medium text-slate-200">{inv.client}</td>
                      <td className="p-3.5 font-mono text-white font-semibold">${inv.amount.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-400">{inv.dueDate}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          inv.status === 'paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          inv.status === 'overdue' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{inv.dunningStage}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(`https://pay.bizops.link/${inv.id}`);
                              showToast(`Payment link for ${inv.id} copied!`);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Copy 1-Click Payment Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {inv.status !== 'paid' && (
                            <button
                              onClick={() => handleTriggerNudge(inv.id, inv.client)}
                              className="px-2.5 py-1 rounded bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-[11px] font-medium flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Nudge</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Dunning Rules */}
        {activeTab === 'dunning' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="text-sm font-semibold text-white">Automated Progressive Dunning Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Remove emotional awkwardness from cash collection. The engine dispatches courteous, calibrated nudges at strategic intervals with tokenized payment links.
              </p>
            </div>

            <div className="space-y-4">
              {dunningRules.map((rule, idx) => (
                <div key={rule.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-xs text-white">{rule.trigger}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {rule.channel}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-300 font-mono">{rule.subject}</p>
                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                      {rule.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const updated = [...dunningRules];
                        updated[idx].enabled = !updated[idx].enabled;
                        setDunningRules(updated);
                        showToast(`Rule ${idx + 1} ${updated[idx].enabled ? 'Enabled' : 'Disabled'}`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        rule.enabled 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {rule.enabled ? 'Active Rule' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Create Invoice */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateInvoice} className="max-w-2xl mx-auto rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white">Generate Instant Invoice</h3>
              <p className="text-xs text-slate-400">Zero manual bookkeeping. Generates 1-click Apple Pay & Card payment link.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Client / Company Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Payment Terms</label>
                <select 
                  value={newTerms} 
                  onChange={(e) => setNewTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Due Upon Receipt</option>
                  <option>Net 15 Days</option>
                  <option>Net 30 Days</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-medium">Line Items</label>
              {lineItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <input 
                    type="text"
                    placeholder="Description"
                    value={item.desc}
                    onChange={(e) => updateLineItem(idx, 'desc', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                  <input 
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => updateLineItem(idx, 'qty', e.target.value)}
                    className="w-16 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                  <input 
                    type="number"
                    min="0"
                    placeholder="Rate ($)"
                    value={item.rate}
                    onChange={(e) => updateLineItem(idx, 'rate', e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                  {lineItems.length > 1 && (
                    <button type="button" onClick={() => removeLineItem(idx)} className="p-2 text-red-400 hover:bg-slate-800 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={addLineItem}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Due:</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                ${calculateSubtotal().toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg shadow-emerald-600/20"
            >
              Issue Invoice & Activate Dunning
            </button>
          </form>
        )}

        {/* Tab 4: Bank Reconciler */}
        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <h3 className="text-sm font-semibold text-white">Automated Bank Feed Matcher</h3>
              <p className="text-xs text-slate-400">
                Live Plaid/Banking webhook listener matching incoming wire/ACH deposits to open invoices with zero manual data entry.
              </p>
            </div>

            <div className="space-y-3">
              {bankFeeds.map(feed => (
                <div key={feed.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-white">{feed.sender}</span>
                      <span className="font-mono text-emerald-400 font-bold">+${feed.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-slate-400">Received: {feed.date}</p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px]">
                      <Zap className="w-3 h-3 text-indigo-400" />
                      <span>AI Match: {feed.matchedInv} ({feed.confidence} Confidence)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReconcile(feed.id, feed.matchedInv)}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Balance Ledger</span>
                  </button>
                </div>
              ))}

              {bankFeeds.length === 0 && (
                <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <span>All bank transactions matched and reconciled! Zero variance.</span>
                </div>
              )}
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

