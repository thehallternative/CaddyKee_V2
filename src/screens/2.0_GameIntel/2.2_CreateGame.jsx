import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

function CreateGame({ onNavigate }) {
  // 🎛️ SYSTEM ENGINE CONTROLLERS
  const [saving, setSaving] = useState(false);

  // 📝 NEW GAME BLUEPRINT FIELDS BINDINGS
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('1.0');
  const [format, setFormat] = useState('md');
  const [isFavorite, setIsFavorite] = useState(false);
  const [published, setPublished] = useState(false);

  // 🗄️ JSONB DEFAULT ATTRIBUTE FIELD BINDINGS
  const [configSchemaText, setConfigSchemaText] = useState('{}');
  const [isJsonValid, setIsJsonValid] = useState(true);

  // 🔍 AUTOMATED SLUG ENGINE GENERATOR MATCHING USER KEYSTROKES
  const handleTitleTextChange = (val) => {
    setTitle(val);
    // Convert regular prose inputs into clean database-safe system slugs automatically
    const generatedSlug = val.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setSlug(generatedSlug);
  };

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

  // 💾 DATABASE WRITE: COMMIT TRANSACTION SAVES TO game_rules
  const handleCreateGameRulesSubmit = async () => {
    if (!title.trim() || !slug.trim()) {
      alert('Game Title parameter targets cannot remain empty.');
      return;
    }

    if (!isJsonValid) {
      alert('Invalid layout structures found within your configuration JSON matrix field box.');
      return;
    }

    try {
      setSaving(true);

      const insertionPayload = {
        title: title.trim(),
        slug: slug,
        category: category.trim() || 'SIDE WAGER CORE ENGINE',
        content: content.trim(),
        version: version.trim() || '1.0',
        format: format,
        is_favorite: isFavorite,
        published: published,
        config_schema: JSON.parse(configSchemaText),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('game_rules')
        .insert([insertionPayload]);

      if (error) throw error;

      onNavigate('game-intel');
    } catch (err) {
      alert(`Game generation database transaction dropped: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '12px' }}>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '60px', boxSizing: 'border-box', width: '100%' }}>
        
        {/* SECTION 1: BLUEPRINT DESIGN HEADER CHASSIS */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'relative', margin: '0 auto', width: '120px', height: '120px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '24px', backgroundColor: '#0e3c2f', border: '2px solid rgba(236,193,81,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '38px' }}>
              ➕
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em', color: '#a3d0be' }}>Initialize New Wager Matrix</p>
        </section>

        {/* SECTION 2: METADATA CAPTURE PANEL */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Identity Details</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>GAME TITLE</label>
            <input type="text" value={title} placeholder="e.g., Hollywood" onChange={(e) => handleTitleTextChange(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.5)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>SYSTEM TARGET GENERATED SLUG</label>
            <input type="text" value={slug} disabled style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.2)', border: '1px solid rgba(236,193,81,0.05)', borderRadius: '12px', padding: '18px', color: 'rgba(236,193,81,0.6)', fontWeight: '700', fontSize: '18px', outline: 'none', fontFamily: 'monospace' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>CATEGORY GROUPING LABEL</label>
            <input type="text" value={category} placeholder="e.g., TEAM ROTATION CHALLENGE" onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: '#ecc151', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>INITIAL VERSION STRING</label>
            <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '700', fontSize: '18px', outline: 'none' }} />
          </div>
        </section>

        {/* SECTION 3: SYSTEM CONFIG PARAMETER FIELDS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Default Matrix Variables</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
              <div>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#beedd9' }}>Mark As Favourite</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Float directly to the top dashboard layer</p>
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
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Instantly make selectable across app active managers</p>
              </div>
              <div 
                onClick={() => setPublished(!published)}
                style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: published ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: published ? '#3e2e00' : '#414845', transform: published ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box', borderTop: '1px solid rgba(65,72,69,0.2)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '11px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>CONFIG_SCHEMA MODEL FIELDS (JSONB MATRIX)</label>
                <span style={{ fontSize: '10px', fontWeight: '900', color: isJsonValid ? '#beedd9' : '#eb5e55' }}>
                  {isJsonValid ? '✓ VALID SYNTAX' : '⚠ SYNTAX ERROR'}
                </span>
              </div>
              <textarea rows="6" value={configSchemaText} onChange={(e) => handleJsonStringValidationChange(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#001710', border: isJsonValid ? '1px solid rgba(236,193,81,0.1)' : '1px solid #eb5e55', borderRadius: '10px', padding: '16px', color: '#ecc151', fontSize: '13px', fontFamily: 'monospace', outline: 'none', resize: 'vertical' }} />
            </div>

          </div>
        </section>

        {/* SECTION 4: LONG FORM BLUEPRINT ENGINE RULES OVERVIEW */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>Caddy Manifesto Text</h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <label style={{ fontSize: '11px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em', paddingLeft: '4px' }}>RULES EXPLANATION GUIDE (MARKDOWN FORMAT)</label>
            <textarea rows="8" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type complete rules and instructions text here..." style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(236,193,81,0.15)', borderRadius: '12px', padding: '18px', color: 'white', fontWeight: '500', fontSize: '15px', lineHeight: '1.6', outline: 'none', resize: 'vertical' }} />
          </div>
        </section>

        {/* 💾 EMERGENCE ACTION ENGINE SUBMIT */}
        <div style={{ marginTop: '20px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleCreateGameRulesSubmit}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(236,193,81,0.15)' }}
            type="button"
          >
            Create Blueprint Template
          </button>
        </div>

      </main>

    </div>
  );
}

export default CreateGame;