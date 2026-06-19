import { useRef, useState } from 'react'
import { importSalesCSV } from '../api/client'

const SAMPLE_CSV = `Date,Shop Name,Shop ID,Product Category,Product Name,Quantity,Unit Price,Total Sales,Channel,Shift Manager
2024-03-01 08:00,Shell Cafe Central,SC001,Coffee,Espresso,5,60,300,Dine-in,Somchai
2024-03-01 09:30,Shell Cafe BTS,SC002,Coffee,Cappuccino,3,85,255,Takeaway,Niran
2024-03-02 10:00,Shell Cafe Silom,SC003,Food,Croissant,10,40,400,Dine-in,Pattaya`

export default function ImportData() {
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are accepted.')
      return
    }
    setError(null)
    setResult(null)
    setSelectedFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) { setError('Please select a CSV file.'); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await importSalesCSV(selectedFile)
      setResult(res)
      setSelectedFile(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_sales.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Import Sales Data</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload a CSV file to import sales records into the database</p>
      </div>

      {/* CSV Format Reference */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Expected CSV Format</h2>
          <button onClick={downloadSample} className="text-xs text-blue-600 hover:text-blue-800 underline">
            Download sample CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 rounded">
                {['Date', 'Shop Name', 'Shop ID', 'Product Category', 'Product Name',
                  'Quantity', 'Unit Price', 'Total Sales', 'Channel', 'Shift Manager'].map(col => (
                  <th key={col} className="text-left px-2 py-1.5 text-gray-500 font-semibold whitespace-nowrap border-b border-gray-100">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-600">
                <td className="px-2 py-1.5 whitespace-nowrap">2024-02-01 08:00</td>
                <td className="px-2 py-1.5 whitespace-nowrap">Shell Cafe Central</td>
                <td className="px-2 py-1.5">SC001</td>
                <td className="px-2 py-1.5">Coffee</td>
                <td className="px-2 py-1.5">Espresso</td>
                <td className="px-2 py-1.5">3</td>
                <td className="px-2 py-1.5">60</td>
                <td className="px-2 py-1.5">180</td>
                <td className="px-2 py-1.5">Dine-in</td>
                <td className="px-2 py-1.5">Somchai</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Accepted date formats: YYYY-MM-DD HH:MM, YYYY-MM-DD HH:MM:SS, YYYY-MM-DD, DD/MM/YYYY
        </p>
      </div>

      {/* Upload Area */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Upload CSV File</h2>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-150 ${
            dragging ? 'border-blue-400 bg-blue-50' :
            selectedFile ? 'border-green-400 bg-green-50' :
            'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />
          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-2xl">📄</p>
              <p className="font-medium text-green-700">{selectedFile.name}</p>
              <p className="text-xs text-green-500">
                {(selectedFile.size / 1024).toFixed(1)} KB — ready to upload
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-3xl">📂</p>
              <p className="text-sm font-medium text-gray-600">Drop CSV file here, or click to browse</p>
              <p className="text-xs text-gray-400">Accepts .csv files only</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Importing…' : 'Import CSV'}
          </button>
          {selectedFile && (
            <button
              onClick={() => { setSelectedFile(null); setError(null); if (fileRef.current) fileRef.current.value = '' }}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card border-green-200 bg-green-50">
          <h2 className="text-sm font-semibold text-green-700 mb-3">Import Complete</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-xs text-gray-500">Rows Imported</p>
              <p className="text-2xl font-bold text-green-600">{result.rows_imported}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-xs text-gray-500">Rows Skipped</p>
              <p className="text-2xl font-bold text-amber-500">{result.rows_skipped}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-green-600">{result.message}</p>
        </div>
      )}
    </div>
  )
}
