import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function EditMatch({ matchId, onNavigate }) {
  // 💾 CORE STORAGE & Telemetry SLOTS
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
  const [activeTargetSlot, setActiveTargetSlot] = useState(null); 
  const [searchFilter, setSearchFilter] = useState('');

  // Quick Guest Inline Toggle Form States
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestHandicap, setGuestHandicap] = useState('0.0');
  const [isPlusHandicap, setIsPlusHandicap] = useState(false); 

  // Dynamic 4-Slot Active Player Board State Matrix
  const [selectedPlayers, setSelectedPlayers] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  });

  const [teeDate, setTeeDate] = useState('');
  const [teeTime, setTeeTime] = useState(''); 

  // 🎛️ DYNAMIC DATABASE-DRIVEN GAME BLUEPRINT MATRICES
  const [dbMasterGames, setDbMasterGames] = useState([]);
  const [liveGameStates, setLiveGameStates] = useState({});
  const [isReconciling, setIsReconciling] = useState(true);

  // 🧮 Smart Display Parser for Plus & Standard Handicaps
  const formatHandicapDisplay = (val) => {
    if (val === null || val === undefined) return '0.0';
    const num = parseFloat(val);
    if (num < 0) {
      return `+${Math.abs(num).toFixed(1)}`;
    }
    return num.toFixed(1);
  };

  // 📡 ASYNC MOUNT RECONCILIATION EXTRACTION LOOKUP LOOP
  useEffect(() => {
    async function reconcileScheduledMatchData() {
      try {
        setIsReconciling(true);

        // 1. Fetch active course options
        const { data: courseData, error: courseError } = await supabase
          .from('course_map')
          .select('id, course_name, location_city')
          .eq('is_active', true)
          .order('course_name', { ascending: true });
        if (courseError) throw courseError;
        setCoursesList(courseData || []);

        // 2. Fetch active community member profile rows
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, nickname, handicap_index');
        if (profileError) throw profileError;
        setProfilesList(profileData || []);

        // 3. Fetch our 5 favorite master game records
        const { data: rulesData, error: rulesError } = await supabase
          .from('game_rules')
          .select('*')
          .eq('published', true)
          .order('is_favorite', { ascending: false });
        if (rulesError) throw rulesError;
        setDbMasterGames(rulesData || []);

        // Initialize plain baseline rules templates
        const initialGameDictionary = {};
        (rulesData || []).forEach(game => {
          const configSchema = game.config_schema || {};
          const flattenedVariables = {};

          Object.keys(configSchema).forEach(key => {
            const item = configSchema[key];
            if (item && typeof item === 'object' && 'default' in item) {
              flattenedVariables[key] = item.default;
            } else {
              flattenedVariables[key] = item;
            }
          });

          initialGameDictionary[game.slug] = {
            active: false,
            expanded: false,
            variables: flattenedVariables
          };
        });

        // 4. INGEST HISTORICAL PARENT CONFIGS FOR THE TARGET ROUND
        if (matchId) {
          const { data: matchObj, error: matchLoadErr } = await supabase
            .from('matches')
            .select('*')
            .eq('id', matchId)
            .single();

          if (!matchLoadErr && matchObj) {
            setMatchName(matchObj.match_name || '');
            setTeeDate(matchObj.tee_date || '');
            setTeeTime(matchObj.tee_time ? matchObj.tee_time.substring(0, 5) : '08:30');

            const matchedCourse = (courseData || []).find(c => c.course_name === matchObj.course_name);
            if (matchedCourse) setSelectedCourseId(matchedCourse.id);
          }

          // Ingest saved side wagers configurations
          const { data: activeWagers, error: wagersLoadErr } = await supabase
            .from('active_wagers')
            .select('*')
            .eq('match_id', matchId);

          if (!wagersLoadErr && activeWagers) {
            activeWagers.forEach(wager => {
              if (initialGameDictionary[wager.game_type]) {
                initialGameDictionary[wager.game_type].active = true;
                initialGameDictionary[wager.game_type].variables = {
                  ...initialGameDictionary[wager.game_type].variables,
                  ...(wager.rules_configuration || {})
                };
              }
            });
          }

          // Ingest assigned players roster lineup mapping
          const { data: activePlayers, error: playersLoadErr } = await supabase
            .from('match_players')
            .select('*')
            .eq('match_id', matchId)
            .order('player_position', { ascending: true });

          const restoredPlayers = { 1: null, 2: null, 3: null, 4: null };
          if (!playersLoadErr && activePlayers) {
            activePlayers.forEach(mp => {
              if (mp.profile_id) {
                const foundProf = (profileData || []).find(p => p.id === mp.profile_id);
                if (foundProf) {
                  restoredPlayers[mp.player_position] = {
                    ...foundProf,
                    handicap_index: mp.handicap_at_match_time
                  };
                }
              } else if (mp.guest_display_name) {
                restoredPlayers[mp.player_position] = {
                  id: null,
                  is_guest: true,
                  display_name: mp.guest_display_name,
                  nickname: '',
                  handicap_index: mp.handicap_at_match_time
                };
              }
            });
            setSelectedPlayers(restoredPlayers);
          }
        }

        setLiveGameStates(initialGameDictionary);

      } catch (err) {
        console.error('Failed to parse database configurations registry:', err.message);
      } finally {
        setLoadingCourses(false);
        setLoadingProfiles(false);
        setIsReconciling(false);
      }
    }
    reconcileScheduledMatchData();
  }, [matchId]);

  // Player Drawer Layout Controller Handlers
  const handleOpenPlayerSelection = (slotIndex) => {
    setActiveTargetSlot(slotIndex);
    setSearchFilter('');
    setIsAddingGuest(false);
    setGuestName('');
    setGuestHandicap('0.0');
    setIsPlusHandicap(false);
    setIsPlayerDrawerOpen(true);
  };

  const handleSelectMemberProfile = (profileObj) => {
    setSelectedPlayers(prev => ({ ...prev, [activeTargetSlot]: profileObj }));
    setIsPlayerDrawerOpen(false);
  };

  const handleCreateQuickGuest = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    let finalHcpValue = guestHandicap ? parseFloat(guestHandicap) : 0.0;
    if (isPlusHandicap && finalHcpValue > 0) finalHcpValue = -finalHcpValue;

    setSelectedPlayers(prev => ({
      ...prev,
      [activeTargetSlot]: {
        id: null, 
        is_guest: true,
        display_name: guestName.trim(), 
        nickname: '', 
        handicap_index: finalHcpValue
      }
    }));
    setIsPlayerDrawerOpen(false);
  };

  // Mutator Event Controllers For Dynamic Settings Sliders
  const handleGameToggle = (slug) => {
    setLiveGameStates(prev => {
      const node = { ...prev[slug] };
      node.active = !node.active;
      return { ...prev, [slug]: node };
    });
  };

  const handleDrawerExpand = (slug) => {
    setLiveGameStates(prev => {
      const node = { ...prev[slug] };
      if (!node.active) return prev;
      node.expanded = !node.expanded;
      return { ...prev, [slug]: node };
    });
  };

  const handleSubVariableBooleanToggle = (slug, varKey) => {
    setLiveGameStates(prev => {
      const node = { ...prev[slug] };
      const vars = { ...node.variables };
      vars[varKey] = !vars[varKey];
      node.variables = vars;
      return { ...prev, [slug]: node };
    });
  };

  const handleSubVariableNumericStep = (slug, varKey, increment, isInteger = false) => {
    setLiveGameStates(prev => {
      const node = { ...prev[slug] };
      const vars = { ...node.variables };
      const currentVal = typeof vars[varKey] === 'number' ? vars[varKey] : parseFloat(vars[varKey] || 0);
      const step = isInteger ? 1 : 0.5;

      const calculated = increment ? currentVal + step : currentVal - step;
      vars[varKey] = calculated >= 0 ? calculated : 0;
      node.variables = vars;
      return { ...prev, [slug]: node };
    });
  };

  const handleSubVariableTextInput = (slug, varKey, value) => {
    setLiveGameStates(prev => {
      const node = { ...prev[slug] };
      const vars = { ...node.variables };
      vars[varKey] = value;
      node.variables = vars;
      return { ...prev, [slug]: node };
    });
  };

  const currentSelectedCourse = coursesList.find(c => c.id === selectedCourseId);

  // 🚀 SUBMIT UPDATE OBLIGATION PACK BACK TO DATABASE
  const handleCommitMatchUpdates = async (shouldLaunchLiveScoringModule) => {
    try {
      const sanitizedTime = teeTime.length === 5 ? `${teeTime}:00` : teeTime;
      const targetCourseName = currentSelectedCourse ? currentSelectedCourse.course_name : 'Unknown Course';

      // 1. Update Core Matches Header Row
      const { error: headerUpdateErr } = await supabase
        .from('matches')
        .update({
          match_name: matchName || 'Saturday Tournament Session',
          course_name: targetCourseName,
          tee_date: teeDate,
          tee_time: sanitizedTime
        })
        .eq('id', matchId);

      if (headerUpdateErr) throw headerUpdateErr;

      // 2. Clear out dependencies cleanly to avoid primary key duplicates collision
      await supabase.from('active_wagers').delete().eq('match_id', matchId);
      await supabase.from('match_players').delete().eq('match_id', matchId);

      // 3. Re-insert active game variable profiles roster sets
      const activeGameKeys = Object.keys(liveGameStates).filter(slug => liveGameStates[slug].active);
      if (activeGameKeys.length > 0) {
        const wagersPayload = activeGameKeys.map(slug => ({
          match_id: matchId,
          game_type: slug,
          rules_configuration: liveGameStates[slug].variables
        }));
        const { error: wagerError } = await supabase.from('active_wagers').insert(wagersPayload);
        if (wagerError) throw wagerError;
      }

      // 4. Re-insert board positions map matrix rows
      const activeRosterPayload = Object.keys(selectedPlayers)
        .filter(slotKey => selectedPlayers[slotKey] !== null)
        .map(slotKey => {
          const p = selectedPlayers[slotKey];
          return {
            match_id: matchId,
            profile_id: p.id, 
            guest_display_name: p.id ? null : p.display_name, 
            player_position: parseInt(slotKey),
            handicap_at_match_time: p.handicap_index || 0.0
          };
        });

      if (activeRosterPayload.length > 0) {
        const { error: rosterError } = await supabase.from('match_players').insert(activeRosterPayload);
        if (rosterError) throw rosterError;
      }

      // 5. Split Workflow Navigation Router Diverter
      if (shouldLaunchLiveScoringModule) {
        // Force routing switch back down into live game context layout
        onNavigate('live-game', {
          matchId: matchId,
          matchName: matchName || 'Saturday Tournament Session',
          courseName: targetCourseName,
          activeGames: activeGameKeys,
          roster: selectedPlayers
        });
      } else {
        onNavigate('mission-control');
      }

    } catch (err) {
      console.error('Database configuration update dropped execution:', err.message);
      alert('Transaction Fault: ' + err.message);
    }
  };

  const filteredProfiles = profilesList.filter(p => {
    const mixedStr = `${p.display_name || ''} ${p.nickname || ''}`.toUpperCase();
    return mixedStr.includes(searchFilter.toUpperCase());
  });

  if (isReconciling) {
    return (
      <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', tracking: '0.1em' }}>
        RECONCILING ROUND SPECIFICATIONS MATRIX...
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box', paddingTop: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* PILLAR 1: MATCH NAME */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>
            MATCH SETUP (EDIT MODE)
          </span>
          <div style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
            <input 
              type="text" 
              value={matchName}
              onChange={(e) => setMatchName(e.target.value)}
              placeholder="e.g., Saturday Tournament Battle" 
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontSize: '20px', fontWeight: '900', padding: 0 }}
            />
          </div>
        </section>

        {/* PILLAR 2: WHERE */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>WHERE</span>
          <div 
            onClick={() => setIsCourseDrawerOpen(true)}
            style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', flex: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>map</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '20px' }}>
                <span style={{ color: '#beedd9', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase' }}>
                  {currentSelectedCourse ? currentSelectedCourse.course_name : 'Select a Course'}
                </span>
                <span style={{ color: '#ecc151', fontSize: '11px', fontWeight: '900', marginTop: '4px' }}>
                  {currentSelectedCourse ? `(${currentSelectedCourse.location_city})` : 'Tap to select'}
                </span>
              </div>
              <span className="material-symbols-outlined" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: '#ecc151', fontSize: '20px', opacity: 0.6 }}>unfold_more</span>
            </div>
          </div>
        </section>

        {/* PILLAR 3: WHEN */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>WHEN</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE DATE</span>
              <input type="date" value={teeDate} onChange={(e) => setTeeDate(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', fontSize: '15px', width: '100%', colorScheme: 'dark' }} />
            </div>
            <div style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(190,237,217,0.5)', display: 'block', marginBottom: '4px' }}>TEE TIME</span>
              <input type="time" value={teeTime} onChange={(e) => setTeeTime(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '900', fontSize: '15px', width: '100%', colorScheme: 'dark' }} />
            </div>
          </div>
        </section>

        {/* PILLAR 4: WHO */}
        <section>
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>WHO</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[1, 2, 3, 4].map(slotIdx => {
              const player = selectedPlayers[slotIdx];
              const resolvedInitials = player ? (player.nickname ? player.nickname.substring(0, 2).toUpperCase() : player.display_name.substring(0, 2).toUpperCase()) : '';
              const resolvedDisplayName = player ? (player.nickname ? player.nickname : player.display_name) : '';

              return (
                <div key={slotIdx} onClick={() => handleOpenPlayerSelection(slotIdx)} style={{ backgroundColor: player ? '#00251b' : '#0e3c2f', border: player ? '1px solid #ecc151' : '1px dashed rgba(236,193,81,0.15)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 8px', cursor: 'pointer', minHeight: '112px', justifyContent: 'center', boxSizing: 'border-box' }}>
                  {player ? (
                    <>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#0e3c2f', border: '2px solid #ecc151', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontStyle: 'italic', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase' }}>{resolvedInitials}</div>
                      <span style={{ fontSize: '10px', fontWeight: '900', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%', textTransform: 'uppercase' }}>{resolvedDisplayName}</span>
                      <span style={{ fontSize: '8px', fontWeight: '900', color: '#ecc151', marginTop: '4px' }}>HCP: {formatHandicapDisplay(player.handicap_index)}</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(236,193,81,0.4)', marginBottom: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span></div>
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
          <span style={{ fontSize: '10px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', letterSpacing: '0.3em', display: 'block', marginBottom: '12px', paddingLeft: '8px' }}>GAME MODE SELECTION</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dbMasterGames.map((game) => {
              const gameLive = liveGameStates[game.slug] || { active: false, expanded: false, variables: {} };
              const configSchema = game.config_schema || {};

              return (
                <div key={game.slug} style={{ backgroundColor: '#0e3c2f', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', overflow: 'hidden' }}>
                  <div onClick={() => handleDrawerExpand(game.slug)} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#00251b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gameLive.active ? '#ecc151' : 'rgba(190,237,217,0.3)', border: '1px solid rgba(236,193,81,0.05)', flex: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                        {game.slug === 'wolf' ? 'pets' : game.slug === 'hollywood' ? 'movie' : game.slug === 'team_game' ? 'groups' : game.slug === 'greenies' ? 'golf_course' : '3k'}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', fontStyle: 'italic', color: gameLive.active ? '#ecc151' : 'rgba(190,237,217,0.6)' }}>{game.title}</h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', fontWeight: '700', color: 'rgba(190,237,217,0.4)' }}>{game.category}</p>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); handleGameToggle(game.slug); }} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: gameLive.active ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: gameLive.active ? '#3e2e00' : '#414845', transform: gameLive.active ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>

                  {gameLive.active && gameLive.expanded && (
                    <div style={{ padding: '20px 24px', backgroundColor: '#002117', borderTop: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {Object.keys(configSchema).map((vKey, innerIdx) => {
                        const meta = configSchema[vKey];
                        const val = gameLive.variables[vKey];
                        const labelText = meta.label || vKey.toUpperCase().replace(/_/g, ' ');
                        const typeSpec = meta.type || typeof val;

                        return (
                          <div key={vKey} style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: innerIdx > 0 ? '1px solid rgba(65,72,69,0.2)' : 'none', paddingTop: innerIdx > 0 ? '16px' : '0' }}>
                            {typeSpec === 'boolean' || typeof val === 'boolean' ? (
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: '#beedd9' }}>{labelText}</h4>
                                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.4)' }}>{meta.description}</p>
                                </div>
                                <div onClick={() => handleSubVariableBooleanToggle(game.slug, vKey)} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: val ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}>
                                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: val ? '#3e2e00' : '#414845', transform: val ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                                </div>
                              </div>
                            ) : typeSpec === 'numeric' || typeSpec === 'integer' || typeof val === 'number' ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: '#beedd9' }}>{labelText}</h4>
                                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'rgba(190,237,217,0.4)' }}>{meta.description}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001710', borderRadius: '12px', padding: '6px', border: '1px solid rgba(236,193,81,0.1)', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
                                  <button onClick={() => handleSubVariableNumericStep(game.slug, vKey, false, typeSpec === 'integer')} style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#0e3c2f', border: 'none', color: '#ecc151', fontSize: '18px', fontWeight: '900', cursor: 'pointer' }} type="button">-</button>
                                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#ecc151', fontFamily: 'monospace' }}>{typeof val === 'number' ? val.toFixed(typeSpec === 'integer' ? 0 : 2) : val}</span>
                                  <button onClick={() => handleSubVariableNumericStep(game.slug, vKey, true, typeSpec === 'integer')} style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#0e3c2f', border: 'none', color: '#ecc151', fontSize: '18px', fontWeight: '900', cursor: 'pointer' }} type="button">+</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: '#beedd9' }}>{labelText}</h4>
                                <p style={{ margin: '0 0 4px 0', fontSize: '10px', color: 'rgba(190,237,217,0.4)' }}>{meta.description}</p>
                                <input type="text" value={val || ''} onChange={(e) => handleSubVariableTextInput(game.slug, vKey, e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '14px', fontWeight: '700', outline: 'none' }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ACTION PANEL CONTROL TRAY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '28px', paddingBottom: '40px', width: '100%' }}>
          <button 
            onClick={() => handleCommitMatchUpdates(false)}
            style={{ width: '100%', backgroundColor: 'transparent', color: '#ecc151', border: '1px solid rgba(236,193,81,0.4)', borderRadius: '40px', padding: '20px 0', fontSize: '16px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontWeight: 'bold', fontSize: '20px' }}>bookmark_add</span>
            SAVE & PRE-POST ALTERATIONS
          </button>

          <button 
            onClick={() => handleCommitMatchUpdates(true)}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(236,193,81,0.15)' }}
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontWeight: 'bold', fontSize: '22px' }}>power_settings_new</span>
            LAUNCH MASTER SCORING VIEW
          </button>
        </div>

      </div>

      {/* VENUE COURSE SYSTEM DRAWER */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: isCourseDrawerOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsCourseDrawerOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isCourseDrawerOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '15vh', borderTop: '1px solid rgba(236,193,81,0.25)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isCourseDrawerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto' }} />
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>AVAILABLE CLUBS</h3>
            <button onClick={() => setIsCourseDrawerOpen(false)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Cancel</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {coursesList.map((course) => {
              const isSelected = course.id === selectedCourseId;
              return (
                <div key={course.id} onClick={() => { setSelectedCourseId(course.id); setIsCourseDrawerOpen(false); }} style={{ backgroundColor: isSelected ? '#0e3c2f' : '#001d14', border: isSelected ? '1px solid #ecc151' : '1px solid rgba(236,193,81,0.04)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: isSelected ? 'white' : '#beedd9', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase' }}>{course.course_name}</span>
                    <span style={{ color: isSelected ? '#ecc151' : 'rgba(190,237,217,0.4)', fontSize: '12px' }}>{course.location_city}</span>
                  </div>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ecc151' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PLAYER CONFIG DRAWER */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 110, pointerEvents: isPlayerDrawerOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsPlayerDrawerOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isPlayerDrawerOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '15vh', borderTop: '1px solid rgba(236,193,81,0.25)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isPlayerDrawerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto' }} />
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>SELECT PLAYER SLOT {activeTargetSlot}</h3>
              <button onClick={() => setIsPlayerDrawerOpen(false)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Close</button>
            </div>
            <div style={{ backgroundColor: '#001710', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ color: '#ecc151', fontSize: '20px' }}>search</span>
              <input type="text" placeholder="Search community profiles..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '15px' }} />
            </div>
            <button type="button" onClick={() => setIsAddingGuest(!isAddingGuest)} style={{ width: '100%', backgroundColor: isAddingGuest ? '#ecc151' : '#0e3c2f', color: isAddingGuest ? '#3e2e00' : '#ecc151', padding: '14px 0', borderRadius: '12px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>{isAddingGuest ? '✕' : '＋'}</span> {isAddingGuest ? 'Collapse Guest Console' : 'Create Quick Anonymous Guest'}
            </button>
            {isAddingGuest && (
              <form onSubmit={handleCreateQuickGuest} style={{ backgroundColor: '#001710', border: '1px solid #ecc151', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Guest Moniker" value={guestName} onChange={(e) => setGuestName(e.target.value)} required style={{ backgroundColor: '#0e3f2f', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '14px', fontWeight: '700', outline: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                  <input type="number" step="0.1" placeholder="0.0" value={guestHandicap} onChange={(e) => setGuestHandicap(e.target.value)} style={{ backgroundColor: '#0e3f2f', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '14px', fontWeight: '900', outline: 'none' }} />
                  <div onClick={() => setIsPlusHandicap(!isPlusHandicap)} style={{ height: '46px', backgroundColor: '#0e3f2f', borderRadius: '10px', display: 'flex', padding: '3px', cursor: 'pointer', boxSizing: 'border-box', border: '1px solid rgba(236,193,81,0.15)' }}>
                    <div style={{ flex: 1, backgroundColor: !isPlusHandicap ? '#00251b' : 'transparent', color: '#beedd9', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>STD</div>
                    <div style={{ flex: 1, backgroundColor: isPlusHandicap ? '#ecc151' : 'transparent', color: '#3e2e00', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>PLUS (+)</div>
                  </div>
                </div>
                <button type="submit" style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '10px', padding: '14px 0', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>Inject Guest</button>
              </form>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredProfiles.map((profile) => {
              const isAlreadyDrafted = Object.values(selectedPlayers).some(slot => slot?.id === profile.id);
              return (
                <div key={profile.id} onClick={() => { if (!isAlreadyDrafted) handleSelectMemberProfile(profile); }} style={{ backgroundColor: isAlreadyDrafted ? 'rgba(0,29,20,0.3)' : '#001d14', border: '1px solid rgba(236,193,81,0.04)', padding: '16px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isAlreadyDrafted ? 0.35 : 1, cursor: isAlreadyDrafted ? 'not-allowed' : 'pointer' }}>
                  <span style={{ color: '#beedd9', fontSize: '16px', fontWeight: '900' }}>{profile.display_name} {profile.nickname && <span style={{ color: '#ecc151' }}>({profile.nickname.toUpperCase()})</span>}</span>
                  <span className="material-symbols-outlined" style={{ color: '#ecc151' }}>{isAlreadyDrafted ? 'lock_person' : 'person_add'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

export default EditMatch;