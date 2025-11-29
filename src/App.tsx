import { MapContainer } from 'react-leaflet'
import MapContent from './components/MapContent'
import Sidebar from './components/Sidebar'
import SearchBar from './components/SearchBar'
import CustomControls from './components/CustomControls'
import { useMapStore } from './store/mapStore'
import 'leaflet/dist/leaflet.css'

function App() {
  const { center, zoom } = useMapStore()

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Header with Search */}
      <header className="bg-white shadow-sm z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">AOI Creation</h1>
          <div className="w-full max-w-md ml-4">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={true}
          >
            <MapContent />
            <CustomControls />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default App

