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

function onLocalidadUpdate(localidad) {
  if (!localidad) return

  coords.value = {
    lat: Number(localidad.lat),
    lng: Number(localidad.lng),
    codigo: localidad.codigo ?? coords.value.codigo
  }

  // 🔥 mover marcador en el mapa
  mapRef.value?.placeMarker(coords.value.lat, coords.value.lng)

  emit('update:localidad', localidad)
  emit('update:coords', coords.value)

  // 🔥 guardar en localStorage
  localStorage.setItem('localidad', JSON.stringify(localidad))
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
      @update:localidad="onLocalidadUpdate"
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