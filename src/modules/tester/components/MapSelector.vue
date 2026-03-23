<template>
  <div class="relative">
    <!-- Botón ubicación actual -->
    <button
      class="absolute z-10 top-2 right-2 bg-white shadow rounded px-2 py-1 text-sm hover:bg-gray-100"
      @click="useMyLocation"
    >
      📍 Mi ubicación
    </button>

    <div id="map" class="map"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, defineExpose, h, render } from 'vue'
import { MapPin } from 'lucide-vue-next'
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const props = defineProps({ 
  lat: Number, 
  lng: Number, 
  codigo: String,
  address: String
})

const emit = defineEmits(['update:coords', 'update:address'])

const map = ref(null)
const marker = ref(null)
const currentZoom = ref(13)

// Icono personalizado (liviano)
function createLucideIcon(icon, props = {}) {
  const container = document.createElement('div')
  const vnode = h(icon, props)
  render(vnode, container)
  return container.innerHTML
}


const customIcon = L.divIcon({
  className: '',
  html: `
    <svg width="64" height="64" viewBox="0 0 64 64">
      <!-- Halo exterior naranja -->
      <!--<circle cx="32" cy="32" r="30" fill="rgba(200,5,0,0.2)" />-->
      <!--<circle cx="32" cy="32" r="25" fill="rgba(255,5,0,0.30)" />-->
      
      <!-- Borde blanco que resalta -->
      <circle cx="32" cy="32" r="20" fill="white" fill-opacity="0.9" />

      <!-- Tu MapPin centrado -->
      <foreignObject x="16" y="16" width="32" height="32">
        ${createLucideIcon(MapPin, { size: 33, color: '#FA2B06' })}
      </foreignObject>
    </svg>
  `,
  iconSize: [64, 64],
  iconAnchor: [30, 64] // punta del pin
})



function emitCoords(lat, lng) {
  emit("update:coords", {
    lat,
    lng,
    codigo: props.codigo,
    address: props.address
  })
}

function placeMarker(lat, lng, fromUser = false) {
  if (!map.value) return

  if (marker.value) {
    marker.value.setLatLng([lat, lng])
  } else {
    marker.value = L.marker([lat, lng], {
      draggable: true,
      icon: customIcon
    }).addTo(map.value)

    marker.value.on("dragend", (e) => {
      const pos = e.target.getLatLng()
      emitCoords(pos.lat, pos.lng)
    })
  }

  map.value.setView([lat, lng], currentZoom.value)

  // Solo emitir si viene del usuario o inicialización
  if (fromUser) {
    emitCoords(lat, lng)
  }
}

// Click en mapa
function onMapClick(e) {
  const { lat, lng } = e.latlng
  placeMarker(lat, lng, true)
}

// Ubicación del usuario
function useMyLocation() {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords
    placeMarker(latitude, longitude, true)
  })
}

onMounted(() => {
  map.value = L.map("map").setView(
    [
      props.lat ?? 4.6,
      props.lng ?? -74.08
    ],
    currentZoom.value
  )

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map.value)

  map.value.on("zoomend", () => {
    currentZoom.value = map.value.getZoom()
  })

  map.value.on("click", onMapClick)

  if (props.lat != null && props.lng != null) {
    placeMarker(props.lat, props.lng, true)
  }
})

// Watch externo limpio
watch(() => [props.lat, props.lng], ([lat, lng], [oldLat, oldLng]) => {
  if (lat != null && lng != null && (lat !== oldLat || lng !== oldLng)) {
    placeMarker(lat, lng, false)
  }
})

// Limpieza (MUY importante)
onUnmounted(() => {
  map.value?.off()
  map.value?.remove()
})

defineExpose({ placeMarker })
</script>

<style scoped>
.map {
  height: 400px;
  width: 100%;
  border-radius: 10px;
}

</style>