<template>
  <div id="map" style="height: 400px; width: 100%;"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  lat: Number,
  lng: Number
})
const emit = defineEmits(['update:coords'])

const map = ref(null)
const marker = ref(null)

onMounted(() => {
  map.value = L.map("map").setView([props.lat || 4.6, props.lng || -74.08], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map.value);

  // Click para seleccionar coordenadas
  map.value.on("click", (e) => {
    const { lat, lng } = e.latlng;
    placeMarker(lat, lng)
    emit("update:coords", { lat, lng })
  });

  // Si ya hay coords iniciales, colocar marcador
  if (props.lat && props.lng) {
    placeMarker(props.lat, props.lng)
  }
});

// Función para colocar o mover marcador
function placeMarker(lat, lng) {
  if (marker.value) {
    marker.value.setLatLng([lat, lng])
  } else {
    marker.value = L.marker([lat, lng], { draggable: true }).addTo(map.value)
    marker.value.on("dragend", (e) => {
      const pos = e.target.getLatLng()
      emit("update:coords", { lat: pos.lat, lng: pos.lng })
    })
  }
  map.value.setView([lat, lng])
}

// Escuchar cambios en props para mover marcador desde inputs
watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (newLat && newLng) placeMarker(newLat, newLng)
})
</script>

<style scoped>
#map { border-radius: 10px; }
</style>
