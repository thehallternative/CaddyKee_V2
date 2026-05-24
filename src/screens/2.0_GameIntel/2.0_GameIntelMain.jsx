import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function GameIntelMain({ onNavigate }) {
  // 🎛️ CONTROLLERS & STREAM ENGINE READ STATE COUPLINGS
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 🗄️ TELEMETRY CACHE HOOK MATRICES
  const [gameRules, setGameRules] = useState([]);
  const [selectedGameRules, setSelectedGameRules] = useState(null);

  // 📡 DATABASE READ: CONNECT LIVE STREAM FROM SUPABASE game_rules
  const fetchGameRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('game_rules')
        .select('*');

      if (error) throw error;
      setGameRules(data || []);
    } catch (err) {
      console.error('Game rules pipeline payload load failure:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameRules();
  }, []);

  // 🔍 LOOKAHEAD EXTENSION FILTER & PREEMPTIVE FAVOURITES VECTOR SORTING
  const filteredGameRules = gameRules.filter(g => {
    const title = g.title || '';
    const slug = g.slug || '';
    const category = g.category || '';
    const content = g.content || '';
    const combinedStr = `${title} ${slug} ${category} ${content}`.toUpperCase();
    return combinedStr.includes(searchQuery.toUpperCase());
  }).sort((a, b) => {
    // Force favorite items (Wolf, Hollywood, 2-Man Best Ball, Greenies) to float to the absolute top
    const favA = a.is_favorite ? 1 : 0;
    const favB = b.is_favorite ? 1 : 0;
    if (favB !== favA) return favB - favA;
    
    // Secondary alphabetization mapping matrix trace pass
    return (a.title || '').localeCompare(b.title || '');
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box', paddingTop: '12px' }}>
      
      {/* SEARCH FIELD BAR CHASSIS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#0e3c2f', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ecc151', fontWeight: 'bold' }}>🔍</span>
          <input 
            type="text"
            placeholder="SEARCH OPERATIONAL GAMES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '13px', padding: 0, textTransform: 'uppercase' }}
          />
        </div>
      </div>

      {/* COMMAND MODULE ACTIONS ROW - RECONFIGURED FOR SINGLE MASTER BUTTON SETUP */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => onNavigate('create-game')}
          style={{ flex: 1, backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 8px 20px rgba(236,193,81,0.1)' }}
          type="button"
        >
          <span>➕</span> Create New Game
        </button>
      </div>

      {/* MAIN CONTENT SECTION CHASSIS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8px', padding: '0 4px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#ecc151', fontStyle: 'italic', textTransform: 'uppercase', tracking: '0.05em' }}>
            CORE ENGINE BLUEPRINTS
          </h3>
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.15em' }}>
            TOTAL UNITS: {filteredGameRules.length.toString().padStart(2, '0')}
          </span>
        </div>

        {loading ? (
          <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '900' }}>
            STREAMING GAME MASTER RULES REGISTRY...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredGameRules.map(rule => {
              const subtitleString = rule.category || 'SIDE WAGER CORE ENGINE';

              return (
                <div 
                  key={rule.id}
                  style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', position: 'relative' }}
                >
                  {/* Premium Favourite Tag Identifier */}
                  {rule.is_favorite && (
                    <span style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '10px', color: '#ecc151', fontWeight: '900', tracking: '0.05em', fontStyle: 'italic', textTransform: 'uppercase', backgroundColor: '#0e3c2f', padding: '4px 8px', borderRadius: '8px' }}>
                      ★ FAVOURITE
                    </span>
                  )}

                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em', textTransform: 'uppercase' }}>
                      {subtitleString} {rule.version && `(v${rule.version})`}
                    </p>
                    <h4 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase', tracking: '-0.02em' }}>
                      {rule.title}
                    </h4>
                  </div>

                  {/* UNIFIED DUAL BUTTON TRACK BLOCK MATRIX */}
                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button 
                      onClick={() => setSelectedGameRules(rule)}
                      style={{ flex: 1, padding: '14px 0', borderRadius: '30px', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(236,193,81,0.1)' }}
                      type="button"
                    >
                      View Details ➜
                    </button>
                    <button 
                      onClick={() => onNavigate('edit-game', { ruleId: rule.id })}
                      style={{ padding: '0 20px', borderRadius: '30px', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      type="button"
                    >
                      ✎ Edit
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredGameRules.length === 0 && (
              <div style={{ color: 'rgba(190,237,217,0.3)', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '700', border: '1px dashed rgba(236,193,81,0.1)', borderRadius: '16px' }}>
                NO RECOGNIZED GOLF GAMES REGISTERED TO BACKEND DATA HOOKS
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 💎 UNIFIED HIGH-READABILITY TACTICAL RULES OVERLAY DRAWER                 */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: selectedGameRules ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setSelectedGameRules(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: selectedGameRules ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '15vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxSizing: 'border-box', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: selectedGameRules ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          {selectedGameRules && (
            <>
              {/* Drawer Header Layout */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.15em', textTransform: 'uppercase' }}>
                    SLUG IDENTIFIER: {selectedGameRules.slug || 'NONE'}
                  </p>
                  <h3 style={{ margin: 0, color: '#beedd9', fontSize: '24px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {selectedGameRules.title}
                  </h3>
                </div>
                <button onClick={() => setSelectedGameRules(null)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 18px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} type="button">Close</button>
              </div>

              {/* Drawer Scrollable Content Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box', paddingBottom: '60px' }}>
                
                {/* Structural Configuration Target Schema Summary */}
                <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '12px', borderLeft: '3px solid #ecc151', boxSizing: 'border-box' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>TEMPLATE VARIABLES MATRIX SCHEMA</p>
                  <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', color: '#ecc151' }}>
                    {JSON.stringify(selectedGameRules.config_schema) === '{}' ? 'NO EXTENDED CONFIG SCHEMA BOUND' : JSON.stringify(selectedGameRules.config_schema)}
                  </span>
                </div>

                {/* Rules Content Technical Guidelines Blueprint Documentation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em' }}>WAGER RULES AND DOCUMENTATION TEXT</span>
                  <div style={{ backgroundColor: '#001710', padding: '20px', borderRadius: '14px', border: '1px solid rgba(236,193,81,0.05)' }}>
                    <p style={{ margin: 0, color: '#beedd9', fontSize: '14px', lineHeight: '1.6', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
                      {selectedGameRules.content || 'No documentation descriptions compiled for this rule profile asset yet.'}
                    </p>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}

export default GameIntelMain;