import { useEffect, useRef } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import { TileLayer, WMSTileLayer } from 'react-leaflet'
import { useMapStore } from '../store/mapStore'
import DrawingManager from './DrawingManager'
import FeatureLayers from './FeatureLayers'

function MapEvents() {
  const map = useMap()
  const { setCenter, setZoom, center, zoom } = useMapStore()
  const isUpdatingRef = useRef(false)

  useMapEvents({
    moveend: () => {
      if (!isUpdatingRef.current) {
        setCenter(map.getCenter())
      }
    },
    zoomend: () => {
      if (!isUpdatingRef.current) {
        setZoom(map.getZoom())
      }
    },
  })

  // Sync map view when center/zoom changes from store (e.g., from search)
  useEffect(() => {
    const currentCenter = map.getCenter()
    const currentZoom = map.getZoom()
    
    // Handle both array and LatLng object formats
    let targetLat: number
    let targetLng: number
    
    if (Array.isArray(center)) {
      targetLat = center[0]
      targetLng = center[1]
    } else if (center && typeof center === 'object' && 'lat' in center && 'lng' in center) {
      targetLat = center.lat
      targetLng = center.lng
    } else {
      return // Invalid center format
    }

    const latDiff = Math.abs(currentCenter.lat - targetLat)
    const lngDiff = Math.abs(currentCenter.lng - targetLng)
    const zoomDiff = Math.abs(currentZoom - zoom)

    // Only update if there's a significant difference
    if (latDiff > 0.0001 || lngDiff > 0.0001 || zoomDiff > 0.1) {
      isUpdatingRef.current = true
      map.setView([targetLat, targetLng], zoom)
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 100)
    }
  }, [map, center, zoom])

  return null
}

function MapContent() {
  const map = useMap()
  const { wmsLayerVisible, loadFeaturesFromStorage } = useMapStore()
  const initializedRef = useRef(false)

  useEffect(() => {
    // Load persisted features on mount (only once)
    if (!initializedRef.current) {
      loadFeaturesFromStorage()
      initializedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run on mount

  return (
    <>
      {/* Base OSM Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* WMS Layer for Satellite/Drone Imagery */}
      {wmsLayerVisible && (
        <WMSTileLayer
          url="https://www.wms.nrw.de/geobasis/wms_nw_dop"
          layers="nw_dop"
          format="image/png"
          transparent={true}
          opacity={0.8}
          attribution='&copy; <a href="https://www.wms.nrw.de/">Geobasis NRW</a>'
        />
      )}

      {/* Render drawn features */}
      <FeatureLayers />

      {/* Drawing Manager */}
      <DrawingManager />

      {/* Map Event Handlers */}
      <MapEvents />
    </>
  )
}

export default MapContent

