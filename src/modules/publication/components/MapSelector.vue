<template>
  <div class="relative">
    <!-- Botón ubicación actual -->
    <button
      class="absolute z-10 top-2 right-2 bg-white shadow rounded px-2 py-1 text-sm hover:bg-gray-100"
      @click="useMyLocation">
      Mi ubicación
    </button>

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

// Función para crear iconos livianos
function createLucideIcon(icon, props = {}) {
  const container = document.createElement('div')
  const vnode = h(icon, props)
  render(vnode, container)
  return container.innerHTML
}

// Icono del marcador
const customIcon = L.divIcon({
  className: '',
  html: `
    <svg width="64" height="64" viewBox="0 0 64 64">
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

function placeMarker(lat, lng, fromUser = false) {
  if (!map.value) return
  if (marker.value) marker.value.setLatLng([lat, lng])
  else {
    marker.value = L.marker([lat, lng], { draggable: true, icon: customIcon }).addTo(map.value)
    marker.value.on("dragend", e => {
      const pos = e.target.getLatLng()
      emitCoords(pos.lat, pos.lng)
    })
  }
  map.value.setView([lat, lng], currentZoom.value)
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
  await nextTick() // Asegura que el div exista

  // Bogotá como ubicación inicial si props lat/lng no existen
  const initLat = props.lat ?? 4.7110
  const initLng = props.lng ?? -74.0721

  map.value = L.map("map").setView([initLat, initLng], currentZoom.value)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map.value)

  map.value.on("zoomend", () => currentZoom.value = map.value.getZoom())
  map.value.on("click", onMapClick)

  // Si props tienen valor, coloca marcador
  if (props.lat != null && props.lng != null) placeMarker(props.lat, props.lng, true)
  else placeMarker(initLat, initLng, false)
})

// Watch seguro
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
}
</style>