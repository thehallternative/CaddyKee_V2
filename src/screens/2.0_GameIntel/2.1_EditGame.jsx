import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function EditGame({ ruleId, onNavigate }) {
  // 🎛️ SYSTEM ENGINE CONTROLLERS
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 📝 GAME REFERENCE MATRIX TEXT FIELD STATE BINDINGS
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('1.0');
  const [format, setFormat] = useState('md');
  const [isFavorite, setIsFavorite] = useState(false);
  const [published, setPublished] = useState(false);

  // 🗄️ JSONB CONFIGURATION MATRIX LAYOUT HOOK
  const [configSchemaText, setConfigSchemaText] = useState('{}');
  const [isJsonValid, setIsJsonValid] = useState(true);

  // 📡 DATABASE READ: INGEST TARGET TEMPLATE ATTRIBUTES ON MOUNT
  useEffect(() => {
    if (!ruleId) {
      setLoading(false);
      return;
    }

    const fetchGameRuleAttributes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('game_rules')
          .select('*')
          .eq('id', ruleId)
          .single();

        if (error) throw error;
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setCategory(data.category || '');
          setContent(data.content || '');
          setVersion(data.version || '1.0');
          setFormat(data.format || 'md');
          setIsFavorite(data.is_favorite || false);
          setPublished(data.published || false);
          
          // Stringify JSONB data parameters neatly into spreadsheet validation viewport
          setConfigSchemaText(JSON.stringify(data.config_schema || {}, null, 2));
        }
      } catch (err) {
        console.error('Failed to ingest master game rule attributes:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameRuleAttributes();
  }, [ruleId]);

  // 🔍 INLINE STRUCTURAL VALIDATOR FOR SPREADSHEET MATRIX INPUT
  const handleJsonStringValidationChange = (value) => {
    setConfigSchemaText(value);
    try {
      JSON.parse(value);
      setIsJsonValid(true);
    } catch (e) {
      setIsJsonValid(false);
    }
  };

  // 💾 DATABASE WRITE: TRANSACTION MATRIX TRANSACTION SAVE
  const handleUpdateGameRulesSubmit = async () => {
    if (!title.trim() || !slug.trim()) {
      alert('Game Title and Slug parameters cannot remain unpopulated.');
      return;
    }

    if (!isJsonValid) {
      alert('Invalid config_schema layout format. Ensure standard JSON formatting configuration maps are correct before committing transaction saves.');
      return;
    }

    try {
      setSaving(true);
      
      const updatedPayload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, '_'),
        category: category.trim() || null,
        content: content.trim(),
        version: version.trim() || '1.0',
        format: format,
        is_favorite: isFavorite,
        published: published,
        config_schema: JSON.parse(configSchemaText),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('game_rules')
        .update(updatedPayload)
        .eq('id', ruleId);

      if (error) throw error;
      
      onNavigate('game-intel');
    } catch (err) {
      alert(`Game template update transaction dropped: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', tracking: '0.1em' }}>
        INGESTING MASTER GAME ATTRIBUTES...
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '12px' }}>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '60px', boxSizing: 'border-box', width: '100%' }}>
        
        {/* SECTION 1: IDENTITY BANNER DISPLAY BLOCK */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'relative', margin: '0 auto', width: '120px', height: '120px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '24px', backgroundColor: '#0e3c2f', border: '2px solid rgba(236,193,81,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '32px', textTransform: 'uppercase' }}>
              {title.substring(0,2) || 'GM'}
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em', color: '#a3d0be' }}>Wager Blueprint Matrix</p>
        </section>

        {/* SECTION 2: CORE GENERAL METADATA TEXT PRESETS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Core Data</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>GAME TITLE</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>SLUG SYSTEM UNIFIED IDENTIFIER</label>
            <input type="text" value={slug} disabled style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.2)', border: '1px solid rgba(236,193,81,0.05)', borderRadius: '12px', padding: '18px', color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: '18px', outline: 'none', fontFamily: 'monospace' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>CATEGORY HEAD SUBTITLE</label>
            <input type="text" value={category} placeholder="e.g., ROTATION MATCH WAGER" onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: '#ecc151', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>VERSION STRING TAG</label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>
        </section>

        {/* SECTION 3: EXTENSIVE VARIABLES CONTROL - REAL TIME MATRIX GRAPH CONFIG SCHEMA JSON PANEL */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Variables Validation Matrix</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* SORTING RULES INTERFACE PARAMETERS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#beedd9' }}>Sort As Favourite</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Float ruleset to command center dashboard hub</p>
              </div>
              <div 
                onClick={() => setIsFavorite(!isFavorite)}
                style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: isFavorite ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isFavorite ? '#3e2e00' : '#414845', transform: isFavorite ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box', borderTop: '1px solid rgba(65,72,69,0.2)', paddingTop: '20px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#beedd9' }}>Publish Blueprint</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Activate across live match selectors</p>
              </div>
              <div 
                onClick={() => setPublished(!published)}
                style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: published ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: published ? '#3e2e00' : '#414845', transform: published ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
              </div>
            </div>

            {/* LIVE CONFIG_SCHEMA TEXTAREA MATRIX ENGINE SPREADSHEET COMPONENT LINK */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box', borderTop: '1px solid rgba(65,72,69,0.2)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>JSONB CONFIG_SCHEMA STRUCTURES</label>
                <span style={{ fontSize: '10px', fontWeight: '900', color: isJsonValid ? '#beedd9' : '#eb5e55' }}>
                  {isJsonValid ? '✓ JSON SCHEMA SECURE' : '⚠ JSON SYNTAX ERROR'}
                </span>
              </div>
              <textarea 
                rows="10" 
                value={configSchemaText} 
                onChange={(e) => handleJsonStringValidationChange(e.target.value)} 
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#001710', border: isJsonValid ? '1px solid rgba(236,193,81,0.1)' : '1px solid #eb5e55', borderRadius: '10px', padding: '16px', color: '#ecc151', fontSize: '13px', fontFamily: 'monospace', outline: 'none', resize: 'vertical', lineHeight: '1.5' }}
              />
            </div>

          </div>
        </section>

        {/* SECTION 4: LONG FORM KEE DOCUMENTATION DOCUMENT */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Rules Documentation</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>WAGER OPERATION MANIFESTO TEXT (MARKDOWN FORMAT)</label>
            <textarea rows="8" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type complete instructions here..." style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '500', fontSize: '15px', lineHeight: '1.6', outline: 'none', resize: 'vertical' }} />
          </div>
        </section>

        {/* 💾 CLEAN SAVE ACTION CONTROLLER */}
        <div style={{ marginTop: '20px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleUpdateGameRulesSubmit}
            disabled={saving}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(236,193,81,0.15)', opacity: saving ? 0.6 : 1 }}
            type="button"
          >
            {saving ? 'UPDATING BLUEPRINT SCHEMA...' : 'SAVE GAME MODIFICATIONS'}
          </button>
        </div>

      </main>

    </div>
  );
}

export default EditGame;