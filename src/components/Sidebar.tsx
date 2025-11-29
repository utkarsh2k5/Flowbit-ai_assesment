import { useMapStore } from '../store/mapStore'
import { useState } from 'react'

function Sidebar() {
  const {
    features,
    wmsLayerVisible,
    setWmsLayerVisible,
    drawingMode,
    setDrawingMode,
    removeFeature,
    clearAllFeatures,
    selectedFeature,
    setSelectedFeature,
  } = useMapStore()
  const [isOpen, setIsOpen] = useState(true)

  const handleDrawingModeClick = (mode: 'marker' | 'polyline' | 'polygon') => {
    if (drawingMode === mode) {
      setDrawingMode(null)
    } else {
      setDrawingMode(mode)
    }
  }

  const getFeatureTypeLabel = (type: string) => {
    switch (type) {
      case 'marker':
        return 'Point'
      case 'polyline':
        return 'Line'
      case 'polygon':
        return 'Polygon'
      default:
        return type
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-2 top-20 z-20 bg-white p-2 rounded-md shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 w-80 bg-white shadow-lg z-10 flex flex-col h-full`}
        aria-label="Layer management sidebar"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Layer Management</h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {/* WMS Layer Toggle */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Base Layers</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wmsLayerVisible}
                onChange={(e) => setWmsLayerVisible(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                aria-label="Toggle WMS satellite imagery layer"
              />
              <span className="text-sm text-gray-700">Satellite/Drone Imagery (WMS)</span>
            </label>
          </div>

          {/* Drawing Tools */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Drawing Tools</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleDrawingModeClick('marker')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  drawingMode === 'marker'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Draw marker"
              >
                📍 Add Point
              </button>
              <button
                onClick={() => handleDrawingModeClick('polyline')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  drawingMode === 'polyline'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Draw polyline"
              >
                📏 Add Line
              </button>
              <button
                onClick={() => handleDrawingModeClick('polygon')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  drawingMode === 'polygon'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Draw polygon"
              >
                🔷 Add Polygon
              </button>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Features ({features.length})
              </h3>
              {features.length > 0 && (
                <button
                  onClick={clearAllFeatures}
                  className="text-xs text-red-600 hover:text-red-800"
                  aria-label="Clear all features"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              {features.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No features drawn yet</p>
              ) : (
                features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedFeature === feature.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedFeature(feature.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedFeature(feature.id)
                      }
                    }}
                    aria-label={`Feature ${feature.id}, type ${feature.type}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-gray-700">
                          {getFeatureTypeLabel(feature.type)}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">#{feature.id.slice(-6)}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFeature(feature.id)
                          useMapStore.getState().saveFeaturesToStorage()
                        }}
                        className="text-red-600 hover:text-red-800 text-xs"
                        aria-label={`Delete feature ${feature.id}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

