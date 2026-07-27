import React, { useState } from 'react';
import { 
  Lock, KeyRound, Save, Inbox, Check, AlertCircle, 
  X, RefreshCw, Database, Plus, Trash2, Download, Shield 
} from 'lucide-react';
import { ContactMessage } from '../types';

interface CMSAdminPanelProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  portfolioData: any;
  onRefreshData: () => void;
}

export const CMSAdminPanel: React.FC<CMSAdminPanelProps> = ({
  darkMode,
  isOpen,
  onClose,
  portfolioData,
  onRefreshData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'info' | 'inbox' | 'backup'>('info');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string>('');

  // Editable local state
  const [editableInfo, setEditableInfo] = useState<any>(portfolioData?.personalInfo || {});

  React.useEffect(() => {
    if (portfolioData?.personalInfo) {
      setEditableInfo(portfolioData.personalInfo);
    }
  }, [portfolioData]);

  if (!isOpen) return null;

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2025' || pinInput === 'karan2025' || pinInput === 'google2025') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passkey. Hint: Try 2025');
    }
  };

  const handleSaveCMS = async () => {
    setIsSaving(true);
    setSaveSuccess('');
    try {
      const res = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authPin: pinInput,
          data: {
            personalInfo: editableInfo
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('CMS changes successfully saved to database!');
        onRefreshData();
      } else {
        setAuthError(data.message || 'Save failed.');
      }
    } catch (err) {
      console.error('CMS save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className={`max-w-3xl w-full max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl relative overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-950 text-white">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Built-in CMS & Recruiter Inbox</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Lock Screen */}
        {!isAuthenticated ? (
          <div className="p-8 text-center max-w-sm mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold">Karan's CMS Portal</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your Admin Passkey / PIN to edit portfolio data and review recruiter inquiries.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <input
                id="cms-passkey-input"
                type="password"
                placeholder="Enter Passkey (e.g. 2025)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className={`w-full text-center px-4 py-3 rounded-xl font-mono text-sm border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              />

              {authError && (
                <p className="text-xs text-rose-500 font-semibold">{authError}</p>
              )}

              <button
                id="btn-cms-login"
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Unlock CMS Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated CMS View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs Bar */}
            <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs font-semibold">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'info' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Edit Profile Data
                </button>
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    activeTab === 'inbox' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Recruiter Messages ({portfolioData?.messages?.length || 0})</span>
                </button>
              </div>

              <span className="text-[10px] text-emerald-500 font-mono">
                ● Authenticated Mode
              </span>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={editableInfo.name || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, name: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Target Role / Portfolio Focus</label>
                      <input
                        type="text"
                        value={editableInfo.targetProgram || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, targetProgram: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Email Contact</label>
                      <input
                        type="email"
                        value={editableInfo.email || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, email: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Location</label>
                      <input
                        type="text"
                        value={editableInfo.location || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, location: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Profile Photo (URL or File Upload)</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Paste image URL (e.g. https://... or leave blank for KP initials)"
                        value={editableInfo.avatar || ''}
                        onChange={(e) => setEditableInfo({ ...editableInfo, avatar: e.target.value })}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}
                      />
                      <label className="px-3 py-2 rounded-lg bg-slate-800 text-white font-bold text-xs cursor-pointer hover:bg-slate-700 transition-colors shrink-0">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (uploadEvent) => {
                                const base64 = uploadEvent.target?.result as string;
                                setEditableInfo({ ...editableInfo, avatar: base64 });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Professional Executive Bio</label>
                    <textarea
                      rows={4}
                      value={editableInfo.bio || ''}
                      onChange={(e) => setEditableInfo({ ...editableInfo, bio: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}
                    />
                  </div>

                  {saveSuccess && (
                    <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-4 h-4" /> {saveSuccess}
                    </p>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveCMS}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'inbox' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500">Recruiter Inquiry Log</h4>
                  {(!portfolioData?.messages || portfolioData.messages.length === 0) ? (
                    <p className="text-xs text-slate-500 italic py-8 text-center">
                      No messages received yet. Messages sent via the contact form will appear here.
                    </p>
                  ) : (
                    portfolioData.messages.map((msg: ContactMessage) => (
                      <div key={msg.id} className={`p-4 rounded-xl border space-y-1.5 text-xs ${
                        darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex justify-between items-center font-bold">
                          <span>{msg.name} ({msg.company})</span>
                          <span className="font-mono text-[10px] text-slate-500">{msg.timestamp}</span>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 font-semibold">{msg.subject}</div>
                        <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{msg.message}</p>
                        <div className="text-[10px] font-mono text-slate-500 pt-1">
                          Email: {msg.email}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
