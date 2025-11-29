import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { useMapStore } from '../store/mapStore'
import type { DrawFeature } from '../store/mapStore'

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function FeatureLayers() {
  const map = useMap()
  const { features, selectedFeature, setSelectedFeature } = useMapStore()
  const layersRef = useRef<Map<string, L.Layer>>(new Map())
  const previousFeaturesLengthRef = useRef<number>(0)

  // Separate effect to set layer references only when new features are added
  // This prevents infinite loops by not running on every feature update
  useEffect(() => {
    if (features.length > previousFeaturesLengthRef.current) {
      // New features were added, set their layer references
      features.forEach((feature) => {
        if (!feature.layer) {
          const layer = layersRef.current.get(feature.id)
          if (layer) {
            useMapStore.getState().updateFeature(feature.id, { layer })
          }
        }
      })
      previousFeaturesLengthRef.current = features.length
    } else if (features.length < previousFeaturesLengthRef.current) {
      // Features were removed, update the length ref
      previousFeaturesLengthRef.current = features.length
    }
  }, [features.length]) // Only depend on length, not the array itself

  useEffect(() => {
    if (!map) return

    // Track which features we need to keep
    const currentFeatureIds = new Set(features.map((f) => f.id))
    
    // Remove layers for features that no longer exist
    layersRef.current.forEach((layer, id) => {
      if (!currentFeatureIds.has(id) && !id.startsWith('highlight-')) {
        map.removeLayer(layer)
        layersRef.current.delete(id)
      }
    })

    // Add or update features as layers
    features.forEach((feature) => {
      // Check if layer already exists for this feature
      const existingLayer = layersRef.current.get(feature.id)
      if (existingLayer && feature.layer === existingLayer) {
        // Layer already exists and matches, skip creating new one
        return
      }

      // Remove old layer if it exists
      if (existingLayer) {
        map.removeLayer(existingLayer)
      }

      let layer: L.Layer

      if (feature.type === 'marker') {
        const latlng = feature.geometry as L.LatLngExpression
        layer = L.marker(latlng, { icon: DefaultIcon })
      } else if (feature.type === 'polyline') {
        const latlngs = feature.geometry as L.LatLngExpression[]
        layer = L.polyline(latlngs, {
          color: '#3388ff',
          weight: 4,
        })
      } else if (feature.type === 'polygon') {
        const latlngs = feature.geometry as L.LatLngExpression[][]
        layer = L.polygon(latlngs, {
          color: '#3388ff',
          fillColor: '#3388ff',
          fillOpacity: 0.2,
        })
      } else {
        return
      }

      // Add popup
      const popupContent = `
        <div>
          <strong>${feature.type}</strong><br/>
          <button 
            class="delete-feature-btn" 
            data-feature-id="${feature.id}"
            style="margin-top: 8px; padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Delete
          </button>
        </div>
      `
      layer.bindPopup(popupContent)

      // Handle click
      layer.on('click', () => {
        setSelectedFeature(feature.id)
      })

      // Handle delete button click
      layer.on('popupopen', () => {
        const btn = document.querySelector(`.delete-feature-btn[data-feature-id="${feature.id}"]`)
        if (btn) {
          // Remove existing listener if any
          const newBtn = btn.cloneNode(true) as HTMLElement
          btn.parentNode?.replaceChild(newBtn, btn)
          
          newBtn.addEventListener('click', () => {
            useMapStore.getState().removeFeature(feature.id)
            useMapStore.getState().saveFeaturesToStorage()
            map.closePopup()
          })
        }
      })

      map.addLayer(layer)
      layersRef.current.set(feature.id, layer)
    })

    // Handle selected feature highlighting separately to avoid re-renders
    features.forEach((feature) => {
      const layer = layersRef.current.get(feature.id)
      if (!layer) return

      const highlightKey = `highlight-${feature.id}`
      const existingHighlight = layersRef.current.get(highlightKey)

      if (feature.id === selectedFeature) {
        // Add highlight if not already present
        if (!existingHighlight) {
          if (layer instanceof L.Marker) {
            const circle = L.circle(layer.getLatLng(), {
              radius: 50,
              color: '#ff6b6b',
              fillColor: '#ff6b6b',
              fillOpacity: 0.2,
            })
            map.addLayer(circle)
            layersRef.current.set(highlightKey, circle)
          } else if (layer instanceof L.Polyline || layer instanceof L.Polygon) {
            layer.setStyle({
              color: '#ff6b6b',
              weight: 6,
            })
          }
        }
      } else {
        // Remove highlight if present
        if (existingHighlight) {
          map.removeLayer(existingHighlight)
          layersRef.current.delete(highlightKey)
        }
        // Reset style for non-selected features
        if (layer instanceof L.Polyline || layer instanceof L.Polygon) {
          layer.setStyle({
            color: '#3388ff',
            weight: 4,
          })
        }
      }
    })

    return () => {
      layersRef.current.forEach((layer) => {
        map.removeLayer(layer)
      })
      layersRef.current.clear()
    }
  }, [map, features, selectedFeature, setSelectedFeature])

  return null
}

export default FeatureLayers

