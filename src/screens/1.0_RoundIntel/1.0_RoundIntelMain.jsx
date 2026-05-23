import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function RoundIntelMain({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('live');
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [liveMatches, setLiveMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [historyMatches, setHistoryMatches] = useState([]);

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
    if (isScheduledOpen) {
      fetchMatches();
    }
  }, [isScheduledOpen]);

  // 🗑️ CASCADING ADMIN DESTRUCTION ENGINE
  const handleAdminDelete = async (e, matchId) => {
    e.stopPropagation(); // Avoid triggering the screen navigation click
    
    const confirmDelete = window.confirm("ADMIN ALERT: Delete this match and all child wagers/rosters permanently?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      
      // 1. Clear child wagers
      await supabase.from('active_wagers').delete().eq('match_id', matchId);
      
      // 2. Clear child player ledger dependencies
      await supabase.from('match_players').delete().eq('match_id', matchId);
      
      // 3. Delete master match frame
      const { error } = await supabase.from('matches').delete().eq('id', matchId);
      
      if (error) throw error;
      
      // Refresh cache state
      await fetchMatches();
    } catch (err) {
      alert(`Delete sequence failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchMatch = (match) => {
    setIsScheduledOpen(false);
    
    // Explicit structural contract payload passed straight back to App.jsx
    const payload = {
      matchId: match.id,
      matchName: match.match_name,
      courseName: match.course_name,
      activeGames: match.gameTypes
    };
    
    // DELIVER BOTH TARGET AND CONTENT PAYLOAD
    onNavigate('live-game', payload);
  };

  const renderMatchCards = (matchList, placeholderText) => {
    if (matchList.length === 0) {
      return (
        <p style={{ color: 'rgba(190,237,217,0.4)', textAlign: 'center', fontStyle: 'italic', fontSize: '13px', marginTop: '20px' }}>
          {placeholderText}
        </p>
      );
    }
    return matchList.map(match => (
      <div 
        key={match.id} 
        onClick={() => handleLaunchMatch(match)}
        style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.1)', cursor: 'pointer', textAlign: 'left', position: 'relative' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingRight: '40px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#ecc151', textTransform: 'uppercase', tracking: '0.05em' }}>
            {match.tee_date} • {match.tee_time || 'NO TIME'}
          </span>
          <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '18px' }}>play_circle</span>
        </div>
        
        <h4 style={{ fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#beedd9', margin: '0 40px 0 0' }}>
          {match.match_name}
        </h4>
        <p style={{ fontSize: '13px', color: 'rgba(190,237,217,0.7)', margin: '4px 0 0 0', fontWeight: '500' }}>
          {match.course_name}
        </p>

        {/* 🛠️ ABSOLUTE ADMIN CONTROL PANEL OVERLAY */}
        <div style={{ position: 'absolute', right: '16px', bottom: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => handleAdminDelete(e, match.id)}
            style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(235, 94, 85, 0.2)', border: '1px solid #eb5e55', color: '#eb5e55', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer' }}
            title="Delete Match"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h2 className="text-4xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '10px 0 28px 0' }}>
        ROUND INTELLIGENCE
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <button onClick={() => onNavigate('create-match')} style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }} type="button">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>groups</span>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Create Match</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Deploy immediate side-wager formats and quick-start groups</p>
          </div>
        </button>

        <button onClick={() => setIsScheduledOpen(true)} style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }} type="button">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>map</span>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Scheduled Games</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Audit history ledgers, complete match results, and upcoming itineraries</p>
          </div>
        </button>

        <button onClick={() => onNavigate('create-tournament')} style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }} type="button">
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>trophy</span>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Create Tournament</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Configure dates, registration fields, and team logic parameters</p>
          </div>
        </button>
      </div>

      <div style={{ position: 'fixed', inset: 0, zIndex: 70, pointerEvents: isScheduledOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsScheduledOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isScheduledOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '10vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', backgroundColor: '#00251b', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s ease-out', transform: isScheduledOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto' }}></div>
          
          <div style={{ padding: '16px 20px 8px 20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#ecc151', fontWeight: '700', textTransform: 'uppercase', tracking: '0.1em', fontSize: '10px' }}>Your Schedule</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#ecc151', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>ROUND INTEL</h3>
              </div>
              <button onClick={() => setIsScheduledOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', cursor: 'pointer' }} type="button">
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>✕</span>
              </button>
            </div>

            <div style={{ display: 'flex', padding: '2px', borderRadius: '30px', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)' }}>
              <button onClick={() => setActiveTab('scheduled')} style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', cursor: 'pointer', backgroundColor: activeTab === 'scheduled' ? '#ecc151' : 'transparent', color: activeTab === 'scheduled' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }} type="button">Scheduled</button>
              <button onClick={() => setActiveTab('live')} style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', cursor: 'pointer', backgroundColor: activeTab === 'live' ? '#ecc151' : 'transparent', color: activeTab === 'live' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }} type="button">Live</button>
              <button onClick={() => setActiveTab('history')} style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', cursor: 'pointer', backgroundColor: activeTab === 'history' ? '#ecc151' : 'transparent', color: activeTab === 'history' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }} type="button">History</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px 20px', boxSizing: 'border-box' }}>
            {loading ? (
              <div style={{ color: '#beedd9', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', padding: '20px' }}>
                PROCESSING DATABASE INSTRUCTIONS...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeTab === 'scheduled' && renderMatchCards(scheduledMatches, 'No upcoming scheduled matches')}
                {activeTab === 'live' && renderMatchCards(liveMatches, 'No active live matches for today')}
                {activeTab === 'history' && renderMatchCards(historyMatches, 'No historical matches on file')}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default RoundIntelMain;