import React, { useState } from 'react';
import caddyKeeLogo from './assets/logo.png';
import MissionControl from './screens/0.0_MissionControl';
import RoundIntelMain from './screens/1.0_RoundIntel/1.0_RoundIntelMain'; 
import CreateMatch from './screens/1.0_RoundIntel/1.1_CreateMatch'; 
import LiveGameMain from './screens/1.0_RoundIntel/1.2_LiveGameMain';
import GameIntelMain from './screens/2.0_GameIntel/2.0_GameIntelMain';
import EditGame from './screens/2.0_GameIntel/2.1_EditGame';
import CreateGame from './screens/2.0_GameIntel/2.2_CreateGame';
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
    activeGames: ['wolf'] // Defaulted to Wolf for initial testing
  });

  // 📝 EXTRA DATA TRANSPORTER SLOTS FOR EDIT MODES
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingGameId, setEditingGameId] = useState(null);
  const [editingMatchId, setEditingMatchId] = useState(null); // Tracking lock for editing unplayed games

  // 💬 KEE INTELLIGENCE CORE WORKSPACE STATES
  const [textInput, setTextInput] = useState('');
  const [isKeeProcessing, setIsKeeProcessing] = useState(false);
  const [chatLog, setChatLog] = useState([
    { sender: 'kee', text: "Systems online, Partner. Ready to call the wagers. Give me the hole scores or ask a rules query." }
  ]);

  // Unified Navigation Router that saves your historical footsteps
  const handleScreenNavigation = (targetScreen, contextPayload = null) => {
    let resolvedScreen = targetScreen;

    if (contextPayload) {
      if (resolvedScreen === 'edit-player' && contextPayload.playerId) {
        setEditingPlayerId(contextPayload.playerId);
      } else if (resolvedScreen === 'edit-course' && contextPayload.courseId) {
        setEditingCourseId(contextPayload.courseId); 
      } else if (resolvedScreen === 'edit-game' && contextPayload.ruleId) {
        setEditingGameId(contextPayload.ruleId);
      } else if (contextPayload.matchId) {
        // 🛡️ CRITICAL SAFETEY INTERCEPTOR:
        // If a matchId exists and someone attempts to go to 'live-game' or 'create-match' or 'edit-match',
        // check if we want to force them into the configuration editor page first.
        if (resolvedScreen === 'live-game' || resolvedScreen === 'create-match' || resolvedScreen === 'edit-match') {
          // If they came from an edit action button, or we want scheduled games to open setup first:
          setEditingMatchId(contextPayload.matchId);
          resolvedScreen = 'create-match'; // Route safely to the shared Setup Engine instead of scoring
        } else {
          setCurrentMatchContext(contextPayload);
        }
      } else {
        setCurrentMatchContext(contextPayload);
      }
    }

    // Cleanup guard: reset the editing ID if entering a completely fresh match context pass
    if (resolvedScreen === 'create-match' && (!contextPayload || !contextPayload.matchId)) {
      setEditingMatchId(null);
    }

    // STACK PUSH: Don't log duplication patterns if reloading the current screen
    if (activeScreen !== resolvedScreen) {
      setScreenHistory((prev) => [...prev, activeScreen]);
    }
    
    setActiveScreen(resolvedScreen);
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
    if (activeScreen === 'create-match') return editingMatchId ? 'EDIT ROUNDBLUEPRINT' : 'CREATE MATCH';
    if (activeScreen === 'game-intel') return 'GAME INTELLIGENCE';
    if (activeScreen === 'edit-game') return 'EDIT MASTER GAME';
    if (activeScreen === 'create-game') return 'CREATE NEW GAME';
    if (activeScreen === 'course-intel') return 'COURSE INTELLIGENCE';
    if (activeScreen === 'edit-course') return 'EDIT COURSE'; 
    if (activeScreen === 'create-course') return 'CREATE COURSE';
    if (activeScreen === 'live-game') return currentMatchContext.matchName || 'LIVE SCORECARD';
    return '';
  };

  // 📡 THE INTELLIGENT KEE CONTEXT INGESTION & REASONING LOOP SIMULATOR
  const handleSendCaddyMessage = () => {
    if (!textInput.trim()) return;

    const userMessageText = textInput.trim();
    
    // Log user input step directly into the chat list
    setChatLog(prev => [...prev, { sender: 'user', text: userMessageText }]);
    setTextInput('');
    setIsKeeProcessing(true);

    // Context Assembly Snapshot Payload
    const contextSnapshot = {
      activeGames: currentMatchContext.activeGames,
      currentCourse: currentMatchContext.courseName || 'Rockway Vineyards Golf Club',
      players: ['DH', 'Rosco', 'Timmy', 'Syv']
    };

    // Simulate Kee reasoning over your custom playbook rules (Option A Local Parser)
    setTimeout(() => {
      let keeResponseText = "I parsed that instruction against your active game rules parameters. Let me know if you need to lock that score modification.";
      const query = userMessageText.toLowerCase();

      if (query.includes('scores') || query.includes('hole')) {
        keeResponseText = "Scores recognized for Hole 1. Enforcing Rockway rotation parameters: DH was the Wolf and selected Timmy. Syv cards a net Birdie, activating a 2x Rockway Boost modifier for the Hunters' pool ledger.";
      } else if (query.includes('wolf') || query.includes('rules')) {
        keeResponseText = "Under Rockway house guidelines, the Wolf must declare partnerships immediately after a drive lands. On a player's 4th rotation turn, a Forced Solo rule applies if they have not gone lone wolf yet.";
      } else if (query.includes('leader') || query.includes('winning')) {
        keeResponseText = "Evaluating match value matrices: Rosco is currently up +$40. DH holds second place at -$10. Timmy and Syv sit at -$15.";
      }

      setChatLog(prev => [...prev, { sender: 'kee', text: keeResponseText }]);
      setIsKeeProcessing(false);
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: '#001710', minHeight: '100vh', position: 'relative', fontFamily: 'sans-serif', overflowX: 'hidden', paddingBottom: '140px', boxSizing: 'border-box' }}>
      
      {/* 👑 MASTER APP STACKED HEADER BAR */}
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
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, minWidth: 0, gap: '2px' }}>
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
          <MissionControl matchContext={currentMatchContext} onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
        )}
        {activeScreen === 'round-intel' && (
          <RoundIntelMain onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
        )}
        {activeScreen === 'create-match' && (
          <CreateMatch matchId={editingMatchId} onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
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
          <GameIntelMain onNavigate={(screen, payload) => handleScreenNavigation(screen, payload)} />
        )}
        {activeScreen === 'edit-game' && (
          <EditGame ruleId={editingGameId} onNavigate={(screen) => handleScreenNavigation(screen)} />
        )}
        {activeScreen === 'create-game' && (
          <CreateGame onNavigate={(screen) => handleScreenNavigation(screen)} />
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

      {/* 🧭 PILL CONTEXT HUD FOOTER NAV */}
      <div style={{ position: 'fixed', bottom: '24px', left: '16px', right: '16px', zIndex: 50, display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <nav style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', borderRadius: '40px', height: '80px', backgroundColor: 'rgba(14, 60, 47, 0.98)', border: '1px solid rgba(236, 193, 81, 0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
          
          <button onClick={() => handleScreenNavigation('round-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: ['round-intel', 'create-match', 'live-game'].includes(activeScreen) ? '#ecc151' : '#beedd9', opacity: ['round-intel', 'create-match', 'live-game'].includes(activeScreen) ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>sports_golf</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Rounds</span>
          </button>
          
          <button onClick={() => handleScreenNavigation('player-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: ['player-intel', 'edit-player', 'create-player'].includes(activeScreen) ? '#ecc151' : '#beedd9', opacity: ['player-intel', 'edit-player', 'create-player'].includes(activeScreen) ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>group</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Players</span>
          </button>

          {/* KEE VOICE CONTROL TRIGGER CHASSIS */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button onClick={() => setIsKeeOpen(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', color: '#ecc151', transform: 'translateY(-22px)', width: '88px', padding: 0 }} type="button">
              <div style={{ width: '78px', height: '78px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0px', boxSizing: 'border-box' }}>
                <img src={caddyKeeLogo} alt="KEE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span class="material-symbols-outlined" style="color:#ecc151;font-size:36px;">graphic_eq</span>'; }} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.08em', marginTop: '6px' }}>KEE</span>
            </button>
          </div>

          <button onClick={() => handleScreenNavigation('course-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: ['course-intel', 'edit-course', 'create-course'].includes(activeScreen) ? '#ecc151' : '#beedd9', opacity: ['course-intel', 'edit-course', 'create-course'].includes(activeScreen) ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>map</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Courses</span>
          </button>
          
          <button onClick={() => handleScreenNavigation('game-intel')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: ['game-intel', 'edit-game', 'create-game'].includes(activeScreen) ? '#ecc151' : '#beedd9', opacity: ['game-intel', 'edit-game', 'create-game'].includes(activeScreen) ? 1 : 0.6, padding: 0 }} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>swords</span>
            <span style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', marginTop: '4px' }}>Games</span>
          </button>

        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 💎 ACTIVE INTERACTIVE KEE VOICE INTELLIGENCE OVERLAY DRAWER CHASSIS       */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 130, pointerEvents: isKeeOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsKeeOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isKeeOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '12vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', backgroundColor: '#00251b', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isKeeOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(65,72,69,0.1)', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(236,193,81,0.1)', border: '1px solid #ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', borderRadius: '50%' }}>💬</div>
              <div>
                <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>KEE</h3>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>
                  {isKeeProcessing ? '● REASONING SCHEMAS...' : '● ACTIVE REALTIME INTELLIGENCE'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsKeeOpen(false)} style={{ backgroundColor: '#001710', color: '#beedd9', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Close</button>
          </div>

          {/* DYNAMIC CHAT SCROLL WINDOW VIEWPORT MODULE */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
            {chatLog.map((msg, i) => {
              const isKee = msg.sender === 'kee';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isKee ? 'flex-start' : 'flex-end', width: '100%' }}>
                  <div style={{ maxWidth: '85%', padding: '16px 20px', borderRadius: '20px', borderTopLeftRadius: isKee ? '4px' : '20px', borderTopRightRadius: isKee ? '20px' : '4px', backgroundColor: isKee ? '#001710' : '#ecc151', color: isKee ? '#beedd9' : '#3e2e00', border: isKee ? '1px solid rgba(236,193,81,0.08)' : 'none', fontSize: '14px', fontWeight: '600', lineHeight: '1.5' }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* DYNAMIC SAGE LOADING SIGNAL */}
            {isKeeProcessing && (
              <div style={{ display: 'flex', gap: '6px', height: '24px', alignItems: 'center', paddingLeft: '8px' }}>
                <style>{`
                  @keyframes wavePulse { 0%, 100% { height: 8px; opacity: 0.4; } 50% { height: 20px; opacity: 1; } }
                  .w-bar { width: 3px; background: #ecc151; border-radius: 2px; animation: wavePulse 1s ease-in-out infinite; }
                `}</style>
                <div className="w-bar" style={{ animationDelay: '0.1s' }} />
                <div className="w-bar" style={{ animationDelay: '0.3s' }} />
                <div className="w-bar" style={{ animationDelay: '0.5s' }} />
              </div>
            )}
          </div>

          {/* PRE-CONSTRUCTED SHORTCUT DRILL TAP CHIPS MAP */}
          <div style={{ padding: '0 24px', flex: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.1em', margin: 0 }}>TRY ASKING KEE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <button onClick={() => setTextInput("Lock in Hole 1 scores: DH 6, Rosco 5, Timmy 6, Syv 4. Partner was Timmy.")} style={{ backgroundColor: '#001710', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', textAlign: 'left', fontStyle: 'italic', fontSize: '13px', color: '#beedd9', cursor: 'pointer', outline: 'none' }} type="button">
                "Lock in Hole 1 scores: DH 6, Rosco 5, Timmy 6, Syv 4..."
              </button>
              <button onClick={() => setTextInput("Explain the Rockway Wolf partner selection rules")} style={{ backgroundColor: '#001710', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', textAlign: 'left', fontStyle: 'italic', fontSize: '13px', color: '#beedd9', cursor: 'pointer', outline: 'none' }} type="button">
                "Explain the Rockway Wolf partner selection rules..."
              </button>
            </div>
          </div>

          {/* INPUT BAR SUBMIT SECTION CONTROLS CHASSIS */}
          <div style={{ padding: '24px', paddingBottom: '40px', flex: 'none', borderTop: '1px solid rgba(65,72,69,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#00120b', padding: '4px', borderRadius: '30px', border: '1px solid rgba(236,193,81,0.15)' }}>
              <input 
                placeholder="Type scores or ask caddy question..." 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCaddyMessage()}
                style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 20px', color: 'white', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
              />
              <button 
                onClick={handleSendCaddyMessage}
                style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ecc151', border: 'none', color: '#3e2e00', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
                type="button"
              >
                ▲
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default App;