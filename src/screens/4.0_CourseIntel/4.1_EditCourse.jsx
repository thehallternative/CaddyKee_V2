import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function EditCourse({ courseId, onNavigate }) {
  // 🎛️ SYSTEM CONTROLLERS & SUB-LOADERS
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 📝 ATTRIBUTE FIELD BINDINGS (PARENT: COURSE_MAP)
  const [courseName, setCourseName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // 🎚️ DATA MANAGEMENT GRIDS (CHILDREN: TEES & HOLES DEFINITIONS)
  const [teeRecord, setTeeRecord] = useState(null);
  const [holeMatrix, setHoleMatrix] = useState([]);

  // 📡 DATABASE READ: DYNAMIC THREE-TABLE RECONCILIATION
  useEffect(() => {
    if (!courseId) {
      alert("Missing dynamic course tracking reference id.");
      onNavigate('course-intel');
      return;
    }

    const ingestCompleteCourseTelemetry = async () => {
      try {
        setLoading(true);

        // 1. Fetch parent metrics out of course_map
        const { data: parentCourse, error: parentErr } = await supabase
          .from('course_map')
          .select('*')
          .eq('id', courseId)
          .single();

        if (parentErr) throw parentErr;
        setCourseName(parentCourse.course_name || '');
        setLocationCity(parentCourse.location_city || '');
        setWebsiteUrl(parentCourse.website_url || '');

        // 2. Fetch primary active tee deck group entry
        const { data: teeDecks, error: teeErr } = await supabase
          .from('course_tees')
          .select('*')
          .eq('course_id', courseId)
          .eq('is_active', true)
          .limit(1);

        if (teeErr) throw teeErr;
        const targetTee = teeDecks && teeDecks.length > 0 ? teeDecks[0] : null;
        setTeeRecord(targetTee);

        // 3. Fetch sequentially ordered individual hole matrix configurations
        if (targetTee) {
          const { data: holesList, error: holesErr } = await supabase
            .from('course_hole_definitions')
            .select('*')
            .eq('tee_id', targetTee.id)
            .order('hole_number', { ascending: true });

          if (holesErr) throw holesErr;
          setHoleMatrix(holesList || []);
        } else {
          setHoleMatrix([]);
        }

      } catch (err) {
        console.error('Failed to parse facility data streams:', err.message);
      } finally {
        setLoading(false);
      }
    };

    ingestCompleteCourseTelemetry();
  }, [courseId]);

  // Handle matrix modifications on individual hole properties inline
  const handleMatrixCellChange = (index, field, value) => {
    const updated = [...holeMatrix];
    updated[index][field] = value === '' ? '' : parseInt(value) || 0;
    setHoleMatrix(updated);
  };

  // 💾 DATABASE WRITE: TRANSACTION COMMIT EXECUTIONS
  const handleUpdateCourseSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!courseName.trim()) {
      alert('Course Name mapping line cannot remain empty.');
      return;
    }

    try {
      setSaving(true);

      // Re-sum active values for tee table updates
      const totalYardageSum = holeMatrix.reduce((sum, h) => sum + (parseInt(h.yardage) || 0), 0);
      const totalParSum = holeMatrix.reduce((sum, h) => sum + (parseInt(h.par) || 4), 0);

      // 1. Update Parent facility tags inside course_map
      const { error: mapUpdateErr } = await supabase
        .from('course_map')
        .update({
          course_name: courseName.trim().toUpperCase(),
          location_city: locationCity.trim() || null,
          website_url: websiteUrl.trim() || null
        })
        .eq('id', courseId);

      if (mapUpdateErr) throw mapUpdateErr;

      // 2. Update computed values inside course_tees
      if (teeRecord) {
        const { error: teeUpdateErr } = await supabase
          .from('course_tees')
          .update({
            total_yardage: totalYardageSum,
            total_par: totalParSum
          })
          .eq('id', teeRecord.id);

        if (teeUpdateErr) throw teeUpdateErr;
      }

      // 3. Batch upsert modified hole definitions sequentially
      if (holeMatrix.length > 0) {
        const { error: matrixUpsertErr } = await supabase
          .from('course_hole_definitions')
          .insert(holeMatrix, { upsert: true }); // Upsert matches on unique record keys safely

        if (matrixUpsertErr) throw matrixUpsertErr;
      }

      onNavigate('course-intel');
    } catch (err) {
      alert(`Course modification execution blocked: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontWeight: '900', fontStyle: 'italic' }}>
        RECONCILING OPERATIONAL TRACK SPECS...
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '12px' }}>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* HOLE-BY-HOLE VERIFICATION PREVIEW INTERFACE GRID */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.15em' }}>VERIFICATION HOLE BLUEPRINT MATRIX</span>
            <span style={{ color: '#ecc151', fontSize: '11px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' }}>
              Tee Style: {teeRecord ? teeRecord.tee_name : 'DEFAULT'}
            </span>
          </div>

          <div style={{ width: '100%', overflowX: 'auto', display: 'flex', gap: '12px', paddingBottom: '12px' }} className="no-scrollbar">
            {holeMatrix.map((hole, idx) => (
              <div 
                key={hole.id || idx}
                style={{ backgroundColor: '#00251b', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '14px', padding: '16px', minWidth: '94px', boxSizing: 'border-box', textAlign: 'center' }}
              >
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#ecc151', fontStyle: 'italic' }}>H {hole.hole_number}</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
                  <span style={{ fontSize: '7px', color: 'rgba(190,237,217,0.4)', fontWeight: '900' }}>PAR</span>
                  <input type="number" value={hole.par} onChange={(e) => handleMatrixCellChange(idx, 'par', e.target.value)} style={{ width: '100%', backgroundColor: '#0e3c2f', border: 'none', borderRadius: '6px', padding: '6px 0', color: 'white', fontWeight: '900', fontSize: '15px', textAlign: 'center', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                  <span style={{ fontSize: '7px', color: 'rgba(190,237,217,0.4)', fontWeight: '900' }}>YARDS</span>
                  <input type="number" value={hole.yardage} onChange={(e) => handleMatrixCellChange(idx, 'yardage', e.target.value)} style={{ width: '100%', backgroundColor: '#0e3c2f', border: 'none', borderRadius: '6px', padding: '6px 0', color: '#beedd9', fontWeight: '900', fontSize: '13px', textAlign: 'center', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                  <span style={{ fontSize: '7px', color: 'rgba(190,237,217,0.4)', fontWeight: '900' }}>INDEX</span>
                  <input type="number" value={hole.stroke_index} onChange={(e) => handleMatrixCellChange(idx, 'stroke_index', e.target.value)} style={{ width: '100%', backgroundColor: '#0e3c2f', border: 'none', borderRadius: '6px', padding: '6px 0', color: '#ecc151', fontWeight: '700', fontSize: '12px', textAlign: 'center', outline: 'none' }} />
                </div>
              </div>
            ))}
          </div>
          <span style={{ fontSize: '10px', fontStyle: 'italic', color: 'rgba(190,237,217,0.3)', paddingLeft: '4px' }}>← Swipe horizontally to review or modify specific hole profiles inline</span>
        </section>

        {/* FACILITY LOCATION GENERAL PREFERENCES FIELDS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '11px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Identity Metrics</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', paddingLeft: '4px' }}>COURSE NAME</label>
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '900', fontStyle: 'italic', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', paddingLeft: '4px' }}>LOCATION MARKET</label>
            <input type="text" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', paddingLeft: '4px' }}>OFFICIAL FACILITY WEBSITE URL</label>
            <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>
        </section>

        {/* 💾 FORM TRANSACTION SAVE CONTROL ACCELERATOR */}
        <div style={{ marginTop: '12px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleUpdateCourseSubmit}
            disabled={saving}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(236,193,81,0.15)', opacity: saving ? 0.6 : 1 }}
            type="button"
          >
            {saving ? 'SAVING DATA ARRAYS...' : 'SAVE'}
          </button>
        </div>

      </main>
    </div>
  );
}

export default EditCourse;