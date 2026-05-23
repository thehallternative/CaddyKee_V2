import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function CreateMatch({ onNavigate }) {
  // 💾 STANDARDIZED PICKER & LIVE DATABASE COUPLING STATES
  const [matchName, setMatchName] = useState('');
  
  // Custom Mobile UI Sliding Drawer Layer Matrix (Courses)
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);

  // Squad Roster Management States (Profiles & Guests)
  const [profilesList, setProfilesList] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [isPlayerDrawerOpen, setIsPlayerDrawerOpen] = useState(false);
  const [activeTargetSlot, setActiveTargetSlot] = useState(null); // Tracks slots 1, 2, 3, or 4
  const [searchFilter, setSearchFilter] = useState('');

  // Quick Guest Inline Toggle Form States
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestHandicap, setGuestHandicap] = useState('0.0');
  const [isPlusHandicap, setIsPlusHandicap] = useState(false); // 💊 True if plus index (+), saves as negative float

  // Dynamic 4-Slot Active Player Board State Matrix
  const [selectedPlayers, setSelectedPlayers] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  });

  // Initialize with standard current formats so pickers aren't empty on mount
  const [teeDate, setTeeDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [teeTime, setTeeTime] = useState('08:30'); 

  const [games, setGames] = useState({
    skins: { active: false, expanded: false, stakes: 10, carryOver: true },
    wolf: { active: false, expanded: false, multiplier: 2, loneWolf: false },
    match: { active: true, expanded: false, hcpScale: 100, tieBreaker: 'SUDDEN DEATH' }
  });

  // 🧮 Smart Display Parser for Plus & Standard Handicaps
  const formatHandicapDisplay = (val) => {
    if (val === null || val === undefined) return '0.0';
    const num = parseFloat(val);
    if (num < 0) {
      return `+${Math.abs(num).toFixed(1)}`;
    }
    return num.toFixed(1);
  };

  // 📡 ASYNC MOUNT TELEMETRY LOAD (COURSES & PROFILES)
  useEffect(() => {
    async function streamInitialDatabaseTelemetry() {
      try {
        setLoadingCourses(true);
        setLoadingProfiles(true);

        // 1. Fetch active course options
        const { data: courseData, error: courseError } = await supabase
          .from('course_map')
          .select('id, course_name, location_city')
          .eq('is_active', true)
          .order('course_name', { ascending: true });

        if (courseError) throw courseError;
        setCoursesList(courseData || []);
        if (courseData && courseData.length > 0) {
          setSelectedCourseId(courseData[0].id);
        }

        // 2. Fetch active community member profile rows
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, nickname, handicap_index');

        if (profileError) throw profileError;
        setProfilesList(profileData || []);

        // 3. Evaluate and apply default captain assignment to Slot 1
        const defaultCaptain = profileData?.find(
          p => p.nickname?.toUpperCase() === 'DH' || p.display_name?.toUpperCase().includes('HAZEN')
        );
        if (defaultCaptain) {
          setSelectedPlayers(prev => ({ ...prev, 1: defaultCaptain }));
        }

      } catch (err) {
        console.error('Failed to query database registries:', err.message);
      } finally {
        setLoadingCourses(false);
        setLoadingProfiles(false);
      }
    }
    streamInitialDatabaseTelemetry();
  }, []);

  // Open Player Drawer Controller
  const handleOpenPlayerSelection = (slotIndex) => {
    setActiveTargetSlot(slotIndex);
    setSearchFilter('');
    setIsAddingGuest(false);
    setGuestName('');
    setGuestHandicap('0.0');
    setIsPlusHandicap(false);
    setIsPlayerDrawerOpen(true);
  };

  // Assign Member Selection Row to active player board slot
  const handleSelectMemberProfile = (profileObj) => {
    setSelectedPlayers(prev => ({
      ...prev,
      [activeTargetSlot]: profileObj
    }));
    setIsPlayerDrawerOpen(false);
  };

  // Local Object Factory to deploy temporary accountable Quick Guests
  const handleCreateQuickGuest = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    let finalHcpValue = guestHandicap ? parseFloat(guestHandicap) : 0.0;
    
    // 🧮 Core Plus Math Conversion Rule: Store + as negative float value
    if (isPlusHandicap && finalHcpValue > 0) {
      finalHcpValue = -finalHcpValue;
    }

    const pseudoGuestProfile = {
      id: null, 
      is_guest: true,
      display_name: guestName.trim().toUpperCase(),
      nickname: 'GUEST',
      handicap_index: finalHcpValue
    };

    setSelectedPlayers(prev => ({
      ...prev,
      [activeTargetSlot]: pseudoGuestProfile
    }));
    setIsPlayerDrawerOpen(false);
  };

  const handleGameToggle = (gameId) => {
    setGames(prev => ({
      ...prev,
      [gameId]: { ...prev[gameId], active: !prev[gameId].active }
    }));
  };

  const handleDrawerExpand = (gameId) => {
    if (!games[gameId].active) return;
    setGames(prev => ({
      ...prev,
      [gameId]: { ...prev[gameId], expanded: !prev[gameId].expanded }
    }));
  };

  const adjustSkinsStakes = (amount) => {
    setGames(prev => ({
      ...prev,
      skins: { ...prev.skins, stakes: Math.max(0, prev.skins.stakes + amount) }
    }));
  };

  const toggleSkinsCarryOver = () => {
    setGames(prev => ({
      ...prev,
      skins: { ...prev.skins, carryOver: !prev.skins.carryOver }
    }));
  };

  const toggleLoneWolf = () => {
    setGames(prev => ({
      ...prev,
      wolf: { ...prev.wolf, loneWolf: !prev.wolf.loneWolf }
    }));
  };

  const handleTieBreakerChange = (val) => {
    setGames(prev => ({
      ...prev,
      match: { ...prev.match, tieBreaker: val }
    }));
  };

  // Find Currently Active Selected Course Object Profile safely
  const currentSelectedCourse = coursesList.find(c => c.id === selectedCourseId);

  // 🚀 ATOMIC COMPOUND TRANSACTION TELEMETRY EMISSION
  const handleInitializeMatch = async () => {
    try {
      const sanitizedTime = teeTime.length === 5 ? `${teeTime}:00` : teeTime;
      const targetCourseName = currentSelectedCourse ? currentSelectedCourse.course_name : 'Unknown Course';

      // TRANSACTION STEP 1: Insert Core Matches Header Log Item
      const { data: newMatch, error: matchError } = await supabase
        .from('matches')
        .insert([
          {
            match_name: matchName || 'Saturday Skins Challenge',
            course_name: targetCourseName,
            tee_date: teeDate,       
            tee_time: sanitizedTime  
          }
        ])
        .select()
        .single();

      if (matchError) throw matchError;

      // TRANSACTION STEP 2: Loop and generate active side-wager relational entries inside active_wagers
      const activeGameKeys = Object.keys(games).filter(g => games[g].active);
      
      if (activeGameKeys.length > 0) {
        const wagersPayload = activeGameKeys.map(gameKey => ({
          match_id: newMatch.id,
          game_type: gameKey,
          rules_configuration: games[gameKey]
        }));

        const { error: wagerError } = await supabase
          .from('active_wagers')
          .insert(wagersPayload);

        if (wagerError) throw wagerError;
      }

      // TRANSACTION STEP 3: Map Active Board Slots and Write into the optimized match_players schema
      const activeRosterPayload = Object.keys(selectedPlayers)
        .filter(slotKey => selectedPlayers[slotKey] !== null)
        .map(slotKey => {
          const p = selectedPlayers[slotKey];
          return {
            match_id: newMatch.id,
            profile_id: p.id, 
            guest_display_name: p.id ? null : p.display_name, 
            player_position: parseInt(slotKey),
            handicap_at_match_time: p.handicap_index || 0.0
          };
        });

      if (activeRosterPayload.length > 0) {
        const { error: rosterError } = await supabase
          .from('match_players')
          .insert(activeRosterPayload);

        if (rosterError) throw rosterError;
      }

      // TRANSACTION STEP 4: Fast Handoff Context payload step over to scoring view layout chassis
      onNavigate('live-game', {
        matchId: newMatch.id,
        matchName: matchName || 'Saturday Skins Challenge',
        courseName: targetCourseName,
        activeGames: activeGameKeys,
        roster: selectedPlayers
      });

    } catch (err) {
      console.error('Supabase payload dispatch crash:', err.message);
      alert('Supabase Connection Failed: ' + err.message);
    }
  };

  // Local Array Discovery Filter Rules for Active Member Profile Lists
  const filteredProfiles = profilesList.filter(p => {
    const combinedCriteria = `${p.display_name || ''} ${p.nickname || ''}`.toUpperCase();
    return combinedCriteria.includes(searchFilter.toUpperCase());
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
      
      <header style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.2em', margin: '0 0 8px 0', fontFamily: 'sans-serif' }}>
          MATCH CONFIGURATION PROTOCOL
        </p>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white m-0">
          CREATE MATCH
        </h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* PILLAR 1: MATCH NAME */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>
            MATCH NAME
          </span>
          <div style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
            <input 
              type="text" 
              value={matchName}
              onChange={(e) => setMatchName(e.target.value)}
              placeholder="e.g., Saturday Skins Challenge" 
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontSize: '20px', fontWeight: '900', padding: 0 }}
            />
          </div>
        </section>

        {/* PILLAR 2: WHERE */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>WHERE</span>
          </div>
          <div 
            onClick={() => { if (!loadingCourses && coursesList.length > 0) setIsCourseDrawerOpen(true); }}
            style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', flex: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>map</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              {loadingCourses ? (
                <span style={{ color: 'rgba(190, 237, 217, 0.4)', fontStyle: 'italic', fontWeight: '900', fontSize: '16px' }}>
                  Streaming live club registries...
                </span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '20px' }}>
                  <span style={{ color: '#beedd9', fontSize: '18px', fontWeight: '900', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    {currentSelectedCourse ? currentSelectedCourse.course_name : 'Select a Course'}
                  </span>
                  <span style={{ color: '#ecc151', fontSize: '11px', fontWeight: '900', marginTop: '4px', letterSpacing: '0.05em' }}>
                    {currentSelectedCourse ? `(${currentSelectedCourse.location_city})` : 'Tap to select'}
                  </span>
                </div>
              )}
              <span className="material-symbols-outlined" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: '#ecc151', fontSize: '20px', opacity: 0.6 }}>
                unfold_more
              </span>
            </div>
          </div>
        </section>

        {/* PILLAR 3: WHEN */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>
            WHEN
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE DATE</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9' }}>
                <input 
                  type="date" 
                  value={teeDate} 
                  onChange={(e) => setTeeDate(e.target.value)} 
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', fontSize: '15px', padding: 0, width: '100%', colorScheme: 'dark', cursor: 'pointer' }} 
                />
              </div>
            </div>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE TIME</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#beedd9' }}>
                <input 
                  type="time" 
                  value={teeTime} 
                  onChange={(e) => setTeeTime(e.target.value)} 
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', fontSize: '15px', padding: 0, width: '100%', colorScheme: 'dark', cursor: 'pointer' }} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* PILLAR 4: WHO */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>WHO</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[1, 2, 3, 4].map(slotIdx => {
              const player = selectedPlayers[slotIdx];
              return (
                <div 
                  key={slotIdx}
                  onClick={() => { if (!loadingProfiles) handleOpenPlayerSelection(slotIdx); }}
                  style={{ backgroundColor: player ? '#00251b' : '#0e3c2f', border: player ? '1px solid #ecc151' : '1px dashed rgba(236,193,81,0.15)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 8px', cursor: 'pointer', minHeight: '112px', justifyContent: 'center', boxSizing: 'border-box' }}
                >
                  {player ? (
                    <>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontStyle: 'italic', fontSize: '14px', marginBottom: '8px' }}>
                        {player.nickname ? player.nickname.substring(0, 2).toUpperCase() : player.display_name.substring(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '900', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%', textTransform: 'uppercase' }}>
                        {player.nickname ? player.nickname : player.display_name.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '8px', fontWeight: '900', color: '#ecc151', marginTop: '4px' }}>
                        HCP: {formatHandicapDisplay(player.handicap_index)}
                      </span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(236,193,81,0.4)', marginBottom: '8px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)' }}>SLOT {slotIdx}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* PILLAR 5: WHAT */}
        <section style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em' }}>GAME MODE SELECTION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* SKINS */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('skins')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.skins.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>payments</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontStyle: 'italic', color: games.skins.active ? '#ecc151' : 'rgba(190,237,217,0.6)', tracking: '0.05em' }}>SKINS</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Standard Hole Wagers</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('skins'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.skins.active ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.skins.active ? '#3e2e00' : '#414845', transform: games.skins.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>
              
              {games.skins.active && games.skins.expanded && (
                <div style={{ padding: '20px 24px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>STAKES PER HOLE</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#0e3c2f', padding: '6px 16px', borderRadius: '24px' }}>
                      <button onClick={(e) => { e.stopPropagation(); adjustSkinsStakes(-5); }} style={{ background: 'none', border: 'none', color: '#ecc151', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>-</button>
                      <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '16px' }}>${games.skins.stakes}</span>
                      <button onClick={(e) => { e.stopPropagation(); adjustSkinsStakes(5); }} style={{ background: 'none', border: 'none', color: '#ecc151', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>CARRY OVER</h4>
                    </div>
                    <div onClick={toggleSkinsCarryOver} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.skins.carryOver ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.skins.carryOver ? '#3e2e00' : '#414845', transform: games.skins.carryOver ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WOLF */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('wolf')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.wolf.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>pets</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontStyle: 'italic', color: games.wolf.active ? '#ecc151' : 'rgba(190,237,217,0.6)', tracking: '0.05em' }}>WOLF</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Rotating Team Captain</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('wolf'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.wolf.active ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.wolf.active ? '#3e2e00' : '#414845', transform: games.wolf.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {games.wolf.active && games.wolf.expanded && (
                <div style={{ padding: '20px 24px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>WOLF POINT SCALE</h4>
                    </div>
                    <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '14px' }}>X {games.wolf.multiplier}</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>LONE WOLF POT</h4>
                    </div>
                    <div onClick={toggleLoneWolf} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.wolf.loneWolf ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.wolf.loneWolf ? '#3e2e00' : '#414845', transform: games.wolf.loneWolf ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MATCH PLAY */}
            <div style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
              <div onClick={() => handleDrawerExpand('match')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: games.match.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>swords</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontStyle: 'italic', color: games.match.active ? '#ecc151' : 'rgba(190,237,217,0.6)', tracking: '0.05em' }}>MATCH PLAY</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>Head-to-Head Scoring Matrix</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); handleGameToggle('match'); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: games.match.active ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: games.match.active ? '#3e2e00' : '#414845', transform: games.match.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {games.match.active && games.match.expanded && (
                <div style={{ padding: '20px 24px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>HANDICAP SCALE</h4>
                    </div>
                    <span style={{ color: '#ecc151', fontStyle: 'italic', fontWeight: '900', fontSize: '14px' }}>{games.match.hcpScale}%</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgba(236,193,81,0.05)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '900', color: '#beedd9', tracking: '0.05em' }}>TIE BREAKER RULE</h4>
                    </div>
                    <select 
                      value={games.match.tieBreaker}
                      onChange={(e) => handleTieBreakerChange(e.target.value)}
                      style={{ backgroundColor: '#0e3c2f', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '10px', fontWeight: '900', color: '#ecc151', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="SUDDEN DEATH">SUDDEN DEATH</option>
                      <option value="MATCH HALVED">MATCH HALVED</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* INITIATOR DISPATCH BUTTON */}
        <div style={{ paddingTop: '28px', paddingBottom: '20px' }}>
          <button 
            onClick={handleInitializeMatch}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(236,193,81,0.15)' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontWeight: 'bold' }}>power_settings_new</span>
            INITIALIZE MATCH TELEMETRY
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 💎 DRAWER A: HIGH-FIDELITY MOBILE COURSE SLIDING DRAWER SYSTEM             */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: isCourseDrawerOpen ? 'auto' : 'none', display: 'block' }}>
        
        {/* Dark Backdrop Mask Filter */}
        <div 
          onClick={() => setIsCourseDrawerOpen(false)} 
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isCourseDrawerOpen ? 1 : 0, transition: 'opacity 0.4s ease-out', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} 
        />
        
        {/* Sliding Sheet Panel */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '15vh', borderTop: '1px solid rgba(236,193,81,0.25)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxShadow: '0 -15px 40px rgba(0,0,0,0.6)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isCourseDrawerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Top Notch Bar Graphic */}
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto', flex: 'none' }} />
          
          {/* Header Dashboard Title */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
            <div>
              <p style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.15em', margin: '0 0 2px 0', textTransform: 'uppercase' }}>SELECT VENUE GEOMETRY</p>
              <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic', uppercase: 'text' }}>AVAILABLE CLUBS</h3>
            </div>
            <button 
              onClick={() => setIsCourseDrawerOpen(false)} 
              style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} 
              type="button"
            >
              Cancel
            </button>
          </div>

          {/* Dynamic Scroll Matrix Stack Rows */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {coursesList.map((course) => {
              const isSelected = course.id === selectedCourseId;
              return (
                <div 
                  key={course.id}
                  onClick={() => { setSelectedCourseId(course.id); setIsCourseDrawerOpen(false); }}
                  style={{ backgroundColor: isSelected ? '#0e3c2f' : '#001d14', border: isSelected ? '1px solid #ecc151' : '1px solid rgba(236,193,81,0.04)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '12px' }}>
                    <span style={{ color: isSelected ? 'white' : '#beedd9', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.02em' }}>
                      {course.course_name}
                    </span>
                    <span style={{ color: isSelected ? '#ecc151' : 'rgba(190,237,217,0.4)', fontSize: '12px', fontWeight: '700' }}>
                      {course.location_city}
                    </span>
                  </div>
                  
                  {/* Radio Confirmation Light Indicator */}
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '2px solid #ecc151' : '2px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxSizing: 'border-box' }}>
                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ecc151' }} />}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💎 DRAWER B: HIGH-FIDELITY SEARCH DRAWER + ACCOUNTABLE QUICK GUEST PACK  */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 110, pointerEvents: isPlayerDrawerOpen ? 'auto' : 'none', display: 'block' }}>
        <div 
          onClick={() => setIsPlayerDrawerOpen(false)} 
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isPlayerDrawerOpen ? 1 : 0, transition: 'opacity 0.4s ease-out', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} 
        />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '15vh', borderTop: '1px solid rgba(236,193,81,0.25)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isPlayerDrawerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -15px 40px rgba(0,0,0,0.6)' }}>
          
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto', flex: 'none' }} />
          
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', flexDirection: 'column', gap: '14px', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.15em', margin: '0 0 2px 0', textTransform: 'uppercase' }}>ROSTER SQUAD MUTATION</p>
                <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>SELECT PLAYER SLOT {activeTargetSlot}</h3>
              </div>
              <button 
                onClick={() => setIsPlayerDrawerOpen(false)} 
                style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} 
                type="button"
              >
                Close
              </button>
            </div>
            
            {/* Top Toolbar Action Core: Live Search Box */}
            <div style={{ backgroundColor: '#001710', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '20px' }}>search</span>
              <input 
                type="text"
                placeholder="Search community profiles..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '15px', padding: 0 }}
              />
            </div>
            
            {/* Full-Width Quick Guest Visibility Bar Trigger */}
            <button
              type="button"
              onClick={() => setIsAddingGuest(!isAddingGuest)}
              style={{ width: '100%', backgroundColor: isAddingGuest ? '#ecc151' : '#0e3c2f', color: isAddingGuest ? '#3e2e00' : '#ecc151', border: '1px solid rgba(236,193,81,0.08)', padding: '14px 0', borderRadius: '12px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textTransform: 'uppercase', transition: 'all 0.2s' }}
            >
              <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {isAddingGuest ? '✕' : '＋'}
              </span>
              {isAddingGuest ? 'Collapse Guest Console' : 'Create Quick Anonymous Guest'}
            </button>

            {/* 🏎️ RESTRUCTURED HIGH-FIDELITY INLINE GUEST ENTRY DECK WITH STRETCHED PILL CHASSIS */}
            {isAddingGuest && (
              <form 
                onSubmit={handleCreateQuickGuest}
                style={{ backgroundColor: '#001710', border: '1px solid #ecc151', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease-out' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Guest Handle Row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.05em' }}>GUEST NAME / MONIKER</span>
                    <input 
                      type="text" 
                      placeholder="e.g., Slicer Mike"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      style={{ backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '14px', fontWeight: '700', outline: 'none' }}
                    />
                  </div>

                  {/* Stretched Grid Layout for Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.05em' }}>
                        {isPlusHandicap ? 'PLUS HANDICAP (+)' : 'STANDARD HANDICAP'}
                      </span>
                      <input 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0"
                        value={guestHandicap}
                        onChange={(e) => setGuestHandicap(e.target.value)}
                        style={{ backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: isPlusHandicap ? '#ecc151' : 'white', fontSize: '14px', fontWeight: '900', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Pro High-Contrast Toggle */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', letterSpacing: '0.05em' }}>INDEX VARIANT</span>
                      <div 
                        onClick={() => setIsPlusHandicap(!isPlusHandicap)}
                        style={{ height: '46px', backgroundColor: '#0e3c2f', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '10px', display: 'flex', padding: '3px', boxSizing: 'border-box', cursor: 'pointer' }}
                      >
                        <div style={{ flex: 1, backgroundColor: !isPlusHandicap ? '#00251b' : 'transparent', color: !isPlusHandicap ? '#beedd9' : 'rgba(190,237,217,0.25)', border: !isPlusHandicap ? '1px solid rgba(236,193,81,0.1)' : 'none', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', transition: 'all 0.1s ease-in-out' }}>
                          STD
                        </div>
                        <div style={{ flex: 1, backgroundColor: isPlusHandicap ? '#ecc151' : 'transparent', color: isPlusHandicap ? '#3e2e00' : 'rgba(236,193,81,0.3)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', transition: 'all 0.1s ease-in-out' }}>
                          PLUS (+)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '10px', padding: '14px 0', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold' }}>check_circle</span>
                  Inject {isPlusHandicap ? `+${guestHandicap}` : guestHandicap} Guest Into Slot {activeTargetSlot}
                </button>
              </form>
            )}
          </div>

          {/* Member Profile Selection Rows Stack */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredProfiles.map((profile) => {
              const isAlreadyDrafted = Object.values(selectedPlayers).some(slot => slot?.id === profile.id);
              return (
                <div 
                  key={profile.id} 
                  onClick={() => { if (!isAlreadyDrafted) handleSelectMemberProfile(profile); }}
                  style={{ backgroundColor: isAlreadyDrafted ? 'rgba(0,29,20,0.3)' : '#001d14', border: '1px solid rgba(236,193,81,0.04)', padding: '16px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: isAlreadyDrafted ? 'not-allowed' : 'pointer', opacity: isAlreadyDrafted ? 0.35 : 1 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: '#beedd9', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase' }}>
                      {profile.display_name}
                      {profile.nickname && (
                        <span style={{ color: '#ecc151', marginLeft: '6px', fontSize: '13px', fontWeight: '700' }}>
                          ({profile.nickname.toUpperCase()})
                        </span>
                      )}
                    </span>
                    <span style={{ color: 'rgba(190,237,217,0.4)', fontSize: '11px', fontWeight: '700' }}>
                      GLOBAL HANDICAP REGISTER: {formatHandicapDisplay(profile.handicap_index)}
                    </span>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '18px', opacity: isAlreadyDrafted ? 0.2 : 0.6 }}>
                    {isAlreadyDrafted ? 'lock_person' : 'person_add'}
                  </span>
                </div>
              );
            })}
            {filteredProfiles.length === 0 && !isAddingGuest && (
              <p style={{ color: 'rgba(190,237,217,0.3)', textAlign: 'center', fontStyle: 'italic', marginTop: '30px', fontSize: '13px' }}>
                No database records match your search query.
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

export default CreateMatch;