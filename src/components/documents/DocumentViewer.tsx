import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PatientDocument } from '../../types';
import { 
  FolderArchive, 
  Plus, 
  Search, 
  Eye, 
  ZoomIn, 
  FileText, 
  Download, 
  Trash2, 
  Check, 
  Camera, 
  X
} from 'lucide-react';

export const DocumentViewer: React.FC = () => {
  const { documents, patients, addDocument } = useClinic();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PatientDocument['type']>('X-Ray');
  const [fileUrl, setFileUrl] = useState('/src/assets/images/dental_xray_sample_1793105632778.jpg');
  const [notes, setNotes] = useState('');

  const docTypes: PatientDocument['type'][] = ['X-Ray', 'PDF Report', 'Consent Form', 'Treatment Plan', 'Intraoral Photo'];

  const filteredDocs = documents.filter(d => {
    const typeMatch = filterType === 'all' || d.type === filterType;
    const q = searchQuery.toLowerCase().trim();
    const queryMatch = !q || d.title.toLowerCase().includes(q) || d.patientId.toLowerCase().includes(q);
    return typeMatch && queryMatch;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDocument({
      patientId,
      title,
      type,
      fileUrl,
      notes
    });

    setIsUploadOpen(false);
    setTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Digital Radiology & Document Repository
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {documents.length} Files Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store digital panoramic OPGs, RVG bitewings, surgical consent forms, and specialist reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-md shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document / X-Ray</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title or Patient ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Document Types</option>
            {docTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => {
          const patientObj = patients.find(p => p.id === doc.patientId);

          return (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition-all text-xs space-y-3"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setSelectedImage(doc.fileUrl)}>
                <img
                  src={doc.fileUrl}
                  alt={doc.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-mono text-[10px]">
                  {doc.type}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  {doc.title}
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Patient: <strong className="text-slate-700 dark:text-slate-300">{patientObj?.name || doc.patientId}</strong> ({doc.patientId})
                </p>
                {doc.notes && (
                  <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2">
                    {doc.notes}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Uploaded: {doc.uploadedAt}</span>
                <button
                  type="button"
                  onClick={() => setSelectedImage(doc.fileUrl)}
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Lightbox</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full text-center">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-teal-400"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Radiograph View"
              className="max-h-[80vh] mx-auto rounded-xl border border-slate-700 shadow-2xl object-contain"
              referrerPolicy="no-referrer"
            />
            <p className="text-slate-400 text-xs mt-3">
              High-Resolution Diagnostic Digital View
            </p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-teal-500" />
                <span>Upload Clinical Document</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 mt-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Patient *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Post-Op OPG Full Arch Scan"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {docTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Radiologist remarks or treatment planning notes..."
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                >
                  Attach to EMR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
