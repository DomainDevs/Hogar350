<template>
  <div class="relative">
    <!-- Botón ubicación actual con tooltip y animación hover -->
    <button
      class="absolute z-10 top-2 right-2 bg-white shadow rounded px-3 py-1 text-sm hover:bg-gray-100 hover:scale-105 transition-transform duration-200 tooltip"
      @click="useMyLocation"
    >
      📍 Mi ubicación
      <span class="tooltip-text">Ir a mi ubicación</span>
    </button>

    <!-- Mapa -->
    <div id="map" class="map"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, defineExpose, h, render } from 'vue'
import { MapPin } from 'lucide-vue-next'
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const props = defineProps({
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  codigo: String
})

const emit = defineEmits(['update:coords'])
const map = ref(null)
const marker = ref(null)
const currentZoom = ref(13)

// Crear iconos livianos con Lucide
function createLucideIcon(icon, props = {}) {
  const container = document.createElement('div')
  const vnode = h(icon, props)
  render(vnode, container)
  return container.innerHTML
}

// Icono personalizado del marcador
const customIcon = L.divIcon({
  className: '',
  html: `
    <svg width="64" height="64" viewBox="0 0 64 64" class="marker-svg">
      <circle cx="32" cy="32" r="20" fill="white" fill-opacity="0.9" />
      <foreignObject x="16" y="16" width="32" height="32">
        ${createLucideIcon(MapPin, { size: 33, color: '#FA2B06' })}
      </foreignObject>
    </svg>
  `,
  iconSize: [64, 64],
  iconAnchor: [30, 64]
})

function emitCoords(lat, lng) {
  emit("update:coords", { lat, lng, codigo: props.codigo })
}

// Coloca marcador con animación
function placeMarker(lat, lng, fromUser = false) {
  if (!map.value) return
  if (marker.value) {
    marker.value.setLatLng([lat, lng], { animate: true, duration: 0.5 })
  } else {
    marker.value = L.marker([lat, lng], { draggable: true, icon: customIcon }).addTo(map.value)
    marker.value.on("dragend", e => {
      const pos = e.target.getLatLng()
      emitCoords(pos.lat, pos.lng)
    })
    marker.value.getElement().style.cursor = 'grab'
  }
  map.value.setView([lat, lng], currentZoom.value, { animate: true, duration: 0.5 })
  if (fromUser) emitCoords(lat, lng)
}

function onMapClick(e) {
  const { lat, lng } = e.latlng
  placeMarker(lat, lng, true)
}

function useMyLocation() {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords
    placeMarker(latitude, longitude, true)
  })
}

onMounted(async () => {
  await nextTick() // asegurar que div exista

  const initLat = props.lat ?? 4.7110
  const initLng = props.lng ?? -74.0721

  map.value = L.map("map", { zoomControl: true }).setView([initLat, initLng], currentZoom.value)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map.value)

  map.value.on("zoomend", () => currentZoom.value = map.value.getZoom())
  map.value.on("click", onMapClick)

  if (props.lat != null && props.lng != null) placeMarker(props.lat, props.lng, true)
  else placeMarker(initLat, initLng, false)
})

watch(
  () => [props.lat, props.lng],
  ([lat, lng], [oldLat, oldLng]) => {
    if (lat != null && lng != null && (lat !== oldLat || lng !== oldLng)) {
      placeMarker(lat, lng, false)
    }
  }
)

onUnmounted(() => { map.value?.off(); map.value?.remove() })
defineExpose({ placeMarker })
</script>

<style scoped>
.map {
  height: 400px;
  width: 100%;
  border-radius: 10px;
  min-height: 300px;
}

/* Animación suave del SVG del marcador */
.marker-svg {
  transition: transform 0.3s ease;
}
.marker-svg:hover {
  transform: scale(1.1);
}

/* Tooltip botón ubicación */
.tooltip {
  position: absolute; /* antes era relative, ahora absoluto dentro del contenedor */
  top: 10px;          /* separación superior */
  right: 10px;        /* separación derecha */
  z-index: 10000;     /* siempre sobre el mapa */
}

.tooltip-text {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 3px 6px;
  position: absolute;
  top: -30px;
  right: 50%;
  transform: translateX(50%);
  font-size: 12px;
  white-space: nowrap;
  z-index: 10001;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Hover del botón ubicación */
button {
  position: absolute;      /* sobre el mapa */
  top: 10px;               /* separación desde el top */
  right: 10px;             /* separación desde la derecha */
  z-index: 10000;          /* siempre encima del mapa */
  background-color: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0,0,0,0.15);
}
</style>