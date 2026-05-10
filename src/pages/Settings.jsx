import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Moon, Shield, Key, LogOut, Settings as SettingsIcon } from 'lucide-react';
import ToggleSwitch from '../components/Settings/ToggleSwitch';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : {
      username: "neon_rider99",
      isPrivate: false,
      showOnlineStatus: true,
      likeNotifications: true,
      darkMode: true
    };
  });

  // Save to local storage whenever settings change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUsernameChange = (e) => {
    updateSetting('username', e.target.value);
  };

  return (
    <div className="-m-6 lg:-m-10 min-h-[calc(100vh-64px)] bg-slate-950 text-slate-200 p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-3xl mx-auto pb-20 animate-in fade-in duration-500 relative z-10">
        
        <div className="mb-8 pt-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            Control Panel
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 font-medium">Manage your system preferences and security protocols.</p>
        </div>

        <div className="space-y-8">
          
          {/* Account Settings */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <User className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">Account Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Username</label>
                <input 
                  type="text" 
                  value={settings.username}
                  onChange={handleUsernameChange}
                  className="w-full sm:w-2/3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">This is how you will appear on the grid.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:border-purple-500/50">
                  <Key className="w-4 h-4 text-purple-400" />
                  Change Password
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 w-full sm:w-auto text-rose-500 font-medium border border-rose-500/30 transition-colors hover:border-rose-500">
                  <LogOut className="w-4 h-4" />
                  Disconnect from Network
                </button>
              </div>
            </div>
          </section>

          {/* Privacy Settings */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Shield className="w-5 h-5 text-rose-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">Privacy & Security</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-200">Private Account</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Only approved allies can see your transmissions.</p>
                </div>
                <ToggleSwitch 
                  checked={settings.isPrivate} 
                  onChange={(val) => updateSetting('isPrivate', val)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-200">Show Online Status</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Let others know when you are active on the grid.</p>
                </div>
                <ToggleSwitch 
                  checked={settings.showOnlineStatus} 
                  onChange={(val) => updateSetting('showOnlineStatus', val)} 
                />
              </div>
            </div>
          </section>

          {/* Notification & Appearance */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <Bell className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">System Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700"><Bell className="w-4 h-4 text-slate-300" /></div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">Alert Notifications</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Receive alerts when someone interacts with your posts.</p>
                  </div>
                </div>
                <ToggleSwitch 
                  checked={settings.likeNotifications} 
                  onChange={(val) => updateSetting('likeNotifications', val)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700"><Moon className="w-4 h-4 text-slate-300" /></div>
                  <div>
                    <h3 className="text-base font-bold text-slate-200">Dark Mode Protocol</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Switch system UI to high-contrast dark theme.</p>
                  </div>
                </div>
                <ToggleSwitch 
                  checked={settings.darkMode} 
                  onChange={(val) => updateSetting('darkMode', val)} 
                />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
