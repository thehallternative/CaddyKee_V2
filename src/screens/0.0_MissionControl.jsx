import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import caddyKeeLogo from '../assets/logo.png';

function MissionControl({ matchContext, onNavigate }) {
  // 🎛️ SYSTEM CONTROLLERS & DATA STREAM SLOTS
  const [agendaMatches, setAgendaMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📝 SLOGAN MATRIX PERIODIC TICKER STATE
  const [currentSloganIdx, setCurrentSloganIdx] = useState(0);
  const slogans = [
    "Unlock a Smarter Way to Play.",
    "Your Group. Your Game. Powered by KEE."
  ];

  // 📡 DATABASE READ: QUERY ALL CURRENT & UPCOMING TIMELINES LIVE
  const fetchOperationalAgenda = async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];

      // Fetch all matches from today onward to dynamically populate the launch feed
      const { data, error } = await supabase
        .from('matches')
        .select('id, match_name, course_name, tee_date, tee_time')
        .gte('tee_date', todayStr)
        .order('tee_date', { ascending: true })
        .order('tee_time', { ascending: true });

      if (error) throw error;
      setAgendaMatches(data || []);
    } catch (err) {
      console.error('Failed to stream real-time operational agenda feed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationalAgenda();

    // Slogan rotating ticker intervals setup
    const sloganTimer = setInterval(() => {
      setCurrentSloganIdx((prev) => (prev + 1) % slogans.length);
    }, 4000);

    return () => clearInterval(sloganTimer);
  }, []);

  const handleLaunchMatchCard = (match) => {
    const payload = {
      matchId: match.id,
      matchName: match.match_name,
      courseName: match.course_name,
      activeGames: ['skins', 'wolf', 'match_play']
    };
    onNavigate('live-game', payload);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', boxSizing: 'border-box', width: '100%', paddingTop: '12px', position: 'relative' }}>
      
      {/* 🎨 INJECTING HARDWARE-ACCELERATED KEYFRAMES & PULSE MOTIONS */}
      <style>{`
        @keyframes flyInLogo {
          0% { transform: translateY(60px); opacity: 0; filter: blur(4px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes flyInSlogan {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0.85; }
        }
        @keyframes flyInFeed {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes ambientEmeraldPulse {
          0% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.15); opacity: 0.25; }
          100% { transform: scale(1); opacity: 0.15; }
        }
        @keyframes futuristicLaserScan {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .laser-glow-card {
          position: relative;
          overflow: hidden;
        }
        .laser-glow-card::after {
          content: '';
          position: absolute;
          top: 0;
          height: 100%;
          width: 150px;
          background: linear-gradient(to right, transparent, rgba(236,193,81,0.08), transparent);
          transform: skewX(-25deg);
          animation: futuristicLaserScan 3.5s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 🎨 INTERACTIVE BACKGROUND ATMOSPHERIC RADIAL PULSE SHIELD */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-10%', 
          left: '50%', 
          width: '320px', 
          height: '320px', 
          borderRadius: '50%', 
          backgroundColor: '#ecc151', 
          filter: 'blur(140px)', 
          zIndex: 0, 
          pointerEvents: 'none',
          transform: 'translateX(-50%)',
          animation: 'ambientEmeraldPulse 6s infinite ease-in-out'
        }} 
      />

      {/* BRANDING HUB EXTRUDING HERO CARD */}
      <section 
        style={{ 
          zIndex: 1,
          backgroundColor: '#0e3c2f', 
          border: '1px solid rgba(236,193,81,0.15)', 
          borderRadius: '24px', 
          padding: '40px 24px', 
          textAlign: 'center', 
          boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          boxSizing: 'border-box'
        }}
      >
        {/* 🎬 ANIMATED LAYER 1: Core Floating Logo Brand Identity */}
        <div style={{ animation: 'flyInLogo 0.7s cubic-bezier(0.1, 0.85, 0.25, 1) forwards' }}>
          <img 
            src={caddyKeeLogo} 
            alt="CaddyKee Logo" 
            style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(236,193,81,0.4))' }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* 🎬 ANIMATED LAYER 2: Staggered Dynamic Slogan Ticker Text */}
        <div 
          style={{ 
            opacity: 0,
            animation: 'flyInSlogan 0.7s cubic-bezier(0.1, 0.85, 0.25, 1) 0.3s forwards',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p style={{ margin: 0, color: '#beedd9', fontSize: '15px', fontWeight: '900', fontStyle: 'italic', tracking: '0.02em', textTransform: 'uppercase', lineHeight: '1.4', transition: 'all 0.3s ease' }}>
            {slogans[currentSloganIdx]}
          </p>
        </div>
      </section>

      {/* 🎬 ANIMATED LAYER 3: Combined Real-time Operational Agenda Feed */}
      <section 
        style={{ 
          zIndex: 1,
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px',
          opacity: 0,
          animation: 'flyInFeed 0.7s cubic-bezier(0.1, 0.85, 0.25, 1) 0.6s forwards'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.15em', textTransform: 'uppercase', paddingLeft: '4px' }}>
          OPERATIONAL ROUNDS DISPATCH FEED
        </span>

        {loading ? (
          <div style={{ color: '#beedd9', padding: '30px', textAlign: 'center', fontStyle: 'italic', fontWeight: '700', fontSize: '13px' }}>
            STREAMING ACTIVE ITINERARIES FROM DB HOOKS...
          </div>
        ) : agendaMatches.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {agendaMatches.map((match) => {
              const isToday = match.tee_date === new Date().toISOString().split('T')[0];
              
              return (
                <div 
                  key={match.id}
                  onClick={() => handleLaunchMatchCard(match)}
                  className="laser-glow-card"
                  style={{ 
                    backgroundColor: 'rgba(14, 60, 47, 0.4)', 
                    backdropFilter: 'blur(20px)', 
                    border: isToday ? '1px solid #ecc151' : '1px solid rgba(236,193,81,0.12)', 
                    padding: '24px', 
                    borderRadius: '16px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    boxShadow: isToday ? '0 10px 25px rgba(236,193,81,0.06)' : 'none'
                  }}
                >
                  <div style={{ paddingRight: '12px' }}>
                    <span 
                      style={{ 
                        backgroundColor: isToday ? '#ecc151' : '#0e3c2f', 
                        color: isToday ? '#3e2e00' : '#ecc151', 
                        fontSize: '9px', 
                        fontWeight: '900', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        textTransform: 'uppercase', 
                        tracking: '0.05em',
                        border: isToday ? 'none' : '1px solid rgba(236,193,81,0.2)'
                      }}
                    >
                      {isToday ? '● LIVE TODAY' : 'SCHEDULED'}
                    </span>
                    <h3 style={{ margin: '12px 0 4px 0', color: 'white', fontWeight: '900', fontStyle: 'italic', fontSize: '20px', textTransform: 'uppercase', tracking: '-0.01em', lineHeight: '1.2' }}>
                      {match.match_name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#a3d0be', fontWeight: '700' }}>
                      Track: {match.course_name} {match.tee_time ? `• ${match.tee_time}` : ''}
                    </p>
                  </div>
                  <span style={{ color: '#ecc151', fontSize: '18px', fontWeight: 'bold', flexShrink: 0 }}>➜</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            onClick={() => onNavigate('round-intel')}
            style={{ backgroundColor: 'rgba(14, 60, 47, 0.15)', border: '1px dashed rgba(236,193,81,0.12)', padding: '40px 24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }}
          >
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', fontStyle: 'italic', color: 'rgba(190,237,217,0.3)', textTransform: 'uppercase' }}>
              No active session rounds or timelines found on deck
            </p>
            <span style={{ display: 'block', marginTop: '8px', fontSize: '10px', color: '#ecc151', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em' }}>
              [ Create Match In Rounds Ledger ]
            </span>
          </div>
        )}
      </section>

    </div>
  );
}

export default MissionControl;