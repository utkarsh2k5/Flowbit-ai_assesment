/// <reference types="vite/client" />

declare module 'leaflet' {
  import * as L from 'leaflet'
  export = L
  export as namespace L
}

declare module 'leaflet-draw' {
  import * as L from 'leaflet'
  export = L
  export as namespace L
}

