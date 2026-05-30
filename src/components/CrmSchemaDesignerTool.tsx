import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Download, 
  HelpCircle, 
  X, 
  Settings, 
  Sliders, 
  BookOpen, 
  UserPlus, 
  LineChart, 
  ChevronRight, 
  ListRestart, 
  Check, 
  GitFork, 
  AlertCircle,
  FileCode,
  Sparkles,
  Info
} from 'lucide-react';

interface CRMField {
  id: string;
  name: string;
  category: 'Contact' | 'Demographic' | 'Behavioral' | 'Psychographic' | 'Geographic' | 'Custom';
  type: 'text' | 'number' | 'email' | 'date' | 'tel' | 'url' | 'textarea' | 'formula';
}

interface RFMRule {
  score: number;
  operator: '<=' | '>=' | '<' | '>';
  value: number;
  label: string;
}

interface RFMConfig {
  recency: RFMRule[];
  frequency: RFMRule[];
  monetary: RFMRule[];
}

interface CrmSchemaDesignerToolProps {
  onCalculateRun: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Demographic: { bg: 'bg-blue-50/80', text: 'text-blue-700', border: 'border-blue-150' },
  Psychographic: { bg: 'bg-purple-50/80', text: 'text-purple-700', border: 'border-purple-150' },
  Geographic: { bg: 'bg-teal-50/80', text: 'text-teal-700', border: 'border-teal-150' },
  Behavioral: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-150' },
  Contact: { bg: 'bg-slate-50/80', text: 'text-slate-700', border: 'border-slate-150' },
  Custom: { bg: 'bg-pink-50/80', text: 'text-pink-700', border: 'border-pink-150' }
};

const TEMPLATES: Record<string, CRMField[]> = {
  basic: [
    { id: 'f_fname', name: 'First Name', category: 'Contact', type: 'text' },
    { id: 'f_lname', name: 'Last Name', category: 'Contact', type: 'text' },
    { id: 'f_email', name: 'Email Address', category: 'Contact', type: 'email' },
    { id: 'f_phone', name: 'Phone Number', category: 'Contact', type: 'tel' }
  ],
  sales: [
    { id: 'f_company', name: 'Company Name', category: 'Demographic', type: 'text' },
    { id: 'f_contact', name: 'Key Contact Group', category: 'Contact', type: 'text' },
    { id: 'f_status', name: 'Lead Status', category: 'Behavioral', type: 'text' },
    { id: 'f_value', name: 'Estimated Deal Value', category: 'Custom', type: 'number' }
  ],
  marketing: [
    { id: 'f_persona', name: 'Persona Group Segment', category: 'Demographic', type: 'text' },
    { id: 'f_source', name: 'Acquisition Source Channel', category: 'Behavioral', type: 'text' },
    { id: 'f_interests', name: 'Customer Core Interests', category: 'Psychographic', type: 'textarea' }
  ],
  rfm: [
    { id: 'rfm_raw_r', name: 'Days Since Last Order', category: 'Behavioral', type: 'number' },
    { id: 'rfm_raw_f', name: 'Total Order Count', category: 'Behavioral', type: 'number' },
    { id: 'rfm_raw_m', name: 'Total Lifetime Spend', category: 'Behavioral', type: 'number' },
    { id: 'rfm_score_r', name: 'R Score (Formula)', category: 'Behavioral', type: 'formula' },
    { id: 'rfm_score_f', name: 'F Score (Formula)', category: 'Behavioral', type: 'formula' },
    { id: 'rfm_score_m', name: 'M Score (Formula)', category: 'Behavioral', type: 'formula' },
    { id: 'rfm_segment', name: 'RFM Segment (Formula)', category: 'Behavioral', type: 'formula' }
  ]
};

