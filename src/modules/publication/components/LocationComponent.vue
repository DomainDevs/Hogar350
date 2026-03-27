<template>
  <div class="space-y-4">
    <!-- Selectores de ubicación -->
    <LocationSelector
      @update:departamento="onDepartamentoUpdate"
      @update:municipio="onMunicipioUpdate"
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

// ------------------------
// Handlers de selección
// ------------------------

// Selección de departamento
function onDepartamentoUpdate(dep) {
  // Mantener lógica original, opcional manejar algo adicional
  // console.log('Departamento seleccionado', dep)
}

// Selección de municipio o localidad (compatibilidad: siempre emite update:municipio)
function onMunicipioUpdate(municipio) {
  if (!municipio) return

  mapLat.value = Number(municipio.lat)
  mapLng.value = Number(municipio.lng)
  mapCodigo.value = municipio.codigo

  // Centrar marcador en el mapa
  mapRef.value?.placeMarker(mapLat.value, mapLng.value)
}

// Movimiento manual del marcador
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