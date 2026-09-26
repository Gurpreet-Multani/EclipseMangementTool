import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Bell,
  Zap,
  Shield,
  User,
  ChevronDown,
  CheckCircle,
  Check,
  LogOut,
  PlusCircle,
  KeyRound,
  Lock,
  MessageSquare
} from 'lucide-react';

interface NavbarProps {
  onOpenNewSale: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenRbacModal: () => void;
  onOpenMessaging: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewSale,
  onNavigateTab,
  onOpenRbacModal,
  onOpenMessaging,
}) => {
  const { currentUser, users, loginAs, logout, isAdmin, isManager, isRepresentative } = useAuth();
  const { notifications, messages, markNotificationRead, clearAllNotifications } = useData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = messages.filter(
    (m) => currentUser && !m.readBy?.includes(currentUser.id)
  ).length;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">FiberBlitz</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Field Sales & State Blitz Operations
            </p>
          </div>
        </div>

        {/* Right Action Icons & Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* RBAC Security Info Button */}
          <button
            onClick={onOpenRbacModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs"
            title="Inspect Role-Based Access Control (RBAC) Permissions"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline font-semibold">RBAC Access</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                isAdmin
                  ? 'bg-amber-400/20 text-amber-400'
                  : isManager
                  ? 'bg-purple-400/20 text-purple-400'
                  : 'bg-cyan-400/20 text-cyan-400'
              }`}
            >
              {currentUser?.role}
            </span>
          </button>

          {/* Quick Action on Web Layout */}
          <button
            onClick={onOpenNewSale}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Log Fiber Sale</span>
          </button>

          {/* Internal Messaging / Dispatch Center */}
          <button
            onClick={onOpenMessaging}
            className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Open Blitz Communications & Direct Messages"
            aria-label="Internal Messages"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-slate-950">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100">Live Field Updates</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-400">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkTab) onNavigateTab(notif.linkTab);
                          setShowNotifMenu(false);
                        }}
                        className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-cyan-950/20 border-l-2 border-cyan-400' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Fast Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <div className="relative">
                <img
                  src={currentUser?.badgePhotoUrl || currentUser?.idPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser?.displayName || 'User'}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/50"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${
                    isAdmin
                      ? 'bg-amber-400'
                      : isManager
                      ? 'bg-purple-400'
                      : 'bg-cyan-400'
                  }`}
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                  <span
                    className={
                      isAdmin
                        ? 'text-amber-400'
                        : isManager
                        ? 'text-purple-400'
                        : 'text-cyan-400'
                    }
                  >
                    {currentUser?.role}
                  </span>
                  {isAdmin && <Shield className="w-2.5 h-2.5 text-amber-400" />}
                  {isManager && <Shield className="w-2.5 h-2.5 text-purple-400" />}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-slate-950/70 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser?.badgePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-100">{currentUser?.displayName}</p>
                      <p className="text-[11px] text-slate-400">{currentUser?.title}</p>
                      <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          isAdmin
                            ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                            : isManager
                            ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30'
                            : 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                        }`}
                      >
                        Role: {currentUser?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 border-b border-slate-800">
                  <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona (Test RBAC System)
                  </p>
                  <div className="space-y-1">
                    {users.map((u) => {
                      const isSelected = u.id === currentUser?.id;
                      const uRoleLower = u.role?.toLowerCase();
                      const uIsAdmin = uRoleLower === 'admin' || uRoleLower === 'owner';
                      const uIsManager = uRoleLower === 'manager';

                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            loginAs(u.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-xs ${
                            isSelected
                              ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                uIsAdmin
                                  ? 'bg-amber-400'
                                  : uIsManager
                                  ? 'bg-purple-400'
                                  : 'bg-cyan-400'
                              }`}
                            />
                            <span>{u.displayName}</span>
                            <span className="text-[10px] text-slate-500 capitalize">({u.role})</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-1.5 bg-slate-950/40 space-y-0.5">
                  <button
                    onClick={() => {
                      onOpenRbacModal();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-200 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>View Role Permissions Matrix</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigateTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>View Full Profile & Bank Details</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
