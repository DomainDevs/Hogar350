<script setup>
import { ref, watch } from 'vue'
import LocationSelector from './LocationSelector.vue'
import MapSelector from './MapSelector.vue'

// Props del formulario principal
const props = defineProps({
  municipio: Object,       // Municipio completo
  coords: {
    type: Object,
    default: () => ({ lat: null, lng: null, codigo: null, municipio: '', departamento: '' })
  }
})

// Emits hacia el formulario principal
const emit = defineEmits([
  'update:municipio',
  'update:coords'
])

const mapRef = ref(null)

// Estado local sincronizado con props
const localCoords = ref({ ...props.coords })

// Observar si el padre cambia coords (ej. sessionStorage)
watch(
  () => props.coords,
  (newVal) => {
    localCoords.value = { ...newVal }
  },
  { deep: true }
)

// Cuando LocationSelector emite un municipio
function onMunicipioUpdate(municipio) {
  if (!municipio) return

  // Actualizamos coords locales
  localCoords.value = {
    lat: Number(municipio.lat),
    lng: Number(municipio.lng),
    codigo: municipio.codigoDane,      // Código oficial
    municipio: municipio.municipio,    // Nombre completo
    departamento: municipio.departamento
  }

  // Movemos el marcador en el mapa
  mapRef.value?.placeMarker(localCoords.value.lat, localCoords.value.lng)

  // Emitimos al padre
  emit('update:municipio', municipio)
  emit('update:coords', localCoords.value)

  // Guardar en localStorage si quieres persistir la selección
  localStorage.setItem('selectedLocation', JSON.stringify(localCoords.value))
}

// Cuando el mapa emite nuevas coords (usuario mueve el pin)
function onMapUpdate(newCoords) {
  localCoords.value = newCoords
  emit('update:coords', newCoords)

  // Actualizar localStorage también
  localStorage.setItem('selectedLocation', JSON.stringify(localCoords.value))
}
</script>

<template>
  <div class="space-y-4">
    <!-- Selector de municipio -->
    <LocationSelector
      :municipio="municipio"
      @update:municipio="onMunicipioUpdate"
    />

    <!-- Mapa -->
    <MapSelector
      ref="mapRef"
      :lat="localCoords.lat"
      :lng="localCoords.lng"
      :codigo="localCoords.codigo"
      @update:coords="onMapUpdate"
    />
  </div>
</template>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>