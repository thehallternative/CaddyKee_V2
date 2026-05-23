import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function LiveGameMain({ matchId, activeGames = ['skins', 'wolf', 'match_play'], onNavigate }) {
  // 🎛️ CORE TELEMETRY & LOADING STATES
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState({ match_name: '', course_name: '' });
  const [players, setPlayers] = useState([]);
  const [holeDefinitions, setHoleDefinitions] = useState([]); // Real DB Hole Layout Cache
  
  // 🎛️ UNIVERSAL CHASSIS SCORES & HOLE VARIABLE STATES
  const [currentHole, setCurrentHole] = useState(1);
  const [isStandingsOpen, setIsStandingsOpen] = useState(false);
  const [selectedWolfPartner, setSelectedWolfPartner] = useState('');
  const [isPressActive, setIsPressActive] = useState(false);
  
  // Local scratchpad score state before sync architecture is written
  const [scores, setScores] = useState({});

  // 🛠️ UTILITY: PLUS HANDICAP MATHEMATICS
  const formatHandicapDisplay = (handicap) => {
    if (handicap === undefined || handicap === null) return '0';
    const num = parseFloat(handicap);
    if (num < 0) return `+${Math.abs(num)}`;
    return `${num}`;
  };

  // 📡 DATABASE READ: MASTER CONTEXT, ROSTER, & HOLE CONFIGURATIONS
  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    const fetchMatchTelemetry = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Master Match Reference Frame
        const { data: matchData, error: matchErr } = await supabase
          .from('matches')
          .select('match_name, course_name')
          .eq('id', matchId);

        let resolvedCourseName = '';
        if (!matchErr && matchData && matchData.length > 0) {
          setMatchDetails(matchData[0]);
          resolvedCourseName = matchData[0].course_name;
        }

        // 2. Fetch Player Ledger Ordered by Hitting Order
        const { data: playerData, error: playerErr } = await supabase
          .from('match_players')
          .select(`
            id,
            guest_display_name,
            player_position,
            handicap_at_match_time,
            profiles (display_name, nickname)
          `)
          .eq('match_id', matchId)
          .order('player_position', { ascending: true });

        if (!playerErr && playerData) {
          setPlayers(playerData);
          
          // Seed initial score tracking references dynamically from real roster IDs
          const initialScores = {};
          playerData.forEach(p => {
            initialScores[p.id] = { gross: 4, overUnder: 'E' };
          });
          setScores(initialScores);
        }

        // 3. Fetch Hole Definitions Map based on Course Name Match
        if (resolvedCourseName) {
          // Resolve course entry
          const { data: courseMap } = await supabase
            .from('course_map')
            .select('id')
            .eq('course_name', resolvedCourseName)
            .maybeSingle();

          if (courseMap) {
            // Find the tee system linked to this course
            const { data: tees } = await supabase
              .from('course_tees')
              .select('id')
              .eq('course_id', courseMap.id)
              .limit(1);

            if (tees && tees.length > 0) {
              // Pull all 18 hole definitions ordered by layout sequence
              const { data: holes } = await supabase
                .from('course_hole_definitions')
                .select('hole_number, par, stroke_index, yardage')
                .eq('tee_id', tees[0].id)
                .order('hole_number', { ascending: true });

              if (holes) {
                setHoleDefinitions(holes);
              }
            }
          }
        }
      } catch (error) {
        console.error('Telemetry ingestion fault intercepted:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchTelemetry();
  }, [matchId]);

  // 🧮 DYNAMIC HOLE DICTIONARY RESOLVER
  const currentHoleData = holeDefinitions.find(h => h.hole_number === currentHole) || {
    par: 4,
    stroke_index: 5,
    yardage: null
  };

  const adjustScore = (playerKey, delta) => {
    setScores(prev => {
      if (!prev[playerKey]) return prev;
      return {
        ...prev,
        [playerKey]: {
          ...prev[playerKey],
          gross: Math.max(1, prev[playerKey].gross + delta)
        }
      };
    });
  };

  const handleHoleChange = (direction) => {
    if (direction === 'prev') {
      setCurrentHole(prev => Math.max(1, prev - 1));
    } else {
      setCurrentHole(prev => Math.min(18, prev + 1));
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', tracking: '0.1em' }}>
        INGESTING HOLE MAPS & METRICS...
      </div>
    );
  }

  const activeRoster = players.length > 0 ? players : [
    { id: 'p1', player_position: 1, guest_display_name: 'Captain DH' },
    { id: 'p2', player_position: 2, guest_display_name: 'Player 2' },
    { id: 'p3', player_position: 3, guest_display_name: 'Player 3' },
    { id: 'p4', player_position: 4, guest_display_name: 'Player 4' }
  ];

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box' }}>
      
      {/* 🏛️ DYNAMIC MATCH & COURSE TITLE HUD OVERVIEW */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '0 0 2px 0' }}>
          {matchDetails.match_name || 'LIVE SCORECARD'}
        </h1>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190, 237, 217, 0.6)', tracking: '0.15em', textTransform: 'uppercase' }}>
          {matchDetails.course_name || 'NO COURSE ASSIGNED'}
        </span>
      </div>

      {/* CORE CHASSIS TABS SWITCH */}
      <div style={{ display: 'flex', padding: '2px', borderRadius: '30px', backgroundColor: '#00251b', border: '1px solid rgba(236,193,81,0.1)', marginBottom: '28px' }}>
        <button 
          onClick={() => setIsStandingsOpen(false)}
          style={{ flex: 1, padding: '12px 0', borderRadius: '24px', border: 'none', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em', cursor: 'pointer', backgroundColor: !isStandingsOpen ? '#ecc151' : 'transparent', color: !isStandingsOpen ? '#3e2e00' : 'rgba(190,237,217,0.6)' }}
          type="button"
        >
          Scoring
        </button>
        <button 
          onClick={() => setIsStandingsOpen(true)}
          style={{ flex: 1, padding: '12px 0', borderRadius: '24px', border: 'none', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em', cursor: 'pointer', backgroundColor: isStandingsOpen ? '#ecc151' : 'transparent', color: isStandingsOpen ? '#3e2e00' : 'rgba(190,237,217,0.6)' }}
          type="button"
        >
          Standings
        </button>
      </div>

      {/* VIEW PANEL A: THE UNIVERSAL SCORING CHASSIS */}
      {!isStandingsOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeRoster.map(player => {
            const displayName = player.profiles?.nickname || player.profiles?.display_name || player.guest_display_name || `PLAYER ${player.player_position}`;
            const initials = displayName.substring(0, 2);
            const currentScoreObj = scores[player.id] || { gross: currentHoleData.par, overUnder: 'E' };

            return (
              <div key={player.id} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', padding: '12px 16px', borderRadius: '40px', border: '1px solid rgba(236, 193, 81, 0.1)', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid rgba(236,193,81,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', fontStyle: 'italic', fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '900', textTransform: 'uppercase', color: '#beedd9', fontStyle: 'italic', fontSize: '15px', letterSpacing: '-0.02em' }}>
                      {displayName}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: '900', color: '#a3d0be', letterSpacing: '0.05em' }}>
                      CH: {formatHandicapDisplay(player.handicap_at_match_time)}
                    </p>
                  </div>
                </div>
                
                {/* Score Counter Controllers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#001710', padding: '4px', borderRadius: '24px', border: '1px solid rgba(236,193,81,0.05)' }}>
                  <button onClick={() => adjustScore(player.id, -1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} type="button">
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>—</span>
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '20px' }}>{currentScoreObj.gross}</span>
                  <button onClick={() => adjustScore(player.id, 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} type="button">
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>＋</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* 🕹️ VERTICALLY OPTIMIZED HOLE NAVIGATION SCROLLER PANEL */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#00251b', padding: '16px 24px', borderRadius: '32px', border: '1px solid rgba(236,193,81,0.15)', marginTop: '12px' }}>
            <button 
              onClick={() => handleHoleChange('prev')} 
              disabled={currentHole === 1}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', backgroundColor: currentHole === 1 ? 'transparent' : '#0e3c2f', color: currentHole === 1 ? 'rgba(190,237,217,0.2)' : '#ecc151', fontSize: '20px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              type="button"
            >
              ◀
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', margin: 0, textTransform: 'uppercase', tracking: '-0.04em' }}>
                HOLE {currentHole}
              </h2>
              <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190, 237, 217, 0.7)', tracking: '0.12em', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                PAR {currentHoleData.par} • S.I. {currentHoleData.stroke_index} {currentHoleData.yardage ? `• ${currentHoleData.yardage} YDS` : ''}
              </span>
            </div>

            <button 
              onClick={() => handleHoleChange('next')} 
              disabled={currentHole === 18}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', backgroundColor: currentHole === 18 ? 'transparent' : '#0e3c2f', color: currentHole === 18 ? 'rgba(190,237,217,0.2)' : '#ecc151', fontSize: '20px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              type="button"
            >
              ▶
            </button>
          </div>

          {/* FLUID HOLE VARIABLES FOOTER PANEL CONTAINER */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', borderBottom: '1px solid rgba(236,193,81,0.1)', paddingBottom: '6px' }}>
              HOLE COMBAT VARIABLES
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: activeGames.includes('wolf') && activeGames.includes('match_play') ? '1fr 1fr' : '1fr', gap: '16px' }}>
              
              {/* CONDITIONALLY RENDERED WIDGET: WOLF PARTNER SELECTOR */}
              {activeGames.includes('wolf') && (
                <div style={{ backgroundColor: '#00251b', padding: '20px', borderRadius: '24px', border: '1px solid rgba(236,193,81,0.1)' }}>
                  <label style={{ display: 'block', fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.5)', textTransform: 'uppercase', tracking: '0.1em', marginBottom: '12px' }}>
                    Wolf Partner
                  </label>
                  <select 
                    value={selectedWolfPartner}
                    onChange={(e) => setSelectedWolfPartner(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#0e3c2f', border: '1px solid #ecc151', padding: '12px 16px', borderRadius: '30px', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="">[ GO LONE WOLF ]</option>
                    {activeRoster.map(player => {
                      const name = player.profiles?.nickname || player.profiles?.display_name || player.guest_display_name;
                      return <option key={player.id} value={player.id}>{name}</option>;
                    })}
                  </select>
                </div>
              )}

              {/* CONDITIONALLY RENDERED WIDGET: HOLLYWOOD / MATCH PLAY PRESS TOGGLE */}
              {activeGames.includes('match_play') && (
                <div style={{ backgroundColor: '#00251b', padding: '20px', borderRadius: '24px', border: '1px solid rgba(236,193,81,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <label style={{ display: 'block', fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.5)', textTransform: 'uppercase', tracking: '0.1em', marginBottom: '12px' }}>
                    Side Wager Action
                  </label>
                  <button 
                    onClick={() => setIsPressActive(!isPressActive)}
                    style={{ width: '100%', padding: '12px 0', borderRadius: '30px', cursor: 'pointer', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', fontSize: '11px', border: isPressActive ? 'none' : '1px solid #ecc151', backgroundColor: isPressActive ? '#ecc151' : 'transparent', color: isPressActive ? '#3e2e00' : '#ecc151', transition: 'all 0.2s' }}
                    type="button"
                  >
                    {isPressActive ? '🔥 PRESS ACTIVE' : 'ACTIVATE PRESS'}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* VIEW PANEL B: FLUID LIVE CALCULATED STANDINGS LEDGER */}
      {isStandingsOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section B1: Individual Standings */}
          <section>
            <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.5)', tracking: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>INDIVIDUAL WAGER METRICS</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeRoster.map((player, i) => {
                const name = player.profiles?.nickname || player.profiles?.display_name || player.guest_display_name || `PLAYER ${player.player_position}`;
                return (
                  <div key={player.id} style={{ backgroundColor: '#0e3c2f', padding: '14px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(236,193,81,0.05)' }}>
                    <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '14px', color: '#beedd9', textTransform: 'uppercase' }}>{name}</span>
                    <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '8px', color: 'rgba(190,237,217,0.4)', fontWeight: '700' }}>PAR</p>
                        <p style={{ margin: 0, fontWeight: '900', fontStyle: 'italic', color: '#ecc151', fontSize: '14px' }}>{i === 0 ? '+2' : i === 1 ? '-1' : 'E'}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '8px', color: 'rgba(190,237,217,0.4)', fontWeight: '700' }}>TOTAL</p>
                        <p style={{ margin: 0, fontWeight: '900', fontStyle: 'italic', color: '#ecc151', fontSize: '14px' }}>{i === 0 ? '$120' : i === 1 ? '$85' : '$40'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section B2: Conditioned Skins Pool Box */}
          {activeGames.includes('skins') && (
            <section>
              <div style={{ backgroundColor: '#ecc151', padding: '24px', borderRadius: '24px', color: '#3e2e00', boxShadow: '0 15px 30px rgba(236,193,81,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '9px', fontWeight: '900', tracking: '0.1em', opacity: 0.7 }}>CURRENT CARRYOVER POOL</span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '44px', fontWeight: '900', fontStyle: 'italic', lineHeight: '1' }}>$40</h3>
                  </div>
                  <span style={{ fontSize: '36px', opacity: 0.4, fontWeight: 'bold' }}>$</span>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '11px' }}>
                  <span>HOLE {currentHole} SKIN VALUE</span>
                  <span style={{ fontStyle: 'italic', fontSize: '14px' }}>$10</span>
                </div>
              </div>
            </section>
          )}

        </div>
      )}

    </div>
  );
}

export default LiveGameMain;