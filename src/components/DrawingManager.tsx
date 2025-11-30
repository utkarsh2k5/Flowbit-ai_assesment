import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-draw'
import { useMapStore } from '../store/mapStore'
import type { DrawFeature } from '../store/mapStore'
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

L.Marker.prototype.options.icon = DefaultIcon

function DrawingManager() {
  const map = useMap()
  const drawControlRef = useRef<L.Control.Draw | null>(null)
  const { drawingMode, setDrawingMode, addFeature, saveFeaturesToStorage } = useMapStore()

  useEffect(() => {
    if (!map) return

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        marker: {
          icon: DefaultIcon,
        },
        polyline: {
          shapeOptions: {
            color: '#3388ff',
            weight: 4,
          },
        },
        polygon: {
          shapeOptions: {
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.2,
          },
        },
        circle: false,
        rectangle: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
        remove: true,
      },
    })

    drawControlRef.current = drawControl
    map.addControl(drawControl)

    const handleDrawCreated = (e: L.DrawEvents.Created) => {
      const { layer, layerType } = e
      const id = `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      let geometry: LatLngExpression | LatLngExpression[] | LatLngExpression[][]

      if (layerType === 'marker') {
        const marker = layer as L.Marker
        geometry = marker.getLatLng()
      } else if (layerType === 'polyline') {
        const polyline = layer as L.Polyline
        geometry = polyline.getLatLngs() as LatLngExpression[]
      } else if (layerType === 'polygon') {
        const polygon = layer as L.Polygon
        geometry = polygon.getLatLngs() as LatLngExpression[][]
      } else {
        return
      }

      const feature: DrawFeature = {
        id,
        type: layerType as 'marker' | 'polyline' | 'polygon',
        geometry,
        layer,
      }

      addFeature(feature)
      saveFeaturesToStorage()
      setDrawingMode(null)
    }

    const handleDrawDeleted = (e: L.DrawEvents.Deleted) => {
      const { layers } = e
      layers.eachLayer((layer: L.Layer) => {
        const feature = Array.from(useMapStore.getState().features).find(f => f.layer === layer)
        if (feature) {
          useMapStore.getState().removeFeature(feature.id)
        }
      })
      saveFeaturesToStorage()
    }

    const handleDrawEdited = (e: L.DrawEvents.Edited) => {
      const { layers } = e
      layers.eachLayer((layer: L.Layer) => {
        const feature = Array.from(useMapStore.getState().features).find(f => f.layer === layer)
        if (feature) {
          let geometry: LatLngExpression | LatLngExpression[] | LatLngExpression[][]

          if (feature.type === 'marker') {
            const marker = layer as L.Marker
            geometry = marker.getLatLng()
          } else if (feature.type === 'polyline') {
            const polyline = layer as L.Polygon
            geometry = polyline.getLatLngs() as LatLngExpression[]
          } else if (feature.type === 'polygon') {
            const polygon = layer as L.Polygon
            geometry = polygon.getLatLngs() as LatLngExpression[][]
          } else {
            return
          }

          useMapStore.getState().updateFeature(feature.id, { geometry })
        }
      })
      saveFeaturesToStorage()
    }

    map.on(L.Draw.Event.CREATED, handleDrawCreated)
    map.on(L.Draw.Event.DELETED, handleDrawDeleted)
    map.on(L.Draw.Event.EDITED, handleDrawEdited)

    return () => {
      map.removeControl(drawControl)
      map.off(L.Draw.Event.CREATED, handleDrawCreated)
      map.off(L.Draw.Event.DELETED, handleDrawDeleted)
      map.off(L.Draw.Event.EDITED, handleDrawEdited)
    }
  }, [map, addFeature, setDrawingMode, saveFeaturesToStorage])

  useEffect(() => {
    if (!drawControlRef.current || !map) return

    if (drawingMode === 'marker') {
      const markerDrawer = new L.Draw.Marker(map, {
        icon: DefaultIcon,
      })
      markerDrawer.enable()
    } else if (drawingMode === 'polyline') {
      const polylineDrawer = new L.Draw.Polyline(map, {
        shapeOptions: {
          color: '#3388ff',
          weight: 4,
        },
      })
      polylineDrawer.enable()
    } else if (drawingMode === 'polygon') {
      const polygonDrawer = new L.Draw.Polygon(map, {
        shapeOptions: {
          color: '#3388ff',
          fillColor: '#3388ff',
          fillOpacity: 0.2,
        },
      })
      polygonDrawer.enable()
    }
  }, [drawingMode, map])

  return null
}

export default DrawingManager
