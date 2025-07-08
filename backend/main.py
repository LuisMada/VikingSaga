from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv
import json
import random

# Load environment variables
load_dotenv()

app = FastAPI(title="Living Saga Engine API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Fate seeds for character arcs
FATE_SEEDS = [
    "Tragic Hero", "Outsider", "Legend-in-Shadows", "Vengeful Spirit", 
    "Wise Elder", "Cursed Wanderer", "Glory Seeker", "Peacemaker",
    "Oath Breaker", "Divine Chosen", "Exile's Return", "Last of Bloodline"
]

# Initial motifs and tags
INITIAL_MOTIFS = [
    "Blood and Honor", "The Raven's Shadow", "Iron Will", "Storm's Child",
    "Wolf's Heart", "Sea's Calling", "Fire's Forge", "Winter's Endurance"
]

INITIAL_TRAITS = [
    "proud", "curious", "loyal", "vengeful", "wise", "reckless", 
    "cunning", "honest", "fierce", "patient", "ambitious", "humble"
]

@app.get("/")
async def root():
    return {"message": "Living Saga Engine is running!"}

@app.post("/api/create_saga")
async def create_saga():
    """STAGE 1: CHARACTER INCEPTION - Generate the seed of the saga"""
    try:
        fate_seed = random.choice(FATE_SEEDS)
        motifs = random.sample(INITIAL_MOTIFS, 2)
        traits = random.sample(INITIAL_TRAITS, 3)
        
        system_prompt = f"""You are the Living Saga Engine, a master storyteller of Viking Age tales. You create characters destined for legend, tragedy, or glory. Focus on mythic potential and narrative seeds that will grow into epic sagas.

The character's fate seed is: {fate_seed}
Initial motifs: {', '.join(motifs)}
Character traits: {', '.join(traits)}"""

        user_prompt = f"""Create a Viking Age character with mythic potential using this exact JSON structure:

{{
  "name": "Authentic Norse name with patronymic",
  "profession": "Profession with narrative potential",
  "startingAge": "Age between 18-25 (number)",
  "parents": {{
    "father": "Father's name and profession",
    "mother": "Mother's name and profession"
  }},
  "originRegion": "Specific village/region in Norse lands",
  "fateSeed": "{fate_seed}",
  "traits": {traits},
  "physicalMarkers": "Distinctive physical features that hint at destiny",
  "initialTags": ["3-4 tags that will guide future events"],
  "motifs": {motifs},
  "currentAge": "Same as startingAge",
  "worldState": {{
    "localTensions": "Current conflicts or situations in their region",
    "mood": "Overall atmosphere (prosperity, unrest, mystery, etc.)"
  }},
  "relationships": [
    {{
      "name": "Important person in their life",
      "type": "relationship type",
      "status": "alive/dead/distant",
      "bondStrength": "weak/moderate/strong",
      "traits": ["1-2 traits"]
    }}
  ],
  "sagaLog": [
    {{
      "age": "Starting age",
      "event": "Their origin story or defining childhood moment",
      "quote": "A memorable quote that defines their character",
      "tagsGained": ["tags gained from this event"],
      "motifsStrengthened": ["which motifs this reinforced"]
    }}
  ]
}}

Make this character feel destined for saga. Return only valid JSON."""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=800,
            temperature=0.8
        )
        
        character_text = response.choices[0].message.content.strip()
        
        try:
            character_data = json.loads(character_text)
            return character_data
        except json.JSONDecodeError:
            # Fallback character with saga structure
            return create_fallback_character(fate_seed, motifs, traits)
            
    except Exception as e:
        print(f"Error creating saga: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create saga: {str(e)}")

