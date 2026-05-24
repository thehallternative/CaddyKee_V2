import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function CourseIntelMain({ onNavigate }) {
  // 🎛️ SYSTEM CONTROLLERS & TELEMETRY CACHE STACKS
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 📡 SELECTED COURSE & RELATED TEE ARRAYS
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [associatedTees, setAssociatedTees] = useState([]);
  const [loadingTeeDetails, setLoadingTeeDetails] = useState(false);

  // 📡 DATABASE READ: QUERY GLOBAL ACTIVE COURSES LIST
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
      console.error('Course registry fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationalCoursesList();
  }, []);

  // 📡 DATABASE READ: SUB-QUERY ALL ASSIGNED TEES WHEN A CARD DRAWER OPENS
  useEffect(() => {
    if (!selectedCourse) {
      setAssociatedTees([]);
      return;
    }

    const queryTeeBoxTelemetry = async () => {
      try {
        setLoadingTeeDetails(true);
        const { data, error } = await supabase
          .from('course_tees')
          .select('*')
          .eq('course_id', selectedCourse.id)
          .eq('is_active', true)
          .order('total_yardage', { ascending: false }); // Longest tees stay safely up top

        if (error) throw error;
        setAssociatedTees(data || []);
      } catch (err) {
        console.error('Failed to aggregate course tee specifications:', err.message);
      } finally {
        setLoadingTeeDetails(false);
      }
    };

    queryTeeBoxTelemetry();
  }, [selectedCourse]);

  // Dynamic Color Theme Chip Custom Selector for Tee Badges
  const getTeeColorStyle = (teeName = '') => {
    const norm = teeName.toUpperCase().trim();
    if (norm.includes('GOLD')) return { bg: '#251a00', border: '#ecc151', text: '#ecc151' };
    if (norm.includes('BLACK')) return { bg: '#141414', border: '#414845', text: '#c0c8c3' };
    if (norm.includes('BLUE')) return { bg: '#002117', border: '#a3d0be', text: '#a3d0be' };
    if (norm.includes('WHITE')) return { bg: '#2e3132', border: '#e1e3e4', text: '#e1e3e4' };
    if (norm.includes('RED')) return { bg: '#3e0000', border: '#ffb4ab', text: '#ffb4ab' };
    // Fallback baseline layout theme parameters if custom naming floats in
    return { bg: '#0e3c2f', border: 'rgba(236,193,81,0.2)', text: '#beedd9' };
  };

  // 🔍 FRONTEND SEARCH LOOKAHEAD FILTER
  const filteredCourses = courses.filter(course => {
    const haystack = `${course.course_name || ''} ${course.location_city || ''}`.toUpperCase();
    return haystack.includes(searchQuery.toUpperCase());
  });

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box', paddingTop: '12px' }}>
      
      {/* MODULE SELECTION SEARCH & INTERACTION PANEL */}
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

      {/* CORE VENUES GRID DISPATCH FEED */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8px', padding: '0 4px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#ecc151', fontStyle: 'italic', textTransform: 'uppercase', tracking: '0.05em' }}>MY COURSES</h3>
          <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.15em' }}>TOTAL UNITS: {filteredCourses.length.toString().padStart(2, '0')}</span>
        </div>

        {loading ? (
          <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '900' }}>
            STREAMING CLUB MAP TELEMETRY...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}
              >
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em', textTransform: 'uppercase' }}>
                    {course.location_city || 'OPERATIONAL VENUE'}
                  </p>
                  <h4 style={{ margin: 0, fontSize: '22px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {course.course_name}
                  </h4>
                </div>

                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    style={{ flex: 1, padding: '14px 0', borderRadius: '30px', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(236,193,81,0.1)' }}
                    type="button"
                  >
                    View Details ➜
                  </button>
                  <button 
                    onClick={() => onNavigate('edit-course', { courseId: course.id })}
                    style={{ padding: '0 20px', borderRadius: '30px', border: 'none', backgroundColor: '#ecc151', color: '#3e2e00', fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    type="button"
                  >
                    ✎ Edit
                  </button>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <div style={{ color: 'rgba(190,237,217,0.3)', padding: '40px', textAlign: 'center', fontStyle: 'italic', fontWeight: '700', border: '1px dashed rgba(236,193,81,0.1)', borderRadius: '16px' }}>
                NO CHANNELS FOUND MATCHING SEARCH FILTERS
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 💎 UPGRADED HIGH-READABILITY TACTICAL OVERLAY DRAWER SHEET                  */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: selectedCourse ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setSelectedCourse(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: selectedCourse ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '10vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxSizing: 'border-box', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: selectedCourse ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          {selectedCourse && (
            <>
              {/* Drawer Sticky Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {selectedCourse.location_city || 'OPERATIONAL OUTPOST'}
                  </p>
                  <h3 style={{ margin: 0, color: '#beedd9', fontSize: '24px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {selectedCourse.course_name}
                  </h3>
                </div>
                <button onClick={() => setSelectedCourse(null)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 18px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} type="button">Close</button>
              </div>

              {/* Drawer Content Body (Scrollable) */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px', boxSizing: 'border-box', paddingBottom: '80px' }}>
                
                {/* 1. Base Facility Details Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em' }}>FACILITY ANALYSIS</span>
                  <div style={{ backgroundColor: '#001710', padding: '20px', borderRadius: '14px', border: '1px solid rgba(236,193,81,0.05)' }}>
                    <p style={{ margin: 0, color: '#beedd9', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
                      {selectedCourse.notes || "Operational club coordinates loaded natively into active scorecard systems memory arrays. Confirm rule assignments and side-wager protocols directly with squad partners prior to choosing tee positions from the deck metrics ledger below."}
                    </p>
                  </div>
                </div>

                {/* 2. Dynamic Live Tee Box Variations Matrix */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em' }}>TACTICAL TEE LEDGER SPECIFICATIONS</span>
                  
                  {loadingTeeDetails ? (
                    <div style={{ color: '#ecc151', padding: '20px', textAlign: 'center', fontStyle: 'italic', fontSize: '13px', fontWeight: '700' }}>
                      Reconciling tee-deck metrics from cloud lines...
                    </div>
                  ) : associatedTees.length === 0 ? (
                    <div style={{ color: 'rgba(190,237,217,0.3)', padding: '24px', textAlign: 'center', fontStyle: 'italic', fontSize: '13px', backgroundColor: '#001710', borderRadius: '14px', border: '1px dashed rgba(236,193,81,0.08)' }}>
                      No tee box variations configured for this track yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {associatedTees.map((tee) => {
                        const styleConfig = getTeeColorStyle(tee.tee_name);
                        return (
                          <div 
                            key={tee.id}
                            style={{ backgroundColor: '#001d14', border: '1px solid rgba(236,193,81,0.04)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}
                          >
                            {/* Left Box: Tee Identity Callout */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ backgroundColor: styleConfig.bg, border: `1px solid ${styleConfig.border}`, color: styleConfig.text, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '900', fontStyle: 'italic', tracking: '0.05em', minWidth: '70px', textAlign: 'center', textTransform: 'uppercase', boxSizing: 'border-box' }}>
                                {tee.tee_name}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ color: 'white', fontSize: '18px', fontWeight: '900', fontStyle: 'italic' }}>
                                  {tee.total_yardage ? `${tee.total_yardage.toLocaleString()} YDS` : '-- YDS'}
                                </span>
                                <span style={{ color: 'rgba(190,237,217,0.4)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                  Gender Rule: {tee.gender || 'ANY'}
                                </span>
                              </div>
                            </div>

                            {/* Right Box: Dynamic Handicap Math Rating Parameters */}
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ color: '#ecc151', fontSize: '14px', fontWeight: '900', fontStyle: 'italic' }}>
                                CR: {tee.course_rating ? parseFloat(tee.course_rating).toFixed(1) : '--'}
                              </span>
                              <span style={{ color: '#beedd9', fontSize: '11px', fontWeight: '700' }}>
                                SLOPE: {tee.slope_rating ? parseInt(tee.slope_rating) : '--'}
                              </span>
                              <span style={{ color: 'rgba(190,237,217,0.3)', fontSize: '9px', fontWeight: '900' }}>
                                PAR {tee.total_par || '72'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Action Round Ignition Hook */}
                <button 
                  onClick={() => {
                    setSelectedCourse(null);
                    onNavigate('round-intel');
                  }}
                  style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '30px', padding: '20px 0', fontSize: '15px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', marginTop: '12px', boxShadow: '0 12px 30px rgba(236,193,81,0.2)', flexShrink: 0 }}
                  type="button"
                >
                  🚀 START OPERATIONAL ROUND WITH THIS VENUE
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