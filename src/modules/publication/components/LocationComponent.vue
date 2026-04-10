<template>
  <div class="container">
    <!-- Ciudad / Municipio -->
    <div class="field-container">
      <label class="label-style">Ciudad / Municipio <span class="required">*</span></label>
      <div class="input-wrapper">
        <input
          type="text"
          v-model="search"
          @focus="showDropdown = true"
          @blur="hideDropdown"
          @input="filterMunicipios"
          class="input-style"
          placeholder="Registra o escribe tu ciudad/municipio"
          autocomplete="off"
        />
        <span class="dropdown-arrow" @mousedown.prevent="clearAndOpen">▼</span>

        <ul v-show="showDropdown && filtered.length" class="dropdown-list">
          <li v-for="item in filtered" :key="item.municipioId" @mousedown.prevent="selectMunicipio(item)" class="dropdown-item">
            {{ item.municipio }} ({{ item.departamento }})
          </li>
        </ul>
      </div>
    </div>
    <!-- Dirección exacta -->
    <div class="field-container">
      <label class="label-style">Dirección exacta <span class="required">*</span></label>
      <div class="input-wrapper">
        <input
          type="text"
          v-model="direccion"
          @keydown.enter.prevent="buscarDireccion"
          class="input-style input-with-button"
          placeholder="Ej: Calle 123 # 45-67"
        />
        <button 
        class="search-button" 
        @click="buscarDireccion" 
        title="Buscar dirección"  
        :disabled="!canSearch"
        :class="{ 'disabled-btn': !canSearch }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" viewBox="0 0 24 24" fill="white" width="16" height="16">
            <path d="M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"/>
          </svg>
          Buscar
        </button>
        <ul v-if="showResults" class="dropdown-list results-list">
          <li v-for="(item, i) in results" :key="i" @click="applyResult(item)" class="dropdown-item">
            {{ item.display_name }}
          </li>
        </ul>
      </div>
        <div>
        <p v-if="loading" class="text-gray-500 text-sm mt-1">
          🔄 Buscando dirección...
        </p>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
          ❌ {{ errorMessage }}
        </p>
        <p v-if="noResults" class="text-yellow-600 text-sm mt-1">
          ⚠️ No se encontraron resultados
        </p>
        </div>
    </div>

    <!-- Mapa -->
    <MapSelector 
      ref="mapRef" 
      :lat="localCoords.lat" 
      :lng="localCoords.lng" 
      :codigo="localCoords.codigo" 
      @update:coords="onMapUpdate" 
    />

    <!-- Ver en Google -->
    <div class="google-link-container" v-if="localCoords.lat && localCoords.lng">
      <a :href="`https://www.google.com/maps/search/?api=1&query=${localCoords.lat},${localCoords.lng}`" target="_blank" class="google-link-button">
        <MapPin class="w-5 h-5" /> Ver en Google Maps
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MapSelector from './MapSelector.vue'
import { MapPin } from 'lucide-vue-next'

// ---------------- PROPS Y EMITS ----------------
const props = defineProps({
  municipio: Object,
  coords: { 
    type: Object, 
    default: () => ({ 
      lat: null, 
      lng: null, 
      codigo: null, 
      municipio: '',
      localidad: null,
      place_id: null
    }) 
  },
  direccion: { type: String, default: '' }
})

const emit = defineEmits([
  'update:municipio', 
  'update:coords', 
  'update:direccion',
  'update:codigo',
  'update:localidad',
  'update:place_id'
])

// ---------------- ESTADOS ----------------
const mapRef = ref(null)
const search = ref('')
const direccion = ref(props.direccion || '')
const showDropdown = ref(false)
const municipios = ref([])
const filtered = ref([])
const results = ref([])
const showResults = ref(false)
const MAX_RESULTS = 20


const loading = ref(false)
const errorMessage = ref('')
const noResults = ref(false)

const localCoords = ref({ 
  ...props.coords,
  codigo: props.coords?.codigo || null,
  place_id: props.coords?.place_id || null
})

// ---------------- HELPERS ----------------
const getLocalidadNombre = (displayName) => {
  return displayName?.match(/Localidad\s+([^,]+)/i)?.[1] || null
}

