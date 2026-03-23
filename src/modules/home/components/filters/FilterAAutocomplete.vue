<template>
  <div class="relative">

    <!-- CONTENEDOR GENERAL -->
    <div class="flex flex-col md:flex-row items-stretch md:items-start gap-2 w-full">

      <!-- CONTENEDOR INPUT + TAGS -->
      <div
        class="flex flex-wrap items-center border border-[#7c98a7;]
               rounded-md w-full relative gap-2 px-2 py-2
               focus-within:border-orange-500
               transition-colors duration-200"
      >
        <!-- TAGS -->
        <div
          v-for="(item, index) in selectedLocations"
          :key="index"
          class="bg-[#E7EEF0] text-[#000] px-4 flex items-center gap-2 h-10 rounded-md text-[14px] max-w-full"
        >
          {{ item.fullName }}

          <button
            @click="removeTag(index)"
            class="w-5 h-5 bg-[#ff4c00] text-white rounded-full 
                   flex items-center justify-center text-center
                   text-[11px] leading-none
                   hover:bg-[#ff6a2a] transition"
          >
            X
          </button>
        </div>

        <!-- INPUT -->
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          :placeholder="dynamicPlaceholder"
          class="flex-1 min-w-[120px] outline-none text-sm px-2 h-10 rounded-md"
          @input="search"
          @keydown="handleKeyDown"
        />
      </div>

      <!-- BOTÓN BUSCAR -->
      <button
        @click="loadlocation"
        class="w-full md:w-auto h-14 flex items-center justify-center 
               text-white bg-orange-500 hover:bg-[#FF5500] 
               transition-colors duration-300 rounded-md 
               whitespace-nowrap shrink-0 font-bold px-8"
      >
        Buscar
      </button>

    </div>

    <!-- RESULTADOS -->
    <ul v-if="results.length > 0" class="dropdown" role="listbox">
      <li
        v-for="(item, index) in results"
        :key="index"
        @click="selectLocation(item)"
        :class="['dropdown-item', { 'bg-gray-200': index === highlightedIndex }]"
      >
        {{ item.fullName }}
      </li>
    </ul>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Fuse from 'fuse.js'

const emit = defineEmits(['select'])

const query = ref('')
const results = ref([])
const flatLocations = ref([])
const selectedLocations = ref([])
const searchInput = ref(null)

const highlightedIndex = ref(-1)

const dynamicPlaceholder = computed(() => {
  return selectedLocations.value.length === 0
    ? 'Buscar ciudad, localidad, barrio...'
    : ''
})

let fuse

const fetchLocations = async () => {
  const response = await fetch('/data/location-data.json')
  const data = await response.json()
  flattenLocations(data)
  initFuse()
}

function flattenLocations(locationData) {
  const flat = []

  locationData.forEach(depto => {
    depto.municipios.forEach(muni => {
      if (!muni.localidades?.length) {
        flat.push({
          codigoMunicipio: muni.codigo,
          nombreMunicipio: muni.nombre,
          fullName: `${muni.nombre}`
        })
        return
      }

      muni.localidades.forEach(loc => {
        if (!loc.barrios?.length) {
          flat.push({
            codigoLocalidad: loc.codigo,
            nombreLocalidad: loc.nombre,
            fullName: `${loc.nombre}, ${muni.nombre}`
          })
          return
        }

        loc.barrios.forEach(barrio => {
          flat.push({
            codigoBarrio: barrio.codigo,
            nombreBarrio: barrio.nombre,
            fullName: `${barrio.nombre}, ${loc.nombre}, ${muni.nombre}`
          })
        })
      })
    })
  })

  flatLocations.value = flat
}

function initFuse() {
  fuse = new Fuse(flatLocations.value, {
    keys: ['fullName'],
    threshold: 0.3
  })
}

function search() {
  if (query.value.trim().length < 3) {
    results.value = []
    highlightedIndex.value = -1
    return
  }

  const filtered = fuse.search(query.value)
    .map(r => r.item)
    .filter(item =>
      !selectedLocations.value.some(sel => sel.fullName === item.fullName)
    )

  results.value = filtered
  highlightedIndex.value = 0
}

function selectLocation(location) {
  selectedLocations.value.push(location)
  query.value = ''
  results.value = []
  highlightedIndex.value = -1
  searchInput.value?.focus()
  emit('select', selectedLocations.value)
}

function removeTag(index) {
  selectedLocations.value.splice(index, 1)
  emit('select', selectedLocations.value)
  searchInput.value?.focus()
}

function handleKeyDown(event) {
  if (event.key === 'Backspace' && query.value === '') {
    selectedLocations.value.pop()
    emit('select', selectedLocations.value)
    searchInput.value?.focus()
    return
  }

  if (results.value.length === 0) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    highlightedIndex.value =
      (highlightedIndex.value + 1) % results.value.length

  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    highlightedIndex.value =
      (highlightedIndex.value - 1 + results.value.length) %
      results.value.length

  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (
      highlightedIndex.value >= 0 &&
      highlightedIndex.value < results.value.length
    ) {
      selectLocation(results.value[highlightedIndex.value])
    }
  }
}

function loadlocation() {
  console.log("Buscar con:", selectedLocations.value)
}

onMounted(fetchLocations)
</script>

<style scoped>
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 9999;
  border: 1px solid #ddd;
  max-height: 230px;
  overflow-y: auto;
  margin-top: 6px;
  padding: 0;
  list-style: none;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item.bg-gray-200 {
  background-color: #e2e8f0;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}
</style>
