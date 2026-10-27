import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { CLINIC_BRANCHES } from '../../data/initialData';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Stethoscope, 
  FileText, 
  Receipt, 
  CreditCard, 
  Clock, 
  Image as ImageIcon, 
  FolderArchive, 
  Globe, 
  BarChart3, 
  ShieldAlert, 
  Database, 
  ExternalLink,
  MapPin,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'dental-chart'
  | 'prescriptions'
  | 'billing'
  | 'expenses'
  | 'followups'
  | 'documents'
  | 'gallery'
  | 'website-inquiries'
  | 'reports'
  | 'security'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isMobileOpen, 
  onCloseMobile 
}) => {
  const { followUps, webInquiries, activeBranch } = useClinic();

  const pendingFollowUps = followUps.filter(f => f.status === 'Pending').length;
  const newInquiries = webInquiries.filter(w => w.status === 'New').length;

  const currentBranch = CLINIC_BRANCHES.find(b => b.id === activeBranch);

  const navigationSections = [
    {
      group: 'Clinical Operations',
      items: [
        { id: 'dashboard' as NavTab, label: 'Analytics Dashboard', icon: LayoutDashboard },
        { id: 'appointments' as NavTab, label: 'Appointments Calendar', icon: Calendar },
        { id: 'patients' as NavTab, label: 'Patients EMR', icon: Users },
        { id: 'dental-chart' as NavTab, label: 'Interactive Dental Chart', icon: Stethoscope },
        { id: 'prescriptions' as NavTab, label: 'Prescriptions Module', icon: FileText },
      ]
    },
    {
      group: 'Finance & Patient Care',
      items: [
        { id: 'billing' as NavTab, label: 'Billing & Invoices', icon: Receipt },
        { id: 'expenses' as NavTab, label: 'Clinic Expenses', icon: CreditCard },
        { id: 'followups' as NavTab, label: 'Auto Follow-Up', icon: Clock, badge: pendingFollowUps },
        { id: 'documents' as NavTab, label: 'Digital X-Rays & Docs', icon: FolderArchive },
      ]
    },
    {
      group: 'Growth & Management',
      items: [
        { id: 'gallery' as NavTab, label: 'Clinic & Cases Gallery', icon: ImageIcon },
        { id: 'website-inquiries' as NavTab, label: 'Website Inquiries Sync', icon: Globe, badge: newInquiries },
        { id: 'reports' as NavTab, label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'security' as NavTab, label: 'Security & Audit Logs', icon: ShieldAlert },
        { id: 'settings' as NavTab, label: 'Database & Backups', icon: Database },
      ]
    }
  ];

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 w-64 select-none">
      
      {/* Clinic Branches Mini Card */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <span className="uppercase tracking-wider">Active Scope</span>
            <span className="text-teal-600 dark:text-teal-400 font-mono">
              {activeBranch === 'all' ? '2 Clinics' : '1 Clinic'}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {currentBranch ? currentBranch.name.replace('Janta Dental Clinic - ', '') : 'Combined Branches'}
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
              <span className="truncate">{currentBranch ? currentBranch.address : 'Raghubir Nagar & Nihal Vihar'}</span>
            </span>
            <a
              href={currentBranch?.googleMapsUrl || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-500 flex items-center gap-0.5"
              title="Open Google Maps Directions"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationSections.map(section => (
          <div key={section.group}>
            <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 shadow-sm border border-teal-200/50 dark:border-teal-800/50 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Emergency Help Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-teal-600 dark:text-teal-400">Clinic Direct Line</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Delhi</span>
          </div>
          <p className="font-mono text-sm font-bold text-slate-900 dark:text-white tracking-wide">
            9899007819
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Emergency patient hotline & WhatsApp helpline
          </p>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
