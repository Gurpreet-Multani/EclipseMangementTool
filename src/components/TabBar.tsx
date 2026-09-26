import React from 'react';
import { BarChart3, MapPin, GraduationCap, UserCircle2, Plus } from 'lucide-react';

interface TabBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewSale: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab, onOpenNewSale }) => {
  const tabs = [
    { id: 'work', label: 'My Work', icon: BarChart3 },
    { id: 'blitz', label: 'Blitz Hub', icon: MapPin },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'profile', label: 'My Profile', icon: UserCircle2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 sm:px-6 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-cyan-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* Floating Quick Sale Button in Center */}
        <div className="flex flex-col items-center -mt-5 mx-1">
          <button
            onClick={onOpenNewSale}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 ring-4 ring-slate-950 hover:scale-105 active:scale-95 transition-transform"
            aria-label="New Sale"
          >
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
          <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-1">Sale</span>
        </div>

        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-cyan-400 font-semibold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
