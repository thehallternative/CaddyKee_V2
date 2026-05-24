import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function RoundIntelMain({ onNavigate }) {
  // 🎛️ NAVIGATION CONTROLLERS & TABS
  const [activeTab, setActiveTab] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🗄️ MATCH REGISTRY TELEMETRY STACKS
  const [liveMatches, setLiveMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [historyMatches, setHistoryMatches] = useState([]);

  // 🎚️ DELETION CONFIRMATION TARGET PORT
  const [deleteTargetMatch, setDeleteTargetMatch] = useState(null); 

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data: matches, error } = await supabase
        .from('matches')
        .select('id, match_name, course_name, tee_date, tee_time')
        .order('tee_date', { ascending: false });

      if (error) throw error;

      const todayStr = new Date().toISOString().split('T')[0];
      const liveArr = [];
      const scheduledArr = [];
      const historyArr = [];

      (matches || []).forEach(match => {
        const matchPayload = {
          id: match.id,
          match_name: match.match_name,
          course_name: match.course_name,
          tee_date: match.tee_date,
          tee_time: match.tee_time,
          gameTypes: ['skins', 'wolf', 'match_play']
        };

        if (match.tee_date === todayStr) {
          liveArr.push(matchPayload);
        } else if (match.tee_date > todayStr) {
          scheduledArr.push(matchPayload);
        } else {
          historyArr.push(matchPayload);
        }
      });

      setLiveMatches(liveArr);
      setScheduledMatches(scheduledArr);
      setHistoryMatches(historyArr);
    } catch (err) {
      console.error('Error fetching schedules:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // 🗑️ ATOMIC PURGE EXECUTION ENGINE
  const executeMatchPurge = async (matchId) => {
    try {
      setLoading(true);
      setDeleteTargetMatch(null); 
      
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);
      
      if (error) throw error;
      await fetchMatches();
    } catch (err) {
      console.error(`Purge fault: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchMatch = (match) => {
    const payload = {
      matchId: match.id,
      matchName: match.match_name,
      courseName: match.course_name,
      activeGames: match.gameTypes
    };
    onNavigate('live-game', payload);
  };

  // Get active match array based on tab state selection context
  const getActiveListByTab = () => {
    if (activeTab === 'scheduled') return scheduledMatches;
    if (activeTab === 'history') return historyMatches;
    return liveMatches;
  };

  // Filter lookahead processing matrix
  const filteredMatches = getActiveListByTab().filter(m => {
    const haystack = `${m.match_name || ''} ${m.course_name || ''}`.toUpperCase();
    return haystack.includes(searchQuery.toUpperCase());
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box', paddingTop: '12px' }}>
      
      {/* SEARCH FIELD BAR CHASSIS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#0e3c2f', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ecc151', fontWeight: 'bold' }}>🔍</span>
          <input 
            type="text"
            placeholder="SEARCH OPERATIONAL ROUNDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '13px', padding: 0, textTransform: 'uppercase' }}
          />
        </div>
      </div>

      {/* COMMAND MODULE FULL WIDTH ACTION PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => onNavigate('create-match')}
          style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(236,193,81,0.1)' }}
          type="button"
        >
          <span>➕</span> Create Match
        </button>
        <button 
          onClick={() => onNavigate('create-tournament')}
          style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(236,193,81,0.1)' }}
          type="button"
        >
          <span>🏆</span> Create Tournament
        </button>
      </div>

      {/* SEGMENTED TAB SWITCH CONTROLLER SWITCH INLINE */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(65,72,69,0.2)' }}>
        {['live', 'scheduled', 'history'].map((tab) => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
            style={{ paddingBottom: '12px', border: 'none', background: 'transparent', fontSize: '13px', fontWeight: '900', tracking: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #ecc151' : '2px solid transparent', color: activeTab === tab ? '#ecc151' : 'rgba(190,237,217,0.5)' }}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* UNIFIED BENTO CONTAINER DISPLAY SCROLL GRID */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8px', padding: '0 4px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#ecc151', fontStyle: 'italic', textTransform: 'uppercase', tracking: '0.05em' }}>
            {activeTab === 'live' ? 'ACTIVE ROUNDS' : activeTab === 'scheduled' ? 'UPCOMING TIMELINES' : 'HISTORICAL LEDGERS'}
          </h3>
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.15em' }}>
            TOTAL UNITS: {filteredMatches.length.toString().padStart(2, '0')}
          </span>
        </div>

        {loading ? (
          <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '900' }}>
            STREAMING MATCH INFRASTRUCTURE TELEMETRY...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredMatches.map((match) => (
              <div 
                key={match.id}
                style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}
              >
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em', textTransform: 'uppercase' }}>
                    {match.tee_date} • {match.tee_time || 'ANY TIME'}
                  </p>
                  <h4 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {match.match_name}
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(190,237,217,0.6)', fontWeight: '600' }}>
                    📍 {match.course_name}
                  </p>
                </div>

                {/* UNIFIED DUAL ACTION ACCELERATORS BUTTON LAYER */}
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button 
                    onClick={() => handleLaunchMatch(match)}
                    style={{ flex: 1, padding: '14px 0', borderRadius: '30px', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(236,193,81,0.1)' }}
                    type="button"
                  >
                    Launch Match ➜
                  </button>
                  <button 
                    onClick={() => onNavigate('create-match', { matchId: match.id, isEditing: true })}
                    style={{ padding: '0 20px', borderRadius: '30px', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    type="button"
                  >
                    ✎ Edit
                  </button>
                  <button 
                    onClick={() => setDeleteTargetMatch(match)}
                    style={{ padding: '0 16px', borderRadius: '30px', border: 'none', backgroundColor: '#eb5e55', color: 'white', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    type="button"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {filteredMatches.length === 0 && (
              <div style={{ color: 'rgba(190,237,217,0.3)', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '700', border: '1px dashed rgba(236,193,81,0.1)', borderRadius: '16px' }}>
                NO ACTIVE ROUND DATA MATCHES FOUND ON TAB CRITERIA
              </div>
            )}
          </div>
        )}
      </section>

      {/* PREMIUM INTEGRATED CADDY AESTHETIC DELETION DIALOG */}
      {deleteTargetMatch && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
          <div onClick={() => setDeleteTargetMatch(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px', backgroundColor: '#0b2e24', border: '2px solid #eb5e55', borderRadius: '32px', padding: '32px 24px', boxSizing: 'border-box', boxShadow: '0 25px 50px rgba(0,0,0,0.6)', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(235,94,85,0.1)', border: '1px solid #eb5e55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#eb5e55', fontWeight: '900', fontSize: '24px' }}>
              ✕
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#beedd9', margin: '0 0 8px 0', textTransform: 'uppercase', tracking: '-0.02em' }}>
              Confirm Deletion
            </h3>
            <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(190,237,217,0.7)', margin: '0 0 28px 0', lineHeight: '1.4' }}>
              Are you sure you want to completely purge <span style={{ color: '#ecc151', fontWeight: '700' }}>{deleteTargetMatch.match_name}</span>? All child wager entries and financial rosters will be deleted permanently.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => executeMatchPurge(deleteTargetMatch.id)}
                style={{ width: '100%', padding: '16px 0', borderRadius: '30px', border: 'none', backgroundColor: '#eb5e55', color: '#ffffff', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', fontSize: '12px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(235,94,85,0.3)' }}
                type="button"
              >
                Permanently Delete
              </button>
              <button 
                onClick={() => setDeleteTargetMatch(null)}
                style={{ width: '100%', padding: '16px 0', borderRadius: '30px', border: '1px solid rgba(190,237,217,0.2)', backgroundColor: 'transparent', color: '#beedd9', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', fontSize: '11px', cursor: 'pointer' }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RoundIntelMain;