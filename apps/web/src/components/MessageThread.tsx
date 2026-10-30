import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Send, Clock, User, Zap } from 'lucide-react';

export interface ChatMessage {
  id: string;
  collaborationId: string;
  senderId: string;
  senderRole: 'brand' | 'creator';
  content: string;
  createdAt: string;
}

interface MessageThreadProps {
  collaborationId: string;
}

export function MessageThread({ collaborationId }: MessageThreadProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBrand = user?.role === 'brand';

  const quickReplies = isBrand
    ? [
        'Reviewed draft! Approved to proceed with final cut.',
        'Could you adjust the product close-up in the first 5 seconds?',
        'Deliverables verified and accepted. Thank you for partnering!',
      ]
    : [
        'Draft video uploaded for review: drive.google.com/sample-reel',
        'Reel is live with #ad disclosure: instagram.com/reel/collab-demo',
        'Thank you! Added swipe-up link with official discount code.',
      ];

  const fetchMessages = async () => {
    try {
      const data = await api.get<{ messages: ChatMessage[] }>(
        `/collaborations/${collaborationId}/messages`
      );
      setMessages(data.messages || []);
    } catch (err: any) {
      // ignore transient polling errors
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [collaborationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMsg.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const created = await api.post<ChatMessage>(
        `/collaborations/${collaborationId}/messages`,
        { content: newMsg.trim() }
      );
      setMessages((prev) => [...prev, created]);
      setNewMsg('');
    } catch (err: any) {
      setError(err?.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = (text: string) => {
    setNewMsg(text);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col h-[560px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Collaboration Workspace Chat</h3>
          <p className="text-[11px] text-slate-500">
            Real-time deliverable review & milestone coordination
          </p>
        </div>
        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Sync Active
        </span>
      </div>

      {error && (
        <div className="p-2.5 mb-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs p-6 text-center">
            <User className="w-10 h-10 mb-2 text-slate-300 stroke-[1.5]" />
            <span className="font-semibold text-slate-600">No messages yet</span>
            <span className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Coordinate deliverables, share preview links, or request adjustments below.
            </span>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = user?.role === m.senderRole;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    m.senderRole === 'brand' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {m.senderRole}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTime(m.createdAt)}
                  </span>
                </div>
                <div
                  className={`text-xs p-3.5 rounded-2xl max-w-md leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips for 1-Click Testing */}
      <div className="pt-3 pb-1 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
          <Zap className="w-3 h-3 text-amber-500" />
          Quick:
        </span>
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleQuickReply(reply)}
            className="text-[11px] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200/80 transition flex-shrink-0 whitespace-nowrap"
          >
            {reply.length > 36 ? reply.slice(0, 36) + '...' : reply}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="mt-2 flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Share deliverable links, notes, or feedback..."
          className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
        />
        <button
          type="submit"
          disabled={isSending || !newMsg.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSending ? 'Sending...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
