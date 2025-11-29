import { create } from 'zustand'
import { LatLngExpression } from 'leaflet'

export interface DrawFeature {
  id: string
  type: 'marker' | 'polyline' | 'polygon'
  geometry: LatLngExpression | LatLngExpression[] | LatLngExpression[][]
  properties?: Record<string, unknown>
  layer?: L.Layer
}

interface MapState {
  center: LatLngExpression
  zoom: number
  features: DrawFeature[]
  wmsLayerVisible: boolean
  drawingMode: 'none' | 'marker' | 'polyline' | 'polygon' | null
  selectedFeature: string | null

  // Actions
  setCenter: (center: LatLngExpression) => void
  setZoom: (zoom: number) => void
  addFeature: (feature: DrawFeature) => void
  removeFeature: (id: string) => void
  updateFeature: (id: string, updates: Partial<DrawFeature>) => void
  setWmsLayerVisible: (visible: boolean) => void
  setDrawingMode: (mode: 'none' | 'marker' | 'polyline' | 'polygon' | null) => void
  setSelectedFeature: (id: string | null) => void
  clearAllFeatures: () => void
  loadFeaturesFromStorage: () => void
  saveFeaturesToStorage: () => void
}

const STORAGE_KEY = 'aoi-map-features'

export const useMapStore = create<MapState>((set, get) => ({
  center: [51.505, 7.45] as LatLngExpression, // Default to NRW region
  zoom: 13,
  features: [],
  wmsLayerVisible: true,
  drawingMode: null,
  selectedFeature: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),

  addFeature: (feature) =>
    set((state) => {
      const newFeatures = [...state.features, feature]
      return { features: newFeatures }
    }),

  removeFeature: (id) =>
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
      selectedFeature: state.selectedFeature === id ? null : state.selectedFeature,
    })),

  updateFeature: (id, updates) =>
    set((state) => ({
      features: state.features.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  setWmsLayerVisible: (visible) => set({ wmsLayerVisible: visible }),
  setDrawingMode: (mode) => set({ drawingMode: mode }),
  setSelectedFeature: (id) => set({ selectedFeature: id }),
  clearAllFeatures: () => set({ features: [], selectedFeature: null }),

  loadFeaturesFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const features = JSON.parse(stored) as DrawFeature[]
        set({ features })
      }
    } catch (error) {
      console.error('Failed to load features from storage:', error)
    }
  },

  saveFeaturesToStorage: () => {
    try {
      const { features } = get()
      // Remove layer references before storing
      const featuresToStore = features.map(({ layer, ...rest }) => rest)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(featuresToStore))
    } catch (error) {
      console.error('Failed to save features to storage:', error)
    }
  },
}))

