import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { DeviceShell } from './components/DeviceShell';
import { Navbar } from './components/Navbar';
import { TabBar } from './components/TabBar';
import { WorkView } from './components/WorkView';
import { BlitzBookingView } from './components/BlitzBookingView';
import { TrainingView } from './components/TrainingView';
import { ProfileView } from './components/ProfileView';
import { NewSaleModal } from './components/NewSaleModal';
import { BadgeModal } from './components/BadgeModal';
import { RbacMatrixModal } from './components/RbacMatrixModal';
import { InternalMessagingModal } from './components/InternalMessagingModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { LoginView } from './components/LoginView';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('work');
  const [showNewSaleModal, setShowNewSaleModal] = useState<boolean>(false);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [showRbacModal, setShowRbacModal] = useState<boolean>(false);

  // Internal Messaging & Push Dispatch State
  const [showMessagingModal, setShowMessagingModal] = useState<boolean>(false);
  const [messagingInitialBlitzId, setMessagingInitialBlitzId] = useState<string | undefined>(undefined);
  const [messagingInitialRecipientId, setMessagingInitialRecipientId] = useState<string | undefined>(undefined);
  const [messagingInitialMessageId, setMessagingInitialMessageId] = useState<string | undefined>(undefined);

  const handleOpenMessaging = (options?: { blitzId?: string; recipientId?: string; messageId?: string }) => {
    setMessagingInitialBlitzId(options?.blitzId);
    setMessagingInitialRecipientId(options?.recipientId);
    setMessagingInitialMessageId(options?.messageId);
    setShowMessagingModal(true);
  };

  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <DeviceShell>
      <div className="flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 relative">
        {/* iOS Native Push Notification Banner */}
        <PushNotificationToast
          onOpenMessage={(msgId) => handleOpenMessaging({ messageId: msgId })}
        />

        {/* Sticky Dynamic Navbar */}
        <Navbar
          onOpenNewSale={() => setShowNewSaleModal(true)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onOpenRbacModal={() => setShowRbacModal(true)}
          onOpenMessaging={() => handleOpenMessaging()}
        />

        {/* Tab Views */}
        <main className="flex-1 w-full overflow-y-auto">
          {currentTab === 'work' && (
            <WorkView
              onOpenNewSale={() => setShowNewSaleModal(true)}
              onOpenDirectMessage={(repId) => handleOpenMessaging({ recipientId: repId })}
            />
          )}
          {currentTab === 'blitz' && (
            <BlitzBookingView
              onOpenMessagingForBlitz={(blitzId) => handleOpenMessaging({ blitzId })}
            />
          )}
          {currentTab === 'training' && <TrainingView />}
          {currentTab === 'profile' && (
            <ProfileView onOpenBadgeModal={() => setShowBadgeModal(true)} />
          )}
        </main>

        {/* iOS Native Bottom Navigation TabBar */}
        <TabBar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenNewSale={() => setShowNewSaleModal(true)}
        />

        {/* New Sale Modal */}
        {showNewSaleModal && (
          <NewSaleModal onClose={() => setShowNewSaleModal(false)} />
        )}

        {/* Official Security Badge Modal */}
        {showBadgeModal && (
          <BadgeModal onClose={() => setShowBadgeModal(false)} />
        )}

        {/* RBAC Security & Permissions Matrix Modal */}
        {showRbacModal && (
          <RbacMatrixModal onClose={() => setShowRbacModal(false)} />
        )}

        {/* Internal Messaging & Push Dispatch Modal */}
        {showMessagingModal && (
          <InternalMessagingModal
            onClose={() => {
              setShowMessagingModal(false);
              setMessagingInitialBlitzId(undefined);
              setMessagingInitialRecipientId(undefined);
              setMessagingInitialMessageId(undefined);
            }}
            initialBlitzId={messagingInitialBlitzId}
            initialRecipientId={messagingInitialRecipientId}
            initialMessageId={messagingInitialMessageId}
          />
        )}
      </div>
    </DeviceShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
