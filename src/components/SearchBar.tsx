import { useState, useCallback, useEffect } from 'react'
import { useMapStore } from '../store/mapStore'
import { debounce } from '../utils/debounce'

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  boundingbox: [string, string, string, string]
}

function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { setCenter, setZoom, center } = useMapStore()

  const searchLocation = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AOI-Creation-App/1.0',
          },
        }
      )
      const data = (await response.json()) as NominatimResult[]
      setResults(data)
    } catch (error) {
      console.error('Geocoding error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      searchLocation(searchQuery)
    }, 300),
    [searchLocation]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
    setShowResults(true)
  }

  const handleResultClick = (result: NominatimResult) => {
    const lat = parseFloat(result.lat)
    const lon = parseFloat(result.lon)
    const newCenter: [number, number] = [lat, lon]

    setCenter(newCenter)
    setZoom(15)

    setQuery(result.display_name)
    setShowResults(false)
    setResults([])
  }

  // Update map view when center changes (triggered by store)
  useEffect(() => {
    // This effect will trigger map updates through the MapEvents component
    // The center change is already handled by the store
  }, [center])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder="Search location..."
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          aria-label="Search location"
          aria-expanded={showResults && results.length > 0}
          aria-haspopup="listbox"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          ) : (
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setShowResults(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar"
          role="listbox"
        >
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              role="option"
              aria-label={result.display_name}
            >
              <div className="text-sm text-gray-800 dark:text-gray-200">{result.display_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar

