import React, { useState } from 'react';

function App() {
  const [isKeeOpen, setIsKeeOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('mission-control');
  const [scores, setScores] = useState({
    jordan: 4,
    sarah: 4,
    marcus: 4,
    elena: 4,
  });

  const updateScore = (player, delta) => {
    setScores((prev) => ({
      ...prev,
      [player]: Math.max(1, prev[player] + delta),
    }));
  };

  return (
    <div className="bg-mission-gradient min-h-screen text-[#beedd9] relative select-none font-sans overflow-x-hidden pb-40">
      
      {/* PERSISTENT PREMIUM TOP APP BAR */}
      <header className="bg-transparent flex justify-between items-center w-full px-6 py-6 sticky top-0 z-40 backdrop-blur-md">
        <button className="hover:opacity-80 active:scale-95 transition-all text-[#ecc151] flex items-center justify-center" type="button">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-black italic uppercase tracking-tighter text-[#ecc151] text-2xl leading-none">CADDYKEE</h1>
          <span className="text-[9px] font-bold text-[#beedd9]/60 uppercase tracking-widest mt-1">SYSTEM OPERATIONAL</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#ecc151] overflow-hidden cursor-pointer active:scale-95 transition-transform flex items-center justify-center bg-[#0e3c2f] text-[#ecc151] font-black text-xs tracking-tighter">
          DH
        </div>
      </header>

      {/* MAIN APPLICATION CANVAS */}
      <main className="px-6 mt-4 max-w-xl mx-auto space-y-8">
        
        {/* VIEW 1: MISSION CONTROL LANDING DASHBOARD */}
        {activeScreen === 'mission-control' && (
          <div className="space-y-8">
            <div>
              <p className="text-[#ecc151] font-bold uppercase tracking-[0.2em] text-[10px] opacity-80 mb-1">Welcome Back, Player</p>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-[#ecc151]">MISSION CONTROL</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Module MC-01: Round Intelligence */}
              <button 
                onClick={() => setActiveScreen('live-scoring')} 
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#ecc151] text-[#3e2e00] h-48 text-left transition-all duration-300 active:scale-[0.98] shadow-lg overflow-hidden"
                type="button"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="material-symbols-outlined text-3xl">trophy</span>
                  <span className="font-black italic text-[10px] tracking-widest opacity-50">MC-01</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase leading-none">Round Intelligence</h3>
                  <p className="text-[#3e2e00]/80 font-medium text-xs mt-1.5">Start a round with a foursome or track active side-wagers</p>
                </div>
              </button>

              {/* Module MC-02: Player Intelligence */}
              <button 
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#ecc151] text-[#3e2e00] h-48 text-left transition-all duration-300 active:scale-[0.98] shadow-lg overflow-hidden opacity-40 cursor-not-allowed"
                type="button"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="material-symbols-outlined text-3xl">group</span>
                  <span className="font-black italic text-[10px] tracking-widest opacity-50">MC-02</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase leading-none">Player Management</h3>
                  <p className="text-[#3e2e00]/80 font-medium text-xs mt-1.5">Add players, build tournament fields, and audit handicaps</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE SCORING VIEW */}
        {activeScreen === 'live-scoring' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-[#ecc151] tracking-tighter leading-none">CYPRESS POINT</h2>
                <p className="text-[10px] font-bold text-[#beedd9]/60 uppercase tracking-widest mt-1.5">Hole 12 • Par 4 • Stroke Index 5</p>
              </div>
              <button 
                onClick={() => setActiveScreen('mission-control')} 
                className="text-[10px] font-black bg-[#0e3c2f] text-[#ecc151] px-4 py-2 rounded-full uppercase tracking-wider border border-[#ecc151]/20 active:scale-95 transition-transform"
                type="button"
              >
                Exit Round
              </button>
            </div>

            {/* TAB SYSTEM NAVIGATION OVERLAY */}
            <div className="flex bg-[#002117] p-1 rounded-full border border-[#ecc151]/10">
              <button className="flex-1 py-2.5 rounded-full font-black italic uppercase text-[11px] tracking-widest bg-[#ecc151] text-[#3e2e00]" type="button">
                SCORING
              </button>
              <button className="flex-1 py-2.5 rounded-full font-black italic uppercase text-[11px] tracking-widest text-[#beedd9]/60 opacity-60" type="button">
                STANDINGS
              </button>
            </div>

            {/* HIGH-FIDELITY SCORING ROWS */}
            <div className="space-y-3">
              {/* Row 1: Jordan */}
              <div className="glass-caddy rounded-full p-2.5 flex items-center justify-between shadow-xl">
                <div className="flex flex-col ml-5">
                  <span className="font-black italic uppercase tracking-tighter text-[#beedd9] text-base leading-none">Jordan Lisko</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-[#a3d0be]">+2 OVER</span>
                </div>
                <div className="flex items-center gap-3 bg-[#001710]/60 rounded-full p-1 border border-[#ecc151]/10">
                  <button onClick={() => updateScore('jordan', -1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0e3c2f] text-[#ecc151] font-black text-lg active:scale-90 transition-transform" type="button">-</button>
                  <span className="font-black italic text-xl px-1 w-8 Richmond text-center text-[#ecc151]">{scores.jordan}</span>
                  <button onClick={() => updateScore('jordan', 1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#ecc151] text-[#3e2e00] font-black text-lg active:scale-90 transition-transform shadow-md" type="button">+</button>
                </div>
              </div>

              {/* Row 2: Sarah */}
              <div className="glass-caddy rounded-full p-2.5 flex items-center justify-between shadow-xl">
                <div className="flex flex-col ml-5">
                  <span className="font-black italic uppercase tracking-tighter text-[#beedd9] text-base leading-none">Sarah Chen</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-[#a3d0be]">E (EVEN)</span>
                </div>
                <div className="flex items-center gap-3 bg-[#001710]/60 rounded-full p-1 border border-[#ecc151]/10">
                  <button onClick={() => updateScore('sarah', -1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0e3c2f] text-[#ecc151] font-black text-lg active:scale-90 transition-transform" type="button">-</button>
                  <span className="font-black italic text-xl px-1 w-8 text-center text-[#ecc151]">{scores.sarah}</span>
                  <button onClick={() => updateScore('sarah', 1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#ecc151] text-[#3e2e00] font-black text-lg active:scale-90 transition-transform shadow-md" type="button">+</button>
                </div>
              </div>

              {/* Row 3: Marcus */}
              <div className="glass-caddy rounded-full p-2.5 flex items-center justify-between shadow-xl">
                <div className="flex flex-col ml-5">
                  <span className="font-black italic uppercase tracking-tighter text-[#beedd9] text-lg leading-none">Marcus Vane</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-[#a3d0be]">-1 UNDER</span>
                </div>
                <div className="flex items-center gap-3 bg-[#001710]/60 rounded-full p-1 border border-[#ecc151]/10">
                  <button onClick={() => updateScore('marcus', -1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0e3c2f] text-[#ecc151] font-black text-lg active:scale-90 transition-transform" type="button">-</button>
                  <span className="font-black italic text-xl px-1 w-8 text-center text-[#ecc151]">{scores.marcus}</span>
                  <button onClick={() => updateScore('marcus', 1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#ecc151] text-[#3e2e00] font-black text-lg active:scale-90 transition-transform shadow-md" type="button">+</button>
                </div>
              </div>
            </div>

            {/* SIDE BET SELECTION PANEL */}
            <div className="bg-[#002117]/40 rounded-[2rem] p-5 border border-[#ecc151]/10 mt-4">
              <h3 className="font-black italic uppercase tracking-tighter text-[#ecc151] text-base mb-3">ACTIVE MATCH LOGIC</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0e3c2f] p-4 rounded-xl border border-[#ecc151]/10 text-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block mb-1">STAKES PER SKIN</span>
                  <span className="font-black italic text-xl text-[#ecc151]">$10</span>
                </div>
                <div className="bg-[#0e3c2f] p-4 rounded-xl border border-[#ecc151]/10 text-center flex flex-col justify-center items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block mb-0.5">AUTOMATIC PRESS</span>
                  <span className="text-[9px] font-black bg-[#ecc151] text-[#3e2e00] px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PERSISTENT FIXED BOTTOM NAV PILL SHELL */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 flex justify-around items-center px-2 bg-[#0e3c2f]/95 backdrop-blur-xl rounded-[40px] h-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#ecc151]/10 max-w-md mx-auto">
        <button 
          onClick={() => setActiveScreen('mission-control')} 
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 duration-200 ${activeScreen === 'mission-control' ? 'text-[#ecc151]' : 'text-[#beedd9] opacity-60'}`}
          type="button"
        >
          <span className="material-symbols-outlined text-xl">sports_golf</span>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Game On</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-[#beedd9] opacity-60 flex-1 h-full" type="button">
          <span className="material-symbols-outlined text-xl">explore</span>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">GPS</span>
        </button>

        {/* HIGH-PREFORMANCE VOICE OVERLAY ACTUATOR */}
        <div className="flex-1 flex flex-col items-center justify-center -mb-2">
          <button 
            onClick={() => setIsKeeOpen(true)} 
            className="flex flex-col items-center justify-center text-[#ecc151] -translate-y-5 scale-105 transition-all duration-300 active:scale-95"
            type="button"
          >
            <div className="bg-[#0e3c2f] p-3.5 rounded-full shadow-[0_0_20px_rgba(236,193,81,0.5)] border-2 border-[#ecc151] relative">
              <span className="material-symbols-outlined text-3xl animate-pulse">graphic_eq</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest mt-1">KEE</span>
          </button>
        </div>

        <button className="flex flex-col items-center justify-center text-[#beedd9] opacity-60 flex-1 h-full" type="button">
          <span className="material-symbols-outlined text-xl">analytics</span>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Stats</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-[#beedd9] opacity-60 flex-1 h-full" type="button">
          <span className="material-symbols-outlined text-xl">more_horiz</span>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Menu</span>
        </button>
      </nav>

      {/* SLIDE-UP KEE ASSISTANT PANEL HUD */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${isKeeOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Dynamic Shadow Sheet Backdrop */}
        <div 
          onClick={() => setIsKeeOpen(false)} 
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isKeeOpen ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        {/* Immersive Audio Container Deck */}
        <div className={`absolute inset-x-0 bottom-0 top-12 bg-[#00251b] border-t border-[#ecc151]/20 rounded-t-[40px] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isKeeOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1.5 bg-[#414845]/30 rounded-full mx-auto mt-5 mb-1"></div>
          
          <div className="px-6 py-4 flex items-center justify-between border-b border-[#414845]/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#ecc151]/10 flex items-center justify-center text-[#ecc151] border border-[#ecc151]/30">
                <span className="material-symbols-outlined text-2xl">graphic_eq</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-[#beedd9] leading-none">KEE</h3>
                <span className="text-[9px] font-bold text-[#ecc151] uppercase tracking-widest flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ecc151] animate-pulse"></span> Active Intelligence
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsKeeOpen(false)} 
              className="w-10 h-10 rounded-full bg-[#001710] flex items-center justify-center text-[#beedd9] hover:text-[#ecc151] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* TELEMETRY STATE & WAVEFORM TRACK */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-10">
            <div className="space-y-4">
              <p className="text-[#ecc151] font-black italic uppercase tracking-widest text-base animate-pulse">Listening...</p>
              
              <div className="voice-wave justify-center flex items-center gap-1 h-10">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>

            {/* ACTION DIRECTIVE CARDS */}
            <div className="w-full max-w-sm space-y-3">
              <p className="text-[10px] font-bold text-[#c0c8c3] uppercase tracking-widest opacity-60">Operational Prompts</p>
              <div className="grid grid-cols-1 gap-2.5">
                <button className="w-full p-4 bg-[#001710] border border-[#414845]/20 rounded-xl text-left hover:border-[#ecc151]/40 transition-all flex items-center justify-between group" type="button">
                  <span className="text-xs font-semibold text-[#beedd9] italic">"What's the wind doing on the 12th hole look?"</span>
                  <span className="material-symbols-outlined text-sm text-[#ecc151] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </button>
                <button className="w-full p-4 bg-[#001710] border border-[#414845]/20 rounded-xl text-left hover:border-[#ecc151]/40 transition-all flex items-center justify-between group" type="button">
                  <span className="text-xs font-semibold text-[#beedd9] italic">"Kee, calculate total skins pool layout value right now."</span>
                  <span className="material-symbols-outlined text-sm text-[#ecc151] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* SUB-PANEL QUE INPUT ENTRY */}
          <div className="p-6 pb-10">
            <div className="relative flex items-center bg-[#00120b] rounded-full border border-[#414845]/20 focus-within:border-[#ecc151]/50 transition-all p-1">
              <input 
                className="w-full bg-transparent border-none rounded-full px-5 py-3.5 text-xs focus:ring-0 placeholder-[#c0c8c3]/30 outline-none text-[#beedd9]" 
                placeholder="Type structural query parameters..." 
                type="text"
              />
              <button className="p-2.5 bg-[#ecc151] rounded-full text-[#3e2e00] flex items-center justify-center hover:scale-105 transition-transform" type="button">
                <span className="material-symbols-outlined font-black text-sm">arrow_upward</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;