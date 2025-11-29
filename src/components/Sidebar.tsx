import { useMapStore } from '../store/mapStore'

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
    sidebarOpen,
  } = useMapStore()

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
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 absolute left-0 top-0 w-80 h-full bg-white dark:bg-gray-800 shadow-2xl z-[9999] flex flex-col border-r border-gray-200 dark:border-gray-700`}
        aria-label="Layer management sidebar"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Layer Management</h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {/* WMS Layer Toggle */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Layers</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wmsLayerVisible}
                onChange={(e) => setWmsLayerVisible(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                aria-label="Toggle WMS satellite imagery layer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Satellite/Drone Imagery (WMS)</span>
            </label>
          </div>

          {/* Drawing Tools */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Drawing Tools</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleDrawingModeClick('marker')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  drawingMode === 'marker'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Features ({features.length})
              </h3>
              {features.length > 0 && (
                <button
                  onClick={clearAllFeatures}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  aria-label="Clear all features"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              {features.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">No features drawn yet</p>
              ) : (
                features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedFeature === feature.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {getFeatureTypeLabel(feature.type)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">#{feature.id.slice(-6)}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFeature(feature.id)
                          useMapStore.getState().saveFeaturesToStorage()
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs"
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

