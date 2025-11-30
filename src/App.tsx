import { MapContainer } from 'react-leaflet'
import MapContent from './components/MapContent'
import Sidebar from './components/Sidebar'
import SidebarToggleButton from './components/SidebarToggleButton'
import SearchBar from './components/SearchBar'
import CustomControls from './components/CustomControls'
import ThemeSwitcher from './components/ThemeSwitcher'
import { useMapStore } from './store/mapStore'
import 'leaflet/dist/leaflet.css'

function App() {
  const { center, zoom } = useMapStore()

  return (
    <div className="relative w-full h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10 px-4 py-3 relative border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarToggleButton />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AOI Creation</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <Sidebar />

        <div className="w-full h-full relative" style={{ zIndex: 1 }}>
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
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
