import React, { useState } from 'react';

function CreateMatch({ onNavigate }) {
  // 💾 SUPABASE-READY DATA CAPTURE STATES
  const [matchName, setMatchName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Augusta National');
  const [teeDate, setTeeDate] = useState('OCT 24, 2026');
  const [teeTime, setTeeTime] = useState('08:30 AM');
  
  // Game Selector Framework States
  const [games, setGames] = useState({
    skins: { active: false, expanded: false, stakes: 10, carryOver: true },
    wolf: { active: false, expanded: false, multiplier: 2, loneWolf: false },
    match: { active: true, expanded: false, hcpScale: 100, tieBreaker: 'SUDDEN DEATH' }
  });

  // Toggle handling for game modes selection variables
  const handleGameToggle = (gameId) => {
    setGames(prev => ({
      ...prev,
      [gameId]: { ...prev[gameId], active: !prev[gameId].active }
    }));
  };

  const handleDrawerExpand = (gameId) => {
    if (!games[gameId].active) return;
    setGames(prev => ({
      ...prev,
      [gameId]: { ...prev[gameId], expanded: !prev[gameId].expanded }
    }));
  };

  const adjustSkinsStakes = (amount) => {
    setGames(prev => ({
      ...prev,
      skins: { ...prev[gameId = 'skins'], stakes: Math.max(1, prev.skins.stakes + amount) }
    }));
  };

  // 🚀 INITIALIZE ENCRYPTED TELEMETRY WRITE HOOK (SUPABASE TARGET ENGINE)
  const handleInitializeMatch = async () => {
    const matchPayload = {
      match_name: matchName || 'Saturday Challenge Match',
      course_name: selectedCourse,
      tee_date: teeDate,
      tee_time: teeTime,
      active_games: Object.keys(games).filter(g => games[g].active),
      game_configurations: games,
      created_at: new Date().toISOString()
    };

    console.log('Writing payload telemetry parameters to Supabase:', matchPayload);
    
    /* Next Step:
       const { data, error } = await supabase.from('matches').insert([matchPayload]);
    */
    
    // Smooth change to the live game views dashboard canvas loop
    onNavigate('live-game');
  };

  return (
    <div style={{ textAlign: 'left', width: '100%' }}>
      
      {/* SECTION: CONTEXT SPEC PROTOCOL HEADER */}
      <header style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.2em', margin: '0 0 4px 0' }}>MATCH CONFIGURATION PROTOCOL</p>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white m-0">CREATE MATCH</h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* INPUT LAYOUT CARD: MATCH NAME */}
        <section>
          <span style={{ fontSize: '9px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.25em', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>MATCH NAME</span>
          <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)' }}>
            <input 
              type="text" 
              value={matchName}
              onChange={(e) => setMatchName(e.target.value)}
              placeholder="e.g., Saturday Skins Challenge" 
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontSize: '18px', fontWeight: '700', padding: 0 }}
            />
          </div>
        </section>

        {/* INPUT LAYOUT CARD: WHERE (GPS CAPABLE) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.25em' }}>WHERE</span>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.4)', textTransform: 'uppercase' }}>GPS Core Tracking Enabled</span>
          </div>
          <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', flex: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>map</span>
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontSize: '18px', fontWeight: '700', padding: 0 }}
              />
              <p style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', margin: '4px 0 0 0', letterSpacing: '0.05em' }}>GEORGIA, USA • 18 HOLES • PAR 72</p>
            </div>
          </div>
        </section>

        {/* INPUT LAYOUT GRID: WHEN (DATETIME SELECTION CAPABILITY) */}
        <section>
          <span style={{ fontSize: '9px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.25em', display: 'block', marginBottom: '8px', paddingLeft: '4px' }}>WHEN</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: '#0e3c2f', padding: '16px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.4)', display: 'block', marginBottom: '4px' }}>TEE DATE</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9', fontWeight: '700' }}>
                <span>{teeDate}</span>
                <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '16px' }}>calendar_month</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#0e3c2f', padding: '16px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.4)', display: 'block', marginBottom: '4px' }}>TEE TIME</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9', fontWeight: '700' }}>
                <span>{teeTime}</span>
                <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '16px' }}>schedule</span>
              </div>
            </div>
          </div>
        </section>

        {/* ROSTER SECTION: WHO (THE APP FOURSOME MATRIX) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.25em' }}>WHO (FOURSOME MATCH)</span>
            <button style={{ background: 'none', border: 'none', color: '#ecc151', fontSize: '9px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group_add</span> ADD SQUAD
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {/* Active Captain Node */}
            <div style={{ backgroundColor: '#00251b', padding: '12px 6px', borderRadius: '12px', border: '1px solid #ecc151', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontStyle: 'italic', fontSize: '12px', marginBottom: '6px' }}>DH</div>
              <span style={{ fontSize: '9px', fontWeight: '900', color: '#white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>D. HAZEN</span>
              <span style={{ fontSize: '8px', fontWeight: '700', color: '#ecc151', marginTop: '2px' }}>CAPTAIN</span>
            </div>
            {/* Slot 2, 3, 4 placeholders matching image trace parameters */}
            {[2, 3, 4].map(slotIdx => (
              <div key={slotIdx} style={{ backgroundColor: '#0e3c2f', borderRadius: '12px', border: '1px dashed rgba(236,193,81,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 6px', opacity: 0.6 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(236,193,81,0.4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                </div>
                <span style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(190,237,217,0.4)', marginTop: '8px', letterSpacing: '0.05em' }}>PLAYER {slotIdx}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ENGINE UNIT: WHAT (TACTICAL GAME SELECTION LABELS) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.25em' }}>GAME MODE SELECTION</span>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.4)', textTransform: 'uppercase' }}>Multi-Wager Calculation Mode</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* GAME SELECTION ELEMENT LOG: SKINS */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('skins')} style={{ padding: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.skins.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>payments</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '900', fontStyle: 'italic', color: games.skins.active ? '#ecc151' : 'rgba(190,237,217,0.6)', letterSpacing: '0.05em' }}>SKINS</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Standard Hole Wagers</p>
                </div>
                {/* Embedded Custom High-Contrast Toggle Switch Component */}
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('skins'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.skins.active ? '#ecc151' : '#001710', position: 'relative', transition: 'background-color 0.2s', padding: '2px', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.skins.active ? '#3e2e00' : '#414845', transform: games.skins.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>
              
              {/* Context Nested Settings Drawer Expand block */}
              {games.skins.active && games.skins.expanded && (
                <div style={{ padding: '16px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#beedd9' }}>UNIT BASE VALUE</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#0e3c2f', padding: '4px 12px', borderRadius: '20px' }}>
                      <button onClick={(e) => { e.stopPropagation(); adjustSkinsStakes(-5); }} style={{ background: 'none', border: 'none', color: '#ecc151', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>-</button>
                      <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900' }}>${games.skins.stakes}</span>
                      <button onClick={(e) => { e.stopPropagation(); adjustSkinsStakes(5); }} style={{ background: 'none', border: 'none', color: '#ecc151', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GAME SELECTION ELEMENT LOG: WOLF */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('wolf')} style={{ padding: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.wolf.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>pets</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '900', fontStyle: 'italic', color: games.wolf.active ? '#ecc151' : 'rgba(190,237,217,0.6)', letterSpacing: '0.05em' }}>WOLF</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Rotating Honor System Captain</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('wolf'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.wolf.active ? '#ecc151' : '#001710', position: 'relative', transition: 'background-color 0.2s', padding: '2px', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.wolf.active ? '#3e2e00' : '#414845', transform: games.wolf.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>
            </div>

            {/* GAME SELECTION ELEMENT LOG: MATCH PLAY */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('match')} style={{ padding: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.match.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>swords</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '900', fontStyle: 'italic', color: games.match.active ? '#ecc151' : 'rgba(190,237,217,0.6)', letterSpacing: '0.05em' }}>MATCH PLAY</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Classic Head-to-Head Multi-Hole Matrix</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('match'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.match.active ? '#ecc151' : '#001710', position: 'relative', transition: 'background-color 0.2s', padding: '2px', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.match.active ? '#3e2e00' : '#414845', transform: games.match.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* DEPLOY ACTION COMPONENT: INITIALIZE PROTOCOL WRITER */}
        <div style={{ paddingTop: '20px' }}>
          <button 
            onClick={handleInitializeMatch}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '20px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(236,193,81,0.15)' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>power_settings_new</span>
            INITIALIZE MATCH TELEMETRY
          </button>
          <p style={{ fontSize: '8px', color: 'rgba(190,237,217,0.3)', fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em', textAlign: 'center', marginTop: '12px', letterSpacing: '0.15em' }}>ENCRYPTING TELEMETRY PROTOCOL STREAM...</p>
        </div>

      </div>
    </div>
  );
}

export default CreateMatch;