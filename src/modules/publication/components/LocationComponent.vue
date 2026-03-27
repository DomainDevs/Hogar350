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

// 🔥 UNA sola fuente de verdad
const coords = ref({
  lat: null,
  lng: null,
  codigo: null
})

// ------------------------
// SELECTOR
// ------------------------

function onDepartamentoUpdate(dep) {
  emit('update:departamento', dep)

  // 🔥 limpiar estado dependiente
  coords.value = { lat: null, lng: null, codigo: null }
}

function onMunicipioUpdate(municipio) {
  if (!municipio) return

  coords.value = {
    lat: Number(municipio.lat),
    lng: Number(municipio.lng),
    codigo: municipio.codigo
  }

  // 🔥 mantener mapa funcionando
  mapRef.value?.placeMarker(coords.value.lat, coords.value.lng)

  emit('update:municipio', municipio)
  emit('update:coords', coords.value)
}

// ------------------------
// MAPA
// ------------------------

function onMapCoordsUpdate(newCoords) {
  coords.value = newCoords

  emit('update:coords', coords.value)
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
      :lat="coords.lat"
      :lng="coords.lng"
      :codigo="coords.codigo"
      @update:coords="onMapCoordsUpdate"
    />
  </div>
</template>