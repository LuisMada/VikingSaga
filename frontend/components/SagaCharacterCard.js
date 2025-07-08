export default function SagaCharacterCard({ character, onAdvanceSaga, onGenerateLegacy, onSave }) {
  if (!character) return null;

  const currentEvent = character.sagaLog?.[character.sagaLog.length - 1];
  const isOld = character.currentAge >= 60;

  return (
    <div className="viking-card max-w-4xl mx-auto">
      {/* Character Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-viking-gold mb-2">{character.name}</h2>
        <div className="flex justify-center items-center gap-4 text-lg">
          <span className="text-viking-bronze">{character.profession}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">Age {character.currentAge}</span>
          <span className="text-slate-400">•</span>
          <span className="text-viking-bronze italic">{character.fateSeed}</span>
        </div>
      </div>

      {/* Fate and Motifs */}
      <div className="mb-6 text-center">
        <div className="inline-flex flex-wrap gap-2 justify-center">
          {character.motifs?.map((motif, index) => (
            <span key={index} className="bg-viking-gold/20 text-viking-gold px-3 py-1 rounded-full text-sm">
              {motif}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <InfoSection 
            title="Origins" 
            items={[
              { label: "From", value: character.originRegion },
              { label: "Father", value: character.parents?.father || "Unknown" },
              { label: "Mother", value: character.parents?.mother || "Unknown" }
            ]}
          />
          
          <InfoSection 
            title="Physical Markers" 
            content={character.physicalMarkers}
          />

          <InfoSection 
            title="Core Traits" 
            list={character.traits || []}
          />
        </div>
        
        {/* Current State */}
        <div className="space-y-4">
          <InfoSection 
            title="World State" 
            items={[
              { label: "Local Tensions", value: character.worldState?.localTensions || "Unknown" },
              { label: "Regional Mood", value: character.worldState?.mood || "Unknown" }
            ]}
          />
          
          <InfoSection 
            title="Active Tags" 
            list={character.initialTags || []}
          />

          {character.relationships && character.relationships.length > 0 && (
            <InfoSection 
              title="Key Relationships" 
              items={character.relationships.map(rel => ({
                label: rel.name,
                value: `${rel.type} (${rel.status}, ${rel.bondStrength})`
              }))}
            />
          )}
        </div>
      </div>

      {/* Latest Saga Entry */}
      {currentEvent && (
        <div className="mb-6">
          <InfoSection 
            title={`Latest Chapter (Age ${currentEvent.age})`}
            content={currentEvent.event}
          />
          {currentEvent.quote && (
            <div className="mt-3 italic text-viking-bronze text-center">
              "{currentEvent.quote}"
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button 
          onClick={onSave}
          className="viking-button"
        >
          💾 Save Saga
        </button>
        
        {!isOld ? (
          <button 
            onClick={onAdvanceSaga}
            className="viking-button bg-gradient-to-r from-viking-blue to-blue-700 hover:from-blue-700 hover:to-viking-blue"
          >
            ⚡ Advance Saga
          </button>
        ) : (
          <button 
            onClick={onGenerateLegacy}
            className="viking-button bg-gradient-to-r from-viking-red to-red-700 hover:from-red-700 hover:to-viking-red"
          >
            🪦 Write Legacy
          </button>
        )}
      </div>
    </div>
  );
}

function InfoSection({ title, items, list, content }) {
  return (
    <div className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/50">
      <h3 className="text-lg font-semibold text-viking-gold mb-3">{title}</h3>
      
      {content && (
        <p className="text-slate-200 leading-relaxed">{content}</p>
      )}
      
      {items && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row">
              <span className="text-viking-bronze font-medium sm:w-32 sm:flex-shrink-0">
                {item.label}:
              </span>
              <span className="text-slate-200">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {list && (
        <div className="flex flex-wrap gap-2">
          {list.map((item, index) => (
            <span key={index} className="bg-slate-700/50 text-slate-200 px-2 py-1 rounded text-sm">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}