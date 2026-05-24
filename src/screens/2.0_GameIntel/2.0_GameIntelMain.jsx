import React, { useState } from 'react';

function GameIntelMain({ onNavigate }) {
  // 🎛️ CORE FILTERS & SCREEN CONTROLLERS
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  // 📝 STATIC CORE RULES MATRIX (Repurposing bento cards for local inspection)
  const gamesDictionary = [
    {
      id: 'skins',
      title: 'SKINS',
      subtitle: 'PER HOLE POINTS',
      variant: 'Carryover System',
      description: 'The lowest unique score on a hole wins the skin. If no player wins the hole outright, the stake carries over to the next hole, compounding the payout pool value dynamically. Net or gross allocations can be locked prior to tee-off.',
      tactics: 'Highly rewards aggressive play on par-3 and par-5 holes. A single spectacular hole can wipe out a day of steady bogeys.'
    },
    {
      id: 'wolf',
      title: 'WOLF',
      subtitle: 'ROTATION TACTICS',
      variant: '1 v 3 or 2 v 2 Matrix',
      description: 'Players rotate order as the designated Wolf on each hole. The Wolf hits first and dynamically chooses a partner immediately after watching a drive land, or risks going Lone Wolf to play 1-vs-3 for triple points.',
      tactics: 'Requires social strategy and risk management. If you are playing as the Wolf and a steady partner hits an early clean fairway finder, lock them in rather than risking an unpredictable later shot.'
    },
    {
      id: 'match_play',
      title: 'MATCH PLAY',
      subtitle: '1 V 1 CONFLICT',
      variant: 'Hole-by-Hole Ledger',
      description: 'Head-to-head match scoring independent of total cumulative strokes. Wins are calculated strictly by who takes fewer strokes on an individual hole, with standard handicap allowance indices distributed across the card.',
      tactics: 'Play the opponent, not the course. If your competitor hits two consecutive shots into deep hazard fescue, switch to a conservative iron to secure the hole securely.'
    },
    {
      id: 'stableford',
      title: 'STABLEFORD',
      subtitle: 'POINT AGGREGATION',
      variant: 'Modified Scoring Scale',
      description: 'Converts traditional stroke values into positive and negative point metrics relative to par. Double Bogey or worse yields -1, Bogey drops 0, Par awards 2, Birdie yields 4, and an Eagle earns 6 points.',
      tactics: 'Completely eliminates the scorecard-destroying penalty of a single bad hole. A quadruple bogey hurts exactly as much as a standard bogey, so keep firing at flags.'
    },
    {
      id: 'bingo_bango_bongo',
      title: 'BINGO BANGO BONGO',
      subtitle: 'MULTI-PHASE ACHIEVEMENT',
      variant: 'Skill-Agnostic Race',
      description: 'Awards points across three distinct checkpoints on every single hole: Bingo (First on the green), Bango (Closest to the pin once all balls rest on the green), and Bongo (First ball inside the cup).',
      tactics: 'Highly rewards high-handicap players or short hitters. Intentionally laying up just short of the green ensures you hit first into the green, giving you an uncontested shot at the Bingo point.'
    }
  ];

  // 🔍 LOOKAHEAD INPUT REGISTRY FILTER
  const filteredGames = gamesDictionary.filter(g =>
    g.title.toUpperCase().includes(searchQuery.toUpperCase()) ||
    g.description.toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <div style={{ textAlign: 'left', width: '100%', boxSizing: 'border-box', paddingTop: '12px' }}>
      
      {/* SEARCH AND ACTION ENGINE BAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#0e3c2f', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(236,193,81,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ecc151', fontWeight: 'bold' }}>🔍</span>
          <input 
            type="text"
            placeholder="SEARCH OPERATIONAL GAMES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#beedd9', fontWeight: '700', fontSize: '13px', padding: 0, textTransform: 'uppercase' }}
          />
        </div>
      </div>

      {/* COMPONENT LEDGER TITLE TRACKER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '24px', borderBottom: '1px solid rgba(65,72,69,0.15)', paddingBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#ecc151', fontStyle: 'italic', textTransform: 'uppercase', tracking: '0.05em' }}>MY GAMES</h3>
        <div style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(190,237,217,0.4)', tracking: '0.15em', textTransform: 'uppercase', backgroundColor: '#0e3c2f', padding: '4px 10px', borderRadius: '6px' }}>
          Total Units: {filteredGames.length.toString().padStart(2, '0')}
        </div>
      </div>

      {/* DYNAMIC BENTO CARD GRID INTERFACES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredGames.map((game) => (
          <div 
            key={game.id}
            style={{ backgroundColor: 'rgba(14, 60, 47, 0.4)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(236, 193, 81, 0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}
          >
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em', textTransform: 'uppercase' }}>
                {game.subtitle}
              </p>
              <h4 style={{ margin: 0, fontSize: '24px', fontWeight: '900', fontStyle: 'italic', color: 'white', textTransform: 'uppercase', tracking: '-0.02em' }}>
                {game.title}
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button 
                onClick={() => setSelectedGame(game)}
                style={{ flex: 1, padding: '14px 0', borderRadius: '30px', border: 'none', backgroundColor: '#0e3c2f', color: '#ecc151', fontWeight: '900', fontStyle: 'italic', fontSize: '11px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(236,193,81,0.1)' }}
                type="button"
              >
                View Ruleset Details ➜
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 💎 HIGH-READABILITY TACTICAL OVERLAY DRAWER SHEET                        */}
      {/* ========================================================================= */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: selectedGame ? 'auto' : 'none', display: 'block' }}>
        <div onClick={() => setSelectedGame(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', opacity: selectedGame ? 1 : 0, transition: 'opacity 0.4s', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '15vh', borderTop: '2px solid rgba(236,193,81,0.3)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', backgroundColor: '#00251b', boxSizing: 'border-box', boxShadow: '0 -20px 100px rgba(0,0,0,0.8)', transition: 'transform 0.4s cubic-bezier(0.1, 0.85, 0.25, 1)', transform: selectedGame ? 'translateY(0)' : 'translateY(100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ width: '48px', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(236,193,81,0.2)', margin: '16px auto 4px auto', flex: 'none' }} />
          
          {selectedGame && (
            <>
              {/* Drawer Header Layout */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(236,193,81,0.08)', display: 'flex', alignItems: 'center', justifycontent: 'space-between', flex: 'none' }}>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.15em', textTransform: 'uppercase' }}>
                    {selectedGame.variant}
                  </p>
                  <h3 style={{ margin: 0, color: '#beedd9', fontSize: '26px', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', tracking: '-0.02em' }}>
                    {selectedGame.title}
                  </h3>
                </div>
                <button onClick={() => setSelectedGame(null)} style={{ backgroundColor: '#001710', color: '#ecc151', border: '1px solid rgba(236,193,81,0.15)', padding: '10px 18px', borderRadius: '24px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }} type="button">Close</button>
              </div>

              {/* Drawer Scrollable Content Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box', paddingBottom: '60px' }}>
                
                {/* Ruleset Definition Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em' }}>WAGER RULES AND OPERATION</span>
                  <div style={{ backgroundColor: '#001710', padding: '20px', borderRadius: '14px', border: '1px solid rgba(236,193,81,0.05)' }}>
                    <p style={{ margin: 0, color: '#beedd9', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>
                      {selectedGame.description}
                    </p>
                  </div>
                </div>

                {/* Tactical Tips Analysis Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#ecc151', tracking: '0.1em' }}>CADDY INTELLIGENCE TACTICS</span>
                  <div style={{ backgroundColor: '#001710', padding: '20px', borderRadius: '14px', border: '1px solid rgba(236,193,81,0.05)' }}>
                    <p style={{ margin: 0, color: '#ecc151', fontSize: '14px', lineHeight: '1.6', fontWeight: '500', fontStyle: 'italic' }}>
                      {selectedGame.tactics}
                    </p>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}

export default GameIntelMain;