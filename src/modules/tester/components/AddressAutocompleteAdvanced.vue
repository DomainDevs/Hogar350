<template>
  <div class="relative">

    <!-- Selector de departamento/ciudad -->
    <DepartmentCitySelector
      @update:departamento="d => form.departamento = d"
      @update:ciudad="onCiudadSelected"
    />

    <!-- Input de dirección -->
    <input 
      type="text" 
      v-model="query" 
      @input="onInput" 
      placeholder="Escriba la calle y número"
      class="border px-2 py-1 w-full rounded mt-2"
    />
    
    <!-- Resultados de búsqueda -->
    <ul v-if="results.length" class="suggestions absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
      <li 
        v-for="(r, idx) in results" 
        :key="idx" 
        @click="selectAddress(r)"
        class="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        {{ r.display_name }}
      </li>
    </ul>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DepartmentCitySelector from '@/modules/tester/components/LocationSelector.vue'

const todasLocalidades = ref([])
const form = ref({ departamento: null, ciudad: null })

onMounted(async () => {
  try {
    // Cargar todas las localidades (con lat/lng)
    const res = await fetch('/data/localidades.json')
    todasLocalidades.value = await res.json()
    console.log("Localidades cargadas:", todasLocalidades.value)
  } catch (err) {
    console.error('Error al cargar localidades', err)
    todasLocalidades.value = []
  }
})

const props = defineProps({
  pais: { type: String, default: 'Colombia' },
  mapRef: Object
})

const emit = defineEmits(['update:coords', 'update:address'])

const query = ref('')
const results = ref([])
let timeout = null

function onInput() {
  clearTimeout(timeout)
  timeout = setTimeout(() => searchLocal(), 300)
}

function searchLocal() {
  if (!query.value || !form.value.ciudad) {
    results.value = []
    return
  }

  // Buscar en todasLocalidades solo por ciudad y coincidencia en el nombre
  const matches = todasLocalidades.value.filter(
    l =>
      l.ciudad?.toLowerCase() === form.value.ciudad.nombre?.toLowerCase() &&
      l.nombre.toLowerCase().includes(query.value.toLowerCase())
  )

  results.value = matches.map(l => ({
    display_name: `${l.nombre}, ${l.ciudad}, ${props.pais}`,
    lat: l.lat,
    lon: l.lng,
    codigo: l.id
  }))
}

function selectAddress(addr) {
  query.value = addr.display_name
  results.value = []
  emit('update:address', addr.display_name)

  const coordsObj = { lat: parseFloat(addr.lat), lng: parseFloat(addr.lon), codigo: addr.codigo }
  emit('update:coords', coordsObj)

  // Mover marcador en el mapa
  if (props.mapRef?.value) {
    props.mapRef.value.placeMarker(coordsObj.lat, coordsObj.lng, coordsObj.codigo)
  }
}

// Al seleccionar ciudad desde DepartmentCitySelector
function onCiudadSelected(ciudad) {
  form.value.ciudad = ciudad
  emit('update:ciudad', ciudad)

  if (ciudad?.lat != null && ciudad?.lng != null && props.mapRef?.value) {
    props.mapRef.value.placeMarker(ciudad.lat, ciudad.lng, ciudad.id)
  }
}
</script>

<style scoped>
.suggestions {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  z-index: 1400;
}
</style>