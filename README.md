# HackBrooklyn-Healthcare, project by Musfirat R., Michelle F., Nathan C., Mei H.

# Setup for Windows
Prerequisites/Global Downloads:
-> Node.js. Click Next for everything, and then Install
To check if downloaded successfully, run node -v and npm -v. Sometimes PowerShell doesn’t run npm. If this happens,  Right click your powershell and Run as Administrator. Execute this: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned and Press Y. 
-> Python 3.9 - 3.11
-> Ollama. After installing Ollama → run ollama pull llama3.2 in terminal

Running Front-end:
cd front-end/Healthcare-Frontend
npm install 

Back end:
Set up a virtual environment.  Download Python dependencies IN BOTH your virtual environment and your machine. Make sure you make a virtual environment for both your terminals. Otherwise the program won’t run.

Run these in terminal for virtual environment:
-> pip install flask flask-cors python-doctr tf2onnx huggingface-hub langchain-huggingface langchain-community langchain-chroma langchain-classic pypdf
-> pip install pysqlite3-binary
-> ollama run llama3.2 
-> pip install sentence-transformers utopya torch torchvision torchaudio
-> pip install elevenlabs

Why?
flask, flask-cors allows React.js to interact with Flask
python-doctr, tf2onnx allows doctr to process images
langchain & langchain community connects all the data
ollama to interface with llama3.2 model
sentence-transformers & langchain-huggingface to create embeddings
pypdf to reference pdfs
elevenlabs to access & process audio

Once you have two terminal environments to set up the backend, and to set up the front end, set up the backend first. 
-> .venv should be activated & at the start of your command
-> When you set up the backend, make sure the path is correct for the app.py file. 
-> Run python (or your version) app.py
-> Wait until it successfully runs on localhost:5000. There should be no error messages after. 
Ignore UNEXPECTED warnings. 

Then, open the next terminal and make sure the path is correct for App.jsx. Run npm run dev, and you should be able to click and view the website!


# Setup for MacOs
Download Node.js → brew install node 
If command does not work, run /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" to set up Homebrew
Set up terminal environments (one for running back-end (Python), the other for front-end connection (bash or zsh))
In bash: source .venv/bin/activate
You should see (.venv) in front of your terminal path
Install dependencies on your Python environment
Run python app.py (or python3 app.py) in Python environment, should be running debugger towards the end
Switch to your other environment and make sure you are in the correct directory
Can run cd front-end/Healthcare-Frontend
Run npm install to ensure you have all dependencies prior to running website
Run npm run dev, you should see a local server (should look like http://localhost:5173/)

List of Dependencies
-> pip install elevenlabs
-> pip install flask
-> pip install flask_cors
-> pip install doctr
-> pip install "python-doctr[torch]"
-> pip install langchain
-> pip install langchain-huggingface[full]
-> pip install langchain-community
-> pip install langchain-text-splitters
-> pip install sentence-transformers transformers
-> pip install pypdf
-> pip install chromadb
-> pip install ollama

NOTE: MacOS uses Port 5000 to support AirPlay Receiver. To ensure that there are no issues with hosting the website, go to System Settings > General > Airdrop & Handoff and make sure that “AirPlay Receiver” is toggled OFF.


