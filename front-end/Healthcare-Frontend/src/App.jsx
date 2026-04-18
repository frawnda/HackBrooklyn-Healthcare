import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('No file selected')
  const [fileObject, setFileObject] = useState([null]) 
  const [loadingLanguage, setLoadingLanguage] = useState(null)
  const [summary, setSummary] = useState('')
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    setFileObject(file) 
    setSummary('') 
  }

  const handleInputChange = (event) => {
    const file = event.target.files?.[0]
    handleFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    handleFile(file)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyzeClick = async (lang) => {
    if (!fileObject) {
      alert("Please upload a file first!")
      return
    }

    setLoadingLanguage(lang)
    setSummary('') 

    // Prepare the data for Flask
    const formData = new FormData()
    formData.append('file', fileObject)
    formData.append('language', lang)

    try {
      // Direct call to your Flask server
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.summary) {
        // This is where the AI result from RAGpreprocessor.py lands
        setSummary(data.summary)
      } else {
        setSummary("Error: " + (data.error || "The server didn't return a summary."))
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      setSummary("Failed to connect to the backend server. Make sure app.py is running on port 5000.")
    } finally {
      setLoadingLanguage(null)
    }
  }

  return (
    <div className="app-container">
      <header className="mb-5">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#">Bill Express</a>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#">Home</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container">
        <section className="hero-box mb-5 rounded-3 p-5 text-center">
          <h2 className="text-black mb-3">Medical Bill Analyzer 2</h2>
          <p className="text-muted">Upload your medical bill and get an instant AI-powered summary in your preferred language.</p>
        </section>

        <section id="analyzer" className="analyzer-card rounded-3 shadow-sm mb-4 p-4 bg-white">
          <div
            className={`drop-zone p-5 text-center rounded-3 ${dragActive ? 'drop-zone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
            style={{ border: '2px dashed #ccc', cursor: 'pointer' }}
          >
            <input ref={fileInputRef} type="file" className="d-none" onChange={handleInputChange} accept="image/*" />
            <div className="drop-zone-content">
              <p className="mb-2 fs-5 fw-semibold">Drag & drop your bill here</p>
              <p className="text-muted">or click to browse files</p>
              <p className="mt-3 text-primary fw-bold">{fileName}</p>
            </div>
          </div>

          <div className="d-flex justify-content-center flex-column flex-md-row gap-3 mt-4">
            {['English', 'Español', 'Français'].map((lang) => (
              <button
                key={lang}
                className="btn btn-dark fw-bold btn-lg px-5"
                type="button"
                onClick={() => handleAnalyzeClick(lang)}
                disabled={loadingLanguage !== null}
              >
                {loadingLanguage === lang ? `Analyzing...` : lang}
              </button>
            ))}
          </div>
        </section>

        <section className="results-panel">
          {summary && (
            <div className="result-item mb-5 p-4 rounded-3 bg-white shadow-sm border-start border-4" style={{borderLeftColor: '#563d7c'}}>
              <h6 className="mb-3 fw-bold text-uppercase text-muted" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Analysis Results</h6>
              <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{summary}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App