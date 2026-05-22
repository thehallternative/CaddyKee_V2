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
    /* MASTER SCREEN WRAPPER - FORCES TOTAL MOBILE LAYOUT INTEGRITY */
    <div className="bg-mission-gradient min-h-screen relative font-sans overflow-hidden flex flex-col" style={{ backgroundColor: '#001710' }}>
      
      {/* 1. PERSISTENT STANDARD HEADER */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-40 sticky top-0" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center" style={{ color: '#ecc151' }} type="button">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="font-black italic uppercase tracking-tighter text-2xl leading-none" style={{ color: '#ecc151' }}>CADDYKEE</h1>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(190, 237, 217, 0.6)' }}>SYSTEM OPERATIONAL</span>
        </div>
        
        <div className="w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center font-black text-xs" style={{ borderColor: '#ecc151', backgroundColor: '#0e3c2f', color: '#ecc151' }}>
          DH
        </div>
      </header>

      {/* 2. MAIN SCROLLABLE VIEWS CANVAS */}
      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 max-w-xl mx-auto w-full box-border">
        
        {/* VIEW A: MISSION CONTROL */}
        {activeScreen === 'mission-control' && (
          <div className="w-full flex flex-col text-left">
            <p className="font-bold uppercase tracking-[0.2em] text-[10px] mb-1" style={{ color: '#ecc151', opacity: 0.8 }}>Welcome Back, Player</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6" style={{ color: '#ecc151' }}>MISSION CONTROL</h2>

            <div className="w-full flex flex-col gap-4">
              <button 
                onClick={() => setActiveScreen('live-scoring')} 
                className="w-full p-6 rounded-2xl text-left border-none cursor-pointer flex flex-col justify-between shadow-lg"
                style={{ backgroundColor: '#ecc151', color: '#3e2e00', height: '180px' }}
                type="button"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="material-symbols-outlined text-3xl">trophy</span>
                  <span className="font-black italic text-[10px] tracking-widest opacity-50">MC-01</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase leading-none m-0">Round Intelligence</h3>
                  <p className="font-medium text-xs mt-1.5 mb-0 opacity-80">Start a round with a foursome or track active side-wagers</p>
                </div>
              </button>

              <button 
                className="w-full p-6 rounded-2xl text-left border-none flex flex-col justify-between shadow-lg opacity-40 cursor-not-allowed"
                style={{ backgroundColor: '#ecc151', color: '#3e2e00', height: '180px' }}
                type="button"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="material-symbols-outlined text-3xl">group</span>
                  <span className="font-black italic text-[10px] tracking-widest opacity-50">MC-02</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase leading-none m-0">Player Management</h3>
                  <p className="font-medium text-xs mt-1.5 mb-0 opacity-80">Add players, build tournament fields, and audit handicaps</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* VIEW B: LIVE SCORING VIEW */}
        {activeScreen === 'live-scoring' && (
          <div className="w-full flex flex-col gap-6 text-left">
            <div className="flex justify-between items-end w-full">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none m-0" style={{ color: '#ecc151' }}>CYPRESS POINT</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 m-0" style={{ color: 'rgba(190, 237, 217, 0.6)' }}>Hole 12 • Par 4 • Stroke Index 5</p>
              </div>
              <button 
                onClick={() => setActiveScreen('mission-control')} 
                className="text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider border cursor-pointer"
                style={{ backgroundColor: '#0e3c2f', color: '#ecc151', borderColor: 'rgba(236,193,81,0.2)' }}
                type="button"
              >
                Exit Round
              </button>
            </div>

            {/* TAB CAPABILITY SWITCH */}
            <div className="flex p-1 rounded-full border w-full box-border" style={{ backgroundColor: '#002117', borderColor: 'rgba(236,193,81,0.1)' }}>
              <button className="flex-1 py-2.5 rounded-full font-black italic uppercase text-[11px] tracking-widest border-none cursor-pointer" style={{ backgroundColor: '#ecc151', color: '#3e2e00' }} type="button">
                SCORING
              </button>
              <button className="flex-1 py-2.5 rounded-full font-black italic uppercase text-[11px] tracking-widest border-none cursor-pointer bg-transparent" style={{ color: 'rgba(190, 237, 217, 0.6)' }} type="button">
                STANDINGS
              </button>
            </div>

            {/* HIGH-FIDELITY SCORING ROWS */}
            <div className="w-full flex flex-col gap-3">
              {['Jordan Lisko', 'Sarah Chen', 'Marcus Vane'].map((name, idx) => {
                const key = name.split(' ')[0].toLowerCase();
                const overUnder = idx === 0 ? '+2 OVER' : idx === 1 ? 'E (EVEN)' : '-1 UNDER';
                return (
                  <div key={name} className="glass-caddy rounded-full p-2.5 flex items-center justify-between shadow-xl w-full box-border">
                    <div className="flex flex-col ml-5">
                      <span className="font-black italic uppercase tracking-tighter text-base leading-none" style={{ color: '#beedd9' }}>{name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: '#a3d0be' }}>{overUnder}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-full p-1 border" style={{ backgroundColor: 'rgba(0,23,16,0.6)', borderColor: 'rgba(236,193,81,0.1)' }}>
                      <button onClick={() => updateScore(key, -1)} className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer font-black text-lg" style={{ backgroundColor: '#0e3c2f', color: '#ecc151' }} type="button">-</button>
                      <span className="font-black italic text-xl px-1 w-8 text-center" style={{ color: '#ecc151' }}>{scores[key] || 4}</span>
                      <button onClick={() => updateScore(key, 1)} className="w-9 h-9 flex items-center justify-center rounded-full border-none cursor-pointer font-black text-lg shadow-md" style={{ backgroundColor: '#ecc151', color: '#3e2e00' }} type="button">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 3. PERSISTENT FIXED BOTTOM NAV PILL (LOCKS TO FOOTER) */}
      <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto w-[calc(100%-2rem)] box-border">
        <nav className="w-full flex justify-around items-center px-4 rounded-[40px] h-20 shadow-2xl border box-border" style={{ backgroundColor: 'rgba(14, 60, 47, 0.95)', borderColor: 'rgba(236, 193, 81, 0.15)' }}>
          <button 
            onClick={() => setActiveScreen('mission-control')} 
            className="flex flex-col items-center justify-center flex-1 h-full bg-transparent border-none cursor-pointer"
            style={{ color: activeScreen === 'mission-control' ? '#ecc151' : 'rgba(190, 237, 217, 0.6)' }}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">sports_golf</span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Game On</span>
          </button>
          
          <button className="flex flex-col items-center justify-center flex-1 h-full bg-transparent border-none cursor-pointer" style={{ color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined text-xl">explore</span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-1">GPS</span>
          </button>

          {/* THE PROMINENT KEE VOICE ACTUATOR DOCK BUTTON */}
          <div className="flex-1 flex flex-col items-center justify-center -mb-2">
            <button 
              onClick={() => setIsKeeOpen(true)} 
              className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer -translate-y-5 scale-105 active:scale-95 transition-transform"
              style={{ color: '#ecc151' }}
              type="button"
            >
              <div className="p-3.5 rounded-full border-2 relative" style={{ backgroundColor: '#0e3c2f', borderColor: '#ecc151', boxShadow: '0 0 20px rgba(236,193,81,0.5)' }}>
                <span className="material-symbols-outlined text-3xl">graphic_eq</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest mt-1">KEE</span>
            </button>
          </div>

          <button className="flex flex-col items-center justify-center flex-1 h-full bg-transparent border-none cursor-pointer" style={{ color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined text-xl">analytics</span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Stats</span>
          </button>
          
          <button className="flex flex-col items-center justify-center flex-1 h-full bg-transparent border-none cursor-pointer" style={{ color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined text-xl">more_horiz</span>
            <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Menu</span>
          </button>
        </nav>
      </div>

      {/* SLIDE-UP KEE DRAWER LAYER */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${isKeeOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div onClick={() => setIsKeeOpen(false)} className={`absolute inset-0 bg-black/80 transition-opacity duration-500 ${isKeeOpen ? 'opacity-100' : 'opacity-0'}`} style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        
        <div className={`absolute inset-x-0 bottom-0 top-12 border-t rounded-t-[40px] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isKeeOpen ? 'translate-y-0' : 'translate-y-full'}`} style={{ backgroundColor: '#00251b', borderColor: 'rgba(236,193,81,0.2)' }}>
          <div className="w-12 h-1.5 rounded-full mx-auto mt-5 mb-1" style={{ backgroundColor: 'rgba(65,72,69,0.3)' }}></div>
          <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(65,72,69,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'rgba(236,193,81,0.1)', color: '#ecc151', borderColor: 'rgba(236,193,81,0.3)' }}>
                <span className="material-symbols-outlined text-2xl">graphic_eq</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none m-0" style={{ color: '#beedd9' }}>KEE</h3>
                <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1" style={{ color: '#ecc151' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Active Intelligence
                </span>
              </div>
            </div>
            <button onClick={() => setIsKeeOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-on-background hover:text-primary border-none cursor-pointer" style={{ backgroundColor: '#001710', color: '#beedd9' }} type="button">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-4">
            <p className="font-black italic uppercase tracking-widest text-base" style={{ color: '#ecc151' }}>Listening...</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;