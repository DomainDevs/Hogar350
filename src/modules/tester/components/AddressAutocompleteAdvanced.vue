<template>
  <div class="relative">
    <input 
      type="text" 
      v-model="query" 
      @input="onInput" 
      placeholder="Escriba la calle y número"
      class="border px-2 py-1 w-full rounded"
    />
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

const todasLocalidades = ref([])

onMounted(async () => {
  try {
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
  departamento: String,
  ciudad: String,
  localidad: String,
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
  if (!query.value || !props.ciudad) {
    results.value = []
    return
  }

  // Filtrar únicamente por ciudad y nombre
  const matches = todasLocalidades.value.filter(
    l =>
      l.ciudad?.toLowerCase() === props.ciudad?.toLowerCase() &&
      l.nombre.toLowerCase().includes(query.value.toLowerCase())
  )

  // Mapear usando los campos reales del JSON
  results.value = matches.map(l => ({
    display_name: `${l.nombre}, ${l.ciudad}, ${props.pais}`,
    lat: l.lat,
    lon: l.lng,
    codigo: l.id // ⚡ aquí usamos el id de tu JSON
  }))
}

function selectAddress(addr) {
  query.value = addr.display_name
  results.value = []
  emit('update:address', addr.display_name)

  const coordsObj = { lat: parseFloat(addr.lat), lng: parseFloat(addr.lon), codigo: addr.codigo }
  emit('update:coords', coordsObj)

  if (props.mapRef?.value) {
    props.mapRef.value.placeMarker(coordsObj.lat, coordsObj.lng, coordsObj.codigo)
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
