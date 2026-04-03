<template>
  <div class="container">

    <!-- MUNICIPIO -->
    <div class="field-container">
      <label class="label-style">
        Ciudad / Municipio <span class="required">*</span>
      </label>

      <div class="input-wrapper">
        <input
          type="text"
          v-model="search"
          @focus="onFocus"
          @blur="onBlur"
          @input="filterMunicipios"
          class="input-style"
          placeholder="Registra o escribe tu ciudad/municipio"
          autocomplete="off"
        />

        <span class="dropdown-arrow" @mousedown.prevent="clearAndOpen">▼</span>

        <ul v-show="showDropdown && filtered.length" class="dropdown-list">
          <li
            v-for="item in filtered"
            :key="item.municipioId"
            @mousedown.prevent="selectMunicipio(item)"
            class="dropdown-item"
          >
            {{ item.municipio }} ({{ item.departamento }})
          </li>
        </ul>
      </div>
    </div>

    <!-- DIRECCIÓN EXACTA -->
    <div class="field-container">
      <label class="label-style">
        Dirección exacta <span class="required">*</span>
      </label>

      <div class="input-wrapper">
        <input
          type="text"
          v-model="direccion"
          @keydown.enter.prevent="buscarDireccion"
          class="input-style input-with-button"
          placeholder="Ej: Calle 123 # 45-67"
        />

        <!-- Botón de búsqueda estilizado -->
        <button class="search-button" @click="buscarDireccion" title="Buscar dirección">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" viewBox="0 0 24 24" fill="white" width="16" height="16">
            <path d="M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"/>
          </svg>
          Buscar
        </button>

        <!-- Lista resultados -->
        <ul v-if="showResults" class="dropdown-list results-list">
          <li
            v-for="(item, i) in results"
            :key="i"
            @click="applyResult(item)"
            class="dropdown-item"
          >
            {{ item.display_name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- MAPA -->
    <MapSelector
      ref="mapRef"
      :lat="localCoords.lat"
      :lng="localCoords.lng"
      :codigo="localCoords.codigo"
      @update:coords="onMapUpdate"
    />

    <!-- LINK VER EN GOOGLE ABAJO DEL MAPA -->
    <div class="google-link-container" v-if="localCoords.lat && localCoords.lng">
      <a
        :href="`https://www.google.com/maps/search/?api=1&query=${localCoords.lat},${localCoords.lng}`"
        target="_blank"
        class="google-link-button"
        title="Abrir en Google Maps"
      >
        <MapPin class="w-5 h-5" /> <!-- icono un poquito más grande -->
        <span>Ver en Google Maps</span>
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MapSelector from './MapSelector.vue'
import { MapPin } from 'lucide-vue-next'

const props = defineProps({
  municipio: Object,
  coords: { type: Object, default: () => ({ lat: null, lng: null, codigo: null, municipio: '' }) }
})
const emit = defineEmits(['update:municipio', 'update:coords'])

const mapRef = ref(null)
const localCoords = ref({ ...props.coords })
const search = ref('')
const direccion = ref('')
const showDropdown = ref(false)
const municipios = ref([])
const filtered = ref([])

const results = ref([])
const showResults = ref(false)
const MAX_RESULTS = 20

watch(() => props.coords, val => { localCoords.value = { ...val } })

onMounted(async () => {
  try {
    municipios.value = await (await fetch('/data/location.json')).json()
    filtered.value = municipios.value.slice(0, MAX_RESULTS)
  } catch (err) { console.error('Error cargando location.json', err) }
})

function filterMunicipios() {
  const q = search.value.toLowerCase().trim()
  filtered.value = !q
    ? municipios.value.slice(0, MAX_RESULTS)
    : municipios.value.filter(m => m.municipio.toLowerCase().includes(q))
        .slice(0, MAX_RESULTS)
  showDropdown.value = true
}

function selectMunicipio(item) {
  search.value = item.municipio
  showDropdown.value = false
  localCoords.value = { lat: Number(item.lat), lng: Number(item.lng), codigo: item.codigoDane, municipio: item.municipio }
  mapRef.value?.placeMarker(localCoords.value.lat, localCoords.value.lng)
  updateCoords(localCoords.value, item)
}

function buscarDireccion() {
  if (!direccion.value.trim() || !search.value.trim()) return

  // Solo el nombre limpio de la ciudad
  const ciudadRaw = localCoords.value.municipio || search.value || ''
  const ciudad = ciudadRaw.replace(/\s*\(.*\)$/, '') // elimina paréntesis si existe

  const direccionNormalizada = normalizarDireccion(direccion.value)
  const queryString = `${direccionNormalizada}, ${ciudad}, Colombia`
  const query = encodeURIComponent(queryString)
  const url = `https://us1.locationiq.com/v1/search?key=pk.21cc39d91ae48ec7d7a064d2e7241480&q=${query}&format=json&limit=5`

  console.log('Consulta geocoding:', url)

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) return

      // 🔹 Filtrar para priorizar resultados de la misma ciudad
      const ciudadLower = ciudad.toLowerCase()
      const filteredResults = data.filter(d =>
        d.display_name.toLowerCase().includes(ciudadLower)
      )

      if (filteredResults.length === 0) {
        // Si no hay coincidencias exactas, usar todos
        results.value = data
      } else {
        results.value = filteredResults
      }

      showResults.value = results.value.length > 1

      if (results.value.length === 1) {
        applyResult(results.value[0])
      }
    })
    .catch(err => console.error('Error geocodificando dirección:', err))
}

