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
    """STAGE 2: STORY BEAT ENGINE - Advance to the next consequential moment"""
    try:
        current_age = character_data.get("currentAge", 20)
        print(f"🔍 ADVANCING SAGA: Starting with age {current_age}")
        
        # Build narrative context from character's history
        recent_events = character_data.get("sagaLog", [])[-3:]  # Last 3 events for context
        relationships = character_data.get("relationships", [])
        world_state = character_data.get("worldState", {})
        tags = character_data.get("initialTags", [])
        motifs = character_data.get("motifs", [])
        fate_seed = character_data.get("fateSeed", "Unknown")
        
        system_prompt = f"""You are the Living Saga Engine. Your job is to advance a Viking saga by MEANINGFUL STORY BEATS with ORGANIC TIME FLOW.

CRITICAL RULE: Time must be VARIABLE and story-appropriate. DO NOT default to 5 years. Examples:
- Personal conflict resolution: 6-8 months
- Learning new skills: 1-2 years  
- Major life transition: 2-4 years
- Epic journey or exile: 3-5 years
- Quick relationship drama: 4-12 months

Current character age: {current_age}
Fate path: {fate_seed}
Motifs: {', '.join(motifs)}
Tags: {', '.join(tags)}"""

        user_prompt = f"""ADVANCE THIS SAGA WITH ORGANIC TIME FLOW - DO NOT USE EXACTLY 5 YEARS!

CHARACTER: {character_data.get('name', 'Unknown')}, age {current_age}
RECENT EVENTS: {[event.get('event', '')[:100] for event in recent_events]}

YOUR TASK:
1. Choose time period based on story needs (6 months to 6 years - BE CREATIVE!)
2. Calculate exact new age: {current_age} + your chosen time
3. Create meaningful events that justify this time period
4. Show concrete consequences

EXAMPLE GOOD RESPONSES:
- "timePassed": "14 months", "newAge": {current_age + 1}
- "timePassed": "3 years", "newAge": {current_age + 3}  
- "timePassed": "8 months", "newAge": {current_age + 1}

Return this EXACT JSON format:

{{
  "timePassed": "[YOUR CREATIVE TIME CHOICE - NOT 5 YEARS!]",
  "newAge": {current_age} + [YEARS FROM YOUR TIME CHOICE],
  "narrative": "Story explaining why this specific time period made sense",
  "storyBeats": ["Concrete event 1", "Concrete event 2"],
  "quote": "Character quote about this period",
  "tagsEvolved": ["new", "tags"],
  "motifsStrengthened": ["existing motifs"],
  "newMotifs": ["new motifs"],
  "relationshipChanges": [],
  "newRelationships": [],
  "narrativeThreads": {{
    "resolved": [],
    "continuing": [], 
    "newThreads": []
  }},
  "worldStateChanges": {{
    "localTensions": "updated tensions",
    "mood": "new mood",
    "majorEvents": "world changes"
  }},
  "consequences": "what changed for the character"
}}

REMEMBER: BE CREATIVE WITH TIME! Make it fit the story, not a calendar!"""

        print(f"🔍 SENDING TO OPENAI...")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.9  # Higher temperature for more creativity
        )
        
        saga_turn = response.choices[0].message.content.strip()
        print(f"🔍 OPENAI RESPONSE: {saga_turn[:200]}...")
        
        try:
            turn_data = json.loads(saga_turn)
            print(f"🔍 PARSED: timePassed={turn_data.get('timePassed')}, newAge={turn_data.get('newAge')}")
            
            # Validate and fix age calculation if needed
            time_passed = turn_data.get('timePassed', '2 years')
            new_age = turn_data.get('newAge')
            
            # Manual calculation if AI messed up
            if not new_age or new_age <= current_age:
                years_to_add = parse_time_to_years(time_passed)
                new_age = current_age + years_to_add
                turn_data['newAge'] = new_age
                print(f"🔍 FIXED AGE: added {years_to_add} years, new age: {new_age}")
            
            return turn_data
            
        except json.JSONDecodeError as e:
            print(f"🔍 JSON PARSING FAILED: {e}")
            print(f"🔍 RAW RESPONSE: {saga_turn}")
            # Create fallback with random time advancement
            random_years = random.choice([1, 2, 3, 4])  # No 5!
            random_months = random.choice([6, 8, 10, 14, 18])
            time_choice = random.choice([f"{random_years} years", f"{random_months} months"])
            years_to_add = parse_time_to_years(time_choice)
            return create_fallback_turn(character_data, current_age + years_to_add, time_choice)
            
    except Exception as e:
        print(f"🔍 ERROR IN ADVANCE_SAGA: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to advance saga: {str(e)}")

def parse_time_to_years(time_str):
    """Parse time string like '18 months', '2 years' into years"""
    import re
    time_str = time_str.lower()
    
    # Extract numbers
    numbers = re.findall(r'\d+', time_str)
    if not numbers:
        return 2  # fallback
    
    num = int(numbers[0])
    
    if 'month' in time_str:
        years = round(num / 12, 1)
        print(f"🔍 PARSED TIME: '{time_str}' = {years} years")
        return years
    elif 'year' in time_str:
        print(f"🔍 PARSED TIME: '{time_str}' = {num} years")
        return num
    else:
        print(f"🔍 COULDN'T PARSE: '{time_str}', defaulting to 2 years")
        return 2

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

def create_fallback_turn(character_data, new_age, time_passed="2 years"):
    """Enhanced fallback turn with narrative focus"""
    print(f"🔍 USING FALLBACK: {time_passed}, new age: {new_age}")
    
    return {
        "timePassed": time_passed,
        "newAge": new_age,
        "narrative": "The years brought both triumph and hardship, as fate wove new threads into the tapestry of their legend. Old bonds were tested while new alliances formed in the shadow of greater challenges yet to come.",
        "storyBeats": [
            "Faced a significant personal challenge that tested their resolve",
            "Formed or strengthened an important alliance",
            "Gained new insight about their destiny"
        ],
        "quote": "Some paths are chosen, others are carved with blood and determination",
        "tagsEvolved": ["tested", "resolute"],
        "motifsStrengthened": [character_data.get("motifs", ["Iron Will"])[0]],
        "newMotifs": ["Threads of Fate"],
        "relationshipChanges": [],
        "newRelationships": [],
        "narrativeThreads": {
            "resolved": [],
            "continuing": ["The character's ongoing struggle with their destiny"],
            "newThreads": ["A new challenge approaches on the horizon"]
        },
        "worldStateChanges": {
            "localTensions": "Regional conflicts continue to evolve",
            "mood": "anticipation",
            "majorEvents": "Subtle shifts in the balance of power"
        },
        "consequences": "Gained wisdom and allies, but at the cost of innocence"
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