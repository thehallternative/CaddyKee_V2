import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function CreateMatch({ onNavigate }) {
  // 💾 STANDARDIZED PICKER & LIVE DATABASE COUPLING STATES
  const [matchName, setMatchName] = useState('');
  
  // Custom Mobile UI Sliding Drawer Layer Matrix
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);

  // Initialize with standard current formats so pickers aren't empty on mount
  const [teeDate, setTeeDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [teeTime, setTeeTime] = useState('08:30'); 

  const [games, setGames] = useState({
    skins: { active: false, expanded: false, stakes: 10, carryOver: true },
    wolf: { active: false, expanded: false, multiplier: 2, loneWolf: false },
    match: { active: true, expanded: false, hcpScale: 100, tieBreaker: 'SUDDEN DEATH' }
  });

  // 📡 ASYNC MOUNT TELEMETRY LOAD (PATTERN 1)
  useEffect(() => {
    async function streamCourseMapRegistry() {
      try {
        setLoadingCourses(true);
        const { data, error } = await supabase
          .from('course_map')
          .select('id, course_name, location_city')
          .eq('is_active', true)
          .order('course_name', { ascending: true });

        if (error) throw error;
        
        setCoursesList(data || []);
        if (data && data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to query course_map channels:', err.message);
      } finally {
        setLoadingCourses(false);
      }
    }
    streamCourseMapRegistry();
  }, []);

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

  // Find Currently Active Selected Course Object Profile safely
  const currentSelectedCourse = coursesList.find(c => c.id === selectedCourseId);

  // 🚀 ACTIVE PAYLOAD DATA EMISSION
  const handleInitializeMatch = async () => {
    try {
      // Clean time input string to include standard seconds matrix format for PostgreSQL compatibility
      const sanitizedTime = teeTime.length === 5 ? `${teeTime}:00` : teeTime;

      // Map course ID back to string name parameters for target matches schema insertion row
      const targetCourseName = currentSelectedCourse ? currentSelectedCourse.course_name : 'Unknown Course';

      // 1. Dispatch clean, sanitized structural variables to your live Supabase database
      const { data: newMatch, error: matchError } = await supabase
        .from('matches')
        .insert([
          {
            match_name: matchName || 'Saturday Skins Challenge',
            course_name: targetCourseName,
            tee_date: teeDate,       
            tee_time: sanitizedTime  
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

      // 3. Fast Handoff Context payload step over to the Universal Scoring Chassis screen
      onNavigate('live-game', {
        matchId: newMatch.id,
        matchName: matchName || 'Saturday Skins Challenge',
        courseName: targetCourseName,
        activeGames: activeGameKeys
      });

    } catch (err) {
      console.error('Supabase payload dispatch crash:', err.message);
      alert('Supabase Connection Failed: ' + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
      
      <header style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.2em', margin: '0 0 8px 0', fontFamily: 'sans-serif' }}>
          MATCH CONFIGURATION PROTOCOL
        </p>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white m-0">
          CREATE MATCH
        </h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* PILLAR 1: MATCH NAME */}
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

        {/* PILLAR 2: WHERE (PREMIUM SLIDING DRAWER TRIGGER LINK) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>WHERE</span>
          </div>
          <div 
            onClick={() => { if (!loadingCourses && coursesList.length > 0) setIsCourseDrawerOpen(true); }}
            style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', flex: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>map</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              {loadingCourses ? (
                <span style={{ color: 'rgba(190, 237, 217, 0.4)', fontStyle: 'italic', fontWeight: '900', fontSize: '16px' }}>
                  Streaming live club registries...
                </span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '20px' }}>
                  <span style={{ color: '#beedd9', fontSize: '18px', fontWeight: '900', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    {currentSelectedCourse ? currentSelectedCourse.course_name : 'Select a Course'}
                  </span>
                  <span style={{ color: '#ecc151', fontSize: '11px', fontWeight: '900', marginTop: '4px', letterSpacing: '0.05em' }}>
                    {currentSelectedCourse ? `(${currentSelectedCourse.location_city})` : 'Tap to select'}
                  </span>
                </div>
              )}
              {/* Custom Caret Arrow to indicate clickability */}
              <span className="material-symbols-outlined" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: '#ecc151', fontSize: '20px', opacity: 0.6 }}>
                unfold_more
              </span>
            </div>
          </div>
        </section>

        {/* PILLAR 3: WHEN */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>
            WHEN
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE DATE</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9' }}>
                <input 
                  type="date" 
                  value={teeDate} 
                  onChange={(e) => setTeeDate(e.target.value)} 
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', fontSize: '15px', padding: 0, width: '100%', colorScheme: 'dark', cursor: 'pointer' }} 
                />
              </div>
            </div>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE TIME</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9' }}>
                <input 
                  type="time" 
                  value={teeTime} 
                  onChange={(e) => setTeeTime(e.target.value)} 
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', fontSize: '15px', padding: 0, width: '100%', colorScheme: 'dark', cursor: 'pointer' }} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* PILLAR 4: WHO */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>WHO</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: '#00251b', padding: '16px 8px', borderRadius: '16px', border: '1px solid #ecc151', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontStyle: 'italic', fontSize: '14px', marginBottom: '8px' }}>
                DH
              </div>
              <span style={{ fontSize: '10px', fontWeight: '900', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>D. HAZEN</span>
              <span style={{ fontSize: '8px', fontWeight: '900', color: '#ecc151', marginTop: '4px' }}>HCP: 4.2</span>
            </div>
            {[2, 3, 4].map(idx => (
              <div key={idx} style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px dashed rgba(236,193,81,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 8px', opacity: 0.6 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(236,193,81,0.4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                </div>
                <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', marginTop: '12px' }}>PLAYER {idx}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PILLAR 5: WHAT */}
        <section style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>GAME MODE SELECTION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* SKINS */}
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
                    </div>
                    <div onClick={toggleSkinsCarryOver} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.skins.carryOver ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.skins.carryOver ? '#3e2e00' : '#414845', transform: games.skins.carryOver ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WOLF */}
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
                    </div>
                    <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '14px' }}>X {games.wolf.multiplier}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>LONE WOLF POT</h4>
                    </div>
                    <div onClick={toggleLoneWolf} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.wolf.loneWolf ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.wolf.loneWolf ? '#3e2e00' : '#414845', transform: games.wolf.loneWolf ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MATCH PLAY */}
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
                    </div>
                    <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '14px' }}>{games.match.hcpScale}%</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>TIE BREAKER RULE</h4>
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

        {/* INITIATOR DISPATCH BUTTON */}
        <div style={{ paddingTop: '28px', paddingBottom: '20px' }}>
          <button 
            onClick={handleInitializeMatch}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifycontent: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(236,193,81,0.15)' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>power_settings_new</span>
            INITIALIZE MATCH TELEMETRY
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 💎 HIGH-FIDELITY MOBILE COURSE SLIDING DRAWER SYSTEM                      */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: isCourseDrawerOpen ? 'auto' : 'none', display: 'block' }}>
        
        {/* Dark Backdrop Mask Filter */}
        <div 
          onClick={() => setIsCourseDrawerOpen(false)} 
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isCourseDrawerOpen ? 1 : 0, transition: 'opacity 0.4s ease-out', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} 
        />
        
        {/* Sliding Sheet Panel */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '15vh', borderTop: '1px solid rgba(236,193,81,0.25)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxShadow: '0 -15px 40px rgba(0,0,0,0.6)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isCourseDrawerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Top Notch Bar Graphic */}
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto', flex: 'none' }} />
          
          {/* Header Dashboard Title */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
            <div>
              <p style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.15em', margin: '0 0 2px 0', textTransform: 'uppercase' }}>SELECT VENUE GEOMETRY</p>
              <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic', uppercase: 'text' }}>AVAILABLE CLUBS</h3>
            </div>
            <button 
              onClick={() => setIsCourseDrawerOpen(false)} 
              style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} 
              type="button"
            >
              Cancel
            </button>
          </div>

          {/* Dynamic Scroll Matrix Stack Rows */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {coursesList.map((course) => {
              const isSelected = course.id === selectedCourseId;
              return (
                <div 
                  key={course.id}
                  onClick={() => { setSelectedCourseId(course.id); setIsCourseDrawerOpen(false); }}
                  style={{ backgroundColor: isSelected ? '#0e3c2f' : '#001d14', border: isSelected ? '1px solid #ecc151' : '1px solid rgba(236,193,81,0.04)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '12px' }}>
                    <span style={{ color: isSelected ? '#white' : '#beedd9', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.02em' }}>
                      {course.course_name}
                    </span>
                    <span style={{ color: isSelected ? '#ecc151' : 'rgba(190,237,217,0.4)', fontSize: '12px', fontWeight: '700' }}>
                      {course.location_city}
                    </span>
                  </div>
                  
                  {/* Radio Confirmation Light Indicator */}
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '2px solid #ecc151' : '2px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxSizing: 'border-box' }}>
                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ecc151' }} />}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}

export default CreateMatch;