function applyResult(item) {
  localCoords.value.lat = Number(item.lat)
  localCoords.value.lng = Number(item.lon)
  mapRef.value?.placeMarker(localCoords.value.lat, localCoords.value.lng)
  showResults.value = false
  updateCoords(localCoords.value)
}

function onMapUpdate(coords) { localCoords.value = coords; updateCoords(coords) }
function onFocus() { showDropdown.value = true; filterMunicipios() }
function onBlur() { setTimeout(() => showDropdown.value = false, 150) }
function clearAndOpen() { search.value = ''; filtered.value = municipios.value.slice(0, MAX_RESULTS); showDropdown.value = true }

function updateCoords(coords, municipio = null) {
  emit('update:coords', coords)
  if (municipio) emit('update:municipio', municipio)
  localStorage.setItem('selectedLocation', JSON.stringify(localCoords.value))
}

function normalizarDireccion(input) {
  if (!input) return ''
  let dir = input.toLowerCase()
  dir = dir.replace(/[<>"'`;(){}[\]\\]/g, '')
  dir = dir.replace(/\s+/g, ' ').trim()
  dir = dir.replace(/\s*#\s*/g, ' # ')
  dir = dir.replace(/\s*-\s*/g, ' - ')
  const reemplazos = { 'calle':'cl','carrera':'kr','avenida':'av','transversal':'tv','diagonal':'dg' }
  Object.keys(reemplazos).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi')
    dir = dir.replace(regex, reemplazos[key])
  })
  return dir.replace(/\s+/g, ' ').trim().toUpperCase()
}
</script>

<style scoped>
.container { display: flex; flex-direction: column; gap: 1rem; }

/* Labels e input */
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

/* Input con botón */
.input-with-button { padding-right: 100px; }

/* Botón Buscar */
.search-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ff5500;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.search-button:hover { background-color: #e64a00; }

/* Link Ver en Google mejorado */
.google-link-container { margin-top: 16px; display: flex; justify-content: flex-start; }

.google-link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: #1a73e8;
  background-color: #e8f0fe; /* fondo suave */
  padding: 8px 14px;
  border-radius: 10px; /* estilo tipo “chip” */
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
}

.google-link-button:hover {
  background-color: #d2e3fc;
  color: #174ea6;
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
  transform: translateY(-1px);
}
</style>