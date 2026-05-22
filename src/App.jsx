import React, { useState } from 'react';
import caddyKeeLogo from './assets/logo.png';
import MissionControl from './screens/0.0_MissionControl';

function App() {
  const [isKeeOpen, setIsKeeOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('mission-control');

  return (
    <div style={{ backgroundColor: '#001710', minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', overflowX: 'hidden', paddingBottom: '140px', boxSizing: 'border-box' }}>
      
      {/* 1. PERSISTENT TOP HEADER UNIFORMITY */}
      <header style={{ width: '100%', padding: '24px 24px 16px 24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(0, 23, 16, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        
        {/* Left Circular Badge Frame */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <button 
              onClick={() => setActiveScreen('mission-control')}
              style={{ color: '#ecc151', padding: 0, border: 'none', background: 'none', backgroundColor: 'transparent', outline: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {activeScreen === 'mission-control' ? 'home' : 'arrow_back'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Centered Title Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
          <button
            onClick={() => setActiveScreen('mission-control')}
            style={{ background: 'none', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', outline: 'none', padding: 0 }}
            type="button"
          >
            <h1 style={{ color: '#ecc151', fontFamily: 'sans-serif', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em', fontSize: '26px', lineHeight: '1', margin: 0 }}>CADDYKEE</h1>
          </button>
        </div>
        
        {/* Right Circular Avatar Badge Frame */}
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', fontWeight: '900', fontSize: '11px', boxSizing: 'border-box' }}>
            DH
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC CONTENT INJECTION MOUNT */}
      <main className="px-6 pt-4 max-w-xl mx-auto w-full box-border" style={{ display: 'flex', flexDirection: 'column' }}>
        {activeScreen === 'mission-control' && (
          <MissionControl onNavigate={(screen) => setActiveScreen(screen)} />
        )}
        
        {/* Temporary routing placeholders for upcoming file drops */}
        {activeScreen !== 'mission-control' && (
          <div style={{ textAlign: 'center', color: '#beedd9', padding: '40px 0', opacity: 0.6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ecc151', marginBottom: '16px' }}>construction</span>
            <h3 style={{ textTransform: 'uppercase', fontStyle: 'italic', fontWeight: '900', margin: 0 }}>Sub-Page Connected</h3>
            <p style={{ fontSize: '12px', marginTop: '6px' }}>Ready to parse input properties for channel path: "{activeScreen}"</p>
          </div>
        )}
      </main>

      {/* 3. PERSISTENT FIXED NAVIGATION HUD PILL */}
      <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 50, display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <nav style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', borderRadius: '40px', height: '80px', backgroundColor: 'rgba(14, 60, 47, 0.98)', border: '1px solid rgba(236, 193, 81, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
          
          <button 
            onClick={() => setActiveScreen('mission-control')} 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontWeight: 'bold' }}>sports_golf</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Game On</span>
          </button>
          
          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', padding: 0 }} type="button">
            <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 5.5C15 4 16.5 2.8 18 2.2C19.2 1.8 19.8 2.5 19.2 3.8L17.5 6.5" stroke="#ecc151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 5.5C12.8 3.5 14 1.8 15.5 1.2C16.8 0.8 17.5 1.8 16.8 3.2L15 6" stroke="#ecc151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 5.5C10.5 3.8 11.2 2.2 12.5 1.8C13.8 1.5 14.2 2.5 13.8 3.8L12.5 6" stroke="#ecc151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 6.5H15.5L13.5 22.5H8.5L9.5 6.5Z" fill="#0e3c2f" stroke="#ecc151" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9.5 7.5C8.2 7.5 7.5 8.5 7.5 9.5V11.5C7.5 12.5 8.2 13.5 9.5 13.5" stroke="#ecc151" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M11 11.5L16.5 22" stroke="#ecc151" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 14.5L7.5 22" stroke="#ecc151" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>My Bag</span>
          </button>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button 
              onClick={() => setIsKeeOpen(true)} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', transform: 'translateY(-20px)', width: '76px' }}
              type="button"
            >
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

          <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151' }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontWeight: 'bold' }}>meeting_room</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px', whiteSpace: 'nowrap' }}>Clubhouse</span>
          </button>
          
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