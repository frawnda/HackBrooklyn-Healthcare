import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('No file selected')
 
  // track which specific language is loading (null, 'English', 'Español', 'Français', etc.)
  const [loadingLanguage, setLoadingLanguage] = useState(null)
  // state to store the resulting summary text
  const [summary, setSummary] = useState('')
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    setSummary('') // reset summary when a new file is picked
  }

  const handleInputChange = (event) => {
    const file = event.target.files?.[0]
    handleFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    handleFile(file)
  }
  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  // 3. check language being selected
  const handleAnalyzeClick = (lang) => {
    setLoadingLanguage(lang)
    setSummary('') // clear the old bill summary while loading
    window.setTimeout(() => {
      setLoadingLanguage(null)
        {/* setSummary to the RAG summary based on the language*/}
        {/* need to alert RAG which button was pressed Eng = 1, Esp = 2, Fr = 3*/}
      if (lang === 'English') setSummary('This is your summarized medical bill in English.')
      if (lang === 'Español') setSummary('Este es el resumen de su factura médica en Español.')
      if (lang === 'Français') setSummary('Ceci est le résumé de votre facture médicale en Français.')
    }, 1700)
  }


  return (
    <div className="app-container">
      <header className="mb-5">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#">Bill Express</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#analyzer">Analyzer</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#support">Support</a>
                </li>
                <li className="nav-item ms-lg-3">
                  <button className="btn btn-dark btn-sm" type="button">Login</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>


      <main>
        <section className="hero-box mb-5 rounded-3 p-5">
          <div className="hero-content">
            <h2 className="text-black mb-3">Medical Bill Analyzer</h2>
          </div>
        </section>

        <section id="analyzer" className="analyzer-card rounded-3 shadow-sm mb-4">
          <div
            className={`drop-zone p-4 text-center rounded-3 ${dragActive ? 'drop-zone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            {/* user uploads file, send to RAGpreprocessor.py */}
            <input ref={fileInputRef} type="file" className="d-none" onChange={handleInputChange} />
            <div className="drop-zone-content">
              <p className="mb-2 fs-5 fw-semibold">Drag & drop your bill here</p>
              <p className="mt-3 text-dark fw-medium">{fileName}</p>
            </div>
          </div>

          {/* check if THIS specific button is the one loading */}
          <div className="d-flex justify-content-around flex-column flex-md-row gap-3 mt-4">
            {['English', 'Español', 'Français'].map((lang) => (
              <button
                key={lang}
                className="btn btn-dark fw-bold btn-lg px-4"
                type="button"
                onClick={() => handleAnalyzeClick(lang)}
                disabled={loadingLanguage !== null}
              >
                {loadingLanguage === lang ? `Translating to ${lang}...` : lang}
              </button>
            ))}
          </div>
        </section>


        {/* only show content if summary exists */}
        <section className="results-panel rounded-3 shadow-sm">
          {summary && (
            <div className="result-item mb-3 p-3 rounded-3 bg-light border-start border-primary border-4">
              <h6 className="mb-1 fw-bold">Summarized Bill</h6>
              <p className="mb-0 text-dark">{summary}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}


export default App

