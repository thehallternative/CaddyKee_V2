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
      
      {/* PERSISTENT HEADER AREA */}
      <header className="sticky top-0 z-40 bg-transparent px-8 py-6 flex justify-between items-center backdrop-blur-md">
        <button className="hover:opacity-80 active:scale-95 transition-all text-[#ecc151]" type="button">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-black italic uppercase tracking-tighter text-[#ecc151] text-2xl leading-none">CADDYKEE</h1>
          <span className="text-[9px] font-bold text-[#beedd9]/60 uppercase tracking-widest mt-1">SYSTEM OPERATIONAL</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#ecc151] overflow-hidden cursor-pointer active:scale-95 transition-transform flex items-center justify-center bg-[#0e3c2f] text-[#ecc151] font-black text-sm">
          DH
        </div>
      </header>

      {/* DYNAMIC SCREEN NAVIGATION LAYER */}
      <main className="max-w-4xl mx-auto px-8 mt-4">
        
        {/* VIEW 1: MISSION CONTROL */}
        {activeScreen === 'mission-control' && (
          <div className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
            <div>
              <p className="text-[#ecc151] font-bold uppercase tracking-[0.2em] text-sm opacity-80 mb-1">Welcome Back, Player</p>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-[#ecc151]">MISSION CONTROL</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Round Intelligence Module */}
              <button 
                onClick={() => setActiveScreen('live-scoring')} 
                className="group flex flex-col justify-between p-8 rounded-xl bg-[#ecc151] text-[#3e2e00] h-64 text-left transition-all duration-300 active:scale-95 shadow-[0_10px_30px_rgba(236,193,81,0.2)]"
                type="button"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="material-symbols-outlined text-4xl">trophy</span>
                  <span className="font-black italic text-xs tracking-widest opacity-40">MC-01</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black italic uppercase leading-none">Round Intelligence</h3>
                  <p className="text-[#3e2e00]/70 font-semibold text-sm mt-2">Start a round with a foursome or track active side-wagers</p>
                </div>
              </button>

              {/* Player Intelligence Module */}
              <button className="group flex flex-col justify-between p-8 rounded-xl bg-[#ecc151] text-[#3e2e00] h-64 text-left transition-all duration-300 active:scale-95 opacity-50 cursor-not-allowed" type="button">
                <div className="flex justify-between items-start w-full">
                  <span className="material-symbols-outlined text-4xl">group</span>
                  <span className="font-black italic text-xs tracking-widest opacity-40">MC-02</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black italic uppercase leading-none">Player Management</h3>
                  <p className="text-[#3e2e00]/70 font-semibold text-sm mt-2">Add players, build tournament fields, and audit indices</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE SCORING VIEW */}
        {activeScreen === 'live-scoring' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black italic uppercase text-[#ecc151] tracking-tighter">CYPRESS POINT CLUB</h2>
                <p className="text-xs font-bold text-[#beedd9]/60 uppercase tracking-widest mt-1">Hole 12 • Par 4 • Stroke Index 5</p>
              </div>
              <button 
                onClick={() => setActiveScreen('mission-control')} 
                className="text-xs font-bold bg-[#0e3c2f] text-[#ecc151] px-4 py-2 rounded-full uppercase tracking-wider border border-[#ecc151]/20 active:scale-95 transition-transform"
                type="button"
              >
                Exit Round
              </button>
            </div>

            {/* TAB CAPABILITY SIMULATION */}
            <div className="flex gap-2 bg-[#002117] p-1.5 rounded-full border border-[#ecc151]/10">
              <button className="flex-1 py-3 px-6 rounded-full font-black italic uppercase text-xs tracking-widest bg-[#ecc151] text-[#3e2e00]" type="button">
                SCORING
              </button>
              <button className="flex-1 py-3 px-6 rounded-full font-black italic uppercase text-xs tracking-widest text-[#beedd9]/60 opacity-60" type="button">
                STANDINGS
              </button>
            </div>

            {/* HIGH-FIDELITY SCORING ROWS */}
            <div className="space-y-4">
              {/* Row 1: Jordan */}
              <div className="glass-caddy rounded-full p-3 flex items-center justify-between shadow-2xl">
                <div className="flex flex-col ml-6">
                  <span className="font-black italic uppercase tracking-tighter text-[#beedd9] text-lg leading-none">Jordan Lisko</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[#a3d0be]">+2 OVER</span>
                </div>
                <div className="flex items-center gap-3 bg-[#001710]/50 rounded-full p-1 border border-[#ecc151]/10">
                  <button onClick={() => updateScore('jordan', -1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0e3c2f] text-[#ecc151] font-black text-xl active:scale-90 transition-transform" type="button">-</button>
                  <span className="font-black italic text-2xl px-2 w-10 text-center text-[#ecc151]">{scores.jordan}</span>
                  <button onClick={() => updateScore('jordan', 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ecc151] text-[#3e2e00] font-black text-xl active:scale-90 transition-transform shadow-[0_0_15px_rgba(236,193,81,0.3)]" type="button">+</button>
                </div>
              </div>

              {/* Row 2: Sarah */}
              <div className="glass-caddy rounded-full p-3 flex items-center justify-between shadow-2xl">
                <div className="flex flex-col ml-6">
                  <span className="font-black italic uppercase tracking-tighter text-[#beedd9] text-lg leading-none">Sarah Chen</span>
                  <span className="text-[10px] font-bold text-[#a3d0be] uppercase tracking-widest mt-1">E (EVEN)</span>
                </div>
                <div className="flex items-center gap-3 bg-[#001710]/50 rounded-full p-1 border border-[#ecc151]/10">
                  <button onClick={() => updateScore('sarah', -1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0e3c2f] text-[#ecc151] font-black text-xl active:scale-90 transition-transform" type="button">-</button>
                  <span className="font-black italic text-2xl px-2 w-10 text-center text-[#ecc151]">{scores.sarah}</span>
                  <button onClick={() => updateScore('sarah', 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ecc151] text-[#3e2e00] font-black text-xl active:scale-90 transition-transform shadow-[0_0_15px_rgba(236,193,81,0.3)]" type="button">+</button>
                </div>
              </div>

              {/* Row 3: Marcus */}
              <div className="glass-caddy rounded-full p-3 flex items-center justify-between shadow-2xl">
                <div className="flex flex-col ml-6">
                  <span className="font-black italic uppercase tracking-tighter text-[#beedd9] text-lg leading-none">Marcus Vane</span>
                  <span className="text-[10px] font-bold text-[#a3d0be] uppercase tracking-widest mt-1">-1 UNDER</span>
                </div>
                <div className="flex items-center gap-3 bg-[#001710]/50 rounded-full p-1 border border-[#ecc151]/10">
                  <button onClick={() => updateScore('marcus', -1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0e3c2f] text-[#ecc151] font-black text-xl active:scale-90 transition-transform" type="button">-</button>
                  <span className="font-black italic text-2xl px-2 w-10 text-center text-[#ecc151]">{scores.marcus}</span>
                  <button onClick={() => updateScore('marcus', 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ecc151] text-[#3e2e00] font-black text-xl active:scale-90 transition-transform shadow-[0_0_15px_rgba(236,193,81,0.3)]" type="button">+</button>
                </div>
              </div>
            </div>

            {/* SIDE BET SELECTION HUB */}
            <div className="bg-[#002117]/40 rounded-[2.5rem] p-6 border border-[#ecc151]/10 mt-6">
              <h3 className="font-black italic uppercase tracking-tighter text-[#ecc151] text-lg mb-4">ACTIVE MATCH LOGIC</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0e3c2f] p-4 rounded-2xl border border-[#ecc151]/10 text-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block mb-1">STAKES PER SKIN</span>
                  <span className="font-black italic text-2xl text-[#ecc151]">$10</span>
                </div>
                <div className="bg-[#0e3c2f] p-4 rounded-2xl border border-[#ecc151]/10 text-center flex flex-col justify-center items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 block mb-1">AUTOMATIC PRESS</span>
                  <span className="text-xs font-black bg-[#ecc151] text-[#3e2e00] px-3 py-1 rounded-full uppercase tracking-wider mt-0.5">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PERSISTENT FLOATING BOTTOM NAV BAR */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 flex justify-around items-center px-2 bg-[#0e3c2f]/95 backdrop-blur-xl rounded-[40px] h-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#ecc151]/10 max-w-xl mx-auto">
        <button 
          onClick={() => setActiveScreen('mission-control')} 
          className={`flex flex-col items-center justify-center flex-1 transition-all active:scale-90 duration-300 ${activeScreen === 'mission-control' ? 'text-[#ecc151]' : 'text-[#beedd9] opacity-60'}`}
          type="button"
        >
          <span className="material-symbols-outlined mb-1">sports_golf</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest">Game On</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-[#beedd9] opacity-60 flex-1" type="button">
          <span className="material-symbols-outlined mb-1">explore</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest">GPS</span>
        </button>

        {/* PROMINENT CENTER BUTTON - KEE TRIGGER */}
        <div className="flex-1 flex flex-col items-center -mb-2">
          <button 
            onClick={() => setIsKeeOpen(true)} 
            className="flex flex-col items-center justify-center text-[#ecc151] -translate-y-6 scale-110 transition-all duration-300 active:scale-100"
            type="button"
          >
            <div className="bg-[#0e3c2f] p-4 rounded-full shadow-[0_0_25px_rgba(236,193,81,0.6)] border-2 border-[#ecc151] relative">
              <span className="material-symbols-outlined text-4xl animate-pulse">graphic_eq</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest mt-2">KEE</span>
          </button>
        </div>

        <button className="flex flex-col items-center justify-center text-[#beedd9] opacity-60 flex-1" type="button">
          <span className="material-symbols-outlined mb-1">analytics</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest">Stats</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-[#beedd9] opacity-60 flex-1" type="button">
          <span className="material-symbols-outlined mb-1">more_horiz</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest">Menu</span>
        </button>
      </nav>

      {/* PERSISTENT SLIDE-UP KEE ASSISTANT DRAWER */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${isKeeOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Clickable Sheet Backdrop */}
        <div 
          onClick={() => setIsKeeOpen(false)} 
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isKeeOpen ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        {/* Sliding Audio HUD Frame */}
        <div className={`absolute inset-x-0 bottom-0 top-12 bg-[#00251b] border-t border-[#ecc151]/20 rounded-t-[40px] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isKeeOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-12 h-1.5 bg-[#414845]/30 rounded-full mx-auto mt-6 mb-2"></div>
          
          <div className="px-8 py-4 flex items-center justify-between border-b border-[#414845]/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ecc151]/10 flex items-center justify-center text-[#ecc151] border border-[#ecc151]/30">
                <span className="material-symbols-outlined text-3xl">graphic_eq</span>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[#beedd9]">KEE</h3>
                <span className="text-[10px] font-bold text-[#ecc151] uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ecc151] animate-pulse"></span> Active Intelligence
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsKeeOpen(false)} 
              className="w-12 h-12 rounded-full bg-[#001710] flex items-center justify-center text-[#beedd9] hover:text-[#ecc151] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* AUDIO HUD CONTENT LAYER */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-12">
            <div className="space-y-6">
              <p className="text-[#ecc151] font-black italic uppercase tracking-widest text-lg animate-pulse">Listening...</p>
              
              {/* High-Fidelity Waveforms */}
              <div className="voice-wave justify-center flex items-center gap-1 h-10">
                <div className="wave-bar"></div>
                <div className="wave-bar style={{animationDelay:'0.1s'}}"></div>
                <div className="wave-bar style={{animationDelay:'0.2s'}}"></div>
                <div className="wave-bar style={{animationDelay:'0.3s'}}"></div>
                <div className="wave-bar style={{animationDelay:'0.4s'}}"></div>
                <div className="wave-bar style={{animationDelay:'0.2s'}}"></div>
                <div className="wave-bar style={{animationDelay:'0.1s'}}"></div>
              </div>
            </div>

            {/* SELECTION SUGGESTIONS GRID */}
            <div className="w-full max-w-md space-y-4">
              <p className="text-xs font-bold text-[#c0c8c3] uppercase tracking-widest opacity-60">Operational Context Prompts</p>
              <div className="grid grid-cols-1 gap-3">
                <button className="w-full p-4 bg-[#001710] border border-[#414845]/20 rounded-2xl text-left hover:border-[#ecc151]/40 transition-all flex items-center justify-between group" type="button">
                  <span className="text-sm font-semibold text-[#beedd9] italic">"What's the wind doing on the 12th hole look?"</span>
                  <span className="material-symbols-outlined text-sm text-[#ecc151] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </button>
                <button className="w-full p-4 bg-[#001710] border border-[#414845]/20 rounded-2xl text-left hover:border-[#ecc151]/40 transition-all flex items-center justify-between group" type="button">
                  <span className="text-sm font-semibold text-[#beedd9] italic">"Kee, calculate total skins pool layout value right now."</span>
                  <span className="material-symbols-outlined text-sm text-[#ecc151] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* CHAT ENTRY OPTIONAL TEXT FIELD */}
          <div className="p-8 pb-12">
            <div className="relative flex items-center bg-[#00120b] rounded-full border border-[#414845]/20 focus-within:border-[#ecc151]/50 transition-all p-1">
              <input 
                className="w-full bg-transparent border-none rounded-full px-6 py-4 text-sm focus:ring-0 placeholder-[#c0c8c3]/40 outline-none text-[#beedd9]" 
                placeholder="Type structural query parameters..." 
                type="text"
              />
              <button className="p-3 bg-[#ecc151] rounded-full text-[#3e2e00] flex items-center justify-center hover:scale-105 transition-transform" type="button">
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