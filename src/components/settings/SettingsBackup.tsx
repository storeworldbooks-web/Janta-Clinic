import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Database, 
  Download, 
  Upload, 
  FileCode, 
  FolderDown, 
  CheckCircle2,
  HardDrive,
  Copy,
  Check,
  Terminal,
  FolderCheck,
  ExternalLink
} from 'lucide-react';

export const SettingsBackup: React.FC = () => {
  const { 
    exportDatabaseJSON, 
    restoreDatabaseJSON, 
    exportPatientsCSV, 
    exportRevenueCSV,
    patients,
    appointments,
    invoices
  } = useClinic();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `janta_clinic_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSQL = () => {
    const lines: string[] = [
      '-- Janta Dental Clinic Database Backup',
      `-- Generated on: ${new Date().toISOString()}`,
      '',
      'BEGIN TRANSACTION;'
    ];

    patients.forEach(p => {
      const escapedNotes = (p.notes || '').replace(/'/g, "''");
      lines.push(
        `INSERT OR REPLACE INTO patients (id, name, mobile, email, age, gender, blood_group, address, branch_assigned, notes, registered_date) VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.mobile}', '${p.email}', ${p.age}, '${p.gender}', '${p.bloodGroup}', '${p.address.replace(/'/g, "''")}', '${p.branchAssigned}', '${escapedNotes}', '${p.registeredDate}');`
      );
    });

    appointments.forEach(a => {
      lines.push(
        `INSERT OR REPLACE INTO appointments (id, patient_id, patient_name, doctor_name, treatment, date, time, branch, status) VALUES ('${a.id}', '${a.patientId}', '${a.patientName.replace(/'/g, "''")}', '${a.doctorName.replace(/'/g, "''")}', '${a.treatment.replace(/'/g, "''")}', '${a.date}', '${a.time}', '${a.branch}', '${a.status}');`
      );
    });

    lines.push('COMMIT;');

    const blob = new Blob([lines.join('\n')], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `janta_clinic_backup_${new Date().toISOString().split('T')[0]}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreDatabaseJSON(content);
      if (success) {
        setImportStatus('Database successfully restored! All records updated.');
      } else {
        setImportStatus('Failed to parse backup JSON. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  const psCommand = `New-Item -ItemType Directory -Force -Path "E:\\Websites\\janta clinic"; Expand-Archive -Path "$HOME\\Downloads\\janta-clinic-source.zip" -DestinationPath "E:\\Websites\\janta clinic" -Force; cd "E:\\Websites\\janta clinic"; npm install; npm run dev`;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Database Management & Data Backups
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              Offline & Local Storage
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full JSON snapshots, SQL database dumps, CSV ledgers, and local source exports for Janta Dental Clinic.
          </p>
        </div>
      </div>

      {/* Local Save & Deployment for E:\Websites\janta clinic */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white border border-teal-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                Target Directory: E:\Websites\janta clinic
              </span>
              <span className="text-xs text-slate-400">Windows Local Environment</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1.5">
              Export All Project Files to E:\Websites\janta clinic
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Download the complete, self-contained project package with all React 19 components, Tailwind styling, dental odontogram charts, and EMR records ready for your local computer.
            </p>
          </div>

          <a
            href="/janta-clinic-source.zip"
            download="janta-clinic-source.zip"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download Project Source ZIP (2.9 MB)</span>
          </a>
        </div>

        {/* 1-Step PowerShell extraction command */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              <span>1-Step Windows PowerShell Command (Creates folder, extracts ZIP, and launches server):</span>
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(psCommand, 'powershell')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-mono text-[11px] transition-colors"
            >
              {copiedCode === 'powershell' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-teal-200 overflow-x-auto select-all">
            {psCommand}
          </div>
        </div>

        {/* 3 Step Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[10px] mb-1.5">1</div>
            <p className="font-bold text-white">Download Source ZIP</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click the button above to download <code>janta-clinic-source.zip</code> into your Downloads.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[10px] mb-1.5">2</div>
            <p className="font-bold text-white">Extract to E:\Websites\janta clinic</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Run the PowerShell command above, or right-click the ZIP &gt; Extract All to <code>E:\Websites\janta clinic</code>.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-[10px] mb-1.5">3</div>
            <p className="font-bold text-white">Start Local App</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Run <code>npm install</code> followed by <code>npm run dev</code> to open on localhost:3000.</p>
          </div>
        </div>
      </div>

      {/* Backup & Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Database JSON Backup & Restore */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-500" />
              <span>Full Database Snapshots</span>
            </h3>
            <span className="text-slate-400">JSON & SQL</span>
          </div>

          <p className="text-slate-500 leading-relaxed">
            Download the complete current clinic state (patients, appointments, prescriptions, billing, dental odontograms) as a standalone JSON or relational SQL file.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSQL}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-semibold transition-colors border border-slate-200 dark:border-slate-700"
            >
              <FileCode className="w-3.5 h-3.5 text-teal-500" />
              <span>Download SQL Dump</span>
            </button>
          </div>

          {/* Restore file */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Restore Database from JSON Snapshot:
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full text-slate-500 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 dark:file:bg-teal-950 file:text-teal-700 dark:file:text-teal-300 hover:file:bg-teal-100"
            />
            {importStatus && (
              <p className="mt-2 text-teal-600 dark:text-teal-400 font-semibold">{importStatus}</p>
            )}
          </div>
        </div>

        {/* Spreadsheets Export */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderDown className="w-4 h-4 text-cyan-500" />
              <span>CSV Spreadsheet Ledgers</span>
            </h3>
            <span className="text-slate-400">Excel / Sheets</span>
          </div>

          <p className="text-slate-500 leading-relaxed">
            Export structured CSV spreadsheets compatible with Microsoft Excel, Google Sheets, or clinic bookkeeping tools for accounting and records.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Patients Master Registry</p>
                <p className="text-[11px] text-slate-500">{patients.length} Registered Patient records</p>
              </div>
              <button
                type="button"
                onClick={exportPatientsCSV}
                className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800"
              >
                Export CSV
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Financial Revenue & Invoices</p>
                <p className="text-[11px] text-slate-500">{invoices.length} Invoices & Payment entries</p>
              </div>
              <button
                type="button"
                onClick={exportRevenueCSV}
                className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
