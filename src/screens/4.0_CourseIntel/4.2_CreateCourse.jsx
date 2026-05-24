import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

function CreateCourse({ onNavigate }) {
  // 🎛️ CORE TELEMETRY STATES
  const [saving, setSaving] = useState(false);

  // 📝 FIELD BINDING MODULE DATA MATRIX (ALIGNED TO COURSE_MAP COLUMNS)
  const [courseName, setCourseName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [holesCount, setHolesCount] = useState('18 HOLES');

  // Placeholder trigger for structural bento image hooks
  const handleImageScorecardDropSelection = (e) => {
    alert("AI Scorecard Vision Parsing Engine initialized. Spatial layout character recognition arrays will deploy on next version update.");
  };

  // 💾 DATABASE WRITE: COMMIT NEW OPERATIONAL VENUES
  const handleSaveCourseSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!courseName.trim()) {
      alert('Course Name field cannot remain blank.');
      return;
    }

    try {
      setSaving(true);

      const insertPayload = {
        course_name: courseName.trim().toUpperCase(),
        location_city: locationCity.trim() || null,
        website_url: websiteUrl.trim() || null,
        is_active: true // Standard activation rule on entry initialization
      };

      const { error } = await supabase
        .from('course_map')
        .insert([insertPayload]);

      if (error) throw error;

      onNavigate('course-intel'); // Smooth fallback back to index database grid view
    } catch (err) {
      alert(`Course initialization blocked: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '12px' }}>
      
      <main style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px', boxSizing: 'border-box', width: '100%' }}>
        
        {/* SECTION 1: AI SCORECARD PARSER BENTO */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.1em', uppercase: 'text' }}>AI SCORECARD PARSER</span>
            <span style={{ color: '#ecc151', fontSize: '14px', fontWeight: 'bold' }}>⚡ AUTO VECTORED</span>
          </div>

          <div 
            style={{ 
              position: 'relative', 
              borderRadius: '16px', 
              padding: '40px 24px', 
              backgroundColor: 'rgba(14, 60, 47, 0.4)', 
              border: '2px dashed #ecc151', 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#423200', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', marginBottom: '16px', boxShadow: '0 0 20px rgba(236,193,81,0.2)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>photo_camera</span>
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase' }}>Upload Scorecard</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#a3d0be', fontWeight: '600', maxWidth: '260px', lineHeight: '1.4' }}>AI will automatically extract tees, par, and yardage from your captured image lines.</p>
            <input type="file" onChange={handleImageScorecardDropSelection} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
            {['Full Card', 'Front 9', 'Back 9'].map((segment) => (
              <div key={segment} style={{ backgroundColor: '#0e3c2f', padding: '14px', borderRadius: '12px', textAlign: 'center', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.05em', color: '#beedd9', opacity: 0.6, border: '1px solid rgba(236,193,81,0.03)' }}>
                {segment}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: VERTICALLY STACKED HIGH-READABILITY MANUAL INPUT FIELDS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Manual Entry</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>COURSE NAME</label>
            <input type="text" value={courseName} placeholder="e.g. LOOKOUT POINT COUNTRY CLUB" onChange={(e) => setCourseName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '900', fontStyle: 'italic', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>LOCATION LOCATION</label>
            <input type="text" value={locationCity} placeholder="e.g. Fonthill, ON" onChange={(e) => setLocationCity(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>WEBSITE MAP URL</label>
            <input type="url" value={websiteUrl} placeholder="e.g. www.lookoutpoint.com" onChange={(e) => setWebsiteUrl(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>HOLES CARD MODE</label>
            <select value={holesCount} onChange={(e) => setHolesCount(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '16px', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}>
              <option value="18 HOLES">18 HOLES CHALLENGE</option>
              <option value="9 HOLES">9 HOLES SHORT COMPLEX</option>
            </select>
          </div>
        </section>

        {/* 💾 PRIMARY SAVE BUTTON CONTAINER */}
        <div style={{ marginTop: '12px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleSaveCourseSubmit}
            disabled={saving}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(236,193,81,0.15)', opacity: saving ? 0.6 : 1 }}
            type="button"
          >
            {saving ? 'INITIALIZING FIELD VECTOR...' : 'SAVE NEW COURSE'}
          </button>
        </div>

      </main>

    </div>
  );
}

export default CreateCourse;