<template>
  <div class="relative">
    <input 
      type="text" 
      v-model="query" 
      @input="searchAddress" 
      placeholder="Escriba la calle y número"
      class="border px-2 py-1 w-full rounded"
    />
    <ul v-if="results.length" class="suggestions absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
      <li 
        v-for="r in results" 
        :key="r.place_id" 
        @click="selectAddress(r)"
        class="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        {{ r.display_name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  departamento: String,
  ciudad: String,
  localidad: String
})
const emit = defineEmits(['update:coords', 'update:address'])

const query = ref('')
const results = ref([])
let controller = null

async function searchAddress() {
  if (!query.value) {
    results.value = []
    return
  }

  // Cancelar petición anterior si existe
  controller?.abort()
  controller = new AbortController()

  // Concatenar dirección completa con ciudad/localidad
  const fullQuery = `${query.value}, ${props.localidad}, ${props.ciudad}, ${props.departamento}`
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&limit=5`

  try {
    const res = await fetch(url, { signal: controller.signal })
    const data = await res.json()
    results.value = data
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err)
  }
}

function selectAddress(addr) {
  query.value = addr.display_name
  results.value = []
  emit('update:address', addr.display_name)
  emit('update:coords', { lat: parseFloat(addr.lat), lng: parseFloat(addr.lon) })
}
</script>

<style scoped>
.suggestions {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
