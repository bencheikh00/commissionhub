'use client';

import React, { useState } from 'react';
import ChatTopbar from './ChatTopbar';
import MembersSidebar from './MembersSidebar';
import ChatArea from './ChatArea';
import InfoPanel from './InfoPanel';
import AbsenceModal from './AbsenceModal';

export default function ChatPage() {
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ChatTopbar onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Members Sidebar */}
        <div className={`
          ${mobileSidebarOpen ? 'flex' : 'hidden'}
          lg:flex flex-col w-64 xl:w-72 2xl:w-80 flex-shrink-0
          border-r border-border bg-card overflow-hidden
          absolute lg:relative inset-y-0 left-0 z-30
          lg:top-auto lg:bottom-auto
        `}>
          <MembersSidebar onClose={() => setMobileSidebarOpen(false)} />
        </div>

        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 z-20 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <ChatArea />
        </div>

        {/* Right Info Panel */}
        <div className="hidden xl:flex flex-col w-72 2xl:w-80 flex-shrink-0 border-l border-border bg-card overflow-hidden">
          <InfoPanel onRequestAbsence={() => setShowAbsenceModal(true)} />
        </div>
      </div>

      {/* Absence Modal */}
      {showAbsenceModal && (
        <AbsenceModal onClose={() => setShowAbsenceModal(false)} />
      )}
    </div>
  );
}