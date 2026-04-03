<template>
  <div class="relative w-full" style="z-index: 9999;">
    
    <!-- MUNICIPIO -->
    <label class="label-style">
      Ciudad / Municipio <span class="text-[#ff5500]">*</span>
    </label>

    <!-- Combo estilo select -->
    <div class="relative">
      <input
        type="text"
        v-model="search"
        @focus="onFocus"
        @blur="onBlur"
        @input="filterMunicipios"
        class="input-style pr-10 cursor-pointer"
        placeholder="Registra o escribe tu ciudad/municipio"
        autocomplete="off"
      />

      <!-- Icono de flecha -->
      <span
        class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        @mousedown.prevent="clearAndOpen"
      >
        ▼
      </span>

      <!-- Dropdown -->
      <ul
        v-show="showDropdown && filtered.length"
        class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg"
        style="z-index: 10000;"
      >
        <li
          v-for="item in filtered"
          :key="item.municipioId"
          @mousedown.prevent="selectMunicipio(item)"
          class="px-4 py-2 hover:bg-orange-50 cursor-pointer"
        >
          {{ item.municipio }} ({{ item.departamento }})
        </li>
      </ul>
    </div>

    <!-- DIRECCIÓN EXACTA -->
    <div class="mt-4">
      <label class="label-style">
        Dirección exacta <span class="text-[#ff5500]">*</span>
      </label>
      <input
        type="text"
        v-model="direccion"
        @input="onDireccionInput"
        class="input-style"
        placeholder="Ej: Calle 123 # 45-67"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits([
  'update:municipio',
  'update:departamento',
  'update:coords',
  'update:direccion'
])

const MAX_RESULTS = 20
const search = ref('')
const direccion = ref('')
const showDropdown = ref(false)
const municipios = ref([])
const filtered = ref([])

let geocodeTimeout = null

// Cargar datos desde location.json
onMounted(async () => {
  try {
    municipios.value = await (await fetch('/data/location.json')).json()
    filtered.value = municipios.value.slice(0, MAX_RESULTS)
  } catch (err) {
    console.error('Error cargando location.json', err)
  }
})

// Filtra municipios mientras el usuario digita
function filterMunicipios() {
  const q = search.value.toLowerCase().trim()

  if (!q) {
    filtered.value = municipios.value.slice(0, MAX_RESULTS)
    showDropdown.value = true
    return
  }

  filtered.value = municipios.value
    .filter(m =>
      m.municipio.toLowerCase().includes(q) ||
      m.departamento.toLowerCase().includes(q)
    )
    .slice(0, MAX_RESULTS)

  showDropdown.value = true
}

// Selección de municipio
function selectMunicipio(item) {
  search.value = `${item.municipio} (${item.departamento})`
  showDropdown.value = false

  emit('update:municipio', item)
  emit('update:departamento', item) 
  emit('update:coords', { lat: Number(item.lat), lng: Number(item.lng) })
}

// Entrada de dirección exacta
function onDireccionInput() {
  emit('update:direccion', direccion.value)

  if (geocodeTimeout) clearTimeout(geocodeTimeout)

  // Debounce de 700ms antes de llamar la API
  geocodeTimeout = setTimeout(async () => {
    if (!direccion.value.trim() || !search.value.trim()) return

    const query = encodeURIComponent(`${search.value} ${direccion.value}`)
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/search?key=pk.21cc39d91ae48ec7d7a064d2e7241480&q=221b%2C%20Baker%20St%2C%20London&format=json&limit=1`
      )
      const data = await res.json()
      if (data?.length) {
        emit('update:coords', { lat: Number(data[0].lat), lng: Number(data[0].lon) })
      }
    } catch (err) {
      console.error('Error geocodificando dirección:', err)
    }
  }, 700)
}

// Abrir dropdown al hacer focus
function onFocus() {
  showDropdown.value = true
  filterMunicipios()
}

// Cerrar dropdown con retraso para permitir click
function onBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

// Abrir limpio con límite aplicado
function clearAndOpen() {
  search.value = ''
  filtered.value = municipios.value.slice(0, MAX_RESULTS)
  showDropdown.value = true
}
</script>

<style scoped>
.label-style {
  display: block;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
  color: #374151;
}
.input-style {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  transition: all 0.2s;
  background-color: #fff;
}
.input-style:focus {
  border-color: #ff5500;
  box-shadow: 0 0 0 2px rgba(255, 85, 0, 0.2);
}
</style>