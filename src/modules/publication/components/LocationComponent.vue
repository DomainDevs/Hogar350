<script setup>
import { ref } from 'vue'
import LocationSelector from './LocationSelector.vue'
import MapSelector from './MapSelector.vue'

const emit = defineEmits([
  'update:departamento',
  'update:municipio',
  'update:localidad',
  'update:direccion',
  'update:coords'
])

const mapRef = ref(null)
const mapLat = ref(null)
const mapLng = ref(null)
const mapCodigo = ref(null)

// ------------------------
// SELECTOR
// ------------------------

function onDepartamentoUpdate(dep) {
  emit('update:departamento', dep)
}

function onMunicipioUpdate(municipio) {
  if (!municipio) return

  mapLat.value = Number(municipio.lat)
  mapLng.value = Number(municipio.lng)
  mapCodigo.value = municipio.codigo

  // 🔥 ESTO ES LO QUE NO PUEDES PERDER
  mapRef.value?.placeMarker(mapLat.value, mapLng.value)

  emit('update:municipio', municipio)
  emit('update:coords', {
    lat: mapLat.value,
    lng: mapLng.value,
    codigo: mapCodigo.value
  })
}

// ------------------------
// MAPA
// ------------------------

function onMapCoordsUpdate(coords) {
  mapLat.value = coords.lat
  mapLng.value = coords.lng
  mapCodigo.value = coords.codigo

  emit('update:coords', coords)
}
</script>

<template>
  <div class="space-y-4">
    <LocationSelector
      @update:departamento="onDepartamentoUpdate"
      @update:municipio="onMunicipioUpdate"
    />

    <MapSelector
      ref="mapRef"
      :lat="mapLat"
      :lng="mapLng"
      :codigo="mapCodigo"
      @update:coords="onMapCoordsUpdate"
    />
  </div>
</template>