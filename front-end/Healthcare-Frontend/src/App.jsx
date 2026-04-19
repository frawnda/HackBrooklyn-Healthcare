import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('No file selected')
  // UPDATED: Now initialized as an empty array
  const [fileObjects, setFileObjects] = useState([])
  const [loadingLanguage, setLoadingLanguage] = useState(null)
  const [summary, setSummary] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const fileInputRef = useRef(null)

  // UPDATED: Appends new files to the array instead of replacing
  const handleFile = (newFile) => {
    if (!newFile) return
    
    setFileObjects(prev => [...prev, newFile])
    
    // Update display name to show all uploaded files
    setFileName(prev => 
      prev === 'No file selected' ? newFile.name : `${prev}, ${newFile.name}`
    )
    setSummary('')
  }

  const handleInputChange = (event) => {
    // Handle potential multiple selection if the input allowed it
    const files = Array.from(event.target.files || [])
    files.forEach(file => handleFile(file))
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
    // Handle multiple dropped files
    const files = Array.from(event.dataTransfer.files || [])
    files.forEach(file => handleFile(file))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyzeClick = async (lang) => {
    // UPDATED: Check array length
    if (fileObjects.length === 0) {
      alert("Please upload at least one file!")
      return
    }

    setLoadingLanguage(lang)
    setSummary('')

    // UPDATED: Append all files in the array to the FormData
    const formData = new FormData()
    fileObjects.forEach((file) => {
      formData.append('file', file) // Flask's getlist('file') will pick these up
    })
    formData.append('language', lang)

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
     
      if (data.summary) {
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

  // OPTIONAL: Add a reset button to clear files for the next analysis
  const resetFiles = () => {
    setFileObjects([])
    setFileName('No file selected')
    setSummary('')
  }

  const handleTranscribe = () => {
    if (fileObjects.length === 0) {
      alert("Please upload at least one file!")
      return
    }
    setIsTranscribing(true)
    // TODO: Add transcription logic here
    // For now, this just demonstrates the UI state change
  }

  return (
    <div className="app-container">
      <header className="mb-5">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#">Bill Express</a>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#" onClick={resetFiles}>Clear Files</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container">
        <section className="hero-box mb-5 rounded-3 p-5 text-center">
          <h2 className="text-black mb-3">Medical Bill Analyzer</h2>
          <p className="text-muted">You can upload multiple documents!</p>
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
            {/* Added 'multiple' attribute to allow selecting multiple files at once */}
            <input 
                ref={fileInputRef} 
                type="file" 
                className="d-none" 
                onChange={handleInputChange} 
                accept="image/*" 
                multiple 
            />
            <div className="drop-zone-content">
              <p className="mb-2 fs-5 fw-semibold">Drag & drop your files here</p>
              <p className="text-muted">Supports multiple images</p>
              <p className="mt-3 text-primary fw-bold" style={{fontSize: '0.9rem'}}>{fileName}</p>
            </div>
          </div>

          <div className="d-flex justify-content-center flex-column flex-md-row gap-3 mt-4 align-items-center">
            {['English', 'Español', 'Français'].map((lang) => (
              <button
                key={lang}
                className="btn btn-dark fw-bold btn-lg px-5"
                type="button"
                onClick={() => handleAnalyzeClick(lang)}
                disabled={loadingLanguage !== null}
              >
                {loadingLanguage === lang ? `Analyzing ${fileObjects.length} files...` : lang}
              </button>
            ))}
            <button
              className="btn btn-dark fw-bold btn-lg px-5"
              type="button"
              onClick={handleTranscribe}
            >
              {isTranscribing ? 'Transcribe' : 'Transcribing...'}
            </button>
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