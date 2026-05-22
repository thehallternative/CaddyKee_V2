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
    <div style={{ backgroundColor: '#001710', minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', overflowX: 'hidden', paddingBottom: '140px', boxSizing: 'border-box' }}>
      
      {/* 1. ROCK-SOLID DYNAMIC TOP HEADER */}
      <header style={{ width: '100%', padding: '16px 24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(0, 23, 16, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        
        {/* Left Side: Dynamic Navigation Trigger (Menu vs. Back Arrow) */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          {activeScreen === 'mission-control' ? (
            /* Show standard menu icon ONLY on landing page */
            <button className="bg-transparent border-none cursor-pointer flex items-center justify-center" style={{ color: '#ecc151', padding: 0, outline: 'none' }} type="button">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
            </button>
          ) : (
            /* Show dynamic Back Arrow on ALL other sub-pages */
            <button 
              onClick={() => setActiveScreen('mission-control')}
              className="bg-transparent border-none cursor-pointer flex items-center justify-center" 
              style={{ color: '#ecc151', padding: 0, outline: 'none' }} 
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '26px', fontWeight: 'bold' }}>arrow_back</span>
            </button>
          )}
        </div>
        
        {/* Center Side: Universal Branding Header */}
        <div style={{ display: 'flex', flexDirection: 'column', items: 'center', textAlign: 'center', flex: 1 }}>
          <h1 style={{ color: '#ecc151', fontFamily: 'sans-serif', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em', fontSize: '24px', lineHeight: '1', margin: 0 }}>CADDYKEE</h1>
          <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190, 237, 217, 0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px', whiteSpace: 'nowrap' }}>SYSTEM OPERATIONAL</span>
        </div>
        
        {/* Right Side: Logged In User Avatar Profile Badge */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', fontWeight: '900', fontSize: '11px', boxSizing: 'border-box' }}>
            DH
          </div>
        </div>
      </header>

      {/* SCROLLABLE MAIN CANVAS */}
      <main className="px-6 pt-4 max-w-xl mx-auto w-full box-border" style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* VIEW A: MISSION CONTROL (LANDING PAGE) */}
        {activeScreen === 'mission-control' && (
          <div style={{ textAlign: 'left' }}>
            <p className="font-bold uppercase tracking-[0.2em] text-[10px] mb-1" style={{ color: '#ecc151', opacity: 0.8, margin: '0 0 4px 0' }}>Welcome Back, Player</p>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '0 0 24px 0' }}>MISSION CONTROL</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={() => setActiveScreen('live-scoring')} 
                style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'between', height: '180px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
                type="button"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>trophy</span>
                  <span style={{ fontFamily: 'sans-serif', fontWeight: '900', fontStyle: 'italic', fontSize: '10px', tracking: '0.1em', opacity: 0.5 }}>MC-01</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, leading: '1' }}>Round Intelligence</h3>
                  <p style={{ fontWeight: '500', fontSize: '12px', margin: '6px 0 0 0', opacity: 0.8 }}>Start a round with a foursome or track active side-wagers</p>
                </div>
              </button>

              <button 
                style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'between', height: '180px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', opacity: 0.4, cursor: 'not-allowed', boxSizing: 'border-box' }}
                type="button"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>group</span>
                  <span style={{ fontFamily: 'sans-serif', fontWeight: '900', fontStyle: 'italic', fontSize: '10px', tracking: '0.1em', opacity: 0.5 }}>MC-02</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, leading: '1' }}>Player Management</h3>
                  <p style={{ fontWeight: '500', fontSize: '12px', margin: '6px 0 0 0', opacity: 0.8 }}>Add players, build tournament fields, and audit handicaps</p>
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

      {/* 3. PERSISTENT FIXED BOTTOM NAV PILL */}
      <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 50, display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <nav style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', borderRadius: '40px', height: '80px', backgroundColor: 'rgba(14, 60, 47, 0.98)', border: '1px solid rgba(236, 193, 81, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
          
          <button 
            onClick={() => setActiveScreen('mission-control')} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: activeScreen === 'mission-control' ? '#ecc151' : 'rgba(190, 237, 217, 0.6)' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sports_golf</span>
            <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Game On</span>
          </button>
          
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>explore</span>
            <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>GPS</span>
          </button>

          {/* THE SEAMLESS KEE TRIGGER BUTTON - FEATURING YOUR OFFICIAL SKELETON KEY LOGIC LOGO */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button 
              onClick={() => setIsKeeOpen(true)} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', transform: 'translateY(-16px)', width: '70px' }}
              type="button"
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', boxShadow: '0 0 20px rgba(236,193,81,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '6px', boxSizing: 'border-box' }}>
                <img 
                  src="/src/assets/logo.png" 
                  alt="KEE" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    /* Technical Fallback if image path moves */
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="material-symbols-outlined" style="color:#ecc151;font-size:28px;">graphic_eq</span>';
                  }}
                />
              </div>
              <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>KEE</span>
            </button>
          </div>

          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
            <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Stats</span>
          </button>
          
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
            <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Menu</span>
          </button>

        </nav>
      </div>

      {/* SLIDE-UP ASSISTANT DRAWER */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, pointerEvents: isKeeOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsKeeOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', opacity: isKeeOpen ? 1 : 0, transition: 'opacity 0.5s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '48px', borderTop: '1px solid rgba(236,193,81,0.2)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', backgroundColor: '#00251b', boxShadow: '0 -10px 30px rgba(0,0,0,0.5)', transition: 'transform 0.5s ease-out', transform: isKeeOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(65,72,69,0.3)', margin: '20px auto 4px auto' }}></div>
          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(65,72,69,0.1)' }}>
            <h3 style={{ margin: 0, color: '#beedd9', fontStyle: 'italic', fontWeight: '900' }}>KEE</h3>
            <button onClick={() => setIsKeeOpen(false)} style={{ backgroundColor: '#001710', color: '#beedd9', border: 'none', padding: '8px 12px', borderRadius: '20px', cursor: 'pointer' }} type="button">Close</button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900' }}>Listening...</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;