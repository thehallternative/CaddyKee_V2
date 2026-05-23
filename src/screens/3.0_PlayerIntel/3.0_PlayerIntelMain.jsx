import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function PlayerIntelMain({ onNavigate }) {
  // 🎛️ NAVIGATION CONTROLLERS & TABS
  const [activeTab, setActiveTab] = useState('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 🗄️ TELEMETRY CACHE STATES
  const [profiles, setProfiles] = useState([]);
  const [selectedPlayerStats, setSelectedPlayerStats] = useState(null);

  // 📡 ASSISTANT VOICE SHEET STATE COUPLINGS
  const [isKeeVoiceOpen, setIsKeeVoiceOpen] = useState(false);
  const [voiceTouchStart, setVoiceTouchStart] = useState(0);

  // 📡 DATABASE READ: STREAM PROFILES FROM SUPABASE
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Profile stream error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // 🛠️ UTILITY: PLUS HANDICAP DISPLAY CONVERSION
  const formatHandicapDisplay = (val) => {
    if (val === null || val === undefined) return '0.0';
    const num = parseFloat(val);
    if (num < 0) return `+${Math.abs(num).toFixed(1)}`;
    return num.toFixed(1);
  };

  // 🕹️ ASSISTANT DRAWER GESTURE SWIPE SHEET DISPATCHERS
  const handleVoiceTouchStart = (e) => {
    setVoiceTouchStart(e.touches[0].clientY);
  };

  const handleVoiceTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - voiceTouchStart;
    if (diff > 60) {
      setIsKeeVoiceOpen(false); // Discard drawer downward swipe gesture match
    }
  };

  // 🔍 FRONTEND LOOKAHEAD FILTER LOGIC
  const filteredProfiles = profiles.filter(p => {
    const combinedStr = `${p.display_name || ''} ${p.nickname || ''}`.toUpperCase();
    return combinedStr.includes(searchQuery.toUpperCase());
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
      
      {/* SEGMENTED TAB SWITCH CONTROLLER */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', borderBottom: '1px solid rgba(65,72,69,0.2)', paddingTop: '12px' }}>
        <button 
          onClick={() => setActiveTab('players')}
          style={{ paddingBottom: '12px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: '900', tracking: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderBottom: activeTab === 'players' ? '2px solid #ecc151' : '2px solid transparent', color: activeTab === 'players' ? '#ecc151' : 'rgba(190,237,217,0.5)' }}
          type="button"
        >
          Players
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          style={{ paddingBottom: '12px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: '900', tracking: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderBottom: activeTab === 'groups' ? '2px solid #ecc151' : '2px solid transparent', color: activeTab === 'groups' ? '#ecc151' : 'rgba(190,237,217,0.5)' }}
          type="button"
        >
          Groups
        </button>
      </div>

      {/* SEARCH FIELD BAR CHASSIS */}
      <div style={{ backgroundColor: '#0e3c2f', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span style={{ color: '#ecc151', fontWeight: 'bold' }}>🔍</span>
        <input 
          type="text"
          placeholder="SEARCH PLAYERS..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '13px', padding: 0, textTransform: 'uppercase' }}
        />
      </div>

      {/* DRAWER TRIGGER FORM TOGGLE ACTION PANEL */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {/* 🚀 FIXED LINK: Button routes cleanly to our standalone Create Player component layout */}
        <button 
          onClick={() => onNavigate('create-player')}
          style={{ flex: 1, backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '16px 0', borderRadius: '12px', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          type="button"
        >
          <span>＋</span> Create Player
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          style={{ flex: 1, backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '16px 0', borderRadius: '12px', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          type="button"
        >
          <span>👥</span> Create Group
        </button>
      </div>

      {/* MAIN VIEW TAB INTERCHANGES CONTAINER */}
      {loading ? (
        <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '900' }}>
          LOADING PROFILES REGISTRY...
        </div>
      ) : activeTab === 'players' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredProfiles.map(profile => {
            const displayName = profile.display_name || 'UNKNOWN ROSTER ITEM';
            const initials = displayName.substring(0, 2);

            return (
              <div 
                key={profile.id}
                onClick={() => setSelectedPlayerStats(profile)}
                style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid rgba(236,193,81,0.25)', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontStyle: 'italic', fontSize: '14px', textTransform: 'uppercase' }}>
                    {initials}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: '900', fontStyle: 'italic', color: '#ecc151', fontSize: '16px', textTransform: 'uppercase' }}>
                      {displayName} {profile.nickname && <span style={{ color: '#beedd9', fontSize: '13px' }}>({profile.nickname})</span>}
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', fontWeight: '700', color: '#a3d0be', tracking: '0.05em' }}>
                      INDEX: {formatHandicapDisplay(profile.handicap_index)}
                    </p>
                  </div>
                </div>
                
                {/* 🔥 COMPONENT UPGRADE: HIGH-FIDELITY INTERACTIVE PROMINENT ROUTING EDIT BUTTON CHASSIS */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Shield modal click overlays from firing during navigation
                    onNavigate('edit-player', { playerId: profile.id });
                  }}
                  style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    border: 'none', 
                    backgroundColor: '#0e3c2f', 
                    color: '#ecc151', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(236,193,81,0.2)',
                    transition: 'all 0.2s'
                  }} 
                  type="button"
                >
                  ✎
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* DUMMY COMPONENT GROUP STACK DRAWERS LINK */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.05)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151' }}>THE SATURDAY SKINS</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#a3d0be', fontWeight: '700' }}>8 MEMBERS • ACTIVE CHAPTER</p>
          </div>
          <div style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.05)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151' }}>FOURSOME A</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#a3d0be', fontWeight: '700' }}>4 MEMBERS • MANICURED STACKS</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💎 STANDALONE PLAYER STATS DETAIL OVERLAY PANELS LAYER                   */}
      {/* ========================================================================= */}
      {selectedPlayerStats && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
          <div onClick={() => setSelectedPlayerStats(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px', backgroundColor: '#0b2e24', border: '1px solid rgba(236,193,81,0.2)', borderRadius: '32px', padding: '32px 24px', boxSizing: 'border-box', boxShadow: '0 25px 50px rgba(0,0,0,0.6)', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '1px solid #ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#ecc151', fontWeight: '900', fontSize: '18px', textTransform: 'uppercase' }}>
              {(selectedPlayerStats.display_name || 'PL').substring(0,2)}
            </div>
            
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', color: '#beedd9', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
              {selectedPlayerStats.display_name}
            </h3>
            {selectedPlayerStats.nickname && (
              <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#ecc151', fontWeight: '900', tracking: '0.05em' }}>
                CLUB HANDLE: {selectedPlayerStats.nickname}
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#001710', padding: '14px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
                <span style={{ fontSize: '8px', color: 'rgba(190,237,217,0.4)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>CURRENT INDEX</span>
                <span style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151' }}>
                  {formatHandicapDisplay(selectedPlayerStats.handicap_index)}
                </span>
              </div>
              <div style={{ backgroundColor: '#001710', padding: '14px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
                <span style={{ fontSize: '8px', color: 'rgba(190,237,217,0.4)', fontWeight: '700', display: 'block', marginBottom: '4px' }}>ROLE TYPE</span>
                <span style={{ fontSize: '14px', fontWeight: '900', fontStyle: 'italic', color: '#beedd9', textTransform: 'uppercase', lineHeight: '28px' }}>
                  {selectedPlayerStats.role || 'PLAYER'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedPlayerStats(null)}
              style={{ width: '100%', padding: '14px 0', borderRadius: '30px', border: 'none', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', fontSize: '11px', cursor: 'pointer' }}
              type="button"
            >
              Dismiss Profile
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💎 KEE ASSISTANT DRAWER COMPACT LAYER - Overlapping components removed cleanly */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 130, pointerEvents: isKeeVoiceOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsKeeVoiceOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isKeeVoiceOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
        
        <div 
          onTouchStart={handleVoiceTouchStart}
          onTouchMove={handleVoiceTouchMove}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '12vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', backgroundColor: '#00251b', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isKeeVoiceOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(65,72,69,0.1)', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: 'rgba(236,193,81,0.1)', border: '1px solid #ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', borderRadius: '50%' }}>
                💬
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>KEE</h3>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>● ACTIVE INTELLIGENCE</span>
              </div>
            </div>
            <button onClick={() => setIsKeeVoiceOpen(false)} style={{ backgroundColor: '#001710', color: '#beedd9', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Close</button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', boxSizing: 'border-box', textAlign: 'center', gap: '32px' }}>
            <div>
              <p style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '18px', margin: '0 0 16px 0', tracking: '0.05em' }}>Listening...</p>
              <div style={{ display: 'flex', gap: '6px', height: '40px', alignItems: 'center', justifyContent: 'center' }}>
                <style>{`
                  @keyframes wavePulse { 0%, 100% { height: 10px; } 50% { height: 36px; } }
                  .w-bar { width: 4px; background: #ecc151; border-radius: 2px; animation: wavePulse 1.2s ease-in-out infinite; }
                `}</style>
                <div className="w-bar" style={{ animationDelay: '0.1s' }} />
                <div className="w-bar" style={{ animationDelay: '0.3s' }} />
                <div className="w-bar" style={{ animationDelay: '0.5s' }} />
                <div className="w-bar" style={{ animationDelay: '0.2s' }} />
                <div className="w-bar" style={{ animationDelay: '0.1s' }} />
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
              <p style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(190,237,217,0.5)', tracking: '0.1em', marginBottom: '12px' }}>TRY ASKING</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', textAlign: 'left', fontStyle: 'italic', fontSize: '13px', color: '#beedd9' }}>"What's the wind doing on the 4th?"</div>
                <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', textAlign: 'left', fontStyle: 'italic', fontSize: '13px', color: '#beedd9' }}>"Who's leading the tournament?"</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px', paddingBottom: '40px', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#00120b', padding: '4px', borderRadius: '30px', border: '1px solid rgba(236,193,81,0.1)' }}>
              <input placeholder="Type a caddy message..." style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 20px', color: 'white', outline: 'none', fontSize: '14px' }} />
              <button style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ecc151', border: 'none', color: '#3e2e00', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }} type="button">▲</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PlayerIntelMain;