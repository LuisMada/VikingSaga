import { useState } from 'react';

export default function SavedCharacters({ savedCharacters, onClearAll }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedSaga, setSelectedSaga] = useState(null);
  
  if (savedCharacters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No saved sagas yet. Begin your first legend!</p>
      </div>
    );
  }

  const displayedCharacters = showAll ? savedCharacters : savedCharacters.slice(0, 6);

  if (selectedSaga) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedSaga(null)}
          className="text-viking-bronze hover:text-viking-gold transition-colors"
        >
          ← Back to Hall of Legends
        </button>
        <SagaViewer saga={selectedSaga} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-viking-gold">📜 Hall of Legends</h2>
        <button
          onClick={onClearAll}
          className="text-sm bg-viking-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedCharacters.map((saga, index) => (
          <div 
            key={saga.id || index} 
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-500/50 hover:border-viking-bronze/50 transition-colors cursor-pointer"
            onClick={() => setSelectedSaga(saga)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-viking-gold">{saga.name}</h3>
                <p className="text-viking-bronze text-sm">{saga.profession}</p>
                {saga.fateSeed && (
                  <p className="text-slate-400 text-xs italic">{saga.fateSeed}</p>
                )}
              </div>
              <div className="text-right text-sm text-slate-400">
                <p>Age: {saga.currentAge}</p>
                {saga.isLegacy && (
                  <span className="text-viking-gold text-xs">👑 Legacy</span>
                )}
              </div>
            </div>
            
            <p className="text-slate-300 text-sm mb-3 line-clamp-2">
              {saga.physicalMarkers || "A legendary figure of the Viking Age"}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {saga.motifs?.slice(0, 2).map((motif, i) => (
                <span key={i} className="text-xs bg-viking-bronze/20 text-viking-bronze px-2 py-1 rounded">
                  {motif}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{saga.sagaLog ? `${saga.sagaLog.length} chapters` : 'New saga'}</span>
              <span>{new Date(saga.savedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      {savedCharacters.length > 6 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-viking-bronze hover:text-viking-gold transition-colors"
          >
            {showAll ? 'Show Less' : `Show All (${savedCharacters.length})`}
          </button>
        </div>
      )}
    </div>
  );
}

function SagaViewer({ saga }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-viking-gold mb-2">{saga.name}</h2>
        <div className="flex justify-center items-center gap-4 text-lg">
          <span className="text-viking-bronze">{saga.profession}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">Age {saga.currentAge}</span>
          <span className="text-slate-400">•</span>
          <span className="text-viking-bronze italic">{saga.fateSeed}</span>
        </div>
        {saga.isLegacy && (
          <div className="mt-4 p-4 bg-viking-gold/10 rounded-lg border border-viking-gold/30">
            <p className="text-viking-gold font-bold">👑 This saga has reached its legendary conclusion</p>
          </div>
        )}
      </div>

      {/* Character Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-500/50">
          <h3 className="text-lg font-semibold text-viking-gold mb-3">Origins</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-viking-bronze">From:</span> {saga.originRegion}</p>
            <p><span className="text-viking-bronze">Father:</span> {saga.parents?.father}</p>
            <p><span className="text-viking-bronze">Mother:</span> {saga.parents?.mother}</p>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-500/50">
          <h3 className="text-lg font-semibold text-viking-gold mb-3">Essence</h3>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {saga.motifs?.map((motif, i) => (
                <span key={i} className="text-xs bg-viking-gold/20 text-viking-gold px-2 py-1 rounded">
                  {motif}
                </span>
              ))}
            </div>
            <p className="text-slate-300 text-sm">{saga.physicalMarkers}</p>
          </div>
        </div>
      </div>

      {/* Saga Log */}
      {saga.sagaLog && saga.sagaLog.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-viking-gold">The Complete Saga</h3>
          {saga.sagaLog.map((entry, index) => (
            <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-500/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-viking-bronze text-slate-900 flex items-center justify-center text-sm font-bold">
                  {entry.age}
                </div>
                <h4 className="font-semibold text-slate-200">Age {entry.age}</h4>
              </div>
              <p className="text-slate-300 mb-2">{entry.event}</p>
              {entry.quote && (
                <blockquote className="italic text-viking-bronze border-l-2 border-viking-bronze pl-3">
                  "{entry.quote}"
                </blockquote>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Legacy */}
      {saga.legacy && (
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-6 border border-viking-gold/30">
          <h3 className="text-xl font-bold text-viking-gold mb-4">⚱️ Final Legacy</h3>
          <p className="text-lg text-viking-bronze font-semibold mb-2">{saga.legacy.legendStatus}</p>
          <p className="text-slate-200 mb-4">{saga.legacy.eulogy}</p>
          <blockquote className="italic text-viking-bronze border-l-4 border-viking-gold pl-4">
            "{saga.legacy.famousQuote}"
          </blockquote>
          <div className="mt-4 text-center">
            <p className="text-viking-bronze italic">"{saga.legacy.runestoneInscription}"</p>
          </div>
        </div>
      )}
    </div>
  );
}