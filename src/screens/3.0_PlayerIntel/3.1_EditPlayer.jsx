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
  const [homeCourseId, setHomeCourseId] = useState('');
  
  // 🏥 EMERGENCY HEALTH & SAFETY PARAMETERS
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // 📡 DATABASE READ: INITIAL RECONCILIATION TARGET INGESTION
  useEffect(() => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    const fetchPlayerProfile = async () => {
      try {
        setLoading(true);
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
          setExternalHandicapId(data.external_handicap_id || '');
          setIsManualIndex(data.is_manual_index || false);
          setManualIndexVal(data.manual_handicap || '');
          setGender(data.gender || 'Prefer Not to Say');
          setIsPro(data.is_pro || false);
          setPreferredTeeBox(data.tee_box || 'BLUE');
          setHomeCourseId(data.home_course_id || '');
          setEmergencyName(data.emergency_contact_name || '');
          setEmergencyPhone(data.emergency_contact_phone || '');

          // 🛠️ PARSE DATABASE FLOAT BACK TO PHYSICAL VISUAL PLUS PREFIX (+)
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
        console.error('Failed to ingest player profile telemetry:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [playerId]);

  // 💾 DATABASE WRITE: COMMIT TRANSACTION SAVES
  const handleUpdateProfileSubmit = async () => {
    if (!firstName.trim()) {
      alert('First Name field cannot remain blank.');
      return;
    }

    try {
      setSaving(true);
      
      // Calculate database index float value based on elite plus (+) state toggles
      let calculatedHcp = handicapIndex ? parseFloat(handicapIndex) : 0.0;
      if (isPlusHcp && calculatedHcp > 0) {
        calculatedHcp = -calculatedHcp;
      }

      const updatedPayload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        display_name: `${firstName.trim()} ${lastName.trim()}`.toUpperCase(),
        nickname: nickname.trim() ? nickname.trim().toUpperCase() : null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        handicap_index: calculatedHcp,
        is_manual_index: isManualIndex,
        manual_handicap: manualIndexVal ? parseFloat(manualIndexVal) : null,
        external_handicap_id: externalHandicapId.trim() || null,
        gender: gender,
        is_pro: isPro,
        tee_box: preferredTeeBox,
        home_course_id: homeCourseId.trim() || null,
        emergency_contact_name: emergencyName.trim() || null,
        emergency_contact_phone: emergencyPhone.trim() || null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedPayload)
        .eq('id', playerId);

      if (error) throw error;
      
      onNavigate('player-intel'); // Step back into main registry overview instantly
    } catch (err) {
      alert(`Profile compilation save blocked: ${err.message}`);
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
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box' }}>
      
      {/* HEADER MASTER ACTION BAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '80px', marginBottom: '24px' }}>
        <button 
          onClick={() => onNavigate('player-intel')}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#0e3c2f', color: '#ecc151', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          type="button"
        >
          ◀
        </button>
        <h1 className="text-xl font-black italic uppercase tracking-tighter" style={{ color: '#ecc151', margin: 0 }}>
          EDIT PROFILE
        </h1>
        <button 
          onClick={handleUpdateProfileSubmit}
          disabled={saving}
          style={{ background: 'none', border: 'none', backgroundColor: 'transparent', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', letterSpacing: '0.1em', fontSize: '13px', cursor: 'pointer', opacity: saving ? 0.4 : 1 }}
          type="button"
        >
          {saving ? 'SAVING...' : 'SAVE'}
        </button>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px' }}>
        
        {/* SECTION 1: AVATAR DISPLAY PLACEHOLDER */}
        <section style={{ display: 'flex', flexDirection: 'column', itemsCenter: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
          <div style={{ position: 'relative', margin: '0 auto', width: '112px', height: '112px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '16px', backgroundColor: '#0e3c2f', border: '2px solid rgba(236,193,81,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', fontWeight: '900', fontSize: '32px', fontStyle: 'italic', textTransform: 'uppercase' }}>
              {(firstName.substring(0,1) + lastName.substring(0,1)) || 'P'}
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em', color: '#a3d0be' }}>IDENTITY SYMBOL</p>
        </section>

        {/* SECTION 2: GENERAL FIELDS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '11px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>General Intel</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>FIRST NAME</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>LAST NAME</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>CLUB NICKNAME</label>
            <input type="text" value={nickname} placeholder="e.g., THE CADDY MASTER" onChange={(e) => setNickname(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>PHONE CONTACT</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
          </div>
        </section>

        {/* SECTION 3: HANDICAP CONFIGURATIONS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '11px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Handicap Metrics</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#beedd9' }}>Manual Index Lock</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Override system metrics</p>
              </div>
              <div 
                onClick={() => setIsManualIndex(!isManualIndex)}
                style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: isManualIndex ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isManualIndex ? '#3e2e00' : '#414845', transform: isManualIndex ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>
                  {isPlusHcp ? 'PLUS HANDICAP (+)' : 'STANDARD HANDICAP'}
                </span>
                <input type="number" step="0.1" value={handicapIndex} onChange={(e) => setHandicapIndex(e.target.value)} style={{ backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: isPlusHcp ? '#ecc151' : 'white', fontSize: '15px', fontWeight: '900', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>INDEX VARIANT</span>
                <div onClick={() => setIsPlusHcp(!isPlusHcp)} style={{ height: '46px', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '10px', display: 'flex', padding: '3px', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <div style={{ flex: 1, backgroundColor: !isPlusHcp ? '#0e3c2f' : 'transparent', color: !isPlusHcp ? '#beedd9' : 'rgba(190,237,217,0.2)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>STD</div>
                  <div style={{ flex: 1, backgroundColor: isPlusHcp ? '#ecc151' : 'transparent', color: isPlusHcp ? '#3e2e00' : 'rgba(236,193,81,0.2)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>PLUS (+)</div>
                </div>
              </div>
            </div>

            {isManualIndex && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em' }}>MANUAL OVERRIDE STROKE SPEC</label>
                <input type="number" step="0.1" value={manualIndexVal} placeholder="--" onChange={(e) => setManualIndexVal(e.target.value)} style={{ backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '14px', fontWeight: '700', outline: 'none' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em' }}>EXTERNAL HANDICAP REKORD ID (GHIN)</label>
              <input type="text" value={externalHandicapId} placeholder="G-8829-441" onChange={(e) => setExternalHandicapId(e.target.value)} style={{ backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '14px', fontWeight: '700', outline: 'none' }} />
            </div>
          </div>
        </section>

        {/* SECTION 4: COURSE PREFERENCES */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '11px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Preferences</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>GENDER SPEC</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer Not to Say">Prefer Not to Say</option>
            </select>
          </div>

          <div style={{ backgroundColor: 'rgba(14,60,47,0.2)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#beedd9' }}>Professional Status</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Registered PGA Pro Status</p>
            </div>
            <div 
              onClick={() => setIsPro(!isPro)}
              style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: isPro ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isPro ? '#3e2e00' : '#414845', transform: isPro ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>PREFERRED TEE BOX TEXTURE</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['GOLD', 'BLACK', 'BLUE', 'WHITE'].map(tee => {
                const active = preferredTeeBox === tee;
                return (
                  <button key={tee} onClick={() => setPreferredTeeBox(tee)} style={{ flex: 1, padding: '12px 0', borderRadius: '8px', border: 'none', cursor: 'pointer', fontStyle: 'italic', fontWeight: '900', fontSize: '11px', tracking: '0.05em', backgroundColor: active ? '#ecc151' : '#0e3c2f', color: active ? '#3e2e00' : 'rgba(190,237,217,0.5)', border: active ? '1px solid #ecc151' : '1px solid transparent' }} type="button">
                    {tee}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>HOME COURSE REGISTER KEY</label>
            <input type="text" value={homeCourseId} onChange={(e) => setHomeCourseId(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
          </div>
        </section>

        {/* SECTION 5: EMERGENCY CONTACTS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '11px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Safety Matrices</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>EMERGENCY NAME</label>
              <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>EMERGENCY PHONE</label>
              <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(65,72,69,0.15)', borderRadius: '10px', padding: '14px', color: 'white', fontWeight: '700', outline: 'none' }} />
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}

export default EditPlayer;