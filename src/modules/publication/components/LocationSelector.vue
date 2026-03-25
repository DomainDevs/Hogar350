<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">

    <!-- Departamento -->
    <div class="flex flex-col">
      <label for="departamento" class="text-sm font-medium mb-1">
        Departamento
      </label>
      <select
        id="departamento"
        v-model="selectedDepartamento"
        @change="onDepartamentoChange"
        class="border px-2 py-1 rounded w-auto"
      >
        <option value="">Seleccione departamento</option>
        <option 
          v-for="d in departamentos" 
          :key="d.id" 
          :value="d.id"
        >
          {{ d.nombre }}
        </option>
      </select>
    </div>

    <!-- Municipio -->
    <div class="flex flex-col">
      <label for="municipio" class="text-sm font-medium mb-1">
        Municipio
      </label>
      <select
        id="municipio"
        v-model="selectedCiudad"
        @change="onCiudadChange"
        class="border px-2 py-1 rounded w-auto"
        :disabled="!selectedDepartamento"
      >
        <option value="">Seleccione municipio</option>
        <option 
          v-for="c in ciudadesFiltradas" 
          :key="c.id" 
          :value="c.id"
        >
          {{ c.nombre }}
        </option>
      </select>
    </div>

    <!-- Localidad -->
    <div class="flex flex-col">
      <label for="localidad" class="text-sm font-medium mb-1">
        Localidad
      </label>
      <select
        id="localidad"
        v-model="selectedLocalidad"
        @change="onLocalidadChange"
        class="border px-2 py-1 rounded w-auto"
        :disabled="!selectedCiudad"
      >
        <option value="">Seleccione localidad</option>
        <option 
          v-for="l in localidadesFiltradas" 
          :key="l.id" 
          :value="l.id"
        >
          {{ l.nombre }}
        </option>
      </select>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits([
  'update:departamento',
  'update:ciudad',
  'update:localidad',
  'update:map'
])

const departamentos = ref([])
const ciudades = ref([])
const localidades = ref([])

const selectedDepartamento = ref('')
const selectedCiudad = ref('')
const selectedLocalidad = ref('')

// Datos por defecto de Bogotá
const defaultBogota = { id: '00001', nombre: 'Bogotá D.C.', lat: 4.610, lng: -74.070 }

// Cargar JSON al montar
onMounted(async () => {
  try {
    departamentos.value = await (await fetch('/data/departamentos.json')).json()
    ciudades.value = await (await fetch('/data/municipios.json')).json()
    localidades.value = await (await fetch('/data/localidades.json')).json()
  } catch (err) {
    console.error('Error cargando datos', err)
  }
})

// Filtrar municipios por departamento
const ciudadesFiltradas = computed(() => {
  if (!selectedDepartamento.value) return []
  return ciudades.value.filter(c => String(c.departamentoId) === String(selectedDepartamento.value))
})

// Filtrar localidades por ciudad
const localidadesFiltradas = computed(() => {
  if (!selectedCiudad.value) return []
  return localidades.value.filter(l =>
    String(l.departamentoId) === String(selectedDepartamento.value) &&
    String(l.municipioId) === String(selectedCiudad.value)
  )
})

// Cambio de departamento
function onDepartamentoChange() {
  selectedCiudad.value = ''
  selectedLocalidad.value = ''
  const dep = departamentos.value.find(d => d.id === selectedDepartamento.value) || null
  emit('update:departamento', dep)
  
  // Reseteamos ciudad y localidad con Bogotá por defecto
  emit('update:ciudad', defaultBogota)
  emit('update:localidad', defaultBogota)
  // No movemos el mapa todavía
}

// Cambio de ciudad
function onCiudadChange() {
  selectedLocalidad.value = ''
  const ciudad = ciudades.value.find(c => c.id === selectedCiudad.value)
  if (!ciudad) return
  const coordenadas = { lat: Number(ciudad.lat), lng: Number(ciudad.lng) }
  emit('update:ciudad', { ...ciudad, ...coordenadas })
  emit('update:localidad', defaultBogota) // localidad aún vacía -> Bogotá
  emit('update:map', coordenadas)
}

// Cambio de localidad
function onLocalidadChange() {
  const loc = localidades.value.find(l => l.id === selectedLocalidad.value)
  if (!loc) return
  const coordenadas = { lat: Number(loc.lat), lng: Number(loc.lng) }
  //emit('update:localidad', { ...loc, ...coordenadas })
  emit('update:ciudad', { ...loc, ...coordenadas })
  emit('update:map', coordenadas)
}
</script>

<style scoped>
select {
  font-size: 0.875rem;
  height: 2rem;
  line-height: 1.5rem;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
}
select[size] {
  height: auto;
  max-height: 6rem;
  overflow-y: auto;
}
</style>