const canSearch = computed(() => {
  return direccion.value && direccion.value.trim().length >= 8
})

// ---------------- CICLO DE VIDA ----------------
onMounted(async () => {
  try {
    municipios.value = await (await fetch('/data/location.json')).json()
  } catch (err) { console.error(err) }

  filtered.value = municipios.value.slice(0, MAX_RESULTS)

  if (props.municipio) initializeMunicipio(props.municipio)

  const saved = localStorage.getItem('selectedLocation')
  if (saved) {
    const obj = JSON.parse(saved)

    if (obj.direccion) direccion.value = obj.direccion

    if (obj.lat && obj.lng) {
      localCoords.value = {
        lat: Number(obj.lat),
        lng: Number(obj.lng),
        codigo: obj.codigo || null,
        municipio: obj.municipio || '',
        localidad: obj.localidad || null,
        place_id: obj.place_id || null
      }

      mapRef.value?.placeMarker(localCoords.value.lat, localCoords.value.lng)
    }
  }
})

// ---------------- MUNICIPIOS ----------------
const initializeMunicipio = (item) => {
  search.value = item.municipio
  localCoords.value = {
    lat: Number(item.lat || 0),
    lng: Number(item.lng || 0),
    codigo: item.codigoDane || null,
    municipio: item.municipio,
    place_id: null
  }
  mapRef.value?.placeMarker(localCoords.value.lat, localCoords.value.lng)
}

const filterMunicipios = () => {
  const q = search.value.toLowerCase().trim()
  filtered.value = (!q 
    ? municipios.value 
    : municipios.value.filter(m => m.municipio.toLowerCase().includes(q))
  ).slice(0, MAX_RESULTS)

  showDropdown.value = true
}

const selectMunicipio = item => {
  search.value = item.municipio
  showDropdown.value = false

  localCoords.value = {
    lat: Number(item.lat),
    lng: Number(item.lng),
    codigo: item.codigoDane,
    municipio: item.municipio,
    departamento: item.departamento,
    localidad: null,
    place_id: null
  }

  const selected = {
    id: item.municipioId,
    municipio: item.municipio,
    departamentoId: item.departamentoId,
    departamento: item.departamento,
    lat: Number(item.lat),
    lng: Number(item.lng),
    codigo: item.codigoDane,
    localidad: null
  }

  emit('update:municipio', selected)
  emit('update:coords', localCoords.value)
  emit('update:direccion', direccion.value)
  emit('update:codigo', localCoords.value.codigo)
  emit('update:localidad', localCoords.value.localidad)
  emit('update:place_id', localCoords.value.place_id)

  mapRef.value?.placeMarker(localCoords.value.lat, localCoords.value.lng)

  localStorage.setItem('selectedLocation', JSON.stringify({
    ...localCoords.value,
    direccion: direccion.value
  }))
}

// ---------------- BUSCAR DIRECCIÓN (FIX SEGURO) ----------------
const buscarDireccion = async () => {
  const direccionRaw = direccion.value?.trim()
  const municipioRaw = search.value?.trim()

  if (!direccionRaw || !municipioRaw) return

  loading.value = true
  errorMessage.value = ''
  noResults.value = false
  showResults.value = false

  const ciudad = (localCoords.value.municipio || municipioRaw)
    .replace(/\s*\(.*\)$/, '')

  const direccionNormalizada = normalizarDireccion(direccionRaw)

  const API_URL = 'https://localhost:7109/api/Geocoding'

  try {
    direccion.value = direccionNormalizada

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pais: 'Colombia',
        municipio: ciudad,
        direccion: direccionNormalizada
      })
    })

    if (!res.ok) {
      errorMessage.value = `Error del servidor (${res.status})`
      return
    }

    const data = await res.json()

    if (!Array.isArray(data) || data.length === 0) {
      noResults.value = true
      results.value = []
      return
    }

    results.value = data
      .filter(x => x?.latitude && x?.longitude)
      .map(x => ({
        lat: Number(x.latitude),
        lon: Number(x.longitude),
        display_name: x.displayName || '',
        place_id: x.placeId || null
      }))

    showResults.value = results.value.length > 1

    if (results.value.length === 1) {
      applyResult(results.value[0])
    }

  } catch (err) {
    console.error('Error buscando dirección:', err)
    errorMessage.value = 'No se pudo conectar con el servicio'
  } finally {
    loading.value = false
  }
}

