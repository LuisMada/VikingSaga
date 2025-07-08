import { useState, useEffect } from 'react';
import SagaCharacterCard from '../components/SagaCharacterCard';
import SavedCharacters from '../components/SavedCharacters';
import SagaLog from '../components/SagaLog';
import LegacyDisplay from '../components/LegacyDisplay';

export default function Home() {
  const [character, setCharacter] = useState(null);
  const [savedSagas, setSavedSagas] = useState([]);
  const [currentLegacy, setCurrentLegacy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('create'); // create, saga, saved, legacy

  // Load saved sagas from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('vikingSagas');
    if (saved) {
      try {
        setSavedSagas(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved sagas:', e);
      }
    }
  }, []);

  // Save sagas to localStorage whenever savedSagas changes
  useEffect(() => {
    localStorage.setItem('vikingSagas', JSON.stringify(savedSagas));
  }, [savedSagas]);

  const createNewSaga = async () => {
    setLoading(true);
    setError(null);
    setCurrentLegacy(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/create_saga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setCharacter(data);
      setCurrentView('saga');
    } catch (err) {
      console.error('Error creating saga:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const advanceSaga = async () => {
    if (!character) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/advance_saga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const turnData = await response.json();
      console.log('Turn data received:', turnData); // Debug log
      
      // Update character with new saga turn - USING DYNAMIC TIME
      const updatedCharacter = {
        ...character,
        currentAge: turnData.newAge, // This should be dynamic now
        initialTags: [...(character.initialTags || []), ...(turnData.tagsEvolved || [])],
        motifs: [...(character.motifs || []), ...(turnData.newMotifs || [])],
        relationships: updateRelationships(character.relationships || [], turnData),
        worldState: turnData.worldStateChanges || character.worldState,
        narrativeThreads: turnData.narrativeThreads || { resolved: [], continuing: [], newThreads: [] },
        sagaLog: [
          ...(character.sagaLog || []),
          {
            age: turnData.newAge,
            timePassed: turnData.timePassed, // Dynamic time period
            event: turnData.narrative,
            storyBeats: turnData.storyBeats || [],
            quote: turnData.quote,
            tagsGained: turnData.tagsEvolved || [],
            motifsStrengthened: turnData.motifsStrengthened || [],
            relationshipChanges: turnData.relationshipChanges || [],
            consequences: turnData.consequences || "",
            threadsResolved: turnData.narrativeThreads?.resolved || [],
            newThreads: turnData.narrativeThreads?.newThreads || []
          }
        ]
      };
      
      console.log('Updated character:', updatedCharacter); // Debug log
      setCharacter(updatedCharacter);
    } catch (err) {
      console.error('Error advancing saga:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateLegacy = async () => {
    if (!character) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/generate_legacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const legacyData = await response.json();
      setCurrentLegacy(legacyData);
      setCurrentView('legacy');
    } catch (err) {
      console.error('Error generating legacy:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSaga = () => {
    if (character) {
      const sagaToSave = {
        ...character,
        savedAt: new Date().toISOString(),
        id: Date.now() // Simple ID
      };
      setSavedSagas(prev => [sagaToSave, ...prev]);
      alert(`The saga of ${character.name} has been preserved for eternity!`);
    }
  };

  const saveLegacy = () => {
    if (character && currentLegacy) {
      const legacyToSave = {
        ...character,
        legacy: currentLegacy,
        savedAt: new Date().toISOString(),
        id: Date.now(),
        isLegacy: true
      };
      setSavedSagas(prev => [legacyToSave, ...prev]);
      alert(`${character.name}'s legacy has been inscribed in the Hall of Legends!`);
    }
  };

  const clearAllSagas = () => {
    if (window.confirm('Are you sure you want to clear all saved sagas? This cannot be undone.')) {
      setSavedSagas([]);
    }
  };

  const updateRelationships = (currentRels, turnData) => {
    let updatedRels = [...currentRels];
    
    // Apply relationship changes
    if (turnData.relationshipChanges) {
      turnData.relationshipChanges.forEach(change => {
        const relIndex = updatedRels.findIndex(rel => rel.name === change.name);
        if (relIndex >= 0) {
          updatedRels[relIndex] = {
            ...updatedRels[relIndex],
            status: change.newStatus,
            bondStrength: change.bondStrength
          };
        }
      });
    }
    
    // Add new relationships
    if (turnData.newRelationships) {
      updatedRels = [...updatedRels, ...turnData.newRelationships];
    }
    
    return updatedRels;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="viking-title">⚔️ Living Saga Engine ⚔️</h1>
          <p className="viking-subtitle">
            Forge legends that span lifetimes • Watch destinies unfold • Chronicle epic tales
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-700/50 rounded-lg p-1 flex flex-wrap">
            <button
              onClick={() => setCurrentView('create')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'create' 
                  ? 'bg-viking-gold text-slate-900' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Saga
            </button>
            {character && (
              <button
                onClick={() => setCurrentView('saga')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentView === 'saga' 
                    ? 'bg-viking-gold text-slate-900' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Current Saga
              </button>
            )}
            <button
              onClick={() => setCurrentView('saved')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'saved' 
                  ? 'bg-viking-gold text-slate-900' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Hall of Legends ({savedSagas.length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center mb-8">
            <p className="text-red-200">⚠️ Error: {error}</p>
            <p className="text-red-300 text-sm mt-2">
              Make sure your FastAPI server is running and OpenAI API key is configured.
            </p>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'create' && (
          <div className="space-y-8">
            <div className="text-center">
              <button
                onClick={createNewSaga}
                disabled={loading}
                className="viking-button disabled:opacity-50 disabled:cursor-not-allowed text-xl px-8 py-4"
              >
                {loading ? '⚡ Weaving Fate...' : '🌟 Begin New Saga'}
              </button>
            </div>

            {!character && !loading && (
              <div className="text-center py-12">
                <div className="bg-slate-700/30 rounded-lg p-8 max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold text-viking-gold mb-4">
                    🏰 The Living Saga Engine
                  </h2>
                  <p className="text-slate-300 mb-6">
                    Create a Viking destined for legend, then watch their saga unfold across decades. 
                    Each character follows a unique fate path with evolving relationships, world events, and mythic consequences.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-600/30 p-4 rounded-lg">
                      <h3 className="text-viking-gold font-bold mb-2">🌱 Character Inception</h3>
                      <p className="text-slate-300">Generate a character with mythic potential, complete with fate seed and destiny threads</p>
                    </div>
                    <div className="bg-slate-600/30 p-4 rounded-lg">
                      <h3 className="text-viking-gold font-bold mb-2">⏳ Life Turns</h3>
                      <p className="text-slate-300">Advance their story in 5-year increments, watching relationships and world events evolve</p>
                    </div>
                    <div className="bg-slate-600/30 p-4 rounded-lg">
                      <h3 className="text-viking-gold font-bold mb-2">📜 Living Legacy</h3>
                      <p className="text-slate-300">Chronicle their complete saga and generate an epic legacy when their tale ends</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'saga' && character && (
          <div className="space-y-8">
            <SagaCharacterCard 
              character={character} 
              onAdvanceSaga={advanceSaga}
              onGenerateLegacy={generateLegacy}
              onSave={saveSaga}
            />
            
            {character.sagaLog && character.sagaLog.length > 1 && (
              <div className="mt-12">
                <SagaLog character={character} />
              </div>
            )}
          </div>
        )}

        {currentView === 'legacy' && currentLegacy && (
          <LegacyDisplay 
            character={character}
            legacy={currentLegacy}
            onNewSaga={() => {
              setCharacter(null);
              setCurrentLegacy(null);
              setCurrentView('create');
            }}
            onSaveLegacy={saveLegacy}
          />
        )}

        {currentView === 'saved' && (
          <SavedCharacters 
            savedCharacters={savedSagas} 
            onClearAll={clearAllSagas}
          />
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 border border-viking-gold">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-viking-gold"></div>
                <span className="text-viking-gold">The Norns weave your fate...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}