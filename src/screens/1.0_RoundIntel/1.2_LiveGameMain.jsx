import React, { useState } from 'react';

function LiveGameMain({ activeGames = ['skins', 'wolf', 'match_play'], onNavigate }) {
  // 🎛️ UNIVERSAL CHASSIS SCORES & HOLE VARIABLE STATES
  const [currentHole, setCurrentHole] = useState(12);
  const [isStandingsOpen, setIsStandingsOpen] = useState(false);
  const [selectedWolfPartner, setSelectedWolfPartner] = useState('');
  const [isPressActive, setIsPressActive] = useState(false);
  
  const [scores, setScores] = useState({
    jordan: { gross: 4, overUnder: '+2 OVER' },
    sarah: { gross: 4, overUnder: 'E (EVEN)' },
    marcus: { gross: 4, overUnder: '-1 UNDER' },
    elena: { gross: 4, overUnder: '+5 OVER' }
  });

  const adjustScore = (playerKey, delta) => {
    setScores(prev => ({
      ...prev,
      [playerKey]: {
        ...prev[playerKey],
        gross: Math.max(1, prev[playerKey].gross + delta)
      }
    }));
  };

  return (
    <div style={{ textAlign: 'left', width: '100%', relative: 'position' }}>
      
      {/* HOLE STATUS HUD OVERVIEW */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190, 237, 217, 0.5)', tracking: '0.2em', textTransform: 'uppercase' }}>
          CYPRESS POINT CLUB • PAR 4 • S.I. 5
        </span>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '4px 0 0 0' }}>
          HOLE {currentHole}
        </h2>
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
          {Object.keys(scores).map(playerKey => {
            const player = scores[playerKey];
            return (
              <div key={playerKey} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', padding: '12px 16px', borderRadius: '40px', border: '1px solid rgba(236, 193, 81, 0.1)', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid rgba(236,193,81,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', fontStyle: 'italic', fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }}>
                    {playerKey.substring(0, 2)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '900', textTransform: 'uppercase', color: '#beedd9', fontStyle: 'italic', fontSize: '15px', letterSpacing: '-0.02em' }}>
                      {playerKey.charAt(0).toUpperCase() + playerKey.slice(1)}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '9px', fontWeight: '900', color: '#a3d0be', letterSpacing: '0.05em' }}>{player.overUnder}</p>
                  </div>
                </div>
                
                {/* Score Counter Controllers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#001710', padding: '4px', borderRadius: '24px', border: '1px solid rgba(236,193,81,0.05)' }}>
                  <button onClick={() => adjustScore(playerKey, -1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} type="button">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>remove</span>
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '20px' }}>{player.gross}</span>
                  <button onClick={() => adjustScore(playerKey, 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 10px rgba(236,193,81,0.2)' }} type="button">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>add</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* FLUID HOLE VARIABLES FOOTER PANEL CONTAINER */}
          <div style={{ marginTop: '36px' }}>
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
                    <option value="jordan">Jordan Lisko</option>
                    <option value="sarah">Sarah Chen</option>
                    <option value="marcus">Marcus Vane</option>
                    <option value="elena">Elena Rose</option>
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
              {['JORDAN', 'MARCUS', 'SARAH', 'ELENA'].map((name, i) => (
                <div key={name} style={{ backgroundColor: '#0e3c2f', padding: '14px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(236,193,81,0.05)' }}>
                  <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '14px', color: '#beedd9' }}>{name}</span>
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
              ))}
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
                  <span className="material-symbols-outlined" style={{ fontSize: '36px', opacity: 0.4 }}>payments</span>
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