export default function CrmSchemaDesignerTool({ onCalculateRun }: CrmSchemaDesignerToolProps) {
  const [schema, setSchema] = useState<CRMField[]>([]);
  const [fieldName, setFieldName] = useState('');
  const [fieldCategory, setFieldCategory] = useState<CRMField['category']>('Contact');
  const [fieldType, setFieldType] = useState<CRMField['type']>('text');

  // RFM Rules Engine State
  const [rfmConfig, setRfmConfig] = useState<RFMConfig>({
    recency: [
      { score: 5, operator: '<=', value: 30, label: '30 Days or less' },
      { score: 4, operator: '<=', value: 60, label: '60 Days or less' },
      { score: 3, operator: '<=', value: 90, label: '90 Days or less' },
      { score: 2, operator: '<=', value: 180, label: '6 Months or less' },
      { score: 1, operator: '>', value: 180, label: 'More than 6 Months' } 
    ],
    frequency: [
      { score: 5, operator: '>=', value: 10, label: '10+ Orders' },
      { score: 4, operator: '>=', value: 5, label: '5-9 Orders' },
      { score: 3, operator: '>=', value: 3, label: '3-4 Orders' },
      { score: 2, operator: '>=', value: 2, label: '2 Orders' },
      { score: 1, operator: '>=', value: 0, label: '0-1 Orders' } 
    ],
    monetary: [
      { score: 5, operator: '>=', value: 1000, label: '$1000+' },
      { score: 4, operator: '>=', value: 500, label: '$500+' },
      { score: 3, operator: '>=', value: 200, label: '$200+' },
      { score: 2, operator: '>=', value: 50, label: '$50+' },
      { score: 1, operator: '>=', value: 0, label: 'Under $50' } 
    ]
  });

  // Modal displays
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);
  const [rfmModalOpen, setRfmModalOpen] = useState(false);
  
  // Custom toast notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Trigger LocalStorage recovery
  useEffect(() => {
    const savedSchema = localStorage.getItem('crm_schema_designer_v2');
    const savedRfm = localStorage.getItem('crm_rfm_rules');
    
    if (savedSchema) {
      setSchema(JSON.parse(savedSchema));
    } else {
      setSchema([...TEMPLATES.basic]);
    }

    if (savedRfm) {
      setRfmConfig(JSON.parse(savedRfm));
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    const key = 'f_' + Math.random().toString(36).substring(2, 11);
    const updated = [...schema, { 
      id: key, 
      name: fieldName.trim(), 
      category: fieldCategory, 
      type: fieldType 
    }];

    setSchema(updated);
    localStorage.setItem('crm_schema_designer_v2', JSON.stringify(updated));
    setFieldName('');
    onCalculateRun();
    showToast(`Kolom "${fieldName.trim()}" berhasil ditambahkan ke skema.`);
  };

  const handleRemoveField = (id: string, name: string) => {
    const updated = schema.filter(f => f.id !== id);
    setSchema(updated);
    localStorage.setItem('crm_schema_designer_v2', JSON.stringify(updated));
    onCalculateRun();
    showToast(`Kolom "${name}" telah dihapus.`);
  };

  const handleLoadTemplate = (key: string) => {
    const isAddon = key === 'rfm';

    if (!isAddon && schema.length > 0) {
      if (!window.confirm(`Perhatian: Memuat template "${key}" akan menggantikan skema saat ini.\nApakah Anda yakin ingin melanjutkan?`)) {
        return;
      }
    }

    const templateFields = TEMPLATES[key].map(field => {
      // For RFM, keep specific fixed keys, otherwise make randomized keys
      if (key === 'rfm') return field;
      return { ...field, id: 'f_' + Math.random().toString(36).substring(2, 11) };
    });

    if (isAddon) {
      const hasRfm = schema.some(f => f.id === 'rfm_score_r');
      if (hasRfm) {
        showToast('Kolom analisis RFM sudah ditambahkan sebelumnya.', 'error');
        return;
      }
      const updated = [...schema, ...templateFields];
      setSchema(updated);
      localStorage.setItem('crm_schema_designer_v2', JSON.stringify(updated));
      showToast('Kolom RFM berhasil diluncurkan ke skema.');
    } else {
      setSchema(templateFields);
      localStorage.setItem('crm_schema_designer_v2', JSON.stringify(templateFields));
      showToast(`Berhasil memuat skema template ${key}.`);
    }
    onCalculateRun();
  };

  const [copied, setCopied] = useState(false);

  const copyAiAnalysisPrompt = () => {
    let schemaDetails = "";
    if (schema.length === 0) {
      schemaDetails = "The custom schema is currently empty.";
    } else {
      schema.forEach((field, index) => {
        schemaDetails += `- Column **${getColLetter(index)}**: "${field.name}" (Type: ${field.type}, Category: ${field.category}, ID: ${field.id})\n`;
      });
    }

    let rfmRulesStr = "\n### RFM Category Configuration Rules:\n";
    rfmRulesStr += "#### Recency (days or less for score):\n";
    rfmConfig.recency.forEach(rule => {
      rfmRulesStr += `- Score ${rule.score}: ${rule.operator} ${rule.value} days (${rule.label})\n`;
    });
    rfmRulesStr += "#### Frequency (orders or count for score):\n";
    rfmConfig.frequency.forEach(rule => {
      rfmRulesStr += `- Score ${rule.score}: ${rule.operator} ${rule.value} times (${rule.label})\n`;
    });
    rfmRulesStr += "#### Monetary (lifetime value/spend for score):\n";
    rfmConfig.monetary.forEach(rule => {
      rfmRulesStr += `- Score ${rule.score}: ${rule.operator} ${rule.value} spend (${rule.label})\n`;
    });

    const promptText = `I have designed a custom CRM Database Schema and configured specialized RFM (Recency, Frequency, Monetary) Scoring Rules. Here is my configuration:

### Custom Database Columns:
${schemaDetails}
${rfmRulesStr}
Please act as an elite CRM Database Developer and Customer Analytics Consultant. Analyze this database design and:
1. Provide a rigorous appraisal of the schema. Are there any critical customer entity attributes missing for general commercial growth operations (B2B/B2C)?
2. Audit the custom RFM rules I've defined. Are the threshold boundaries commercially balanced, and what strategies should be deployed for the high scorers (Loyalists 555) vs lowest scores (Churn Risks)?
3. Draft the exact SQL CREATE TABLE queries and indexes corresponding to this custom schema for MySQL or PostgreSQL databases.
4. Recommend how to query the database to calculate real-time cohort analysis reports based on this dataset.`;

    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const clearSchema = () => {
    if (!window.confirm('Apakah Anda yakin ingin mengosongkan SELURUH rancangan skema? Tindakan ini tidak dapat dibatalkan.')) return;
    setSchema([]);
    localStorage.removeItem('crm_schema_designer_v2');
    onCalculateRun();
    showToast('Seluruh skema rancangan telah berhasil dikosongkan.', 'success');
  };

  // Helper converter for indices into column headers (e.g., A, B, C... AA, AB)
  const getColLetter = (index: number): string => {
    if (index < 0) return '';
    let letter = '';
    while (index >= 0) {
      let remainder = index % 26;
      letter = String.fromCharCode(remainder + 65) + letter;
      index = Math.floor(index / 26) - 1;
    }
    return letter;
  };

  // Build spreadsheet standard IF formula based on user configurations
  const generateSpreadsheetFormula = (rules: RFMRule[], cellRef: string): string => {
    let formula = '=';
    let closingParentheses = '';
    
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (i === rules.length - 1) {
        formula += rule.score;
      } else {
        formula += `IF(${cellRef}${rule.operator}${rule.value}, ${rule.score}, `;
        closingParentheses += ')';
      }
    }
    return formula + closingParentheses;
  };

  // Download functional CRM Sheets spreadsheet template
  const handleDownloadSheetTemplate = () => {
    if (schema.length === 0) {
      showToast('Kehabisan target: Silakan tambahkan kolom terlebih dahulu.', 'error');
      return;
    }

    const headers = schema.map(f => f.name);

    // Dynamic second row carrying actual spreadsheet calculations
    const formulaRow = schema.map((field, idx) => {
      if (field.id === 'rfm_score_r') {
        const rawIdx = schema.findIndex(f => f.id === 'rfm_raw_r');
        return rawIdx !== -1 
          ? generateSpreadsheetFormula(rfmConfig.recency, `${getColLetter(rawIdx)}2`) 
          : 'Error: Days Raw column was not found';
      }
      if (field.id === 'rfm_score_f') {
        const rawIdx = schema.findIndex(f => f.id === 'rfm_raw_f');
        return rawIdx !== -1 
          ? generateSpreadsheetFormula(rfmConfig.frequency, `${getColLetter(rawIdx)}2`) 
          : 'Error: Orders Raw column was not found';
      }
      if (field.id === 'rfm_score_m') {
        const rawIdx = schema.findIndex(f => f.id === 'rfm_raw_m');
        return rawIdx !== -1 
          ? generateSpreadsheetFormula(rfmConfig.monetary, `${getColLetter(rawIdx)}2`) 
          : 'Error: Spend Raw column was not found';
      }
      if (field.id === 'rfm_segment') {
        const rIdx = schema.findIndex(f => f.id === 'rfm_score_r');
        const fIdx = schema.findIndex(f => f.id === 'rfm_score_f');
        const mIdx = schema.findIndex(f => f.id === 'rfm_score_m');
        if (rIdx !== -1 && fIdx !== -1 && mIdx !== -1) {
          return `=CONCATENATE(${getColLetter(rIdx)}2, ${getColLetter(fIdx)}2, ${getColLetter(mIdx)}2)`;
        }
        return 'Error: Scores not found';
      }
      return ''; // Text fields or generic parameters are empty as standard
    });

    const rows = [headers];
    const hasFormulas = formulaRow.some(cell => String(cell).startsWith('='));
    
    if (hasFormulas) {
      rows.push(formulaRow);
    }

    // CSV generator helper
    const csvContent = rows.map(row => 
      row.map(cell => {
        const val = cell === null || cell === undefined ? '' : String(cell);
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',')
    ).join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CRM_Sheet_Template_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Berhasil mengunduh template Google Sheets berisi rumus.');
    
    // Auto-prompt Sheets Help to assist user workflow setup
    setTimeout(() => {
      setSheetsModalOpen(true);
    }, 800);
  };

  const handleDownloadDataDictionary = () => {
    if (schema.length === 0) {
      showToast('Data skema masih kosong.', 'error');
      return;
    }

    const headers = ['Nama Kolom', 'Kategori Data', 'Jenis Tipe Data', 'Kunci ID Internal'];
    const rows = schema.map(f => [f.name, f.category, f.type, f.id]);
    
    const csvContent = [headers, ...rows].map(row => 
      row.map(cell => {
        const val = cell === null || cell === undefined ? '' : String(cell);
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',')
    ).join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CRM_Data_Dictionary_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Katalog kamus data skema berhasil diunduh.');
  };

  const handleSaveRFMRules = (updatedRules: RFMConfig) => {
    setRfmConfig(updatedRules);
    localStorage.setItem('crm_rfm_rules', JSON.stringify(updatedRules));
    setRfmModalOpen(false);
    onCalculateRun();
    showToast('Parameter batasan nilai RFM berhasil diperbarui.');
  };

  return (
    <div className="space-y-6 text-left relative font-sans w-full select-none selection:bg-indigo-150">
      
      {/* Dynamic Toast Notification Panel */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-40 animate-fadeIn flex items-center gap-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-4 max-w-sm transition-all">
          <div className={`p-1 rounded-full text-white ${toastType === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            <Check className="h-3.5 w-3.5 stroke-[3px]" />
          </div>
          <span className="text-xs font-semibold leading-relaxed tracking-wide text-slate-100">{toastMessage}</span>
        </div>
      )}

      {/* Title Header Section Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400">
            Advanced Schema Architect
          </span>
          <h3 className="font-display font-black text-lg lg:text-xl text-white mt-1">
            CRM Database Schema & RFM Formula Designer
          </h3>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Rancang kolom database pelanggan CRM secara spesifik berdasarkan kategori data, lalu kustomisasikan logika parameter RFM (Recency, Frequency, Monetary). Unduh file Sheets otomatis yang menyematkan relasi rumus IF dinamis demi efisiensi operasional harian.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
          <Database className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-300">Designer Active</span>
        </div>
      </div>

      {/* Parent Adaptive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Adding custom fields Form, and quick launching templates */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-6 self-stretch">
          
          <div className="space-y-6">
            
            {/* Adding manual Custom Fields */}
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-indigo-500" />
                Tambah Kolom Kustom
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Buat identitas kolom database khusus yang disesuaikan dengan kebutuhan analisis internal retail Anda.
              </p>

              <form onSubmit={handleAddField} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-450 text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                    Nama Atribut Kolom
                  </label>
                  <input 
                    type="text" 
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder="Contoh: Metode Akuisisi, Kategori Loyalitas..." 
                    required
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-350 focus:outline-none transition-shadow bg-slate-50/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-450 text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                      Kategori Data
                    </label>
                    <select
                      value={fieldCategory}
                      onChange={(e) => setFieldCategory(e.target.value as any)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-350 focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="Contact">Contact Info</option>
                      <option value="Demographic">Demographic</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="Psychographic">Psychographic</option>
                      <option value="Geographic">Geographic</option>
                      <option value="Custom">Custom Data</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-450 text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                      Tipe Input Data
                    </label>
                    <select
                      value={fieldType}
                      onChange={(e) => setFieldType(e.target.value as any)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-350 focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="text">Text (String)</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="date">Date</option>
                      <option value="tel">Phone No.</option>
                      <option value="url">Link URL</option>
                      <option value="textarea">Long Text</option>
                      <option value="formula">Formula Column</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 cursor-pointer shadow-xs hover:shadow-sm active:translate-y-px transition-all duration-150"
                >
                  <Plus className="h-4 w-4 stroke-[2.5px]" />
                  <span>Tambahkan Kolom baru</span>
                </button>
              </form>
            </div>

            {/* Quick Templates Workspace deployment */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-505 text-indigo-500" />
                Template Skema Cepat
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadTemplate('basic')}
                  className="flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-[11px] font-bold text-slate-700 hover:text-slate-900 duration-150"
                >
                  <span className="truncate">Contact Basic</span>
                  <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadTemplate('sales')}
                  className="flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-[11px] font-bold text-slate-700 hover:text-slate-900 duration-150"
                >
                  <span className="truncate">B2B Enterprise</span>
                  <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadTemplate('marketing')}
                  className="flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all cursor-pointer text-[11px] font-bold text-slate-700 hover:text-slate-900 duration-150"
                >
                  <span className="truncate">ICP Marketing</span>
                  <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadTemplate('rfm')}
                  className="flex items-center justify-between text-left p-2.5 rounded-xl border border-indigo-150 bg-indigo-50/20 hover:bg-indigo-50/40 transition-all cursor-pointer text-[11px] font-bold text-indigo-8o0 text-indigo-700 duration-150"
                  title="Tambahkan 3 kolom raw input + 4 kolom formula RFM otomatis!"
                >
                  <span className="truncate flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-indigo-500" />
                    Analisis RFM
                  </span>
                  <Plus className="h-3 w-3 text-indigo-500 shrink-0" />
                </button>
              </div>
            </div>

            {/* Configure RFM rules parameters shortcut block */}
            <div className="bg-indigo-50/30 border border-indigo-150 p-4 rounded-xl space-y-2.5">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase tracking-widest leading-none">
                    Logika Rumus RFM
                  </span>
                  <p className="text-[11px] text-slate-500 leading-tight mt-1.5">
                    Modifikasi parameter, rentang hari, kuantiti order, atau batas saldo keuangan yang memicu nilai skor otomatis (1-5).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRfmModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-indigo-250 border-indigo-200 bg-white hover:bg-indigo-50/30 text-xs font-bold text-indigo-700 transition-colors cursor-pointer"
              >
                <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                <span>Atur Parameter RFM</span>
              </button>
            </div>

          </div>

          <div className="border-t border-slate-100 pt-4 shrink-0 space-y-2">
            <button
              onClick={clearSchema}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 hover:bg-red-50/40 text-red-650 hover:text-red-750 text-red-650 text-xs font-bold transition-all cursor-pointer text-red-600 border-red-100"
            >
              <ListRestart className="h-3.5 w-3.5 text-red-500" />
              <span>Reset & Kosongkan Skema</span>
            </button>
          </div>

        </div>

        {/* Right Side: Main canvas data table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between self-stretch overflow-hidden min-h-[460px]">
          
          <div className="flex-1 flex flex-col">
            
            {/* Header / Active status controls bar */}
            <div className="border-b border-slate-200/80 bg-slate-50/80 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-mono leading-none font-bold text-slate-550 text-slate-500 uppercase tracking-widest mt-0.5">
                  Visual Schema Canvas ({schema.length} Kolom Dibuat)
                </span>
              </div>

              {/* Action buttons list */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={copyAiAnalysisPrompt}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 animate-none' 
                      : 'bg-amber-500 hover:bg-amber-400 text-white shadow-xs hover:shadow-md animate-pulse'
                  }`}
                  title="Salin prompt analisis AI berdasarkan konfigurasi skema dan aturan RFM saat ini"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{copied ? 'Prompt Copied!' : 'Analyze with AI'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDataDictionary}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 text-xs font-bold transition-colors cursor-pointer text-slate-600"
                >
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                  <span>Kamus Data Dictionary</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSheetTemplate}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
                  title="Unduh templat .csv untuk Google Sheets yang sudah berisi formula dinamis"
                >
                  <FileSpreadsheet className="h-4 w-4 shrink-0" />
                  <span>Unduh Sheet dengan Rumus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSheetsModalOpen(true)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50/50 text-indigo-600 cursor-pointer text-xs"
                  title="Panduan Google Sheets"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List Table Content */}
            <div className="flex-1 overflow-x-auto">
              {schema.length === 0 ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
                  <Database className="h-10 w-10 text-indigo-400 opacity-40 mb-3" />
                  <h4 className="font-display font-extrabold text-sm text-slate-700">Skema kolom masih kosong</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Mulai dengan meluncurkan atribut kustom dari panel sebelah kiri atau pasang sekumpulan skema utuh dari salah satu tombol template operasional cepat.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse table-fixed select-text whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      {/* Left space for row number */}
                      <th className="w-12 bg-slate-150 border-r border-b border-slate-300 text-center font-mono text-[10px] font-bold text-slate-500 py-3 select-none">
                        
                      </th>
                      {schema.map((field, index) => (
                        <th 
                          key={field.id} 
                          className="px-4 py-3 border-r border-b border-slate-300 relative group min-w-[200px] max-w-[250px] bg-slate-100/90 hover:bg-slate-200/80 transition-colors select-none"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-mono leading-none font-bold text-slate-450">
                                {getColLetter(index)}
                              </span>
                              <span className="text-xs font-bold text-slate-800 truncate mt-1.5" title={field.name}>
                                {field.name}
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleRemoveField(field.id, field.name)}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded transition-all cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                              title={`Hapus kolom ${field.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* Row 1: Meta/Types (Row label "1") */}
                    <tr className="hover:bg-slate-50/45 transition-colors">
                      <td className="w-12 bg-slate-100 border-r border-slate-250 text-center font-mono text-[10px] font-bold text-slate-400 py-3.5 select-none">
                        1
                      </td>
                      {schema.map((field) => {
                        const color = CATEGORY_COLORS[field.category] || CATEGORY_COLORS.Custom;
                        const isFormula = field.type === 'formula';
                        return (
                          <td key={field.id} className="px-4 py-3 border-r border-slate-200 bg-slate-50/40 min-w-[200px]">
                            <div className="flex flex-col gap-1.5">
                              <span className={`px-2 py-0.5 inline-flex text-[9px] font-extrabold tracking-wide rounded border ${color.bg} ${color.text} ${color.border} w-fit`}>
                                {field.category}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                {isFormula ? (
                                  <>
                                    <FileCode className="h-3.5 w-3.5 text-indigo-500" />
                                    Formula
                                  </>
                                ) : (
                                  field.type
                                )}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 2: Formula / Interactive preview (Row label "2") */}
                    <tr className="hover:bg-slate-50/45 transition-colors">
                      <td className="w-12 bg-slate-100 border-r border-slate-250 text-center font-mono text-[10px] font-bold text-slate-400 py-3 select-none">
                        2
                      </td>
                      {schema.map((field) => {
                        let cellContent = (
                          <span className="text-slate-300 italic text-[11px] font-mono">
                            [Masukkan Data...]
                          </span>
                        );
                        
                        if (field.id === 'rfm_score_r') {
                          const rawIdx = schema.findIndex(f => f.id === 'rfm_raw_r');
                          const formStr = rawIdx !== -1 
                            ? generateSpreadsheetFormula(rfmConfig.recency, `${getColLetter(rawIdx)}2`) 
                            : 'Missing Raw Recency';
                          cellContent = (
                            <div 
                              className="text-indigo-700 font-mono text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-1 rounded w-full select-all font-semibold break-all leading-normal text-left"
                              title={formStr}
                            >
                              {formStr}
                            </div>
                          );
                        } else if (field.id === 'rfm_score_f') {
                          const rawIdx = schema.findIndex(f => f.id === 'rfm_raw_f');
                          const formStr = rawIdx !== -1 
                            ? generateSpreadsheetFormula(rfmConfig.frequency, `${getColLetter(rawIdx)}2`) 
                            : 'Missing Raw Frequency';
                          cellContent = (
                            <div 
                              className="text-indigo-700 font-mono text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-1 rounded w-full select-all font-semibold break-all leading-normal text-left"
                              title={formStr}
                            >
                              {formStr}
                            </div>
                          );
                        } else if (field.id === 'rfm_score_m') {
                          const rawIdx = schema.findIndex(f => f.id === 'rfm_raw_m');
                          const formStr = rawIdx !== -1 
                            ? generateSpreadsheetFormula(rfmConfig.monetary, `${getColLetter(rawIdx)}2`) 
                            : 'Missing Raw Monetary';
                          cellContent = (
                            <div 
                              className="text-indigo-700 font-mono text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-1 rounded w-full select-all font-semibold break-all leading-normal text-left"
                              title={formStr}
                            >
                              {formStr}
                            </div>
                          );
                        } else if (field.id === 'rfm_segment') {
                          const rIdx = schema.findIndex(f => f.id === 'rfm_score_r');
                          const fIdx = schema.findIndex(f => f.id === 'rfm_score_f');
                          const mIdx = schema.findIndex(f => f.id === 'rfm_score_m');
                          const formStr = (rIdx !== -1 && fIdx !== -1 && mIdx !== -1)
                            ? `=CONCATENATE(${getColLetter(rIdx)}2, ${getColLetter(fIdx)}2, ${getColLetter(mIdx)}2)`
                            : 'Missing Scores';
                          cellContent = (
                            <div 
                              className="text-indigo-700 font-mono text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-1 rounded w-full select-all font-semibold break-all leading-normal text-left"
                              title={formStr}
                            >
                              {formStr}
                            </div>
                          );
                        } else if (field.type === 'formula') {
                          cellContent = (
                            <div className="text-slate-600 font-mono text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded w-full text-left">
                              =KustomFormula()
                            </div>
                          );
                        }

                        return (
                          <td key={field.id} className="px-4 py-3 border-r border-slate-200 min-w-[200px] max-w-[250px]">
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Empty simulated list: Rows 3 to 7 */}
                    {[3, 4, 5, 6, 7].map((rowNum) => (
                      <tr key={rowNum} className="hover:bg-slate-50/20 transition-colors">
                        <td className="w-12 bg-slate-100 border-r border-slate-250 text-center font-mono text-[10px] font-bold text-slate-400 py-3.5 select-none">
                          {rowNum}
                        </td>
                        {schema.map((field) => (
                          <td key={field.id} className="px-4 py-3.5 border-r border-slate-100 min-w-[200px]">
                            <div className="h-3 w-full bg-slate-50/60 rounded-sm border border-dashed border-slate-200/50"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

          {/* Quick Informational footer matching standard layouts */}
          {schema.some(f => f.type === 'formula') && (
            <div className="bg-slate-50/50 px-5 py-3 text-xs text-slate-500 border-t border-slate-100 flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-indigo-500" />
              <span>Sistem mendeteksi kolom berjenis <strong>Formula</strong> terpasang. Unduhlah format <strong>Sheet dengan Rumus</strong> agar relasi penghitungan kalkulasi RFM melekat otomatis di spreadsheet Excel/Google Sheets Anda.</span>
            </div>
          )}

        </div>

      </div>

      {/* --- MODAL 1: GOOGLE SHEETS STEP-BY-STEP HELP --- */}
      {sheetsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-left space-y-5 animate-slideUp">
            
            <div className="flex justify-between items-start border-b border-slate-150 pb-3 mb-1">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-500">How to Setup</span>
                <h3 className="font-display font-black text-slate-900 text-base">Panduan Penggunaan Spreadsheet dengan Rumus</h3>
              </div>
              <button
                type="button"
                onClick={() => setSheetsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-4 leading-relaxed">
              <p>Mekanisme parameter formula nested-IF pemicu otomatisasi RFM telah tertanam langsung ke dalam berkas unduhan CSV ekspor.</p>
              
              <div className="p-4 rounded-xl border border-emerald-150 bg-emerald-50/30 space-y-3">
                <span className="text-xs font-bold font-mono text-emerald-800 block">Langkah Konfigurasi Impor</span>
                <ol className="list-decimal list-inside space-y-2 text-emerald-950">
                  <li>Klik tombol <strong className="text-emerald-900">“Unduh Sheet dengan Rumus”</strong> di dashboard utama.</li>
                  <li>Buka browser dan buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="underline font-bold text-emerald-700 hover:text-emerald-800">sheets.new</a> untuk membuat halaman spreadsheet kosong Google Sheets yang baru.</li>
                  <li>Lakukan impor berkas: Pilih <strong className="font-bold text-emerald-900">File &gt; Import</strong> lalu unggah dokumen CSV skema yang baru saja diunduh.</li>
                  <li>
                    <strong className="font-bold text-emerald-900">Perhatikan Baris (Row):</strong>
                    <div className="mt-1 pl-4 text-[11px] text-slate-600">
                      • <strong>Row 1:</strong> Berisi header nama atribut data.<br/>
                      • <strong>Row 2:</strong> Adalah baris berisi logika pengolahan Rumus.
                    </div>
                  </li>
                  <li>
                    <strong className="font-bold text-emerald-900">Cara Pengoperasian:</strong> Masukkan data mentah konsumen pada kolom raw input yang bersesuaian, lalu <strong>drag / seret ujung kanan bawah sel rumus di Row 2</strong> ke bawah untuk melakukan kalkulasi baris berikutnya secara instan!
                  </li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSheetsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 2: INTERACTIVE CUSTOM RFM PARAMETER BUILDER --- */}
      {rfmModalOpen && (
        <RFMParameterBuilderModal 
          config={rfmConfig}
          onClose={() => setRfmModalOpen(false)}
          onSave={handleSaveRFMRules}
        />
      )}

    </div>
  );
}

// Inner Modal component to keep the file modular & clean
interface BuilderModalProps {
  config: RFMConfig;
  onClose: () => void;
  onSave: (updated: RFMConfig) => void;
}

function RFMParameterBuilderModal({ config, onClose, onSave }: BuilderModalProps) {
  const [localRecency, setLocalRecency] = useState<RFMRule[]>([...config.recency]);
  const [localFrequency, setLocalFrequency] = useState<RFMRule[]>([...config.frequency]);
  const [localMonetary, setLocalMonetary] = useState<RFMRule[]>([...config.monetary]);

  const handleRecencyChange = (idx: number, field: keyof RFMRule, val: any) => {
    const updated = [...localRecency];
    updated[idx] = { ...updated[idx], [field]: val };
    setLocalRecency(updated);
  };

  const handleFrequencyChange = (idx: number, field: keyof RFMRule, val: any) => {
    const updated = [...localFrequency];
    updated[idx] = { ...updated[idx], [field]: val };
    setLocalFrequency(updated);
  };

  const handleMonetaryChange = (idx: number, field: keyof RFMRule, val: any) => {
    const updated = [...localMonetary];
    updated[idx] = { ...updated[idx], [field]: val };
    setLocalMonetary(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      recency: localRecency,
      frequency: localFrequency,
      monetary: localMonetary
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto animate-fadeIn py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 text-left space-y-5 animate-slideUp max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-start border-b border-slate-150 pb-3 mb-1 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-505 text-indigo-500">Threshold Settings</span>
            <h3 className="font-display font-black text-slate-900 text-base">Modifikasi Aturan Logika Pencapaian Nilai RFM</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Recency Threshold Settings Section */}
          <div className="space-y-3.5 bg-blue-50/40 border border-blue-150 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-850 text-blue-800">1. Recency Score thresholds (Durasi Hari Sejak Order Terakhir)</span>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 py-0.5 px-2 rounded-md">Input: Nilai Hari</span>
            </div>
            
            <div className="grid grid-cols-5 gap-3.5">
              {localRecency.map((rule, idx) => {
                const isLast = idx === localRecency.length - 1;
                return (
                  <div key={idx} className="bg-white border border-blue-150 shadow-xs rounded-xl p-3 flex flex-col items-center justify-between text-center min-w-0">
                    <span className="text-lg font-black text-blue-500">⭐ {rule.score}</span>
                    <span className="text-[9px] font-mono text-slate-450 block mt-1">Skor target</span>
                    
                    {!isLast ? (
                      <div className="mt-3 flex items-center gap-1.5 w-full">
                        <span className="text-[10px] font-bold font-mono text-slate-400">{rule.operator}</span>
                        <input 
                          type="number" 
                          value={rule.value} 
                          onChange={(e) => handleRecencyChange(idx, 'value', Number(e.target.value))}
                          className="w-full text-center font-bold text-xs bg-slate-50 border border-slate-200 focus:border-blue-400 rounded-md py-1 px-1 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic font-medium mt-4">Otherwise</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Frequency Threshold Settings Section */}
          <div className="space-y-3.5 bg-purple-50/40 border border-purple-150 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-850 text-purple-800">2. Frequency Score thresholds (Jumlah Total Transaksi Order Hari Ini)</span>
              <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 py-0.5 px-2 rounded-md">Input: Kuantiti</span>
            </div>
            
            <div className="grid grid-cols-5 gap-3.5">
              {localFrequency.map((rule, idx) => {
                const isLast = idx === localFrequency.length - 1;
                return (
                  <div key={idx} className="bg-white border border-purple-150 shadow-xs rounded-xl p-3 flex flex-col items-center justify-between text-center min-w-0">
                    <span className="text-lg font-black text-purple-500">⭐ {rule.score}</span>
                    <span className="text-[9px] font-mono text-slate-450 block mt-1">Skor target</span>
                    
                    {!isLast ? (
                      <div className="mt-3 flex items-center gap-1.5 w-full">
                        <span className="text-[10px] font-bold font-mono text-slate-400">{rule.operator}</span>
                        <input 
                          type="number" 
                          value={rule.value} 
                          onChange={(e) => handleFrequencyChange(idx, 'value', Number(e.target.value))}
                          className="w-full text-center font-bold text-xs bg-slate-50 border border-slate-200 focus:border-purple-400 rounded-md py-1 px-1 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic font-medium mt-4">Otherwise</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monetary Threshold Settings Section */}
          <div className="space-y-3.5 bg-teal-50/40 border border-teal-150 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-850 text-teal-850 text-teal-800">3. Monetary Score thresholds (Nilai Kontribusi Pendapatan / IDR Equivalent)</span>
              <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 py-0.5 px-2 rounded-md">Input: Dollar/Unit</span>
            </div>
            
            <div className="grid grid-cols-5 gap-3.5">
              {localMonetary.map((rule, idx) => {
                const isLast = idx === localMonetary.length - 1;
                return (
                  <div key={idx} className="bg-white border border-teal-150 shadow-xs rounded-xl p-3 flex flex-col items-center justify-between text-center min-w-0">
                    <span className="text-lg font-black text-teal-500">⭐ {rule.score}</span>
                    <span className="text-[9px] font-mono text-slate-450 block mt-1">Skor target</span>
                    
                    {!isLast ? (
                      <div className="mt-3 flex items-center gap-1.5 w-full">
                        <span className="text-[10px] font-bold font-mono text-slate-400">{rule.operator}</span>
                        <input 
                          type="number" 
                          value={rule.value} 
                          onChange={(e) => handleMonetaryChange(idx, 'value', Number(e.target.value))}
                          className="w-full text-center font-bold text-xs bg-slate-50 border border-slate-200 focus:border-teal-400 rounded-md py-1 px-1 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic font-medium mt-4">Otherwise</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-150 pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-250 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 cursor-pointer shadow-xs"
            >
              Simpan & Terapkan Aturan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
