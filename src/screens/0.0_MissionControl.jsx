import React from 'react';

function MissionControl({ matchContext, onNavigate }) {
  const isMatchLive = matchContext && matchContext.matchId !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', boxSizing: 'border-box', width: '100%', paddingTop: '12px' }}>
      
      {/* BRANDING CARD MATRIX WELCOME */}
      <section style={{ backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '24px', padding: '40px 24px', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.3)' }}>
        <h2 style={{ color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '28px', margin: '0 0 4px 0', textTransform: 'uppercase', tracking: '-0.02em' }}>
          UNLOCK YOUR BEST ROUND
        </h2>
        <p style={{ color: '#beedd9', fontSize: '13px', fontWeight: '600', fontStyle: 'italic', margin: 0, opacity: 0.75, letterSpacing: '0.02em' }}>
          Manage Scores & Bets With Confidence
        </p>
      </section>

      {/* 🚀 DYNAMIC WORKSPACE SUMMARY CELL: GAMES UNDERWAY */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.5)', tracking: '0.15em', textTransform: 'uppercase', paddingLeft: '4px' }}>
          GAMES UNDERWAY
        </span>

        {isMatchLive ? (
          <div 
            onClick={() => onNavigate('live-game')}
            style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid #ecc151', padding: '24px', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <span style={{ backgroundColor: '#ecc151', color: '#3e2e00', fontSize: '9px', fontWeight: '900', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', tracking: '0.05em' }}>LIVE MATCH ACTIVE</span>
              <h3 style={{ margin: '8px 0 2px 0', color: 'white', fontWeight: '900', fontStyle: 'italic', fontSize: '18px', textTransform: 'uppercase' }}>{matchContext.matchName}</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#a3d0be', fontWeight: '700' }}>TRACK: {matchContext.courseName}</p>
            </div>
            <span style={{ color: '#ecc151', fontSize: '20px' }}>▶</span>
          </div>
        ) : (
          <div 
            onClick={() => onNavigate('round-intel')}
            style={{ backgroundColor: 'rgba(14, 60, 47, 0.2)', border: '1px dashed rgba(236,193,81,0.15)', padding: '32px 24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }}
          >
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', fontStyle: 'italic', color: 'rgba(190,237,217,0.4)', textTransform: 'uppercase' }}>
              No active session rounds underway
            </p>
            <span style={{ display: 'block', marginTop: '6px', fontSize: '11px', color: '#ecc151', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em' }}>
              [ Setup Match In Rounds Tab ]
            </span>
          </div>
        )}
      </section>

    </div>
  );
}

export default MissionControl;