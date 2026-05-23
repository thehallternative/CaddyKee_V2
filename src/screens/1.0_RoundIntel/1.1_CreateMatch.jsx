import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

function CreateMatch({ onNavigate }) {
  // 💾 FULL CORE DATA CAPTURE STATE ENGINE
  const [matchName, setMatchName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Augusta National');
  const [teeDate, setTeeDate] = useState('OCT 24, 2026');
  const [teeTime, setTeeTime] = useState('08:30 AM');
  
  // High-fidelity configuration modules states matrix matching all Stitch sliders
  const [games, setGames] = useState({
    skins: { active: false, expanded: false, stakes: 10, carryOver: true },
    wolf: { active: false, expanded: false, multiplier: 2, loneWolf: false },
    match: { active: true, expanded: false, hcpScale: 100, tieBreaker: 'SUDDEN DEATH' }
  });

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
      skins: { ...prev.skins, stakes: Math.max(0, prev.skins.stakes + amount) }
    }));
  };

  const toggleSkinsCarryOver = () => {
    setGames(prev => ({
      ...prev,
      skins: { ...prev.skins, carryOver: !prev.skins.carryOver }
    }));
  };

  const toggleLoneWolf = () => {
    setGames(prev => ({
      ...prev,
      wolf: { ...prev.wolf, loneWolf: !prev.wolf.loneWolf }
    }));
  };

  const handleTieBreakerChange = (val) => {
    setGames(prev => ({
      ...prev,
      match: { ...prev.match, tieBreaker: val }
    }));
  };

  // 🚀 HIGH-FIDELITY TELEMETRY INSERTER WRITING DIRECTLY TO SUPABASE
  const handleInitializeMatch = async () => {
    try {
      // 1. Write the parent structural row parameters to public.matches
      const { data: newMatch, error: matchError } = await supabase
        .from('matches')
        .insert([
          {
            match_name: matchName || 'Saturday Skins Challenge',
            course_name: selectedCourse,
            tee_date: new Date().toISOString().split('T')[0], // Sanitizes date for PostgreSQL rules
            tee_time: '08:30:00'
          }
        ])
        .select()
        .single();

      if (matchError) throw matchError;

      // 2. Loop and generate active side-wager relational entries inside active_wagers
      const activeGameKeys = Object.keys(games).filter(g => games[g].active);
      
      if (activeGameKeys.length > 0) {
        const wagersPayload = activeGameKeys.map(gameKey => ({
          match_id: newMatch.id,
          game_type: gameKey,
          rules_configuration: games[gameKey]
        }));

        const { error: wagerError } = await supabase
          .from('active_wagers')
          .insert(wagersPayload);

        if (wagerError) throw wagerError;
      }

      // 3. Smooth forward handoff route to our Live Dynamic scoring grid matrix canvas
      onNavigate('live-game');

    } catch (err) {
      console.error('Supabase payload write error:', err.message);
      alert('Supabase Connection Failed: ' + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
      
      {/* HEADER CONTEXT LOG SECTION */}
      <header style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.2em', margin: '0 0 8px 0', fontFamily: 'sans-serif' }}>
          MATCH CONFIGURATION PROTOCOL
        </p>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white m-0">
          CREATE MATCH
        </h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* PILLAR 1: MATCH NAME PANEL */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>
            MATCH NAME
          </span>
          <div style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
            <input 
              type="text" 
              value={matchName}
              onChange={(e) => setMatchName(e.target.value)}
              placeholder="e.g., Saturday Skins Challenge" 
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontSize: '20px', fontWeight: '900', padding: 0 }}
            />
          </div>
        </section>

        {/* PILLAR 2: WHERE (COURSE GEOMETRY CONFIG) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>WHERE</span>
            <span style={{ fontSize: '10px', color: 'rgba(190,237,217,0.5)', textTransform: 'uppercase', fontWeight: '700' }}>GPS Location Enabled</span>
          </div>
          <div style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', flex: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>map</span>
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontSize: '20px', fontWeight: '900', padding: 0 }}
              />
              <p style={{ fontSize: '10px', color: 'rgba(190,237,217,0.6)', fontWeight: '700', margin: '4px 0 0 0', tracking: '0.05em' }}>
                GEORGIA, USA • 18 HOLES • PAR 72
              </p>
            </div>
          </div>
        </section>

        {/* PILLAR 3: WHEN (DATE GRID SYSTEM) */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>
            WHEN
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE DATE</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9', fontWeight: '900', fontSize: '16px' }}>
                <input type="text" value={teeDate} onChange={(e) => setTeeDate(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', padding: 0, width: '80%' }} />
                <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '18px' }}>calendar_month</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE TIME</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9', fontWeight: '900', fontSize: '16px' }}>
                <input type="text" value={teeTime} onChange={(e) => setTeeTime(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', padding: 0, width: '80%' }} />
                <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '18px' }}>schedule</span>
              </div>
            </div>
          </div>
        </section>

        {/* PILLAR 4: WHO (4-PLAYER SQUAD GRID MATRIX) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>WHO</span>
            <button style={{ background: 'none', border: 'none', color: '#ecc151', fontSize: '10px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>group_add</span> ADD GUESTS
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {/* Captain Card Frame */}
            <div style={{ backgroundColor: '#00251b', padding: '16px 8px', borderRadius: '16px', border: '1px solid #ecc151', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontStyle: 'italic', fontSize: '14px', marginBottom: '8px' }}>
                DH
              </div>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>D. HAZEN</span>
              <span style={{ fontSize: '8px', fontWeight: '900', color: '#ecc151', marginTop: '4px', tracking: '0.05em' }}>HCP: 4.2</span>
            </div>
            {/* Player Slots 2, 3, 4 */}
            {[2, 3, 4].map(idx => (
              <div key={idx} style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px dashed rgba(236,193,81,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 8px', opacity: 0.6 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(236,193,81,0.4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                </div>
                <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', marginTop: '12px', tracking: '0.05em' }}>PLAYER {idx}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PILLAR 5: WHAT (GAME MODE CONFIG PANEL MATRICES) */}
        <section style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>GAME MODE SELECTION</span>
            <span style={{ fontSize: '10px', color: 'rgba(190,237,217,0.5)', fontWeight: '700' }}>Multi-Select Enabled</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* SLIDER BOX A: SKINS */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('skins')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.skins.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>payments</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontStyle: 'italic', color: games.skins.active ? '#ecc151' : 'rgba(190,237,217,0.6)', tracking: '0.05em' }}>SKINS</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Standard Hole Wagers</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('skins'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.skins.active ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.skins.active ? '#3e2e00' : '#414845', transform: games.skins.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>
              
              {games.skins.active && games.skins.expanded && (
                <div style={{ padding: '20px 24px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>STAKES PER HOLE</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.5)' }}>Skins base unit wager</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#0e3c2f', padding: '6px 16px', borderRadius: '24px' }}>
                      <button onClick={(e) => { e.stopPropagation(); adjustSkinsStakes(-5); }} style={{ background: 'none', border: 'none', color: '#ecc151', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>-</button>
                      <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '16px' }}>${games.skins.stakes}</span>
                      <button onClick={(e) => { e.stopPropagation(); adjustSkinsStakes(5); }} style={{ background: 'none', border: 'none', color: '#ecc151', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>CARRY OVER</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.5)' }}>Pushes apply to next hole</p>
                    </div>
                    <div onClick={toggleSkinsCarryOver} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.skins.carryOver ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.skins.carryOver ? '#3e2e00' : '#414845', transform: games.skins.carryOver ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SLIDER BOX B: WOLF */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('wolf')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.wolf.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>pets</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontStyle: 'italic', color: games.wolf.active ? '#ecc151' : 'rgba(190,237,217,0.6)', tracking: '0.05em' }}>WOLF</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Rotating Team Captain</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('wolf'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.wolf.active ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.wolf.active ? '#3e2e00' : '#414845', transform: games.wolf.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {games.wolf.active && games.wolf.expanded && (
                <div style={{ padding: '20px 24px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>WOLF POINT SCALE</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.5)' }}>Win/Loss base multiplier</p>
                    </div>
                    <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '14px', tracking: '0.1em' }}>X {games.wolf.multiplier}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>LONE WOLF POT</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.5)' }}>Double payouts for solo declaration win</p>
                    </div>
                    <div onClick={toggleLoneWolf} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.wolf.loneWolf ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.wolf.loneWolf ? '#3e2e00' : '#414845', transform: games.wolf.loneWolf ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SLIDER BOX C: MATCH PLAY */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('match')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.match.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>swords</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontStyle: 'italic', color: games.match.active ? '#ecc151' : 'rgba(190,237,217,0.6)', tracking: '0.05em' }}>MATCH PLAY</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Head-to-Head Scoring Matrix</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('match'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.match.active ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.match.active ? '#3e2e00' : '#414845', transform: games.match.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {games.match.active && games.match.expanded && (
                <div style={{ padding: '20px 24px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>HANDICAP SCALE</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.5)' }}>Application ratio of net stroke index</p>
                    </div>
                    <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '14px' }}>{games.match.hcpScale}%</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>TIE BREAKER RULE</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.5)' }}>Resolution approach for all-square finish</p>
                    </div>
                    <select 
                      value={games.match.tieBreaker}
                      onChange={(e) => handleTieBreakerChange(e.target.value)}
                      style={{ backgroundColor: '#0e3c2f', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '10px', fontWeight: '900', color: '#ecc151', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="SUDDEN DEATH">SUDDEN DEATH</option>
                      <option value="MATCH HALVED">MATCH HALVED</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* FINAL TELEMETRY EXECUTION TRIGGER CONTAINER */}
        <div style={{ paddingTop: '28px', paddingBottom: '20px' }}>
          <button 
            onClick={handleInitializeMatch}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifycontent: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(236,193,81,0.15)' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>power_settings_new</span>
            INITIALIZE MATCH TELEMETRY
          </button>
          <p style={{ fontSize: '8px', color: 'rgba(190,237,217,0.3)', fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em', textAlign: 'center', marginTop: '16px', letterSpacing: '0.15em' }}>
            ENCRYPTING TELEMETRY PROTOCOL STREAM...
          </p>
        </div>

      </div>
    </div>
  );
}

export default CreateMatch;