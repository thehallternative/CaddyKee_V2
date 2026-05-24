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
        .select('*');

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
      setIsKeeVoiceOpen(false); 
    }
  };

  // 🔍 FRONTEND LOOKAHEAD FILTER LOGIC
  const filteredProfiles = profiles.filter(p => {
    const firstName = p.first_name || '';
    const lastName = p.last_name || '';
    const nickname = p.nickname || '';
    const combinedStr = `${firstName} ${lastName} ${nickname}`.toUpperCase();
    return combinedStr.includes(searchQuery.toUpperCase());
  }).sort((a, b) => {
    const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toUpperCase();
    const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toUpperCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box', paddingTop: '12px' }}>
      
      {/* SEGMENTED TAB SWITCH CONTROLLER */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', borderBottom: '1px solid rgba(65,72,69,0.2)' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#0e3c2f', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ecc151', fontWeight: 'bold' }}>🔍</span>
          <input 
            type="text"
            placeholder={activeTab === 'players' ? "SEARCH PLAYERS..." : "SEARCH GROUPS..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '13px', padding: 0, textTransform: 'uppercase' }}
          />
        </div>
      </div>

      {/* COMMAND MODULE ACTIONS ROW */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => onNavigate('create-player')}
          style={{ flex: 1, backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 8px 20px rgba(236,193,81,0.1)' }}
          type="button"
        >
          <span>➕</span> Create Player
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          style={{ flex: 1, backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 8px 20px rgba(236,193,81,0.1)' }}
          type="button"
        >
          <span>👥</span> Create Group
        </button>
      </div>

      {/* MAIN CONTENT SECTION CHASSIS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8px', padding: '0 4px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#ecc151', fontStyle: 'italic', textTransform: 'uppercase', tracking: '0.05em' }}>
            {activeTab === 'players' ? 'ROSTER MEMBERS' : 'CHAPTER GROUPS'}
          </h3>
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.15em' }}>
            TOTAL UNITS: {activeTab === 'players' ? filteredProfiles.length.toString().padStart(2, '0') : '02'}
          </span>
        </div>

        {loading ? (
          <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '900' }}>
            LOADING PROFILES REGISTRY...
          </div>
        ) : activeTab === 'players' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredProfiles.map(profile => {
              const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'UNKNOWN PLAYER';

              return (
                <div 
                  key={profile.id}
                  style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}
                >
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em', textTransform: 'uppercase' }}>
                      INDEX: {formatHandicapDisplay(profile.handicap_index)}
                    </p>
                    <h4 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase', tracking: '-0.02em' }}>
                      {fullName} {profile.nickname && <span style={{ color: '#beedd9', fontSize: '14px', fontWeight: '500', fontStyle: 'normal' }}>({profile.nickname})</span>}
                    </h4>
                  </div>

                  {/* UNIFIED DUAL BUTTON CHASSIS ARRAYS */}
                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button 
                      onClick={() => setSelectedPlayerStats(profile)}
                      style={{ flex: 1, padding: '14px 0', borderRadius: '30px', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(236,193,81,0.1)' }}
                      type="button"
                    >
                      View Details ➜
                    </button>
                    <button 
                      onClick={() => onNavigate('edit-player', { playerId: profile.id })}
                      style={{ padding: '0 20px', borderRadius: '30px', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      type="button"
                    >
                      ✎ Edit
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredProfiles.length === 0 && (
              <div style={{ color: 'rgba(190,237,217,0.3)', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '700', border: '1px dashed rgba(236,193,81,0.1)', borderRadius: '16px' }}>
                NO SQUAD MEMBERS LOGGED TO SYSTEM PROTOCOLS
              </div>
            )}
          </div>
        ) : (
          /* UNIFIED BENTO GROUPS CHASSIS INTERFACES */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'THE SATURDAY SKINS', meta: '8 MEMBERS • ACTIVE CHAPTER' },
              { title: 'FOURSOME A', meta: '4 MEMBERS • MANICURED STACKS' }
            ].map((group, idx) => (
              <div 
                key={idx}
                style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}
              >
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em', textTransform: 'uppercase' }}>
                    {group.meta}
                  </p>
                  <h4 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {group.title}
                  </h4>
                </div>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button onClick={() => alert("Group stats detailing schemas deploying next sprint session.")} style={{ flex: 1, padding: '14px 0', borderRadius: '30px', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(236,193,81,0.1)' }} type="button">
                    View Details ➜
                  </button>
                  <button onClick={() => alert("Group metrics editor deploying next version patch.")} style={{ padding: '0 20px', borderRadius: '30px', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} type="button">
                    ✎ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 💎 HIGH-READABILITY SLIDE-UP OVERLAY DRAWER SHEET                        */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: selectedPlayerStats ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setSelectedPlayerStats(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: selectedPlayerStats ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '20vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxSizing: 'border-box', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: selectedPlayerStats ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          {selectedPlayerStats && (
            <>
              {/* Drawer Header Layout */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.15em', textTransform: 'uppercase' }}>
                    CLUB HANDLE: {selectedPlayerStats.nickname || 'NONE REGISTERED'}
                  </p>
                  <h3 style={{ margin: 0, color: '#beedd9', fontSize: '24px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {`${selectedPlayerStats.first_name || ''} ${selectedPlayerStats.last_name || ''}`.trim()}
                  </h3>
                </div>
                <button onClick={() => setSelectedPlayerStats(null)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 18px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} type="button">Close</button>
              </div>

              {/* Drawer Content Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box', paddingBottom: '60px' }}>
                
                {/* Metrics Callout Meters */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '12px', borderLeft: '3px solid #ecc151', boxSizing: 'border-box' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>CURRENT HANDICAP INDEX</p>
                    <span style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151' }}>
                      {formatHandicapDisplay(selectedPlayerStats.handicap_index)}
                    </span>
                  </div>
                  <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '12px', borderLeft: '3px solid #ecc151', boxSizing: 'border-box' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>SECURITY ROLE TIER</p>
                    <span style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#beedd9', textTransform: 'uppercase', lineHeight: '38px' }}>
                      {selectedPlayerStats.role || 'PLAYER'}
                    </span>
                  </div>
                </div>

                {/* Additional Metadata Fields Profile Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em' }}>IDENTITY SCHEMAS CONTACT INFO</span>
                  <div style={{ backgroundColor: '#001710', padding: '20px', borderRadius: '14px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#beedd9' }}>
                      <span style={{ color: '#ecc151', marginRight: '6px' }}>✉</span> {selectedPlayerStats.email || 'NO EMAIL SAVED'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#beedd9' }}>
                      <span style={{ color: '#ecc151', marginRight: '6px' }}>📞</span> {selectedPlayerStats.phone || 'NO PHONE CONTACT SAVED'}
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💎 KEE ASSISTANT DRAWER SHEET COMPACT LAYER                              */}
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