// ---------------- RESULTADOS ----------------
const applyResult = item => {
  localCoords.value.lat = Number(item.lat)
  localCoords.value.lng = Number(item.lon)
  localCoords.value.localidad = getLocalidadNombre(item.display_name)
  localCoords.value.place_id = item.place_id

  mapRef.value?.placeMarker(localCoords.value.lat, localCoords.value.lng)

  emit('update:coords', localCoords.value)
  emit('update:direccion', direccion.value)
  emit('update:localidad', localCoords.value.localidad)
  emit('update:place_id', localCoords.value.place_id)

  showResults.value = false

  localStorage.setItem('selectedLocation', JSON.stringify({
    ...localCoords.value,
    direccion: direccion.value
  }))
}

// ---------------- MAPA ----------------
const onMapUpdate = coords => {
  localCoords.value = {
    ...coords,
    codigo: localCoords.value.codigo,
    localidad: localCoords.value.localidad,
    place_id: localCoords.value.place_id
  }

  emit('update:coords', localCoords.value)
  emit('update:codigo', localCoords.value.codigo)
  emit('update:localidad', localCoords.value.localidad)
  emit('update:place_id', localCoords.value.place_id)

  localStorage.setItem('selectedLocation', JSON.stringify({
    ...localCoords.value,
    direccion: direccion.value
  }))
}

// ---------------- UTILES ----------------
const clearAndOpen = () => {
  search.value = ''
  filtered.value = municipios.value.slice(0, MAX_RESULTS)
  showDropdown.value = true
}

const normalizarDireccion = input => {
  if (!input) return ''
  let dir = input.toLowerCase()
    .replace(/[<>"'`;(){}[\]\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  dir = dir.replace(/\s*#\s*/g, ' # ')
  dir = dir.replace(/\s*-\s*/g, ' - ')

  const r = { calle:'cl', carrera:'kr', avenida:'av', transversal:'tv', diagonal:'dg' }

  Object.keys(r).forEach(k => {
    dir = dir.replace(new RegExp(`\\b${k}\\b`, 'gi'), r[k])
  })

  return dir.toUpperCase()
}

const hideDropdown = () => {
  setTimeout(() => showDropdown.value = false, 150)
}
</script>

<style scoped>
.container { display: flex; flex-direction: column; gap: 1rem; }
.label-style { display: block; font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #374151; }
.required { color: #ff5500; }
.input-style { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d5db; outline: none; transition: all 0.2s; background-color: #fff; }
.input-style:focus { border-color: #ff5500; box-shadow: 0 0 0 2px rgba(255,85,0,0.2); }
.input-wrapper { position: relative; }
.dropdown-arrow { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; }
.dropdown-list { position: absolute; top: 100%; left: 0; width: 100%; max-height: 240px; overflow-y: auto; background-color: #fff; border: 1px solid #d1d5db; border-radius: 8px; margin-top: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 99999; }
.results-list { z-index: 99999; }
.dropdown-item { padding: 0.75rem; cursor: pointer; font-size: 0.875rem; }
.dropdown-item:hover { background-color: #fff7ed; }
.input-with-button { padding-right: 100px; }
.search-button { position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background-color: #ff5500; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.search-button:hover { background-color: #e64a00; }
.google-link-container { margin-top: 16px; display: flex; justify-content: flex-start; }
.google-link-button { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; color: #1a73e8; background-color: #e8f0fe; padding: 8px 14px; border-radius: 10px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.08); transition: all 0.2s ease; }
.google-link-button:hover { background-color: #d2e3fc; color: #174ea6; box-shadow: 0 4px 8px rgba(0,0,0,0.12); transform: translateY(-1px); }
.disabled-btn { background-color: #ccc !important; cursor: not-allowed; opacity: 0.6; }
</style>