import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function CourseIntelMain({ onNavigate }) {
  // 🎛️ SYSTEM CONTROLLERS & TELEMETRY CACHE STACKS
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 📡 SELECTED COURSE OVERLAY EXTRACTION STATE
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseTeesCount, setCourseTeesCount] = useState(0);

  // 📡 DATABASE READ: QUERY DATA METRICS FROM COURSE_MAP
  const fetchOperationalCoursesList = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('course_map')
        .select('*')
        .eq('is_active', true)
        .order('course_name', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Course registry fetch blocking error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationalCoursesList();
  }, []);

  // 📡 DYNAMIC SUB-LOOKUP QUERY: FETCH TEE DETAILS WHEN OVERLAY DRAWER ACCEPTS OBJECT
  useEffect(() => {
    if (!selectedCourse) return;

    const queryTeeBoxTelemetry = async () => {
      try {
        const { count, error } = await supabase
          .from('course_tees')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', selectedCourse.id);

        if (!error) {
          setCourseTeesCount(count || 0);
        }
      } catch (err) {
        console.error('Failed to run tee box metrics analysis:', err.message);
      }
    };

    queryTeeBoxTelemetry();
  }, [selectedCourse]);

  // 🔍 FRONTEND LOOKAHEAD REGISTRY FILTER
  const filteredCourses = courses.filter(course => {
    const haystack = `${course.course_name || ''} ${course.location_city || ''} ${course.location_state || ''}`.toUpperCase();
    return haystack.includes(searchQuery.toUpperCase());
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box', paddingTop: '12px' }}>
      
      {/* MODULE SELECTION & ACTION PANEL HEAD BAR CHASSIS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#0e3c2f', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ecc151', fontWeight: 'bold' }}>🔍</span>
          <input 
            type="text"
            placeholder="SEARCH OPERATIONAL COURSES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '13px', padding: 0, textTransform: 'uppercase' }}
          />
        </div>

        <button 
          onClick={() => onNavigate('create-course')}
          style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(236,193,81,0.1)' }}
          type="button"
        >
          <span>➕</span> Add New Course
        </button>
      </div>

      {/* CORE VENUES CELL COMPONENT DISPLAY SCROLL GRID */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8px', padding: '0 4px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#ecc151', fontStyle: 'italic', textTransform: 'uppercase', tracking: '0.05em' }}>MY COURSES</h3>
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.15em' }}>TOTAL UNITS: {filteredCourses.length.toString().padStart(2, '0')}</span>
        </div>

        {loading ? (
          <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '900' }}>
            STREAMING CLUB MAP TELEMETRY FROM CLOUD CORRIDORS...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}
              >
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em', textTransform: 'uppercase' }}>
                    {course.location_city || 'VENUE LOCAL'}, {course.location_state || 'INTEL'}
                  </p>
                  <h4 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase', tracking: '-0.02em', lineHeight: '1.2' }}>
                    {course.course_name}
                  </h4>
                </div>

                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    style={{ flex: 1, padding: '12px 0', borderRadius: '30px', border: 'none', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(236,193,81,0.1)' }}
                    type="button"
                  >
                    View Details ➜
                  </button>
                  <button 
                    onClick={() => onNavigate('edit-course', { courseId: course.id })}
                    style={{ padding: '0 16px', borderRadius: '30px', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    type="button"
                  >
                    ✎ Edit
                  </button>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <div style={{ color: 'rgba(190,237,217,0.3)', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '700', border: '1px dashed rgba(236,193,81,0.1)', borderRadius: '16px' }}>
                NO OPERATIONAL VENUES LOGGED TO SYSTEM PROTOCOLS
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 💎 COMPONENT LOOKUP DRAWERS: TACTICAL COURSE GEOMETRY DISPLAY OVERLAYS    */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: selectedCourse ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setSelectedCourse(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: selectedCourse ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '20vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxSizing: 'border-box', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: selectedCourse ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          {selectedCourse && (
            <>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '9px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {selectedCourse.location_city}, {selectedCourse.location_state}
                  </p>
                  <h3 style={{ margin: 0, color: '#beedd9', fontSize: '24px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {selectedCourse.course_name}
                  </h3>
                </div>
                <button onClick={() => setSelectedCourse(null)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 16px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} type="button">Close</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box' }}>
                
                {/* METRICS METERS COMPONENT STACK */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '12px', borderLeft: '3px solid #ecc151', boxSizing: 'border-box' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>TOTAL PAR SPEC</p>
                    <span style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151' }}>{selectedCourse.total_par || '72'}</span>
                  </div>
                  <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '12px', borderLeft: '3px solid #ecc151', boxSizing: 'border-box' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '9px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.05em' }}>TEE VARIATIONS</p>
                    <span style={{ fontSize: '32px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151' }}>{courseTeesCount || '--'}</span>
                  </div>
                </div>

                {/* DIGEST DESCRIPTION BOX CHASSIS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em' }}>TACTICAL APP ANALYSIS</span>
                  <div style={{ backgroundColor: '#001710', padding: '20px', borderRadius: '14px', border: '1px solid rgba(236,193,81,0.05)' }}>
                    <p style={{ margin: 0, color: '#beedd9', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
                      {selectedCourse.notes || "Precise operational venue geometry confirmed online. Deep hazard structures loaded natively into coordinate tracking memory paths. Confirm target winds and elevation variance specs directly via KEE companion assistant node modules before choosing tee positions."}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedCourse(null);
                    onNavigate('round-intel');
                  }}
                  style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '30px', padding: '18px 0', fontSize: '13px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', marginTop: '12px', boxShadow: '0 10px 25px rgba(236,193,81,0.15)', flexShrink: 0 }}
                  type="button"
                >
                  🚀 START OPERATIONAL SESSION
                </button>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}

export default CourseIntelMain;