import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  User,
  CreditCard,
  Plane,
  FileCheck2,
  DollarSign,
  Lock,
  Camera,
  QrCode,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Save,
  KeyRound,
  IdCard,
  Building2,
  Phone,
  Calendar,
  AlertTriangle,
  Sparkles,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileViewProps {
  onOpenBadgeModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenBadgeModal }) => {
  const {
    currentUser,
    allUsers,
    updateUserProfile,
    updateRepPayRates,
    updateRepRole,
    isAdmin,
    isManager,
    isRepresentative,
    canChangeUserRolesAndTitles,
    canChangePayRates,
  } = useAuth();

  // Target rep selector for Admin / Manager editing
  const [targetUserId, setTargetUserId] = useState<string>(currentUser?.id || '');
  const activeSubjectUser = allUsers.find((u) => u.id === targetUserId) || currentUser;

  // Profile Form States
  const [firstName, setFirstName] = useState(activeSubjectUser?.firstName || '');
  const [lastName, setLastName] = useState(activeSubjectUser?.lastName || '');
  const [email, setEmail] = useState(activeSubjectUser?.email || '');
  const [phone, setPhone] = useState(activeSubjectUser?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(activeSubjectUser?.dateOfBirth || '');
  const [shirtSize, setShirtSize] = useState(activeSubjectUser?.shirtSize || 'L');
  const [managerId, setManagerId] = useState(activeSubjectUser?.managerId || '');
  const [ableToTravel, setAbleToTravel] = useState(activeSubjectUser?.travelProfile?.ableToTravel ?? true);
  const [homeAirport, setHomeAirport] = useState(activeSubjectUser?.travelProfile?.homeAirport || '');
  const [smsConsent, setSmsConsent] = useState(activeSubjectUser?.travelProfile?.smsTravelUpdatesConsent ?? true);

  // Emergency contact
  const [emerName, setEmerName] = useState(activeSubjectUser?.emergencyContact?.name || '');
  const [emerPhone, setEmerPhone] = useState(activeSubjectUser?.emergencyContact?.phone || '');
  const [emerRel, setEmerRel] = useState(activeSubjectUser?.emergencyContact?.relationship || 'Family');

  // Direct deposit state
  const [bankName, setBankName] = useState(activeSubjectUser?.directDeposit?.bankName || '');
  const [accountNum, setAccountNum] = useState(activeSubjectUser?.directDeposit?.accountNumber || '');
  const [routingNum, setRoutingNum] = useState(activeSubjectUser?.directDeposit?.routingNumber || '');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>(activeSubjectUser?.directDeposit?.accountType || 'checking');
  const [taxIdType, setTaxIdType] = useState<'SSN' | 'EIN'>(activeSubjectUser?.directDeposit?.taxIdType || 'SSN');
  const [taxIdNumber, setTaxIdNumber] = useState(activeSubjectUser?.directDeposit?.taxIdNumber || '');
  const [showMaskedBank, setShowMaskedBank] = useState(false);

  // Photos
  const [badgePhoto, setBadgePhoto] = useState(activeSubjectUser?.badgePhotoUrl || '');
  const [idPhoto, setIdPhoto] = useState(activeSubjectUser?.idPhotoUrl || '');

  // Role and Title (Can only be changed by Admin/Manager)
  const [role, setRole] = useState<UserRole>((activeSubjectUser?.role as UserRole) || 'Representative');
  const [title, setTitle] = useState(activeSubjectUser?.title || '');

  // Pay rates for ISP programs (Manager or Admin can ONLY change this section for reps)
  const [payRates, setPayRates] = useState<Record<string, number>>(activeSubjectUser?.payRates || {
    'AT&T Fiber': 260,
    'Frontier Fiber': 280,
    'Quantum Fiber': 250,
    'Brightspeed': 230,
    'Spectrum Gig': 220,
    'Kinetic Fiber': 240,
  });

  // Login credentials
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Synchronize when switching selected user
  const handleSelectUserToEdit = (uId: string) => {
    setTargetUserId(uId);
    const u = allUsers.find((item) => item.id === uId);
    if (u) {
      setFirstName(u.firstName);
      setLastName(u.lastName);
      setEmail(u.email);
      setPhone(u.phone);
      setDateOfBirth(u.dateOfBirth);
      setShirtSize(u.shirtSize);
      setManagerId(u.managerId || '');
      setRole((u.role as UserRole) || 'Representative');
      setTitle(u.title);
      setPayRates(u.payRates || {});
      setAbleToTravel(u.travelProfile?.ableToTravel ?? true);
      setHomeAirport(u.travelProfile?.homeAirport || '');
      setSmsConsent(u.travelProfile?.smsTravelUpdatesConsent ?? true);
      setBankName(u.directDeposit?.bankName || '');
      setAccountNum(u.directDeposit?.accountNumber || '');
      setRoutingNum(u.directDeposit?.routingNumber || '');
      setAccountType(u.directDeposit?.accountType || 'checking');
      setTaxIdType(u.directDeposit?.taxIdType || 'SSN');
      setTaxIdNumber(u.directDeposit?.taxIdNumber || '');
      setBadgePhoto(u.badgePhotoUrl || '');
      setIdPhoto(u.idPhotoUrl || '');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const managerObj = allUsers.find((u) => u.id === managerId);

    const updates = {
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      dateOfBirth,
      shirtSize,
      managerId,
      managerName: managerObj?.displayName || 'Direct to Founder',
      travelProfile: {
        homeAirport,
        ableToTravel,
        smsTravelUpdatesConsent: smsConsent,
      },
      emergencyContact: {
        name: emerName,
        phone: emerPhone,
        relationship: emerRel,
      },
      directDeposit: {
        bankName,
        accountNumber: accountNum,
        routingNumber: routingNum,
        accountType,
        taxIdType,
        taxIdNumber,
      },
      badgePhotoUrl: badgePhoto,
      idPhotoUrl: idPhoto,
    };

    // RBAC: Only Admin or Manager can modify roles/titles and pay rates
    if (canChangeUserRolesAndTitles && targetUserId) {
      await updateRepRole(targetUserId, role, title);
    }
    if (canChangePayRates && targetUserId) {
      await updateRepPayRates(targetUserId, payRates);
    }

    await updateUserProfile(targetUserId || currentUser.id, updates);

    setSavedSuccessMsg('Profile and secure records saved successfully!');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-28">
      {/* Top Banner & Quick Badge View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={badgePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={activeSubjectUser?.displayName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-lg"
            />
            <span
              className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-slate-950 ${
                activeSubjectUser?.role?.toLowerCase() === 'admin' || activeSubjectUser?.role?.toLowerCase() === 'owner'
                  ? 'bg-amber-400'
                  : activeSubjectUser?.role?.toLowerCase() === 'manager'
                  ? 'bg-purple-400'
                  : 'bg-cyan-400'
              }`}
            >
              {activeSubjectUser?.role}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {firstName} {lastName}
              </h1>
              {isAdmin && <Shield className="w-4 h-4 text-amber-400" />}
              {isManager && <Shield className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-xs text-cyan-300 font-semibold">{title || activeSubjectUser?.title}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Upline Manager: <strong>{activeSubjectUser?.managerName || 'Direct to Founder'}</strong>
            </p>
          </div>
        </div>

        {/* Badge Launcher Button */}
        <button
          onClick={onOpenBadgeModal}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all shrink-0"
        >
          <IdCard className="w-4 h-4" />
          <span>View Official Security Badge</span>
        </button>
      </div>

      {/* Target User Switcher for Admin / Manager to Manage Team Members */}
      {(isAdmin || isManager) && (
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {isAdmin ? 'Admin Governance Console: Select User Profile to Manage' : 'Manager Console: Select Team Member to Manage'}
              </span>
              <span className="text-[10px] text-slate-400">
                You have permission to change roles/titles and configure ISP pay rates for team members.
              </span>
            </div>
          </div>
          <select
            value={targetUserId}
            onChange={(e) => handleSelectUserToEdit(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 shrink-0"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName} ({u.role?.toUpperCase()}) — {u.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {savedSuccessMsg && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* PROFILE EDIT FORM */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Basic Agent Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Direct Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Uniform Shirt Size</label>
              <select
                value={shirtSize}
                onChange={(e) => setShirtSize(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Manager / Upline Dropdown */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Assigned Manager / Upline Leader
              </label>
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Direct to Founder (Gurpreet Multani)</option>
                {allUsers
                  .filter((u) => u.role === 'Manager' || u.role === 'Admin')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.displayName} ({m.title || m.role})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: TITLE & SECURITY ROLE (ONLY ADMIN OR MANAGER CAN CHANGE) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Title & Role Assignment</h3>
            </div>
            {canChangeUserRolesAndTitles ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Admin / Manager Authorized</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Protected: Requires Admin or Manager Role</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {canChangeUserRolesAndTitles
              ? `You are signed in as an ${isAdmin ? 'Admin' : 'Manager'}. You have authorization to set job titles and assign system roles ('Admin', 'Manager', or 'Representative').`
              : 'User titles and roles can ONLY be assigned or changed by users with an "Admin" or "Manager" role. Representatives have read-only access to this section.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Assigned Job Title {!canChangeUserRolesAndTitles && '(Locked)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled={!canChangeUserRolesAndTitles}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Fiber Field Specialist"
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs ${
                    canChangeUserRolesAndTitles
                      ? 'text-white focus:border-cyan-500'
                      : 'text-slate-500 cursor-not-allowed bg-slate-950/40 select-none'
                  }`}
                />
                {!canChangeUserRolesAndTitles && (
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                System Role {!canChangeUserRolesAndTitles && '(Locked)'}
              </label>
              <div className="relative">
                <select
                  disabled={!canChangeUserRolesAndTitles}
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs ${
                    canChangeUserRolesAndTitles
                      ? 'text-white focus:border-cyan-500'
                      : 'text-slate-500 cursor-not-allowed bg-slate-950/40 select-none'
                  }`}
                >
                  <option value="Representative">Representative (Sales & Training Access)</option>
                  <option value="Manager">Manager (Team Management & Coursework Authoring)</option>
                  <option value="Admin">Admin (Full System Control)</option>
                </select>
                {!canChangeUserRolesAndTitles && (
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EMERGENCY CONTACT */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">Emergency Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Contact Name</label>
              <input
                type="text"
                value={emerName}
                onChange={(e) => setEmerName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={emerPhone}
                onChange={(e) => setEmerPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Relationship</label>
              <input
                type="text"
                value={emerRel}
                onChange={(e) => setEmerRel(e.target.value)}
                placeholder="Spouse / Parent / Sibling"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: DIRECT DEPOSIT & BANKING */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Direct Deposit & Banking Details</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowMaskedBank(!showMaskedBank)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              {showMaskedBank ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showMaskedBank ? 'Mask Sensitive Numbers' : 'Reveal Banking Numbers'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. JPMorgan Chase Bank, N.A."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="checking">Checking Account</option>
                <option value="savings">Savings Account</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Routing Number (9-digits)</label>
              <input
                type="text"
                value={routingNum}
                onChange={(e) => setRoutingNum(e.target.value)}
                placeholder="026009593"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Account Number</label>
              <input
                type={showMaskedBank ? 'text' : 'password'}
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
                placeholder="Account number"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Tax ID Type</label>
              <select
                value={taxIdType}
                onChange={(e) => setTaxIdType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="SSN">Individual Social Security Number (SSN)</option>
                <option value="EIN">Business Entity Employer ID (EIN)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                {taxIdType === 'SSN' ? 'Social Security Number (SSN)' : 'Company EIN Number'}
              </label>
              <input
                type={showMaskedBank ? 'text' : 'password'}
                value={taxIdNumber}
                onChange={(e) => setTaxIdNumber(e.target.value)}
                placeholder={taxIdType === 'SSN' ? 'XXX-XX-XXXX' : 'XX-XXXXXXX'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: TRAVEL PROFILE */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Travel Profile & Blitz Logistics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                HOME Airport (3-letter Code & City)
              </label>
              <input
                type="text"
                value={homeAirport}
                onChange={(e) => setHomeAirport(e.target.value)}
                placeholder="e.g. DFW - Dallas/Fort Worth, or ORD, ATL, MCO"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Are they able to travel?</label>
              <select
                value={ableToTravel ? 'yes' : 'no'}
                onChange={(e) => setAbleToTravel(e.target.value === 'yes')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
              >
                <option value="yes">YES - Active for State Blitz Travel</option>
                <option value="no">NO - Local Market Sales Only</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="rounded accent-cyan-500 w-4 h-4"
                />
                <span className="text-xs text-slate-300">
                  Consent to travel SMS updates: Receive instant flight changes, shuttle dispatch, and blitz alerts via SMS.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 6: PICTURE OF ID & PROFESSIONAL BADGE PHOTO */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Identity Verification & Badge Photography</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Professional Front-Shot Image for the Badge:
              </label>
              <input
                type="text"
                placeholder="Image URL or Base64"
                value={badgePhoto}
                onChange={(e) => setBadgePhoto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <div className="flex items-center gap-3">
                {badgePhoto && (
                  <img
                    src={badgePhoto}
                    alt="Badge Front Shot"
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-cyan-500"
                  />
                )}
                <button
                  type="button"
                  onClick={onOpenBadgeModal}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium"
                >
                  Preview Badge ID
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Picture of Government Issued ID (Driver License / Passport):
              </label>
              <input
                type="text"
                placeholder="ID Image URL or Base64"
                value={idPhoto}
                onChange={(e) => setIdPhoto(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>State Compliance Verified</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: PAY RATE PER ISP / PROGRAMS (ONLY ADMIN OR MANAGER CAN CHANGE) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">ISP Program Commission Pay Rates</h3>
            </div>
            {canChangePayRates ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Admin / Manager Authorized</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Protected: Requires Admin or Manager Role</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {canChangePayRates
              ? `You are signed in as an ${isAdmin ? 'Admin' : 'Manager'}. You can modify commission payouts per carrier fiber install.`
              : 'Commission pay rates can ONLY be changed by users with "Admin" or "Manager" roles. Representatives have view-only access.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(payRates).map(([isp, rate]) => (
              <div key={isp} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-300 block truncate">{isp}</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-emerald-400">$</span>
                  <input
                    type="number"
                    disabled={!canChangePayRates}
                    value={rate}
                    onChange={(e) => {
                      const updated = { ...payRates, [isp]: Number(e.target.value) };
                      setPayRates(updated);
                    }}
                    className={`w-full bg-transparent font-mono font-bold text-sm ${
                      canChangePayRates ? 'text-white focus:outline-none' : 'text-slate-500 cursor-not-allowed select-none'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500">/install</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8: FIBER AGREEMENT (COMING SOON) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Fiber Independent Rep Agreement</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The electronic signature gateway (Fiber Agreement v2026.2) is currently in development.
            Your active status remains in full compliance.
          </p>
        </div>

        {/* SECTION 9: USER LOGIN INFORMATION (BOTTOM SECTION) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">User Login & Account Security</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Change Account Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SAVE PROFILE BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Banking Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
