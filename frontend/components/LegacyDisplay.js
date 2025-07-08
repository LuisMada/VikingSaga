export default function LegacyDisplay({ character, legacy, onNewSaga, onSaveLegacy }) {
    if (!legacy) return null;
  
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Memorial Header */}
        <div className="text-center py-8 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-xl border border-viking-gold/50">
          <h2 className="text-4xl font-bold text-viking-gold mb-2">⚱️ Memorial Stone ⚱️</h2>
          <h3 className="text-2xl text-viking-bronze mb-4">{character.name}</h3>
          <p className="text-lg text-slate-300">
            {character.startingAge} - {character.currentAge} years
          </p>
          <p className="text-viking-bronze italic mt-2">
            "{legacy.runestoneInscription}"
          </p>
        </div>
  
        {/* Eulogy */}
        <div className="viking-card">
          <h3 className="text-2xl font-bold text-viking-gold mb-4 text-center">The Saga's End</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-200 leading-relaxed text-lg italic text-center">
              {legacy.eulogy}
            </p>
          </div>
        </div>
  
        {/* Legacy Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="viking-card">
            <h4 className="text-xl font-bold text-viking-gold mb-4">Legend Status</h4>
            <p className="text-2xl text-viking-bronze font-semibold mb-3">
              {legacy.legendStatus}
            </p>
            <p className="text-slate-200 leading-relaxed">
              {legacy.worldImpact}
            </p>
          </div>
  
          <div className="viking-card">
            <h4 className="text-xl font-bold text-viking-gold mb-4">Famous Words</h4>
            <blockquote className="text-lg italic text-viking-bronze border-l-4 border-viking-gold pl-4">
              "{legacy.famousQuote}"
            </blockquote>
            <p className="text-slate-400 text-sm mt-2">
              - Words that echo through the ages
            </p>
          </div>
        </div>
  
        {/* Mythic Elements */}
        <div className="viking-card">
          <h4 className="text-xl font-bold text-viking-gold mb-4">Mythic Elements</h4>
          <div className="grid gap-3">
            {legacy.mythicElements?.map((element, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-600/30 rounded-lg">
                <span className="text-viking-gold text-xl">⚡</span>
                <span className="text-slate-200">{element}</span>
              </div>
            ))}
          </div>
        </div>
  
        {/* Legacy Hooks */}
        {legacy.legacyHooks && legacy.legacyHooks.length > 0 && (
          <div className="viking-card">
            <h4 className="text-xl font-bold text-viking-gold mb-4">Threads of Fate Unfinished</h4>
            <p className="text-slate-300 mb-4">
              The saga may end, but some stories continue through others...
            </p>
            <div className="space-y-2">
              {legacy.legacyHooks.map((hook, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-600/20 rounded-lg border border-viking-bronze/30">
                  <span className="text-viking-bronze text-lg">🔗</span>
                  <span className="text-slate-200">{hook}</span>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center py-8">
          <button 
            onClick={onSaveLegacy}
            className="viking-button"
          >
            📜 Save to Hall of Legends
          </button>
          
          <button 
            onClick={onNewSaga}
            className="viking-button bg-gradient-to-r from-viking-blue to-blue-700 hover:from-blue-700 hover:to-viking-blue"
          >
            🆕 Begin New Saga
          </button>
        </div>
  
        {/* Memorial Footer */}
        <div className="text-center py-6 text-slate-400 italic">
          <p>May their name be remembered in the halls of the gods</p>
          <p className="text-sm mt-2">⚔️ Valhalla awaits the worthy ⚔️</p>
        </div>
      </div>
    );
  }