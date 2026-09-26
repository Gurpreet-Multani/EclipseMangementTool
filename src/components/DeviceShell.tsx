import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface DeviceShellProps {
  children: React.ReactNode;
}

export const DeviceShell: React.FC<DeviceShellProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'ios' | 'web'>('web');
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Device Bar & Quick Platform Switcher */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200 tracking-wide uppercase text-[10px]">
            FiberBlitz Synchronized Cloud Node
          </span>
          <span className="hidden sm:inline-block text-slate-500 font-mono text-[10px]">
            • Realtime Firestore v11 Sync
          </span>
        </div>

        {/* Platform View Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setDeviceMode('web')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium text-xs ${
              deviceMode === 'web'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Full Web App Experience (Wide Desktop / Tablet)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Web App</span>
          </button>
          <button
            onClick={() => setDeviceMode('ios')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium text-xs ${
              deviceMode === 'ios'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Simulated iPhone 16 Pro iOS Native Shell"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iOS App</span>
          </button>
        </div>
      </div>

      {/* Main Content Render */}
      {deviceMode === 'web' ? (
        <div className="flex-1 w-full min-h-0 flex flex-col">{children}</div>
      ) : (
        /* iOS Frame Container */
        <div className="flex-1 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 overflow-y-auto">
          <div className="relative w-full max-w-[430px] h-[890px] max-h-[92vh] bg-slate-950 rounded-[52px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden ring-1 ring-slate-700/50">
            {/* iOS Dynamic Island & Status Bar */}
            <div className="w-full bg-slate-950 px-7 pt-3 pb-1 flex items-center justify-between text-xs text-slate-200 select-none z-40">
              <span className="font-semibold tracking-tight text-[13px]">{currentTime}</span>
              
              {/* Dynamic Island pill */}
              <div className="h-6 w-28 bg-black rounded-full border border-slate-800/80 flex items-center justify-center gap-2 px-2 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-cyan-500/80"></div>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* App Screen Inside iOS */}
            <div className="flex-1 overflow-y-auto flex flex-col bg-slate-950 relative">
              {children}
            </div>

            {/* iOS Bottom Home Bar */}
            <div className="w-full bg-slate-950 py-2 flex justify-center items-center z-40">
              <div className="w-36 h-1 bg-slate-600/80 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
