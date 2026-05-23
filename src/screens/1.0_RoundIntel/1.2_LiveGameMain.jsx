import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Stepping out of both 1.0_RoundIntel/ and screens/ to reach src/

function LiveGameMain({ matchId, onNavigate }) {
  // Rest of the code remains exactly the same...
  // 🎛️ CORE STATES
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState({ match_name: '', course_name: '' });
  const [players, setPlayers] = useState([]);
  const [currentHole, setCurrentHole] = useState(1);
  const [isStandingsOpen, setIsStandingsOpen] = useState(false);

  // 🛠️ UTILITY: PLUS HANDICAP MATHEMATICS
  const formatHandicapDisplay = (handicap) => {
    if (!handicap) return '0';
    const num = parseFloat(handicap);
    if (num < 0) return `+${Math.abs(num)}`;
    return `${num}`;
  };

  // 📡 DATABASE READ: MATCH CONTEXT & ROSTER
  useEffect(() => {
    if (!matchId) return;

    const fetchMatchAndRoster = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Match & Course Names
        const { data: matchData, error: matchErr } = await supabase
          .from('matches')
          .select('match_name, course_name')
          .eq('id', matchId)
          .single();

        if (matchErr) throw matchErr;
        if (matchData) setMatchDetails(matchData);

        // 2. Fetch Roster Ordered by Strict Hitting Position
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

        if (playerErr) throw playerErr;
        
        setPlayers(playerData || []);
      } catch (error) {
        console.error('Error loading match telemetry:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchAndRoster();
  }, [matchId]);

  const handleHoleChange = (direction) => {
    if (direction === 'prev') {
      setCurrentHole(prev => Math.max(1, prev - 1));
    } else {
      setCurrentHole(prev => Math.min(18, prev + 1));
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#beedd9', padding: '20px', textAlign: 'center', fontWeight: '900', fontStyle: 'italic' }}>
        LOADING MATCH TELEMETRY...
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box' }}>
      
      {/* 🏛️ DYNAMIC MATCH & COURSE TITLE HUD */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '0 0 2px 0' }}>
          {matchDetails.match_name || 'LIVE MATCH'}
        </h1>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190, 237, 217, 0.6)', tracking: '0.15em', textTransform: 'uppercase' }}>
          {matchDetails.course_name || 'UNKNOWN COURSE'}
        </span>
      </div>

      {/* CORE CHASSIS TABS SWITCH */}
      <div style={{ display: 'flex', padding: '2px', borderRadius: '30px', backgroundColor: '#00251b', border: '1px solid rgba(236,193,81,0.1)', marginBottom: '24px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* 👥 THE 4 PLAYERS ROSTER STACK */}
          {players.map(player => {
            // Resolve name from registered profile or fallback to quick guest entry
            const displayName = player.profiles?.nickname || player.profiles?.display_name || player.guest_display_name || `PLAYER ${player.player_position}`;
            const initials = displayName.substring(0, 2);

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
                
                {/* Score Counter Box Blueprint (Hooks to be connected next) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#001710', padding: '4px', borderRadius: '24px', border: '1px solid rgba(236,193,81,0.05)' }}>
                  <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center' }} type="button">
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>—</span>
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '20px' }}>4</span>
                  <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', display: 'flex', alignItems: 'center', justifyContent: 'center' }} type="button">
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>＋</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* 🕹️ VERTICALLY OPTIMIZED HOLE NAVIGATION SCROLLER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#00251b', padding: '16px 24px', borderRadius: '32px', border: '1px solid rgba(236,193,81,0.15)', marginTop: '20px' }}>
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
              <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.5)', tracking: '0.1em', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                PAR 4 • S.I. 5
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

        </div>
      )}

    </div>
  );
}

export default LiveGameMain;