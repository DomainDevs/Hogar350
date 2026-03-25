<template>
  <div class="space-y-4">
    <!-- Selectores -->
    <LocationSelector
      @update:departamento="onDepartamentoUpdate"
      @update:ciudad="onCiudadUpdate"
    />

    <!-- Mapa -->
    <MapSelector
      ref="mapRef"
      :lat="mapLat"
      :lng="mapLng"
      :codigo="mapCodigo"
      @update:coords="onMapCoordsUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LocationSelector from '@/modules/publication/components/LocationSelector.vue'
import MapSelector from '@/modules/publication/components/MapSelector.vue'

const mapRef = ref(null)

// Coordenadas y código que se pasan al mapa
const mapLat = ref(null)
const mapLng = ref(null)
const mapCodigo = ref(null)

// Selección departamento
function onDepartamentoUpdate(dep) {
  // opcional: manejar lógica si se requiere
  // console.log('Departamento seleccionado', dep)
}

// Selección municipio
function onCiudadUpdate(ciudad) {
  mapLat.value = ciudad.lat
  mapLng.value = ciudad.lng
  mapCodigo.value = ciudad.codigo

  // Centrar marcador en el mapa
  mapRef.value?.placeMarker(mapLat.value, mapLng.value)
}

// Cuando el marcador se mueve manualmente
function onMapCoordsUpdate(coords) {
  mapLat.value = coords.lat
  mapLng.value = coords.lng
  mapCodigo.value = coords.codigo
  // Aquí podrías emitir al padre si quieres
  // emit('update:coords', coords)
}
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>