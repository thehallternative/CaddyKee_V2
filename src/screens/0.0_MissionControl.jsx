import React from 'react';

function MissionControl({ onNavigate }) {
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h2 className="text-4xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '10px 0 28px 0' }}>
        MISSION CONTROL
      </h2>

      {/* 4-MODULE INTELLIGENCE HUB */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        
        {/* MC-01: Round Intelligence */}
        <button 
          onClick={() => onNavigate('round-intel')} 
          style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
          type="button"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>trophy</span>
            <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-01</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Round Intelligence</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Initialize live match telemetry or configure multi-group tournament fields</p>
          </div>
        </button>

        {/* MC-02: Game Intelligence */}
        <button 
          onClick={() => onNavigate('game-intel')}
          style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
          type="button"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>gavel</span>
            <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-02</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Game Intelligence</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Create, add, and edit custom wager games and side-bet rules</p>
          </div>
        </button>

        {/* MC-03: Player Intelligence */}
        <button 
          onClick={() => onNavigate('player-intel')}
          style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
          type="button"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>group</span>
            <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-03</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Player Intelligence</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Add or edit player rosters, handicaps, and consistent groups</p>
          </div>
        </button>

        {/* MC-04: Course Intelligence */}
        <button 
          onClick={() => onNavigate('course-intel')}
          style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
          type="button"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>map</span>
            <span style={{ fontWeight: '900', fontStyle: 'italic', fontSize: '10px', opacity: 0.5 }}>MC-04</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Course Intelligence</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Add or edit course scorecards, pars, and stroke indexes</p>
          </div>
        </button>

      </div>
    </div>
  );
}

export default MissionControl;