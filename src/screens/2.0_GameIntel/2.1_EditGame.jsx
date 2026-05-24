import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function EditGame({ ruleId, onNavigate }) {
  // 🎛️ SYSTEM ENGINE CONTROLLERS
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📝 CORE BLUEPRINT SNAPSHOTS
  const [masterRule, setMasterRule] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('1.0');

  // 🗄️ LOCAL MUTABLE PARAMETERS CAPSULES
  const [liveConfigSchema, setLiveConfigSchema] = useState({});
  const [variantName, setVariantName] = useState('');

  // 📡 DATABASE READ: ACCUMULATE AND EXTRACT BLUEPRINTS FROM SUPABASE
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
        setCategory(data.category || 'SIDE WAGER ENGINE');
        setContent(data.content || '');
        setVersion(data.version || '1.0');

        // Keep the full nested schema intact for custom variable alterations
        setLiveConfigSchema(data.config_schema || {});
      }
    } catch (err) {
      console.error('Failed to decompress live database blueprint specs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ruleId) fetchGameRuleDefaults();
  }, [ruleId]);

  // 🕹️ TOUCH DYNAMIC MUTATORS FOR NESTED JSON SCHEMAS
  const handleToggleValueMutation = (key) => {
    setLiveConfigSchema(prev => {
      const target = { ...prev[key] };
      // Handle both raw booleans and nested schema object structures cleanly
      if (typeof target.default === 'boolean') {
        target.default = !target.default;
      } else if (typeof target === 'boolean') {
        return { ...prev, [key]: !target };
      } else {
        target.default = !target.default;
      }
      return { ...prev, [key]: target };
    });
  };

  const handleNumericStepMutation = (key, increment) => {
    setLiveConfigSchema(prev => {
      const target = { ...prev[key] };
      const currentVal = typeof target.default === 'number' ? target.default : parseFloat(target.default || 0);
      const step = target.type === 'integer' ? 1 : 0.5;
      
      const updatedVal = increment ? currentVal + step : currentVal - step;
      target.default = updatedVal >= 0 ? updatedVal : 0;
      
      return { ...prev, [key]: target };
    });
  };

  const handleTextStringMutation = (key, textVal) => {
    setLiveConfigSchema(prev => {
      const target = { ...prev[key] };
      if (typeof target === 'object') {
        target.default = textVal;
        return { ...prev, [key]: target };
      }
      return { ...prev, [key]: textVal };
    });
  };

  // 🔍 EVALUATE DELTAS AGAINST PRISTINE BACKEND RECORD
  const checkHasFormMutationPatterns = () => {
    if (!masterRule || !masterRule.config_schema) return false;
    return JSON.stringify(liveConfigSchema) !== JSON.stringify(masterRule.config_schema);
  };

  // 💾 SAVE BUTTON INTERCEPT INTERFACE INTERACTION
  const handleSaveButtonClickAction = () => {
    const hasChanges = checkHasFormMutationPatterns();
    
    if (!hasChanges) {
      // Bounce back to dashboard directly if no configurations were tweaked
      onNavigate('game-intel');
      return;
    }

    // Trigger elegant variant preservation modal window
    setVariantName(`${title} (Custom Style)`);
    setIsModalOpen(true);
  };

  // 💾 DATABASE WRITE: COMMIT BRAND NEW CUSTOM BRANCH VARIATION TO SUPABASE
  const handleCommitVariantToBackendDatabase = async () => {
    if (!variantName.trim()) {
      alert('Please provide a unique variation name signature.');
      return;
    }

    try {
      setSaving(true);

      // Derive database-safe runtime slugs to differentiate records
      const variationUniqueSlug = `${masterRule.slug}_variant_${Math.random().toString(36).substring(2, 7)}`;

      const variantPayload = {
        title: variantName.trim(),
        slug: variationUniqueSlug,
        category: category.trim(),
        content: content,
        version: version,
        format: masterRule.format || 'md',
        is_favorite: false,
        published: true,
        config_schema: liveConfigSchema, // Commits cleanly parsed nested parameters layout payload
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
      alert(`Variation commit transaction aborted: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ textAlign: 'left', width: '100%', position: 'relative', boxSizing: 'border-box', paddingTop: '12px' }}>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px', boxSizing: 'border-box', width: '100%' }}>
        
        {/* GAME OVERVIEW DESCRIPTION CHASSIS */}
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

        {/* DYNAMIC FORM TRANSLATION SCHEMA LOOP INPUTS CHASSIS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
            <h2 style={{ fontSize: '12px', fontWeight: '900', fontStyle: 'italic', color: '#ecc151', textTransform: 'uppercase', tracking: '0.15em', margin: 0 }}>
              Adjust Template Parameters
            </h2>
            <span style={{ flexGrow: 1, height: '1px', backgroundColor: '#0e3c2f' }} />
          </div>

          <div style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0e3c2f', padding: '24px', borderRadius: '16px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {Object.keys(liveConfigSchema).map((key, index) => {
              const node = liveConfigSchema[key];
              
              // Extract data parameters cleanly from nested or literal variations nodes
              const labelText = (node && typeof node === 'object' && node.label) ? node.label : key.toUpperCase().replace(/_/g, ' ');
              const currentValue = (node && typeof node === 'object' && 'default' in node) ? node.default : node;
              const typeSpec = (node && typeof node === 'object' && node.type) ? node.type : (typeof currentValue);

              // CONTROL MAPPING ENGINE INTERFACE A: MINT SLIDING TOGGLE PILLS FOR BOOLEANS
              if (typeSpec === 'boolean' || typeof currentValue === 'boolean') {
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box', borderTop: index > 0 ? '1px solid rgba(65,72,69,0.2)' : 'none', paddingTop: index > 0 ? '20px' : '0' }}>
                    <div style={{ paddingRight: '12px' }}>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'white' }}>{labelText}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Type: Boolean Selector Switch</p>
                    </div>
                    <div 
                      onClick={() => handleToggleValueMutation(key)}
                      style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: currentValue ? '#ecc151' : '#001710', position: 'relative', padding: '2px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}
                    >
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: currentValue ? '#3e2e00' : '#414845', transform: currentValue ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                );
              }

              // CONTROL MAPPING ENGINE INTERFACE B: HIGH CONTRAST MODIFIER STEPPERS FOR NUMERICS
              if (typeSpec === 'numeric' || typeSpec === 'integer' || typeof currentValue === 'number') {
                const numVal = typeof currentValue === 'number' ? currentValue : parseFloat(currentValue || 0);
                return (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box', borderTop: '1px solid rgba(65,72,69,0.2)', paddingTop: '20px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'white' }}>{labelText}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a3d0be', textTransform: 'uppercase' }}>Type: Numeric Scalar Limits</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001710', borderRadius: '12px', padding: '6px', border: '1px solid rgba(236,193,81,0.1)', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
                      <button 
                        onClick={() => handleNumericStepMutation(key, false)}
                        style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#0e3c2f', border: 'none', color: '#ecc151', fontSize: '20px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        type="button"
                      >
                        -
                      </button>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: '#ecc151', fontFamily: 'monospace' }}>
                        {numVal.toFixed(typeSpec === 'integer' ? 0 : 2)}
                      </span>
                      <button 
                        onClick={() => handleNumericStepMutation(key, true)}
                        style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: '#0e3c2f', border: 'none', color: '#ecc151', fontSize: '20px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              }

              // CONTROL MAPPING ENGINE INTERFACE C: STRINGS TEXT RECOVERY BOX ENTRIES
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box', borderTop: '1px solid rgba(65,72,69,0.2)', paddingTop: '20px' }}>
                  <label style={{ fontSize: '15px', fontWeight: '900', color: 'white' }}>{labelText}</label>
                  <input 
                    type="text" 
                    value={currentValue || ''} 
                    onChange={(e) => handleTextStringMutation(key, e.target.value)} 
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#001710', border: '1px solid rgba(236,193,81,0.1)', borderRadius: '10px', padding: '16px', color: 'white', fontSize: '16px', fontWeight: '700', outline: 'none' }} 
                  />
                </div>
              );
            })}

            {Object.keys(liveConfigSchema).length === 0 && (
              <div style={{ color: 'rgba(190,237,217,0.3)', padding: '20px', textAlign: 'center', fontStyle: 'italic', fontSize: '13px' }}>
                No variable attributes registered to this template schema framework profiles.
              </div>
            )}

          </div>
        </section>

        {/* SAVE SUBMIT CONTAINER ROW CONTROL */}
        <div style={{ marginTop: '12px', width: '100%', boxSizing: 'border-box' }}>
          <button 
            onClick={handleSaveButtonClickAction}
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