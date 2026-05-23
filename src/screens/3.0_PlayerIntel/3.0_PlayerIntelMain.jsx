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

  // 📝 INLINE DRAWER REGISTRATION STATES (ADDING TIMMY ENGINE)
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNickname, setNewPlayerNickname] = useState('');
  const [newPlayerHcp, setNewPlayerHcp] = useState('0.0');
  const [isPlusHcp, setIsPlusHcp] = useState(false); // 💊 Plus toggle rule support

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

  // 💾 DATABASE WRITE: REGISTER NEW PLAYER
  const handleCreatePlayerSubmit = async (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    try {
      setLoading(true);
      let hcpFloat = newPlayerHcp ? parseFloat(newPlayerHcp) : 0.0;
      
      // Invert plus handicap value to negative float for database storage rule
      if (isPlusHcp && hcpFloat > 0) {
        hcpFloat = -hcpFloat;
      }

      const cleanName = newPlayerName.trim();
      const nameParts = cleanName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const insertPayload = {
        display_name: cleanName.toUpperCase(),
        first_name: firstName,
        last_name: lastName,
        nickname: newPlayerNickname.trim() ? newPlayerNickname.trim().toUpperCase() : null,
        handicap_index: hcpFloat
      };

      const { error } = await supabase
        .from('profiles')
        .insert([insertPayload]);

      if (error) throw error;

      // Reset Form State Elements
      setNewPlayerName('');
      setNewPlayerNickname('');
      setNewPlayerHcp('0.0');
      setIsPlusHcp(false);
      setIsCreateDrawerOpen(false);

      // Re-fetch clean list state data instantly
      await fetchProfiles();
    } catch (err) {
      alert(`Registration fault: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FRONTEND LOOKAHEAD FILTER LOGIC
  const filteredProfiles = profiles.filter(p => {
    const combinedStr = `${p.display_name || ''} ${p.nickname || ''}`.toUpperCase();
    return combinedStr.includes(searchQuery.toUpperCase());
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
      
      {/* TOP HEADER MASTER BAR */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', position: 'relative', height: '40px' }}>
        <h1 style={{ color: '#ecc151', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.04em', fontSize: '20px', margin: 0 }}>
          PLAYER INTELLIGENCE
        </h1>
      </header>

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
        <button 
          onClick={() => setIsCreateDrawerOpen(true)}
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
      {/* 💎 EXPANDABLE BOTTOM DRAWER FORM: ADDING TIMMY DIRECT ENGINE             */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: isCreateDrawerOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsCreateDrawerOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isCreateDrawerOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '20vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isCreateDrawerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto' }} />
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: '#ecc151', fontWeight: '700', textTransform: 'uppercase', fontSize: '9px', tracking: '0.1em' }}>DB INJECTION MODULE</span>
              <h3 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', margin: '2px 0 0 0' }}>REGISTER PLAYER</h3>
            </div>
            <button onClick={() => setIsCreateDrawerOpen(false)} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.2)', color: '#ecc151', fontWeight: '900', cursor: 'pointer' }} type="button">✕</button>
          </div>

          <form onSubmit={handleCreatePlayerSubmit} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>FULL NAME</label>
              <input 
                type="text"
                placeholder="e.g., Timmy Gallant"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                required
                style={{ backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '14px', color: 'white', fontWeight: '700', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>NICKNAME / CLUB MONIKER</label>
              <input 
                type="text"
                placeholder="e.g., TG"
                value={newPlayerNickname}
                onChange={(e) => setNewPlayerNickname(e.target.value)}
                style={{ backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '14px', color: 'white', fontWeight: '700', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>HANDICAP INDEX</label>
                <input 
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={newPlayerHcp}
                  onChange={(e) => setNewPlayerHcp(e.target.value)}
                  style={{ backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '14px', color: isPlusHcp ? '#ecc151' : 'white', fontWeight: '900', fontSize: '15px', outline: 'none', boxSizing: 'border-box', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>INDEX VARIANT</label>
                <div 
                  onClick={() => setIsPlusHcp(!isPlusHcp)}
                  style={{ height: '50px', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', display: 'flex', padding: '4px', boxSizing: 'border-box', cursor: 'pointer' }}
                >
                  <div style={{ flex: 1, backgroundColor: !isPlusHcp ? '#00251b' : 'transparent', color: !isPlusHcp ? '#beedd9' : 'rgba(190,237,217,0.2)', border: !isPlusHcp ? '1px solid rgba(236,193,81,0.1)' : 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>STD</div>
                  <div style={{ flex: 1, backgroundColor: isPlusHcp ? '#ecc151' : 'transparent', color: isPlusHcp ? '#3e2e00' : 'rgba(190,237,217,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>PLUS (+)</div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '30px', padding: '18px 0', fontSize: '13px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', marginTop: '12px', boxShadow: '0 8px 20px rgba(236,193,81,0.25)' }}
            >
              Confirm Cloud Injection
            </button>
          </form>
        </div>
      </div>

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

    </div>
  );
}

export default PlayerIntelMain;