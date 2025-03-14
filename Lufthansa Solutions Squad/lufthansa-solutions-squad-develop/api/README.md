# Ollama Chat API with FastAPI 🚀

## 🔧 1️⃣ Requirements
### 🖥️ **Install Ollama**
If not already installed, download **Ollama** from [https://ollama.com](https://ollama.com) and install it.

**On macOS you can also install Ollama with Homebrew:**
```bash
brew install ollama
```

### 🤖 **Download modell**

If you want to use Mistral 7B:

```bash
ollama pull mistral
```

If you want to use LLaMA 3:

```bash
ollama pull llama3
```

## ⚙ 2️⃣ Installation of the API

Copy the project and install the dependencies:

```bash
git clone git clone https://gitlab-ci-token:<personal-access-token>@gitlab.lhindts.io/oneautomotive/lufthansa-solutions-squad.git
cd lufthansa-solutions-squad/api
python -m venv lufthansa-solutions-squad
source lufthansa-solutions-squad/bin/activate
pip3 install -r requirements.txt
```

## 🚀 3️⃣ Start API

Start the API with:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API then runs at http://localhost:8000 🎉

## 🔍 4️⃣ Test API

With cURL

```bash
curl -X POST "http://localhost:8000/chat" -H "Content-Type: application/json" -d '{"message": "Hallo!"}'
```

## 📌 5️⃣ FAQ
### ❓ How do I change the model?
Edit the app.py file and change the model in the chat function:

```python
response = ollama.chat(model="llama3", messages=[{"role": "user", "content": request.message}])
```

Change “llama3” to “mistral” or another model.

### ❓ I get an error when installing pip install
If you have installed Python via Homebrew, use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
