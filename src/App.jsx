import React, { useState } from 'react';
import caddyKeeLogo from './assets/logo.png';

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
    <div style={{ backgroundColor: '#001710', minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', overflowX: 'hidden', paddingBottom: '160px', boxSizing: 'border-box' }}>
      
      {/* 1. SYMMETRIC FIXED TOP HEADER */}
      <header style={{ width: '100%', padding: '24px 24px 16px 24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(0, 23, 16, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        
        {/* Left Anchor Circular Badge */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          {activeScreen === 'mission-control' ? (
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              <button 
                style={{ color: '#ecc151', padding: 0, border: 'none', background: 'none', backgroundColor: 'transparent', outline: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>home</span>
              </button>
            </div>
          ) : (
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              <button 
                onClick={() => setActiveScreen('mission-control')}
                style={{ color: '#ecc151', padding: 0, border: 'none', background: 'none', backgroundColor: 'transparent', outline: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: '900' }}>arrow_back</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Center Title Logo Anchor */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
          <button
            onClick={() => setActiveScreen('mission-control')}
            style={{ background: 'none', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', outline: 'none', padding: 0 }}
            type="button"
          >
            <h1 style={{ color: '#ecc151', fontFamily: 'sans-serif', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em', fontSize: '26px', lineHeight: '1', margin: 0 }}>CADDYKEE</h1>
          </button>
        </div>
        
        {/* Right Anchor Circular Badge */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', fontWeight: '900', fontSize: '11px', boxSizing: 'border-box' }}>
            DH
          </div>
        </div>
      </header>

      {/* 2. SCROLLABLE CANVAS ZONE */}
      <main className="px-6 pt-4 max-w-xl mx-auto w-full box-border" style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* VIEW A: MISSION CONTROL (LANDING DASHBOARD) */}
        {activeScreen === 'mission-control' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '10px 0 28px 0' }}>MISSION CONTROL</h2>

            {/* 4-MODULE INTELLIGENCE GRID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              
              {/* 1. Round Intelligence */}
              <button 
                onClick={() => setActiveScreen('live-scoring')} 
                style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
                type="button"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>trophy</span>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-01</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineheight: '1' }}>Round Intelligence</h3>
                  <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Initialize live match telemetry or configure multi-group tournaments</p>
                </div>
              </button>

              {/* 2. Player Intelligence */}
              <button 
                style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
                type="button"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>group</span>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-02</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineheight: '1' }}>Player Intelligence</h3>
                  <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Manage playing roster profiles, indexes, and historical squads</p>
                </div>
              </button>

              {/* 3. Course Intelligence */}
              <button 
                style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
                type="button"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>map</span>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-03</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineheight: '1' }}>Course Intelligence</h3>
                  <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Audit local scorecard data, stroke indexing, and structural coordinates</p>
                </div>
              </button>

              {/* 4. Game Intelligence */}
              <button 
                style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
                type="button"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>gavel</span>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-04</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineheight: '1' }}>Game Intelligence</h3>
                  <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Build wager calculations, automate presses, and customize rules formats</p>
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

            <div className="flex p-1 rounded-full border w-full box-border" style={{ backgroundColor: '#002117', borderColor: 'rgba(236,193,81,0.1)' }}>
              <button className="flex-1 py-2.5 rounded-full font-black italic uppercase text-[11px] tracking-widest border-none cursor-pointer" style={{ backgroundColor: '#ecc151', color: '#3e2e00' }} type="button">
                SCORING
              </button>
              <button className="flex-1 py-2.5 rounded-full font-black italic uppercase text-[11px] tracking-widest border-none cursor-pointer bg-transparent" style={{ color: 'rgba(190, 237, 217, 0.6)' }} type="button">
                STANDINGS
              </button>
            </div>

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

      {/* 3. PERSISTENT FLOATING HUD NAVIGATION PILL */}
      <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 50, display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <nav style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', borderRadius: '40px', height: '80px', backgroundColor: 'rgba(14, 60, 47, 0.98)', border: '1px solid rgba(236, 193, 81, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
          
          {/* Button 1: Game On */}
          <button 
            onClick={() => setActiveScreen('mission-control')} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontWeight: 'bold' }}>sports_golf</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Game On</span>
          </button>
          
          {/* Button 2: My Bag - PRECISE STAND BAG ASSET TRACE */}
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', padding: 0 }} type="button">
            <svg style={{ width: '25px', height: '25px' }} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Three detailed angled golf clubs extending out of the top cylinder opening */}
              <path d="M19 14.5C18.2 11.2 18.7 7.2 20.8 6C22.8 4.6 24.8 6.6 24.8 9.7" stroke="#ecc151" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M23 14.5C24 11.2 26 8.5 29 7.5C31.6 6.5 33 8.5 31.6 11.5" stroke="#ecc151" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M26.5 14.5C27.7 11.9 30.1 9.9 32.5 10.5C34.5 11.1 34.1 13.5 31.6 14.5" stroke="#ecc151" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Deployable Dual Stand Stabilization Legs Structure */}
              <path d="M16 23.5L9 36" stroke="#ecc151" strokeWidth="3.2" strokeLinecap="round"/>
              <path d="M25.5 25L31.5 35" stroke="#ecc151" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
              {/* Main Slanted Standing Carry Bag Container Hull */}
              <path d="M17.5 14.5H29.5L26.5 38.5H18.5L17.5 14.5Z" fill="#0e3c2f" stroke="#ecc151" strokeWidth="3" strokeLinejoin="round"/>
              {/* Padded Contoured Backpack Shoulder Carrying Harness Straps */}
              <path d="M17.5 20.5C12.5 21.5 10.5 25.5 10.5 29.5C10.5 33.5 13.5 36.5 17.5 36.5" stroke="#ecc151" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Structural Dual Zip Pocket Seams */}
              <path d="M20.5 24.5H26.5M19.5 32.5H25.5" stroke="#ecc151" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>My Bag</span>
          </button>

          {/* Button 3: KEE (MAXI-SCALE CENTRAL EMBLEM ACTUATOR) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button 
              onClick={() => setIsKeeOpen(true)} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', transform: 'translateY(-20px)', width: '76px' }}
              type="button"
            >
              {/* Enhanced core profile layout expanded outwards to full 66px footprint */}
              <div style={{ width: '66px', height: '66px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', boxShadow: '0 0 25px rgba(236,193,81,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '3px', boxSizing: 'border-box' }}>
                <img 
                  src={caddyKeeLogo} 
                  alt="KEE" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="material-symbols-outlined" style="color:#ecc151;font-size:32px;">graphic_eq</span>';
                  }}
                />
              </div>
              <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.07em', marginTop: '5px' }}>KEE</span>
            </button>
          </div>

          {/* Button 4: Clubhouse */}
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontWeight: 'bold' }}>meeting_room</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px', whiteSpace: 'nowrap' }}>Clubhouse</span>
          </button>
          
          {/* Button 5: Menu */}
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontWeight: 'bold' }}>more_horiz</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Menu</span>
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