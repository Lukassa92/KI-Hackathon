from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import ollama
import chromadb
import uuid

MODEL = "llama3"

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Allow requests from your Angular frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# ChromaDB-Client starten

chroma_client_city = chromadb.PersistentClient(path="./chroma_db/aufenthalt_wolfsburg")
chroma_client_law = chromadb.PersistentClient(path="./chroma_db/aufenthalt_gesetze")
stadt_collection = chroma_client_city.get_or_create_collection("my_collection")
gesetze_collection = chroma_client_law.get_or_create_collection("my_collection")

# Simpler Chat-Verlauf als In-Memory-Speicher
chat_histories = {}  # {session_id: [{"role": "user", "content": "Frage"}, {"role": "assistant", "content": "Antwort"}]}

class ChatRequest(BaseModel):
    session_id: str  # Einzigartige Sitzungs-ID pro Nutzer
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    session_id = request.session_id
    user_input = request.message

    # Falls Session noch nicht existiert, initialisieren
    if session_id not in chat_histories:
        chat_histories[session_id] = [
            {"role": "system", "content": "INSTRUCTIONS: Bitte beantworte die Frage des Users als Mitarbeiter der Stadt Wolfsburg. Nutze vorrangig die INFROMATIONEN VON STADTVERWALTUNG WOLFSBURG und, falls relevant, passende INFORMATIONEN AUS GESETZESTEXTEN. Die Informationen sind folgendermaßen strukturiert: Überschriften befinden sich zwischen <h>-Tags, Inhalte zwischen <p>-Tags. Formatiere Links im Markdown-Stil [Linktext](URL). Antworte in der Sprache, in der die Frage gestellt wurde. Wenn die verfügbaren Informationen nicht ausreichen, teile dem Nutzer mit, dass die entsprechenden Informationen fehlen. Frage abschließend, wie du dem Nutzer weiter behilflich sein können."}
        ]

    # Ähnliche Dokumente aus ChromaDB abrufen
    stadt_results = stadt_collection.query(query_texts=[user_input], n_results=5)
    gesetze_results = gesetze_collection.query(query_texts=[user_input], n_results=5)

    # Kontext kombinieren
    context_parts = []
    if len(stadt_results["documents"]) > 0:
        context_parts.append(f"INFORMATIONEN DER STADTVERWALTUNG WOLFSBURG:\n{'\n'.join(stadt_results['documents'][0])}")
    elif len(gesetze_results["documents"]) > 0:
        context_parts.append(f"INFORMATIONEN AUS GESETZESTEXTEN:\n{'\n'.join(gesetze_results['documents'][0])}")

    context = "\n\n".join(context_parts) if context_parts else "Kein Kontext verfügbar."

    # Chatverlauf aktualisieren
    chat_histories[session_id].append({"role": "user", "content": user_input})

    # Anfrage an Ollama mit Kontext + Chatverlauf
    response = ollama.chat(
        model=MODEL,
        messages=chat_histories[session_id] + [{"role": "user", "content": f"{context}\n\nFRAGE DES USERS: {user_input}"}]
    )

    # Antwort speichern
    answer = response["message"]["content"]
    chat_histories[session_id].append({"role": "assistant", "content": answer})

    return {"message": answer}

@app.get("/")
async def root():
    return {"message": "Ollama API is running!"}
