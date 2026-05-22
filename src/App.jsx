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
      
      {/* PERSISTENT HEADER AREA */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-40 sticky top-0" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <button className="bg-transparent border-none cursor-pointer flex items-center justify-center" style={{ color: '#ecc151' }} type="button">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-black italic uppercase tracking-tighter text-2xl leading-none" style={{ color: '#ecc151', margin: 0 }}>CADDYKEE</h1>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(190, 237, 217, 0.6)' }}>SYSTEM OPERATIONAL</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center font-black text-xs" style={{ borderColor: '#ecc151', backgroundColor: '#0e3c2f', color: '#ecc151' }}>
          DH
        </div>
      </header>

      {/* SCROLLABLE MAIN CANVAS */}
      <main className="px-6 pt-4 max-w-xl mx-auto w-full box-border" style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* VIEW A: MISSION CONTROL */}
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
      </main>

      {/* 3. ROCK-SOLID INLINE FOOTER NAVIGATION SYSTEM */}
      <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 50, display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <nav style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', borderRadius: '40px', height: '80px', backgroundColor: 'rgba(14, 60, 47, 0.98)', border: '1px solid rgba(236, 193, 81, 0.2)', boxShadow: '0 20px ' + '50px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
          
          <button 
            onClick={() => setActiveScreen('mission-control')} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, h: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: activeScreen === 'mission-control' ? '#ecc151' : 'rgba(190, 237, 217, 0.6)' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sports_golf</span>
            <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Game On</span>
          </button>
          
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, h: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>explore</span>
            <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>GPS</span>
          </button>

          {/* THE SEAMLESS KEE TRIGGER BUTTON DEAD CENTER */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button 
              onClick={() => setIsKeeOpen(true)} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', transform: 'translateY(-16px)', width: '70px' }}
              type="button"
            >
              <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', boxShadow: '0 0 20px rgba(236,193,81,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>graphic_eq</span>
              </div>
              <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>KEE</span>
            </button>
          </div>

          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, h: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: 'rgba(190, 237, 217, 0.6)' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>analytics</span>
            <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Stats</span>
          </button>
          
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, h: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: 'rgba(190, 237, 217, 0.6)' }} type="button">
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
            <p style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', animation: 'pulse 1.5s infinite' }}>Listening...</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;