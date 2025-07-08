import { useState } from 'react';

export default function SagaLog({ character }) {
  const [expandedEntry, setExpandedEntry] = useState(null);
  
  if (!character?.sagaLog || character.sagaLog.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No saga entries yet. Create a character to begin their legend!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-viking-gold mb-2">
          The Saga of {character.name}
        </h2>
        <p className="text-viking-bronze italic">
          Path of the {character.fateSeed}
        </p>
      </div>

      <div className="space-y-4">
        {character.sagaLog.map((entry, index) => (
          <SagaEntry 
            key={index}
            entry={entry}
            index={index}
            isExpanded={expandedEntry === index}
            onToggle={() => setExpandedEntry(expandedEntry === index ? null : index)}
            isLatest={index === character.sagaLog.length - 1}
          />
        ))}
      </div>

      {/* Character Summary */}
      <div className="mt-8 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-6 border border-viking-gold/30">
        <h3 className="text-xl font-bold text-viking-gold mb-4">Current State</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-viking-bronze font-medium">Age: </span>
            <span className="text-slate-200">{character.currentAge}</span>
          </div>
          <div>
            <span className="text-viking-bronze font-medium">Region: </span>
            <span className="text-slate-200">{character.originRegion}</span>
          </div>
          <div>
            <span className="text-viking-bronze font-medium">Profession: </span>
            <span className="text-slate-200">{character.profession}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SagaEntry({ entry, index, isExpanded, onToggle, isLatest }) {
  return (
    <div className={`rounded-lg border transition-all duration-300 ${
      isLatest 
        ? 'bg-viking-gold/10 border-viking-gold/50 shadow-lg' 
        : 'bg-slate-700/30 border-slate-500/50 hover:border-slate-400/50'
    }`}>
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isLatest ? 'bg-viking-gold text-slate-900' : 'bg-slate-600 text-slate-200'
            }`}>
              {entry.age}
            </div>
            <h4 className={`font-semibold ${isLatest ? 'text-viking-gold' : 'text-slate-200'}`}>
              Age {entry.age}
              {isLatest && <span className="ml-2 text-sm text-viking-bronze">(Current)</span>}
            </h4>
          </div>
          <div className="text-slate-400">
            {isExpanded ? '−' : '+'}
          </div>
        </div>

        <p className="text-slate-300 mb-3 leading-relaxed">
          {entry.event}
        </p>

        {entry.quote && (
          <blockquote className="italic text-viking-bronze border-l-2 border-viking-bronze pl-3 mb-3">
            "{entry.quote}"
          </blockquote>
        )}

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-500/30 space-y-3">
            {entry.storyBeats && entry.storyBeats.length > 0 && (
              <div>
                <span className="text-viking-bronze font-medium text-sm">Story Beats: </span>
                <div className="mt-1 space-y-1">
                  {entry.storyBeats.map((beat, i) => (
                    <div key={i} className="text-sm text-slate-300 flex items-start">
                      <span className="text-viking-bronze mr-2">•</span>
                      {beat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.consequences && (
              <div>
                <span className="text-viking-bronze font-medium text-sm">Consequences: </span>
                <p className="text-sm text-slate-300 mt-1">{entry.consequences}</p>
              </div>
            )}

            {entry.threadsResolved && entry.threadsResolved.length > 0 && (
              <div>
                <span className="text-viking-bronze font-medium text-sm">Resolved Threads: </span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {entry.threadsResolved.map((thread, i) => (
                    <span key={i} className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">
                      ✓ {thread}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.newThreads && entry.newThreads.length > 0 && (
              <div>
                <span className="text-viking-bronze font-medium text-sm">New Threads: </span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {entry.newThreads.map((thread, i) => (
                    <span key={i} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
                      ★ {thread}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.tagsGained && entry.tagsGained.length > 0 && (
              <div>
                <span className="text-viking-bronze font-medium text-sm">Tags Gained: </span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {entry.tagsGained.map((tag, i) => (
                    <span key={i} className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">
                      +{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.motifsStrengthened && entry.motifsStrengthened.length > 0 && (
              <div>
                <span className="text-viking-bronze font-medium text-sm">Motifs Strengthened: </span>
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {entry.motifsStrengthened.map((motif, i) => (
                    <span key={i} className="bg-viking-gold/20 text-viking-gold px-2 py-1 rounded text-xs">
                      ⬆ {motif}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.relationshipChanges && entry.relationshipChanges.length > 0 && (
              <div>
                <span className="text-viking-bronze font-medium text-sm">Relationship Changes: </span>
                <div className="mt-1 space-y-1">
                  {entry.relationshipChanges.map((change, i) => (
                    <div key={i} className="text-xs text-slate-300">
                      <span className="text-slate-400">{change.name}:</span> {change.change}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}