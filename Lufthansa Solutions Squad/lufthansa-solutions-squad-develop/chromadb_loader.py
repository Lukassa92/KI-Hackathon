import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
import time


# Funktion die PDF in Text umwandelt und Struktur bewahrt
def extract_text_with_structure(pdf_path):
    doc = fitz.open(pdf_path)
    structured_text = []

    for page in doc:
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            if block['type'] == 0:  # Textblock
                for line in block["lines"]:
                    line_text = " ".join([span['text'] for span in line['spans']])
                    # Erkennen von Überschriften anhand der Schriftgröße
                    if line['spans'][0]['size'] > 12:  # Beispiel für Überschrift
                        structured_text.append(f"<h>{line_text}</h>")
                    else:
                        structured_text.append(f"<p>{line_text}</p>")
    return "\n".join(structured_text)


# Inhalte der chroma drucken
def print_chroma_collection_contents(collection):
    # Alle IDs der gespeicherten Dokumente abrufen
    results = collection.get()

    # Iteriere durch die Ergebnisse und drucke die Dokumente
    for i, doc in enumerate(results["documents"]):
        print(f"Dokument {i}:")
        print(f"Text: {doc}")
        print("-" * 50)


# Funktion zum Verarbeiten einer PDF und Erstellen einer Chroma-Datenbank
def process_pdf_to_chroma(pdf_path, chroma_path):
    print(f"Verarbeite PDF: {pdf_path}")
    print(f"Speichere in: {chroma_path}")

    # Text aus der PDF extrahieren
    pdf_text_with_structure = extract_text_with_structure(pdf_path)

    # Text in Chunks teilen
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(pdf_text_with_structure)

    # Embeddings erstellen
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(chunks, convert_to_tensor=True)

    # Embeddings in ChromaDB speichern
    chroma_client = chromadb.PersistentClient(path=chroma_path)
    collection = chroma_client.get_or_create_collection(name="my_collection")

    # Hinzufügen der Embeddings und zugehörigen Texte
    for i, chunk in enumerate(chunks):
        collection.add(
            ids=[str(i)],
            documents=[chunk],
            embeddings=[embeddings[i].tolist()]
        )

    print(f"Befüllen der Chroma für {pdf_path} ist fertig")
    time.sleep(1)
    print("und so sieht es aus:")
    time.sleep(1)

    # Inhalte der Sammlung drucken
    print_chroma_collection_contents(collection)
    print("\n" + "=" * 80 + "\n")


# Definiere die Pfade für beide PDFs und ihre entsprechenden Chroma-Datenbanken
pdf_paths = [
    "documents/AufenthaltGesetze.pdf",
    "documents/AufenthaltserlaubnisWolfsburg.pdf"
]

chroma_paths = [
    "./chroma_db/aufenthalt_gesetze",
    "./chroma_db/aufenthalt_wolfsburg"
]

# Verarbeite beide PDFs nacheinander
for pdf_path, chroma_path in zip(pdf_paths, chroma_paths):
    process_pdf_to_chroma(pdf_path, chroma_path)

print("Alle PDFs wurden verarbeitet und in Chroma-Datenbanken gespeichert.")
