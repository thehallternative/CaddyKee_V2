import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Stepping out of 1.0_RoundIntel/ and screens/ to src/

function RoundIntelMain({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('current');
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 🗄️ MATCH TELEMETRY ARRAYS
  const [currentMatches, setCurrentMatches] = useState([]);
  const [historyMatches, setHistoryMatches] = useState([]);

  // 📡 FETCH RECENT MATCHES FROM SUPABASE
  useEffect(() => {
    if (!isScheduledOpen) return;

    const fetchMatches = async () => {
      try {
        setLoading(true);
        
        // Fetch all matches to split into Current vs History
        const { data: matches, error } = await supabase
          .from('matches')
          .select(`
            id,
            match_name,
            course_name,
            tee_date,
            tee_time,
            active_wagers ( game_type )
          `)
          .order('tee_date', { ascending: false });

        if (error) throw error;

        const todayStr = new Date().toISOString().split('T')[0];

        const current = [];
        const history = [];

        (matches || []).forEach(match => {
          // Extract active game types array from the joined active_wagers table
          const gameTypes = match.active_wagers?.map(w => w.game_type) || ['match_play'];
          
          const matchPayload = {
            id: match.id,
            match_name: match.match_name,
            course_name: match.course_name,
            tee_date: match.tee_date,
            gameTypes: gameTypes
          };

          // Simple split: Today or future matches go to Current; Past dates go to History
          if (match.tee_date >= todayStr) {
            current.push(matchPayload);
          } else {
            history.push(matchPayload);
          }
        });

        setCurrentMatches(current);
        setHistoryMatches(history);
      } catch (err) {
        console.error('Error fetching schedules:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [isScheduledOpen]);

  // 🚀 TRANSPORTER HANDOFF TRIGGER
  const handleLaunchMatch = (match) => {
    setIsScheduledOpen(false);
    
    // Construct the payload exactly as App.jsx expects it
    const payload = {
      matchId: match.id,
      matchName: match.match_name,
      courseName: match.course_name,
      activeGames: match.gameTypes
    };
    
    onNavigate('live-game', payload);
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      
      {/* Centered Component Header */}
      <h2 className="text-4xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: '10px 0 28px 0' }}>
        ROUND INTELLIGENCE
      </h2>

      {/* THREE ACTION COMMAND MODULES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        
        {/* 1. Create Match */}
        <button 
          onClick={() => onNavigate('create-match')} 
          style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
          type="button"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>groups</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Create Match</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Deploy immediate side-wager formats and quick-start groups</p>
          </div>
        </button>

        {/* 2. Scheduled Games */}
        <button 
          onClick={() => setIsScheduledOpen(true)}
          style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
          type="button"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>map</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Scheduled Games</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Audit history ledgers, complete match results, and upcoming itineraries</p>
          </div>
        </button>

        {/* 3. Create Tournament */}
        <button 
          onClick={() => onNavigate('create-tournament')} 
          style={{ width: '100%', padding: '24px', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '160px', backgroundColor: '#ecc151', color: '#3e2e00', textAlign: 'left', boxSizing: 'border-box' }}
          type="button"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>trophy</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', margin: 0, lineHeight: '1' }}>Create Tournament</h3>
            <p style={{ fontWeight: '600', fontSize: '12px', margin: '4px 0 0 0', opacity: 0.85 }}>Configure dates, registration fields, and team logic parameters</p>
          </div>
        </button>

      </div>

      {/* REACT RENDERING SLIDE-UP DRAWER FOR SCHEDULED GAMES */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 70, pointerEvents: isScheduledOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsScheduledOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isScheduledOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '10vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', backgroundColor: '#00251b', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s ease-out', transform: isScheduledOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto' }}></div>
          
          <div style={{ padding: '16px 32px 8px 32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#ecc151', fontWeight: '700', textTransform: 'uppercase', tracking: '0.1em', fontSize: '10px' }}>Your Schedule</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#ecc151', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>ROUND INTEL</h3>
              </div>
              <button onClick={() => setIsScheduledOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.2)', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', cursor: 'pointer' }} type="button">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            <div style={{ display: 'flex', padding: '2px', borderRadius: '30px', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)' }}>
              <button 
                onClick={() => setActiveTab('current')} 
                style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em', cursor: 'pointer', backgroundColor: activeTab === 'current' ? '#ecc151' : 'transparent', color: activeTab === 'current' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }}
                type="button"
              >
                Current
              </button>
              <button 
                onClick={() => setActiveTab('history')} 
                style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em', cursor: 'pointer', backgroundColor: activeTab === 'history' ? '#ecc151' : 'transparent', color: activeTab === 'history' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }}
                type="button"
              >
                History
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 32px 40px 32px', boxSizing: 'border-box' }}>
            {loading ? (
              <div style={{ color: '#beedd9', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', padding: '20px' }}>
                LOADING LEDGERS FROM CACHE...
              </div>
            ) : activeTab === 'current' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                {currentMatches.length === 0 ? (
                  <p style={{ color: 'rgba(190,237,217,0.5)', textAlign: 'center', fontStyle: 'italic', fontSize: '13px' }}>No active or upcoming matches found</p>
                ) : (
                  currentMatches.map(match => (
                    <div 
                      key={match.id} 
                      onClick={() => handleLaunchMatch(match)}
                      style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.1)', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#ecc151', textTransform: 'uppercase', tracking: '0.05em' }}>
                          LIVE / UPCOMING • {match.tee_date}
                        </span>
                        <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '18px' }}>play_circle</span>
                      </div>
                      <h4 style={{ fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#beedd9', margin: 0 }}>
                        {match.match_name}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'rgba(190,237,217,0.7)', margin: '4px 0 0 0', fontWeight: '500' }}>
                        {match.course_name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                {historyMatches.length === 0 ? (
                  <p style={{ color: 'rgba(190,237,217,0.5)', textAlign: 'center', fontStyle: 'italic', fontSize: '13px' }}>No past matches on record</p>
                ) : (
                  historyMatches.map(match => (
                    <div 
                      key={match.id} 
                      onClick={() => handleLaunchMatch(match)}
                      style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'rgba(14,60,47,0.4)', border: '1px solid rgba(236,193,81,0.05)', opacity: 0.8, cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', textTransform: 'uppercase' }}>
                          COMPLETED • {match.tee_date}
                        </span>
                        <span style={{ backgroundColor: 'rgba(236,193,81,0.15)', color: '#ecc151', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '900', fontStyle: 'italic' }}>CLOSED</span>
                      </div>
                      <h4 style={{ fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#beedd9', margin: 0 }}>
                        {match.match_name}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'rgba(190,237,217,0.5)', margin: '4px 0 0 0' }}>
                        {match.course_name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default RoundIntelMain;