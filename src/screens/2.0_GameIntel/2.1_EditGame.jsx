import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function EditGame({ ruleId, onNavigate }) {
  // 🎛️ SYSTEM CONTROLLERS
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📝 CORE BLUEPRINT SNAPSHOTS
  const [masterRule, setMasterRule] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('1.0');

  // 🗄️ PARSED FLAT STATE DICTIONARY FOR LIVE GOLFER FIELDS
  const [flatVariables, setFlatVariables] = useState({});
  const [variantName, setVariantName] = useState('');

  // 📡 DATABASE READ: FETCH GAME RULE SCHEMAS FROM SUPABASE
  const fetchGameRuleDefaults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('game_rules')
        .select('*')
        .eq('id', ruleId)
        .single();

      if (error) throw error;
      if (data) {
        setMasterRule(data);
        setTitle(data.title || '');
        setCategory(data.category || 'BETTING GAMES');
        setContent(data.content || '');
        setVersion(data.version || '1.0');

        // Extract the target default values from the config_schema safely into flat state primitives
        const rawSchema = data.config_schema || {};
        const extractionMap = {};
        
        Object.keys(rawSchema).forEach(key => {
          const item = rawSchema[key];
          if (item && typeof item === 'object' && 'default' in item) {
            extractionMap[key] = item.default;
          } else {
            extractionMap[key] = item;
          }
        });
        
        setFlatVariables(extractionMap);
      }
    } catch (err) {
      console.error('Failed to parse database core game rules attributes:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ruleId) fetchGameRuleDefaults();
  }, [ruleId]);

  // 🕹️ MUTATORS FOR THE FLAT RENDERING ENGINE VALUES
  const handleVariableUpdate = (key, value) => {
    setFlatVariables(prev => ({ ...prev, [key]: value }));
  };

  // 🔍 EVALUATE IF MODIFICATIONS WERE TWEAKED
  const checkHasFormMutationPatterns = () => {
    if (!masterRule || !masterRule.config_schema) return false;
    const rawSchema = masterRule.config_schema;
    
    return Object.keys(flatVariables).some(key => {
      const item = rawSchema[key];
      const originalValue = (item && typeof item === 'object' && 'default' in item) ? item.default : item;
      return flatVariables[key] !== originalValue;
    });
  };

  // 💾 SAVE TRIGGER CLICK
  const handleFormSaveActionTrigger = () => {
    const changesDetected = checkHasFormMutationPatterns();
    
    if (!changesDetected) {
      onNavigate('game-intel');
      return;
    }

    setVariantName(`${title} (Custom Style)`);
    setIsModalOpen(true);
  };

  // 💾 DATABASE WRITE: SAVE BRAND NEW VARIANT COPY ROW TO SUPABASE
  const handleCommitVariantToBackendDatabase = async () => {
    if (!variantName.trim()) {
      alert('Please enter a variant name.');
      return;
    }

    try {
      setSaving(true);

      // Re-assemble the config_schema structure keeping original metadata structure clean
      const baseSchemaLayout = { ...(masterRule.config_schema || {}) };
      Object.keys(flatVariables).forEach(key => {
        if (baseSchemaLayout[key] && typeof baseSchemaLayout[key] === 'object') {
          baseSchemaLayout[key] = { ...baseSchemaLayout[key], default: flatVariables[key] };
        } else {
          baseSchemaLayout[key] = flatVariables[key];
        }
      });

      const customGeneratedSlug = `${masterRule.slug}_variant_${Math.random().toString(36).substring(2, 7)}`;

      const variantPayload = {
        title: variantName.trim(),
        slug: customGeneratedSlug,
        category: category.trim(),
        content: content,
        version: version,
        format: masterRule.format || 'md',
        is_favorite: false,
        published: true,
        config_schema: baseSchemaLayout,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('game_rules')
        .insert([variantPayload]);

      if (error) throw error;

      setIsModalOpen(false);
      onNavigate('game-intel');
    } catch (err) {
      alert(`Failed to save custom variant: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#beedd9', padding: '40px', textAlign: 'center', fontWeight: '900', fontStyle: 'italic', tracking: '0.1em' }}>
        DECOMPRESSING LIVE BLUEPRINT SPECS...
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '12px' }}>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px', boxSizing: 'border-box', width: '100%' }}>
        
        {/* GAME HEADER BLUEPRINT OVERVIEW EXPLANATION */}
        <section style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', border: '1px solid rgba(236,193,81,0.08)', borderRadius: '16px', padding: '24px', boxSizing: 'border-box' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.15em', textTransform: 'uppercase' }}>
            {category} (MASTER LOCKED)
          </p>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase' }}>
            {title}
          </h2>
          <div style={{ backgroundColor: '#001710', padding: '16px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.04)' }}>
            <p style={{ margin: 0, color: '#beedd9', fontSize: '14px', lineHeight: '1.6', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
              {content || 'No baseline overview guidelines written for this master profile blueprint.'}
            </p>
          </div>
        </section>

        {/* PARSED INPUT SECTION CHASSIS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>
              Adjust Template Parameters
            </h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          {/* DYNAMIC FORM RENDERING GENERATION PASS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
            {Object.keys(flatVariables).map((key) => {
              const currentValue = flatVariables[key];
              const schemaMeta = masterRule?.config_schema?.[key] || {};
              const labelText = schemaMeta.label || key.toUpperCase().replace(/_/g, ' ');
              const typeSpec = schemaMeta.type || typeof currentValue;

              return (
                <div 
                  key={key} 
                  style={{ backgroundColor: '#0e3c2f', padding: '20px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box' }}
                >
                  {/* TYPE A: HANDLING BOOLEAN TOGGLES */}
                  {typeSpec === 'boolean' || typeof currentValue === 'boolean' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>TOGGLE PARAMETER</span>
                        <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '900', color: 'white' }}>{labelText}</h4>
                      </div>
                      <div 
                        onClick={() => handleVariableUpdate(key, !currentValue)}
                        style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: currentValue ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}
                      >
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: currentValue ? '#3e2e00' : '#414845', transform: currentValue ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                      </div>
                    </div>
                  ) : typeSpec === 'numeric' || typeSpec === 'integer' || typeof currentValue === 'number' ? (
                    /* TYPE B: HANDLING NUMERIC STEPPERS */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>SCALAR FACTOR</span>
                        <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '900', color: 'white' }}>{labelText}</h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001710', borderRadius: '12px', padding: '6px', border: '1px solid rgba(236,193,81,0.1)', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
                        <button 
                          onClick={() => handleVariableUpdate(key, currentValue - 1 >= 0 ? currentValue - 1 : 0)}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#0e3c2f', border: 'none', color: '#ecc151', fontSize: '20px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          type="button"
                        >
                          -
                        </button>
                        <span style={{ fontSize: '20px', fontWeight: '900', color: '#ecc151', fontFamily: 'monospace' }}>
                          {currentValue}
                        </span>
                        <button 
                          onClick={() => handleVariableUpdate(key, currentValue + 1)}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#0e3c2f', border: 'none', color: '#ecc151', fontSize: '20px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* TYPE C: FALLBACK TRADITIONAL STRING INPUTS */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '900', color: '#ecc151', tracking: '0.05em' }}>TEXT SPECIFICATION</span>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '900', color: 'white' }}>{labelText}</h4>
                      <input 
                        type="text" 
                        value={currentValue || ''} 
                        onChange={(e) => handleVariableUpdate(key, e.target.value)} 
                        style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '16px', color: 'white', fontSize: '16px', fontWeight: '700', outline: 'none' }} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 💾 CONTEXT ACTION BUTTON */}
        <div style={{ marginTop: '12px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleFormSaveActionTrigger}
            style={{ width: '100%', backgroundColor: '#ecc151', color: '#3e2e00', border: 'none', borderRadius: '40px', padding: '22px 0', fontSize: '18px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(236,193,81,0.15)' }}
            type="button"
          >
            Save Configuration Layout
          </button>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 💎 BRAND VARIANT TEXT GENERATION PROMPT OVERLAY POPUP MODAL SCREEN        */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: isModalOpen ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', opacity: isModalOpen ? 1 : 0, transition: 'opacity 0.3s', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} />
        
        <div style={{ position: 'absolute', left: '16px', right: '16px', bottom: '30vh', margin: '0 auto', maxWidth: '400px', backgroundColor: '#00251b', border: '2px solid #ecc151', borderRadius: '24px', padding: '24px', boxSizing: 'border-box', transition: 'transform 0.3s ease-out, opacity 0.3s', transform: isModalOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(40px)', opacity: isModalOpen ? 1 : 0, display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 30px 100px rgba(0,0,0,0.9)' }}>
          
          <div>
            <h3 style={{ margin: 0, color: '#ecc151', fontSize: '20px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' }}>
              Create Custom Variant
            </h3>
            <p style={{ margin: '6px 0 0 0', color: '#beedd9', fontSize: '12px', lineHeight: '1.5', fontWeight: '500' }}>
              Master blueprints cannot be overwritten. Please declare a custom identifier name tag signature to register this customized variation round setup.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '900', color: '#a3d0be', tracking: '0.05em' }}>VARIATION SIGNATURE LABEL</label>
            <input 
              type="text" 
              value={variantName} 
              onChange={(e) => setVariantName(e.target.value)} 
              placeholder="e.g., Rockway Foursome Special"
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.2)', borderRadius: '12px', padding: '16px', color: 'white', fontWeight: '700', fontSize: '15px', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ flex: 1, padding: '16px 0', borderRadius: '30px', backgroundColor: 'transparent', color: '#eb5e55', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', border: '1px solid rgba(235,94,85,0.2)', cursor: 'pointer' }}
              type="button"
            >
              Cancel
            </button>
            <button 
              onClick={handleCommitVariantToBackendDatabase}
              disabled={saving}
              style={{ flex: 2, padding: '16px 0', borderRadius: '30px', backgroundColor: '#ecc151', color: '#3e2e00', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
              type="button"
            >
              {saving ? 'SAVING...' : 'Confirm Preset'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default EditGame;