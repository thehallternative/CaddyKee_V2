import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function RoundIntelMain({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('live');
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [liveMatches, setLiveMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [historyMatches, setHistoryMatches] = useState([]);

  // 🎛️ SWIPE GESTURE STATE TRACKER
  const [activeSwipeId, setActiveSwipeId] = useState(null); 
  const [touchStart, setTouchStart] = useState(0);
  const [touchDelta, setTouchDelta] = useState(0);

  // 🎚️ CUSTOM PREMIUM MODAL DETONATOR STATES
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
    if (isScheduledOpen) {
      fetchMatches();
    }
  }, [isScheduledOpen]);

  // 🗑️ NATIVE CASCADING DESTRUCTION ENGINE (RLS BYPASS RE-ALIGNED)
  const executeMatchPurge = async (matchId) => {
    try {
      setLoading(true);
      setDeleteTargetMatch(null); 
      
      // PostgreSQL handles children automatically now that RLS policies are deployed
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);
      
      if (error) throw error;
      
      setActiveSwipeId(null);
      setTouchDelta(0);
      await fetchMatches();
    } catch (err) {
      console.error(`Purge fault: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchMatch = (match) => {
    if (activeSwipeId === match.id && touchDelta !== 0) {
      setActiveSwipeId(null);
      setTouchDelta(0);
      return;
    }

    setIsScheduledOpen(false);
    const payload = {
      matchId: match.id,
      matchName: match.match_name,
      courseName: match.course_name,
      activeGames: match.gameTypes
    };
    onNavigate('live-game', payload);
  };

  // 🕹️ MOBILE TOUCH INTERACTION EVENT HANDLERS
  const handleTouchStart = (e, id) => {
    setTouchStart(e.targetTouches[0].clientX);
    if (activeSwipeId !== id) {
      setActiveSwipeId(id);
      setTouchDelta(0);
    }
  };

  const handleTouchMove = (e, id) => {
    if (activeSwipeId !== id) return;
    const currentX = e.targetTouches[0].clientX;
    const currentDelta = currentX - touchStart;
    
    if (currentDelta > 85) setTouchDelta(85);
    else if (currentDelta < -85) setTouchDelta(-85);
    else setTouchDelta(currentDelta);
  };

  const handleTouchEnd = () => {
    if (touchDelta < -65) {
      setTouchDelta(-80); 
    } else if (touchDelta > 65) {
      setTouchDelta(80);  
    } else {
      setActiveSwipeId(null);
      setTouchDelta(0);   
    }
  };

  const renderMatchCards = (matchList, placeholderText) => {
    if (matchList.length === 0) {
      return (
        <p style={{ color: 'rgba(190,237,217,0.4)', textAlign: 'center', fontStyle: 'italic', fontSize: '13px', marginTop: '20px' }}>
          {placeholderText}
        </p>
      );
    }
    return matchList.map(match => {
      const isSwiped = activeSwipeId === match.id;
      const cardTransform = isSwiped ? `translateX(${touchDelta}px)` : 'translateX(0px)';

      return (
        <div 
          key={match.id}
          style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', backgroundColor: '#051d16', width: '100%' }}
        >
          {/* 🔥 UNDERLAY LAYER A: PREMIUM GOLD EDIT MODULE */}
          <div 
            onClick={() => {
              setActiveSwipeId(null);
              setTouchDelta(0);
              onNavigate('create-match', { matchId: match.id, isEditing: true });
            }}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100px', backgroundColor: '#ecc151', color: '#3e2e00', display: 'flex', alignItems: 'center', paddingLeft: '24px', boxSizing: 'border-box', fontWeight: '900', fontStyle: 'italic', fontSize: '12px', zIndex: 1, cursor: 'pointer', opacity: isSwiped && touchDelta > 0 ? 1 : 0, transition: 'opacity 0.1s' }}
          >
            EDIT
          </div>

          {/* ❌ UNDERLAY LAYER B: HIGH-CONTRAST DESTRUCTIVE RED TRASH MODULE */}
          <div 
            onClick={() => setDeleteTargetMatch(match)}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', backgroundColor: '#eb5e55', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px', boxSizing: 'border-box', fontWeight: '900', fontStyle: 'italic', fontSize: '12px', zIndex: 1, cursor: 'pointer', opacity: isSwiped && touchDelta < 0 ? 1 : 0, transition: 'opacity 0.1s' }}
          >
            DELETE
          </div>

          {/* 🌁 TOP VISUAL FOREGROUND CARD STACK */}
          <div 
            onClick={() => handleLaunchMatch(match)}
            onTouchStart={(e) => handleTouchStart(e, match.id)}
            onTouchMove={(e) => handleTouchMove(e, match.id)}
            onTouchEnd={handleTouchEnd}
            style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.1)', cursor: 'pointer', textAlign: 'left', position: 'relative', zIndex: 2, transform: cardTransform, transition: touchDelta === 0 ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'none', willChange: 'transform' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#ecc151', textTransform: 'uppercase', tracking: '0.05em' }}>
                {match.tee_date} • {match.tee_time || 'NO TIME'}
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
        </div>
      );
    });
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

      {/* REACT RENDERING SLIDE-UP THREE-TAB DRAWER */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 70, pointerEvents: isScheduledOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => { setIsScheduledOpen(false); setActiveSwipeId(null); setTouchDelta(0); }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isScheduledOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '10vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', backgroundColor: '#00251b', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s ease-out', transform: isScheduledOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto' }}></div>
          
          <div style={{ padding: '16px 20px 8px 20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#ecc151', fontWeight: '700', textTransform: 'uppercase', tracking: '0.1em', fontSize: '10px' }}>Your Schedule</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', color: '#ecc151', margin: '4px 0 0 0', letterSpacing: '-0.02em' }}>ROUND INTEL</h3>
              </div>
              <button onClick={() => { setIsScheduledOpen(false); setActiveSwipeId(null); setTouchDelta(0); }} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', cursor: 'pointer' }} type="button">
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>✕</span>
              </button>
            </div>

            <div style={{ display: 'flex', padding: '2px', borderRadius: '30px', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)' }}>
              <button onClick={() => { setActiveTab('scheduled'); setActiveSwipeId(null); setTouchDelta(0); }} style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', cursor: 'pointer', backgroundColor: activeTab === 'scheduled' ? '#ecc151' : 'transparent', color: activeTab === 'scheduled' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }} type="button">Scheduled</button>
              <button onClick={() => { setActiveTab('live'); setActiveSwipeId(null); setTouchDelta(0); }} style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', cursor: 'pointer', backgroundColor: activeTab === 'live' ? '#ecc151' : 'transparent', color: activeTab === 'live' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }} type="button">Live</button>
              <button onClick={() => { setActiveTab('history'); setActiveSwipeId(null); setTouchDelta(0); }} style={{ flex: 1, padding: '10px 0', borderRadius: '24px', border: 'none', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', cursor: 'pointer', backgroundColor: activeTab === 'history' ? '#ecc151' : 'transparent', color: activeTab === 'history' ? '#3e2e00' : 'rgba(236,193,81,0.6)' }} type="button">History</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px 20px', boxSizing: 'border-box' }}>
            {loading ? (
              <div style={{ color: '#beedd9', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', padding: '20px' }}>
                EXECUTING DATABASE MANIFEST...
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

      {/* 🏛️ PREMIUM INTEGRATED CADDY AESTHETIC DELETION DIALOG */}
      {deleteTargetMatch && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
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