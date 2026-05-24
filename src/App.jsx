import React, { useState } from 'react';
import caddyKeeLogo from './assets/logo.png';
import MissionControl from './screens/0.0_MissionControl';
import RoundIntelMain from './screens/1.0_RoundIntel/1.0_RoundIntelMain'; 
import CreateMatch from './screens/1.0_RoundIntel/1.1_CreateMatch'; 
import LiveGameMain from './screens/1.0_RoundIntel/1.2_LiveGameMain';
import GameIntelMain from './screens/2.0_GameIntel/2.0_GameIntelMain';
import PlayerIntelMain from './screens/3.0_PlayerIntel/3.0_PlayerIntelMain';
import EditPlayer from './screens/3.0_PlayerIntel/3.1_EditPlayer';
import CreatePlayer from './screens/3.0_PlayerIntel/3.2_CreatePlayer';
import CourseIntelMain from './screens/4.0_CourseIntel/4.0_CourseIntelMain';
import EditCourse from './screens/4.0_CourseIntel/4.1_EditCourse';
import CreateCourse from './screens/4.0_CourseIntel/4.2_CreateCourse';

function App() {
  const [isKeeOpen, setIsKeeOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('mission-control');
  
  // 🧭 THE AUTOMATIC NAVIGATION STACK ARRAYS
  const [screenHistory, setScreenHistory] = useState([]);

  // 🧭 THE FAST-SESSION DATA TRANSPORTER SLOTS
  const [currentMatchContext, setCurrentMatchContext] = useState({
    matchId: null,
    matchName: '',
    courseName: '',
    activeGames: ['match_play']
  });

  // 📝 EXTRA DATA TRANSPORTER SLOTS FOR EDIT MODES
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Unified Navigation Router that saves your historical footsteps
  const handleScreenNavigation = (targetScreen, contextPayload = null) => {
    if (contextPayload) {
      if (targetScreen === 'edit-player' && contextPayload.playerId) {
        setEditingPlayerId(contextPayload.playerId);
      } else if (targetScreen === 'edit-course' && contextPayload.courseId) {
        setEditingCourseId(contextPayload.courseId); 
      } else {
        setCurrentMatchContext(contextPayload);
      }
    }

    // STACK PUSH: Don't log duplication patterns if reloading the current screen
    if (activeScreen !== targetScreen) {
      setScreenHistory((prev) => [...prev, activeScreen]);
    }
    
    setActiveScreen(targetScreen);
  };

  // STACK POP: Dynamic back-tracking navigation engine loop
  const handleHeaderBackTransition = () => {
    if (screenHistory.length === 0) {
      setActiveScreen('mission-control');
      return;
    }

    const updatedHistory = [...screenHistory];
    const previousScreen = updatedHistory.pop();

    setScreenHistory(updatedHistory);
    setActiveScreen(previousScreen);
  };

  // Custom Human-Readable Screen Header Title Formatter
  const getScreenSubTitleString = () => {
    if (activeScreen === 'mission-control') return 'WELCOME';
    if (activeScreen === 'player-intel') return 'PLAYER INTELLIGENCE';
    if (activeScreen === 'edit-player') return 'EDIT PLAYER'; 
    if (activeScreen === 'create-player') return 'CREATE PLAYER';
    if (activeScreen === 'round-intel') return 'ROUND INTELLIGENCE';
    if (activeScreen === 'create-match') return 'CREATE MATCH';
    if (activeScreen === 'game-intel') return 'GAME INTELLIGENCE';
    if (activeScreen === 'course-intel') return 'COURSE INTELLIGENCE';
    if (activeScreen === 'edit-course') return 'EDIT COURSE'; 
    if (activeScreen === 'create-course') return 'CREATE COURSE';
    if (activeScreen === 'live-game') return currentMatchContext.matchName || 'LIVE SCORECARD';
    return '';
  };

  return (
    <div style={{ backgroundColor: '#001710', minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', overflowX: 'hidden', paddingBottom: '140px', boxSizing: 'border-box' }}>
      
      {/* 👑 MASTER APP STACKED HEADER BAR - STABLE IDENTIFIER FOR ALL VIEWS */}
      <header style={{ width: '100%', padding: '24px 24px 16px 24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(0, 23, 16, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <button 
              onClick={handleHeaderBackTransition}
              style={{ color: '#ecc151', padding: 0, border: 'none', background: 'none', backgroundColor: 'transparent', outline: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {activeScreen === 'mission-control' ? 'home' : 'arrow_back'}
              </span>
            </button>
          </div>
        </div>
        
        {/* 🎨 STACKED BRAND DESIGN: CaddyKee App Identity locked above clean contextual subtitle string */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, minWidth: 0, gap: '2px' }}>
          {/* 🚀 FIXED LINK: Tapping branding clearing history matrices and maps home */}
          <h1 
            onClick={() => {
              setScreenHistory([]);
              setActiveScreen('mission-control');
            }}
            style={{ color: '#ecc151', fontFamily: 'sans-serif', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em', fontSize: '24px', lineHeight: '1', margin: 0, cursor: 'pointer' }}
          >
            CADDYKEE
          </h1>
          <span style={{ color: '#beedd9', fontSize: '10px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', tracking: '0.05em', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {getScreenSubTitleString()}
          </span>
        </div>
        
        <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            onClick={() => handleScreenNavigation('player-intel')}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ecc151', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', fontWeight: '900', fontSize: '11px', boxSizing: 'border-box', cursor: 'pointer', padding: 0 }}
            type="button"
          >
            DH
          </button>
        </div>
      </header>

      {/* CORE ROUTING ENGINE INJECTION */}
      <main className="px-6 pt-4 max-w-xl mx-auto w-full box-border" style={{ display: 'flex', flexDirection: 'column' }}>
        {activeScreen === 'mission-control' && (
          <MissionControl matchContext={currentMatchContext} onNavigate={(screen) => handleScreenNavigation(screen)} />
        )}
        {activeScreen === 'round-intel' && (
          <RoundIntelMain onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
        )}
        {activeScreen === 'create-match' && (
          <CreateMatch onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
        )}
        {activeScreen === 'live-game' && (
          <LiveGameMain 
            matchId={currentMatchContext.matchId}
            matchName={currentMatchContext.matchName}
            courseName={currentMatchContext.courseName}
            activeGames={currentMatchContext.activeGames} 
            onNavigate={(screen) => handleScreenNavigation(screen)} 
          />
        )}
        {activeScreen === 'game-intel' && (
          <GameIntelMain onNavigate={(screen) => handleScreenNavigation(screen)} />
        )}
        {activeScreen === 'player-intel' && (
          <PlayerIntelMain onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
        )}
        {activeScreen === 'edit-player' && (
          <EditPlayer playerId={editingPlayerId} onNavigate={(screen) => handleScreenNavigation(screen)} />
        )}
        {activeScreen === 'create-player' && (
          <CreatePlayer onNavigate={(screen) => handleScreenNavigation(screen)} />
        )}
        {activeScreen === 'course-intel' && (
          <CourseIntelMain onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
        )}
        {activeScreen === 'edit-course' && (
          <EditCourse courseId={editingCourseId} onNavigate={(screen) => handleScreenNavigation(screen)} />
        )}
        {activeScreen === 'create-course' && (
          <CreateCourse onNavigate={(screen) => handleScreenNavigation(screen)} />
        )}
      </main>

      {/* 🧭 PILL CONTEXT HUD FOOTER NAV - FULL ALIGNMENT PILL FIXED */}
      <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 50, display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <nav style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', borderRadius: '40px', height: '80px', backgroundColor: 'rgba(14, 60, 47, 0.98)', border: '1px solid rgba(236, 193, 81, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
          
          {/* Mapped Action Pillar 1: Rounds Setup */}
          <button onClick={() => handleScreenNavigation('round-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: ['round-intel', 'create-match', 'live-game'].includes(activeScreen) ? '#ecc151' : '#beedd9', opacity: ['round-intel', 'create-match', 'live-game'].includes(activeScreen) ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>sports_golf</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Rounds</span>
          </button>
          
          {/* Mapped Action Pillar 2: Roster Profiles */}
          <button onClick={() => handleScreenNavigation('player-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: ['player-intel', 'edit-player', 'create-player'].includes(activeScreen) ? '#ecc151' : '#beedd9', opacity: ['player-intel', 'edit-player', 'create-player'].includes(activeScreen) ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>group</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Players</span>
          </button>

          {/* KEE VOICE TARGET CONTROL MODAL INTERFACE TRIGGER */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button onClick={() => setIsKeeOpen(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', transform: 'translateY(-20px)', width: '76px', padding: 0 }} type="button">
              <div style={{ width: '66px', height: '66px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', boxShadow: '0 0 25px rgba(236,193,81,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '3px', boxSizing: 'border-box' }}>
                <img src={caddyKeeLogo} alt="KEE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span class="material-symbols-outlined" style="color:#ecc151;font-size:32px;">graphic_eq</span>'; }} />
              </div>
              <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.07em', marginTop: '5px' }}>KEE</span>
            </button>
          </div>

          {/* Mapped Action Pillar 4: Courses Intel Map Sheets Link */}
          <button onClick={() => handleScreenNavigation('course-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: ['course-intel', 'edit-course', 'create-course'].includes(activeScreen) ? '#ecc151' : '#beedd9', opacity: ['course-intel', 'edit-course', 'create-course'].includes(activeScreen) ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>map</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Courses</span>
          </button>
          
          {/* Mapped Action Pillar 5: Games Rulesets Engine Matrix Link */}
          <button onClick={() => handleScreenNavigation('game-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: activeScreen === 'game-intel' ? '#ecc151' : '#beedd9', opacity: activeScreen === 'game-intel' ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>swords</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Games</span>
          </button>

        </nav>
      </div>

      {/* GLOBAL KEE VOICE INTELLIGENCE OVERLAY DRAWER CHASSIS */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 130, pointerEvents: isKeeOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsKeeOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isKeeOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '12vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', backgroundColor: '#00251b', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isKeeOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(65,72,69,0.1)', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(236,193,81,0.1)', border: '1px solid #ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', borderRadius: '50%' }}>💬</div>
              <div>
                <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>KEE</h3>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>● ACTIVE INTELLIGENCE</span>
              </div>
            </div>
            <button onClick={() => setIsKeeOpen(false)} style={{ backgroundColor: '#001710', color: '#beedd9', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Close</button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', boxSizing: 'border-box', textAlign: 'center', gap: '32px' }}>
            <div>
              <p style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '18px', margin: '0 0 16px 0', tracking: '0.05em' }}>Listening...</p>
              <div style={{ display: 'flex', gap: '6px', height: '40px', alignItems: 'center', justifyContent: 'center' }}>
                <style>{`
                  @keyframes wavePulse { 0%, 100% { height: 10px; } 50% { height: 36px; } }
                  .w-bar { width: 4px; background: #ecc151; border-radius: 2px; animation: wavePulse 1.2s ease-in-out infinite; }
                `}</style>
                <div className="w-bar" style={{ animationDelay: '0.1s' }} />
                <div className="w-bar" style={{ animationDelay: '0.3s' }} />
                <div className="w-bar" style={{ animationDelay: '0.5s' }} />
                <div className="w-bar" style={{ animationDelay: '0.2s' }} />
                <div className="w-bar" style={{ animationDelay: '0.1s' }} />
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
              <p style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(190,237,217,0.5)', tracking: '0.1em', marginBottom: '12px' }}>TRY ASKING</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', textAlign: 'left', fontStyle: 'italic', fontSize: '13px', color: '#beedd9' }}>"What's the wind doing on the 4th?"</div>
                <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', textAlign: 'left', fontStyle: 'italic', fontSize: '13px', color: '#beedd9' }}>"Who's leading the tournament?"</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px', paddingBottom: '40px', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#00120b', padding: '4px', borderRadius: '30px', border: '1px solid rgba(236,193,81,0.1)' }}>
              <input placeholder="Type a caddy message..." style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 20px', color: 'white', outline: 'none', fontSize: '14px' }} />
              <button style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ecc151', border: 'none', color: '#3e2e00', display: 'flex', alignItems: 'center', justifyContent: 'center' }} type="button">▲</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;