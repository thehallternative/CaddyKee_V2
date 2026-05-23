import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function EditPlayer({ playerId, onNavigate }) {
  // 🎛️ CORE TELEMETRY STATES
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 📝 PROFILE FIELD BINDING MODULE DATA MATRIX
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [playerRole, setPlayerRole] = useState('player'); 
  
  // 🎚️ HANDICAP CORE ENGINE INTERFACES
  const [handicapIndex, setHandicapIndex] = useState('0.0');
  const [isPlusHcp, setIsPlusHcp] = useState(false); 
  const [isManualIndex, setIsManualIndex] = useState(false);
  const [manualIndexVal, setManualIndexVal] = useState('');
  const [externalHandicapId, setExternalHandicapId] = useState('');

  // 🎨 PREFERENCES MATRIX STACKS
  const [gender, setGender] = useState('Prefer Not to Say');
  const [isPro, setIsPro] = useState(false);
  const [preferredTeeBox, setPreferredTeeBox] = useState('BLUE');
  
  // 🏥 EMERGENCY HEALTH & SAFETY PARAMETERS
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // 🧭 COURSES REGISTRY LOOKUPS & PICKER SELECTIONS
  const [coursesList, setCoursesList] = useState([]);
  const [homeCourseId, setHomeCourseId] = useState('');
  const [isCoursePickerOpen, setIsCoursePickerOpen] = useState(false);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [isGenderPickerOpen, setIsGenderPickerOpen] = useState(false); 

  // Dynamic Label Resolvers for Custom UI Popouts
  const roleLabels = {
    player: 'Viewer (Standard Roster Profile)',
    scorer: 'Scorer (Can Edit Assigned Match Data Rows)',
    admin: 'Admin (Full System Infrastructure Permissions)'
  };

  const currentHomeCourseName = coursesList.find(c => c.id === homeCourseId)?.course_name || 'SELECT HOME COURSE';

  // 📡 DATABASE READ: INITIAL RECONCILIATION INGESTION
  useEffect(() => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    const fetchProfileAndCoursesData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch System Course Maps Registry Options
        const { data: courseData, error: courseErr } = await supabase
          .from('course_map')
          .select('id, course_name, location_city')
          .eq('is_active', true)
          .order('course_name', { ascending: true });

        if (!courseErr && courseData) {
          setCoursesList(courseData);
        }

        // 2. Fetch Active Target Player Profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', playerId)
          .single();

        if (error) throw error;
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setNickname(data.nickname || ''); 
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setPlayerRole(data.role || 'player');
          setExternalHandicapId(data.external_handicap_id || '');
          setIsManualIndex(data.is_manual_index || false);
          setManualIndexVal(data.manual_handicap || '');
          setGender(data.gender || 'Prefer Not to Say');
          setIsPro(data.is_pro || false);
          setPreferredTeeBox(data.tee_box || 'BLUE');
          setHomeCourseId(data.home_course_id || '');
          setEmergencyName(data.emergency_contact_name || '');
          setEmergencyPhone(data.emergency_contact_phone || '');

          const rawHcp = parseFloat(data.handicap_index || 0.0);
          if (rawHcp < 0) {
            setIsPlusHcp(true);
            setHandicapIndex(Math.abs(rawHcp).toString());
          } else {
            setIsPlusHcp(false);
            setHandicapIndex(rawHcp.toString());
          }
        }
      } catch (err) {
        console.error('Failed to ingest player profile attributes:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCoursesData();
  }, [playerId]);

  // 💾 DATABASE WRITE: COMMIT TRANSACTION SAVES
  const handleUpdateProfileSubmit = async () => {
    if (!firstName.trim()) {
      alert('First Name field cannot remain blank.');
      return;
    }

    try {
      setSaving(true);
      
      let calculatedHcp = handicapIndex ? parseFloat(handicapIndex) : 0.0;
      if (isPlusHcp && calculatedHcp > 0) {
        calculatedHcp = -calculatedHcp;
      }

      const updatedPayload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        nickname: nickname.trim() ? nickname.trim() : null, 
        email: email.trim() || null,
        phone: phone.trim() || null,
        role: playerRole, 
        handicap_index: calculatedHcp,
        is_manual_index: isManualIndex,
        manual_handicap: manualIndexVal ? parseFloat(manualIndexVal) : null,
        external_handicap_id: externalHandicapId.trim() || null,
        gender: gender,
        is_pro: isPro,
        tee_box: preferredTeeBox,
        home_course_id: homeCourseId || null, 
        emergency_contact_name: emergencyName.trim() || null,
        emergency_contact_phone: emergencyPhone.trim() || null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedPayload)
        .eq('id', playerId);

      if (error) throw error;
      
      onNavigate('player-intel'); 
    } catch (err) {
      alert(`Profile update error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', tracking: '0.1em' }}>
        LOADING IDENTITY SCHEMAS...
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '12px' }}>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '60px' }}>
        
        {/* SECTION 1: IDENTITY AVATAR BLOCK - Re-Centered Cleanly */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center', width: '100%' }}>
          <div style={{ position: 'relative', margin: '0 auto', width: '120px', height: '120px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '24px', backgroundColor: '#0e3c2f', border: '2px solid rgba(236,193,81,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '38px', textTransform: 'uppercase' }}>
              {(firstName.substring(0,1) + lastName.substring(0,1)) || 'P'}
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em', color: '#a3d0be' }}>Identity Symbol</p>
        </section>

        {/* SECTION 2: VERTICALLY STACKED GENERAL INFORMATION INTEL */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>General</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>FIRST NAME</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>LAST NAME</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>CLUB NICKNAME</label>
            <input type="text" value={nickname} placeholder="e.g., The Caddy Master" onChange={(e) => setNickname(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: '#ecc151', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>PHONE CONTACT</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          {/* ROLE SELECTOR - Extraneous Icon Removed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#ecc151', tracking: '0.05em', paddingLeft: '4px' }}>PLAYER SECURITY ROLE TIER</label>
            <div 
              onClick={() => setIsRolePickerOpen(true)}
              style={{ backgroundColor: 'rgba(14, 60, 47, 0.5)', border: '1px solid rgba(236,193,81,0.2)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <span>{roleLabels[playerRole]}</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: HANDICAP MANAGEMENT CONFIGS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Handicap</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Manual Toggle Wrapper - Reset to Far-Right Spacing */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#beedd9' }}>Manual Index Lock</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Override system metrics</p>
              </div>
              <div 
                onClick={() => setIsManualIndex(!isManualIndex)}
                style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: isManualIndex ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isManualIndex ? '#3e2e00' : '#414845', transform: isManualIndex ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>
                  {isPlusHcp ? 'PLUS HANDICAP (+)' : 'STANDARD HANDICAP'}
                </span>
                <input type="number" step="0.1" value={handicapIndex} onChange={(e) => setHandicapIndex(e.target.value)} style={{ backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '14px', color: isPlusHcp ? '#ecc151' : 'white', fontSize: '18px', fontWeight: '900', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>INDEX VARIANT</span>
                <div onClick={() => setIsPlusHcp(!isPlusHcp)} style={{ height: '50px', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '10px', display: 'flex', padding: '4px', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <div style={{ flex: 1, backgroundColor: !isPlusHcp ? '#0e3c2f' : 'transparent', color: !isPlusHcp ? '#beedd9' : 'rgba(190,237,217,0.2)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>STD</div>
                  <div style={{ flex: 1, backgroundColor: isPlusHcp ? '#ecc151' : 'transparent', color: isPlusHcp ? '#3e2e00' : 'rgba(190,237,217,0.2)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>PLUS (+)</div>
                </div>
              </div>
            </div>

            {isManualIndex && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em' }}>MANUAL OVERRIDE STROKE SPEC</label>
                <input type="number" step="0.1" value={manualIndexVal} placeholder="--" onChange={(e) => setManualIndexVal(e.target.value)} style={{ backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '14px', color: 'white', fontSize: '16px', fontWeight: '700', outline: 'none' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em' }}>EXTERNAL HANDICAP ID (GHIN)</label>
              <input type="text" value={externalHandicapId} placeholder="G-8829-441" onChange={(e) => setExternalHandicapId(e.target.value)} style={{ backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '16px', fontWeight: '700', outline: 'none' }} />
            </div>
          </div>
        </section>

        {/* SECTION 4: PREFERENCES & DYNAMIC VENUE SELECTOR */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Preferences</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          {/* GENDER PICKER - Extraneous Compass Icon Removed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>GENDER SPEC</label>
            <div 
              onClick={() => setIsGenderPickerOpen(true)}
              style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <span>{gender}</span>
            </div>
          </div>

          {/* Professional Status Wrapper - Reset to Far-Right Spacing */}
          <div style={{ backgroundColor: 'rgba(14,60,47,0.2)', padding: '18px 20px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#beedd9' }}>Professional Status</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Registered PGA Pro Status</p>
            </div>
            <div 
              onClick={() => setIsPro(!isPro)}
              style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: isPro ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isPro ? '#3e2e00' : '#414845', transform: isPro ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>PREFERRED TEE BOX TEXTURE</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['GOLD', 'BLACK', 'BLUE', 'WHITE'].map(tee => {
                const active = preferredTeeBox === tee;
                return (
                  <button key={tee} onClick={() => setPreferredTeeBox(tee)} style={{ flex: 1, padding: '16px 0', borderRadius: '10px', border: 'none', cursor: 'pointer', fontStyle: 'italic', fontWeight: '900', fontSize: '13px', tracking: '0.05em', backgroundColor: active ? '#ecc151' : '#0e3c2f', color: active ? '#3e2e00' : 'rgba(190,237,217,0.5)', border: active ? '1px solid #ecc151' : '1px solid transparent' }} type="button">
                    {tee}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>HOME COURSE SELECTION</label>
            <div 
              onClick={() => setIsCoursePickerOpen(true)}
              style={{ position: 'relative', cursor: 'pointer', backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '12px', padding: '18px', color: '#beedd9', fontWeight: '700', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ textTransform: 'uppercase' }}>{currentHomeCourseName}</span>
              <span style={{ color: '#ecc151' }}>📍</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: SAFETY EMERGENCY CONTROLS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Safety</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>EMERGENCY CONTACT NAME</label>
            <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>EMERGENCY PHONE NUMBER</label>
            <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>
        </section>

        {/* SAVE BUTTON CONTAINER - Icon Removed, Label Simplified */}
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={handleUpdateProfileSubmit}
            disabled={saving}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(236,193,81,0.15)', opacity: saving ? 0.6 : 1 }}
            type="button"
          >
            {saving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 💎 DRAWER A: HIGH-FIDELITY VENUE PICKER SHEET LAYER                         */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: isCoursePickerOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsCoursePickerOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isCoursePickerOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '25vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isCoursePickerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto' }} />
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>SELECT HOME CLUB</h3>
            <button onClick={() => setIsCoursePickerOpen(false)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Close</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div onClick={() => { setHomeCourseId(''); setIsCoursePickerOpen(false); }} style={{ backgroundColor: '#001d14', border: '1px solid rgba(236,193,81,0.04)', padding: '16px 20px', borderRadius: '14px', color: '#eb5e55', fontWeight: '800', cursor: 'pointer', fontStyle: 'italic' }}>[ CLEAR ASSIGNED CLUB ]</div>
            {coursesList.map((course) => (
              <div key={course.id} onClick={() => { setHomeCourseId(course.id); setIsCoursePickerOpen(false); }} style={{ backgroundColor: '#001d14', border: '1px solid rgba(236,193,81,0.04)', padding: '16px 20px', borderRadius: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#beedd9', fontWeight: '900', textTransform: 'uppercase' }}>{course.course_name}</span>
                <span style={{ color: '#ecc151', fontSize: '11px', fontWeight: '700' }}>{course.location_city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💎 DRAWER B: HIGH-FIDELITY SECURITY ROLE TIER PICKER SHEET LAYER           */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: isRolePickerOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsRolePickerOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isRolePickerOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '40vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isRolePickerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto' }} />
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>SELECT SECURITY ROLE</h3>
            <button onClick={() => setIsRolePickerOpen(false)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Close</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.keys(roleLabels).map((roleKey) => (
              <div 
                key={roleKey} 
                onClick={() => { setPlayerRole(roleKey); setIsRolePickerOpen(false); }} 
                style={{ backgroundColor: playerRole === roleKey ? '#0e3c2f' : '#001d14', border: playerRole === roleKey ? '1px solid #ecc151' : '1px solid rgba(236,193,81,0.04)', padding: '20px', borderRadius: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: playerRole === roleKey ? 'white' : '#beedd9', fontWeight: '900', fontSize: '15px' }}>{roleLabels[roleKey]}</span>
                {playerRole === roleKey && <span style={{ color: '#ecc151' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💎 DRAWER C: CUSTOM PREMIUM GENDER SELECTOR SLIDING SHEET LAYER           */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: isGenderPickerOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsGenderPickerOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: isGenderPickerOpen ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '45vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: isGenderPickerOpen ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', backgroundColor: 'rgba(190,237,217,0.15)', margin: '16px auto 8px auto' }} />
          <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, color: '#beedd9', fontSize: '20px', fontWeight: '900', fontStyle: 'italic' }}>SELECT GENDER VARIANT</h3>
            <button onClick={() => setIsGenderPickerOpen(false)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }} type="button">Close</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Male', 'Female', 'Prefer Not to Say'].map((variant) => (
              <div 
                key={variant} 
                onClick={() => { setGender(variant); setIsGenderPickerOpen(false); }} 
                style={{ backgroundColor: gender === variant ? '#0e3c2f' : '#001d14', border: gender === variant ? '1px solid #ecc151' : '1px solid rgba(236,193,81,0.04)', padding: '20px', borderRadius: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: gender === variant ? 'white' : '#beedd9', fontWeight: '900', fontSize: '15px' }}>{variant}</span>
                {gender === variant && <span style={{ color: '#ecc151' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default EditPlayer;