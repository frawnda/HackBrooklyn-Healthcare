import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('No file selected')
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
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

  const handleAnalyzeClick = () => {
    setAnalyzing(true)
    window.setTimeout(() => {
      setAnalyzing(false)
    }, 1700)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
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
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="d-none"
              onChange={handleInputChange}
            />
            <div className="drop-zone-content">
              <p className="mb-2 fs-5 fw-semibold">Drag & drop your bill here</p>
              <p className="mb-0 text-secondary">or click to browse files</p>
              <p className="mt-3 mb-0 text-truncate text-dark fw-medium">{fileName}</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-dark btn-lg px-4"
              type="button"
              onClick={handleAnalyzeClick}
              disabled={analyzing}
            >
              {analyzing ? 'Translating...' : 'English'}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-dark btn-lg px-4"
              type="button"
              onClick={handleAnalyzeClick}
              disabled={analyzing}
            >
              {analyzing ? 'Translating...' : 'Spanish'}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-dark btn-lg px-4"
              type="button"
              onClick={handleAnalyzeClick}
              disabled={analyzing}
            >
              {analyzing ? 'Translating...' : 'Chinese'}
            </button>
          </div>
        </section>

        <section className="results-panel rounded-3 shadow-sm">
          <div className="result-item mb-3 p-3 rounded-3 bg-light">
            <h6 className="mb-1"> Summarized Bill </h6>
            <p className="mb-0 text-secondary">Estimated total, insurance coverage, and out-of-pocket details.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App