'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Hash } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderGrade: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    senderId: 'member-002',
    senderName: 'Fatoumata Koné',
    senderAvatar: 'FK',
    senderGrade: 'Adjoint',
    content: "Bonjour à tous ! La réunion de demain est confirmée à 14h00. Merci de vous assurer d'être disponibles.",
    timestamp: '09:15',
    isOwn: false,
    status: 'read',
  },
  {
    id: 'msg-002',
    senderId: 'member-003',
    senderName: 'Ibrahim Traoré',
    senderAvatar: 'IT',
    senderGrade: 'Membre',
    content: "Reçu, merci Fatoumata ! Je serai présent. Est-ce que l'ordre du jour a été finalisé ?",
    timestamp: '09:22',
    isOwn: false,
    status: 'read',
  },
  {
    id: 'msg-003',
    senderId: 'member-001',
    senderName: 'Amadou Diallo',
    senderAvatar: 'AD',
    senderGrade: 'Responsable',
    content: "Oui Ibrahim, l'ordre du jour est disponible dans la section Réunions. Les points principaux : rapport d'activité Q1, planification campagne communication, et validation du budget.",
    timestamp: '09:28',
    isOwn: true,
    status: 'read',
  },
  {
    id: 'msg-004',
    senderId: 'member-005',
    senderName: 'Ousmane Bah',
    senderAvatar: 'OB',
    senderGrade: 'Adjoint',
    content: "Parfait ! J'ai préparé un résumé du rapport Q1. Je le partagerai avant la réunion pour que tout le monde puisse le consulter.",
    timestamp: '09:35',
    isOwn: false,
    status: 'read',
  },
  {
    id: 'msg-005',
    senderId: 'member-007',
    senderName: 'Mamadou Sylla',
    senderAvatar: 'MS',
    senderGrade: 'Membre',
    content: "Bonjour, je serai en légère retard (environ 15 min). Je soumets une demande d'absence partielle.",
    timestamp: '09:41',
    isOwn: false,
    status: 'read',
  },
  {
    id: 'msg-006',
    senderId: 'member-001',
    senderName: 'Amadou Diallo',
    senderAvatar: 'AD',
    senderGrade: 'Responsable',
    content: "Pas de problème Mamadou, nous noterons votre arrivée différée. Pensez à soumettre votre demande via le formulaire d'absence.",
    timestamp: '09:45',
    isOwn: true,
    status: 'read',
  },
  {
    id: 'msg-007',
    senderId: 'member-002',
    senderName: 'Fatoumata Koné',
    senderAvatar: 'FK',
    senderGrade: 'Adjoint',
    content: "Rappel : le compte-rendu de la dernière réunion est disponible sur la plateforme. Merci de le relire avant demain.",
    timestamp: '10:02',
    isOwn: false,
    status: 'read',
  },
  {
    id: 'msg-008',
    senderId: 'member-010',
    senderName: 'Hawa Diallo',
    senderAvatar: 'HD',
    senderGrade: 'Membre',
    content: "Merci pour le rappel ! Une question : est-ce qu'on peut proposer des points supplémentaires à l'ordre du jour ?",
    timestamp: '10:18',
    isOwn: false,
    status: 'read',
  },
  {
    id: 'msg-009',
    senderId: 'member-001',
    senderName: 'Amadou Diallo',
    senderAvatar: 'AD',
    senderGrade: 'Responsable',
    content: "Absolument Hawa ! Envoyez vos suggestions avant ce soir 20h00 pour qu'on puisse les intégrer. Merci à tous pour votre engagement 👍",
    timestamp: '10:24',
    isOwn: true,
    status: 'delivered',
  },
  {
    id: 'msg-010',
    senderId: 'member-012',
    senderName: 'Nènè Kourouma',
    senderAvatar: 'NK',
    senderGrade: 'Membre',
    content: "Super ! Je vais préparer une proposition pour la stratégie réseaux sociaux du prochain trimestre.",
    timestamp: '10:31',
    isOwn: false,
    status: 'read',
  },
];

const GRADE_COLORS: Record<string, string> = {
  Responsable: 'text-yellow-400',
  Adjoint: 'text-blue-400',
  Membre: 'text-muted-foreground',
};

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'member-001',
      senderName: 'Amadou Diallo',
      senderAvatar: 'AD',
      senderGrade: 'Responsable',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sent',
    };
    // BACKEND INTEGRATION POINT: emit via WebSocket or POST /api/messages
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>((acc, msg, i) => {
    const dateLabel = i === 0 ? "Aujourd'hui" : "Aujourd'hui";
    if (acc.length === 0 || acc[acc.length - 1].date !== dateLabel) {
      acc.push({ date: dateLabel, msgs: [msg] });
    } else {
      acc[acc.length - 1].msgs.push(msg);
    }
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Channel header */}
      <div className="px-4 lg:px-6 py-3.5 border-b border-border flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Hash size={14} className="text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-700 text-foreground">général</h2>
          <p className="text-xs text-muted-foreground">Canal principal de la commission</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span>12 membres</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 lg:px-6 py-4 space-y-4">
        {groupedMessages.map((group) => (
          <div key={`group-${group.date}`}>
            {/* Date separator */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-500 px-2 py-0.5 rounded-full bg-card border border-border">
                {group.date}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Messages in group */}
            <div className="space-y-3">
              {group.msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-fade-in ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {!msg.isOwn && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-700 text-primary mt-1">
                      {msg.senderAvatar}
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`flex flex-col max-w-[72%] ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                    {!msg.isOwn && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-700 text-foreground">{msg.senderName}</span>
                        <span className={`text-[10px] font-600 ${GRADE_COLORS[msg.senderGrade] || 'text-muted-foreground'}`}>
                          {msg.senderGrade}
                        </span>
                      </div>
                    )}
                    <div className={`px-4 py-2.5 text-sm leading-relaxed ${msg.isOwn ? 'message-bubble-self' : 'message-bubble-other'}`}>
                      {msg.content}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px] text-muted-foreground tabular-nums">{msg.timestamp}</span>
                      {msg.isOwn && (
                        <span className="text-[10px] text-muted-foreground">
                          {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-700 text-primary flex-shrink-0">
              FK
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary border border-border">
              <div className="flex gap-1 items-center h-4">
                <div className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <div className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <div className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground ml-1">Fatoumata écrit...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-4 lg:px-6 py-4 border-t border-border flex-shrink-0">
        <div className="flex items-end gap-2 bg-input border border-border rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors duration-150">
          <button
            type="button"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-150 flex-shrink-0 mb-0.5"
            aria-label="Joindre un fichier"
          >
            <Paperclip size={18} />
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message... (Entrée pour envoyer)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed max-h-32 scrollbar-thin"
            style={{ minHeight: '24px' }}
          />

          <button
            type="button"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-150 flex-shrink-0 mb-0.5"
            aria-label="Emoji"
          >
            <Smile size={18} />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-xl gradient-orange text-primary-foreground flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed mb-0.5"
            aria-label="Envoyer"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Shift+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
}