@app.post("/api/advance_saga")
async def advance_saga(character_data: dict):
    """STAGE 2: LIFE TURN ENGINE - Simulate the next 5 years"""
    try:
        current_age = character_data.get("currentAge", 20)
        new_age = current_age + 5
        
        # Build context from character's history
        recent_events = character_data.get("sagaLog", [])[-3:]  # Last 3 events
        relationships = character_data.get("relationships", [])
        world_state = character_data.get("worldState", {})
        tags = character_data.get("initialTags", [])
        motifs = character_data.get("motifs", [])
        fate_seed = character_data.get("fateSeed", "Unknown")
        
        system_prompt = f"""You are the Living Saga Engine continuing an epic Viking tale. You must advance the character's story by 5 years, weaving together their past, personality, and the threads of fate.

Character's fate path: {fate_seed}
Current motifs: {', '.join(motifs)}
Active tags: {', '.join(tags)}
Current age: {current_age} → advancing to {new_age}"""

        user_prompt = f"""Continue this Viking's saga for the next 5 years. Base events on their history, relationships, and world state:

CHARACTER CONTEXT:
Name: {character_data.get('name', 'Unknown')}
Profession: {character_data.get('profession', 'Unknown')}
Traits: {', '.join(character_data.get('traits', []))}
Recent events: {[event.get('event', '') for event in recent_events]}
Current relationships: {[rel.get('name', '') + ' (' + rel.get('type', '') + ')' for rel in relationships]}
World tensions: {world_state.get('localTensions', 'Unknown')}

Generate the next chapter using this JSON structure:

{{
  "narrative": "1-2 paragraphs describing the key events of these 5 years",
  "newAge": {new_age},
  "eventsThisTurn": ["List of 2-3 major events that happened"],
  "quote": "A powerful quote from the character about this period",
  "tagsEvolved": ["New tags gained or old ones that changed"],
  "motifsStrengthened": ["Which existing motifs were reinforced"],
  "newMotifs": ["Any new motifs that emerged"],
  "relationshipChanges": [
    {{
      "name": "Person affected",
      "change": "How the relationship changed",
      "newStatus": "alive/dead/distant/loyal",
      "bondStrength": "weak/moderate/strong"
    }}
  ],
  "newRelationships": [
    {{
      "name": "New person in their life",
      "type": "relationship type",
      "status": "current status",
      "bondStrength": "strength of bond",
      "traits": ["1-2 defining traits"]
    }}
  ],
  "worldStateChanges": {{
    "localTensions": "How local conflicts evolved",
    "mood": "New atmosphere in their region",
    "majorEvents": "Any world-changing events they witnessed/caused"
  }}
}}

Remember: This character follows the {fate_seed} path. Events should feel mythic and consequential. Return only valid JSON."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=800,
            temperature=0.8
        )
        
        saga_turn = response.choices[0].message.content.strip()
        
        try:
            turn_data = json.loads(saga_turn)
            return turn_data
        except json.JSONDecodeError:
            return create_fallback_turn(character_data, new_age)
            
    except Exception as e:
        print(f"Error advancing saga: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to advance saga: {str(e)}")

@app.post("/api/generate_legacy")
async def generate_legacy(character_data: dict):
    """STAGE 6: DEATH + LEGACY - Generate the character's final legacy"""
    try:
        saga_log = character_data.get("sagaLog", [])
        final_age = character_data.get("currentAge", 50)
        name = character_data.get("name", "Unknown")
        fate_seed = character_data.get("fateSeed", "Unknown")
        
        system_prompt = f"""You are the Living Saga Engine creating the final chapter of a Viking legend. This character followed the {fate_seed} path. Create a poetic and mythic legacy that honors their full journey."""

        user_prompt = f"""Create the legacy summary for {name}, who lived to age {final_age} following the {fate_seed} path.

Their life events: {[event.get('event', '') for event in saga_log]}

Generate their legacy using this JSON structure:

{{
  "eulogy": "Poetic eulogy in the style of Viking sagas",
  "legendStatus": "How they are remembered (Forgotten Hero, Living Legend, Cautionary Tale, etc.)",
  "worldImpact": "How their actions changed the world around them",
  "famousQuote": "The quote they are most remembered for",
  "mythicElements": ["Legendary aspects of their story"],
  "legacyHooks": ["Story threads that could continue through heirs or rivals"],
  "runestoneInscription": "Brief inscription that would be carved on their memorial stone"
}}

Make this feel like a true Norse saga ending. Return only valid JSON."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=600,
            temperature=0.8
        )
        
        legacy_text = response.choices[0].message.content.strip()
        
        try:
            legacy_data = json.loads(legacy_text)
            return legacy_data
        except json.JSONDecodeError:
            return create_fallback_legacy(character_data)
            
    except Exception as e:
        print(f"Error generating legacy: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate legacy: {str(e)}")

def create_fallback_character(fate_seed, motifs, traits):
    """Fallback character if OpenAI fails"""
    return {
        "name": "Eirik Thorsson",
        "profession": "Blacksmith",
        "startingAge": 22,
        "parents": {
            "father": "Thor Bjornsson (Warrior)",
            "mother": "Astrid Eriksdottir (Healer)"
        },
        "originRegion": "Fjordholm Village",
        "fateSeed": fate_seed,
        "traits": traits,
        "physicalMarkers": "Burn scars on both hands from forge work, piercing blue eyes",
        "initialTags": ["forge-touched", "ambitious", "honor-bound"],
        "motifs": motifs,
        "currentAge": 22,
        "worldState": {
            "localTensions": "Rising conflict between neighboring clans",
            "mood": "tension"
        },
        "relationships": [{
            "name": "Sigrid Ragnarsdottir",
            "type": "childhood friend",
            "status": "alive",
            "bondStrength": "strong",
            "traits": ["fierce", "loyal"]
        }],
        "sagaLog": [{
            "age": 22,
            "event": "Forged his first sword, marking his transition to master craftsman",
            "quote": "Iron bends to will, as fate bends to courage",
            "tagsGained": ["master-smith"],
            "motifsStrengthened": ["Fire's Forge"]
        }]
    }

def create_fallback_turn(character_data, new_age):
    """Fallback turn advancement if OpenAI fails"""
    return {
        "narrative": "The years passed with both triumph and trial, shaping the character through adversity and growth.",
        "newAge": new_age,
        "eventsThisTurn": ["Faced a significant challenge", "Made a crucial alliance"],
        "quote": "Each season teaches us what we need to become",
        "tagsEvolved": ["weathered", "experienced"],
        "motifsStrengthened": [character_data.get("motifs", ["Iron Will"])[0]],
        "newMotifs": ["Wisdom's Weight"],
        "relationshipChanges": [],
        "newRelationships": [],
        "worldStateChanges": {
            "localTensions": "Conflicts continue to simmer",
            "mood": "uncertain",
            "majorEvents": "Minor skirmishes shape the region"
        }
    }

def create_fallback_legacy(character_data):
    """Fallback legacy if OpenAI fails"""
    name = character_data.get("name", "Unknown")
    return {
        "eulogy": f"Here lies {name}, whose deeds echo in the halls of memory",
        "legendStatus": "Remembered Hero",
        "worldImpact": "Their actions rippled through their community",
        "famousQuote": "Legacy is not what we take, but what we leave behind",
        "mythicElements": ["Overcame great adversity", "Inspired others"],
        "legacyHooks": ["Their children carry on their values"],
        "runestoneInscription": f"{name} - Lived with honor, died with purpose"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)