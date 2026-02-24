/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert, Cpu, Database, Wifi, Lock, Globe } from 'lucide-react';

const LOG_MESSAGES = [
  { text: "Establishing AIG System Engine Environment", type: "system" },
  { text: "INITIALIZING SYSTEM BOOT...", type: "system" },
  { text: "ESTABLISHING SECURE CONNECTION TO JMAIL DATA SERVER...", type: "info" },
  { text: "BYPASSING FIREWALL LAYER 1 [OK]", type: "success" },
  { text: "BYPASSING FIREWALL LAYER 2 [OK]", type: "success" },
  { text: "DECRYPTING RSA-4096 HANDSHAKE...", type: "info" },
  { text: "ACCESSING CORE KERNEL MODULES...", type: "system" },
  { text: "LOGIN_REQUIRED", type: "auth" }, // Special marker for login
  { text: "WARNING: UNAUTHORIZED ACCESS DETECTED", type: "warning" },
  { text: "INJECTING OVERRIDE PROTOCOL...", type: "info" },
  { text: "ROOT ACCESS GRANTED", type: "success" },
  { text: "DOWNLOADING ENCRYPTED PACKETS...", type: "info" },
  { text: "RECONSTRUCTING VIRTUAL ENVIRONMENT...", type: "system" },
  { text: "SYNCING WITH JMAIL.WORLD CLUSTER...", type: "info" },
  { text: "PREPARING FINAL REDIRECT...", type: "success" },
];

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isLoginState, setIsLoginState] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SECURE_ID = "j4aigdevconfid";
  const SECURE_PASS = "jeaccessjmailworldreplicaaig4";

  useEffect(() => {
    if (isLoginState || isRedirecting) return;

    const totalDuration = 12000;
    const logInterval = totalDuration / LOG_MESSAGES.length;

    const logTimer = setInterval(() => {
      if (currentLogIndex < LOG_MESSAGES.length) {
        const message = LOG_MESSAGES[currentLogIndex];
        
        if (message.text === "LOGIN_REQUIRED") {
          clearInterval(logTimer);
          setIsLoginState(true);
          return;
        }

        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, `[${timestamp}] ${message.text}`]);
        setCurrentLogIndex(prev => prev + 1);
      } else {
        clearInterval(logTimer);
        setIsRedirecting(true);
        setTimeout(() => {
          window.location.href = 'https://jmail.world/';
        }, 1500);
      }
    }, logInterval);

    return () => clearInterval(logTimer);
  }, [currentLogIndex, isLoginState, isRedirecting]);

  useEffect(() => {
    if (isLoginState || isRedirecting) return;
    
    const totalDuration = 12000;
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    return () => clearInterval(progressTimer);
  }, [isLoginState, isRedirecting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isLoginState]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginId === SECURE_ID && loginPass === SECURE_PASS) {
      setIsLoginState(false);
      setLoginError(false);
      setCurrentLogIndex(prev => prev + 1);
    } else {
      setLoginError(true);
      setLoginId("");
      setLoginPass("");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="scanline" />
      <div className="crt-overlay" />

      {/* Terminal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-black/80 border border-[#00ff41]/30 rounded-lg shadow-[0_0_20px_rgba(0,255,65,0.1)] overflow-hidden flex flex-col h-[70vh] md:h-[600px]"
      >
        {/* Header */}
        <div className="bg-[#00ff41]/10 border-bottom border-[#00ff41]/30 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-[#00ff41]" />
            <span className="text-xs font-bold tracking-widest uppercase">System Terminal - v2.4.0</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto scrollbar-hide font-mono text-sm md:text-base leading-relaxed"
        >
          <div className="mb-4 opacity-70">
            <p>Welcome to JMAIL Secure Access Terminal</p>
            <p>Authorized personnel only. All activities are logged.</p>
            <p className="text-[#00ff41] font-bold">AIG Engine 12.03</p>
            <p className="border-b border-[#00ff41]/20 pb-2 mb-4">--------------------------------------------------</p>
          </div>

          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-1 flex gap-2"
              >
                <span className="text-[#00ff41]/50 shrink-0 select-none">{">"}</span>
                <span className={log.includes("WARNING") ? "text-red-500 glitch" : log.includes("[OK]") || log.includes("GRANTED") ? "text-cyan-400" : ""}>
                  {log}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoginState && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 border border-[#00ff41]/30 bg-[#00ff41]/5 rounded"
            >
              <p className="text-cyan-400 mb-4 uppercase tracking-widest text-xs">Secure Authentication Required</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase opacity-60 mb-1">Secure Sign In ID Number</label>
                  <input 
                    autoFocus
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full bg-black border border-[#00ff41]/50 p-2 text-[#00ff41] outline-none focus:border-[#00ff41] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase opacity-60 mb-1">Secure ID Pass</label>
                  <input 
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-black border border-[#00ff41]/50 p-2 text-[#00ff41] outline-none focus:border-[#00ff41] transition-colors"
                  />
                </div>
                {loginError && (
                  <p className="text-red-500 text-xs animate-pulse">ACCESS DENIED: INVALID CREDENTIALS</p>
                )}
                <button 
                  type="submit"
                  className="w-full bg-[#00ff41]/20 border border-[#00ff41]/50 py-2 uppercase text-xs tracking-widest hover:bg-[#00ff41]/30 transition-colors"
                >
                  Authenticate
                </button>
              </form>
            </motion.div>
          )}
        </div>

        {/* Footer / Status Bar */}
        <div className="bg-[#00ff41]/5 border-t border-[#00ff41]/20 p-4">
          <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-widest opacity-60">
            <span>System Load: {(progress * 0.8).toFixed(1)}%</span>
            <span>Uptime: 00:00:12</span>
          </div>
          <div className="w-full h-2 bg-[#00ff41]/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00ff41] shadow-[0_0_10px_#00ff41]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4 opacity-40">
            <div className="flex flex-col items-center gap-1">
              <Cpu size={14} />
              <span className="text-[8px]">CPU</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Database size={14} />
              <span className="text-[8px]">DB</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wifi size={14} />
              <span className="text-[8px]">NET</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Lock size={14} />
              <span className="text-[8px]">SEC</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="fixed top-10 left-10 opacity-10 pointer-events-none hidden lg:block">
        <ShieldAlert size={120} />
      </div>
      <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none hidden lg:block">
        <Globe size={120} />
      </div>
    </div>
  );
}
