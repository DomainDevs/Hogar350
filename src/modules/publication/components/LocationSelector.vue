<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">

    <!-- Departamento -->
    <select v-model="selectedDepartamento" @change="onDepartamentoChange"
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

    <!-- Municipio -->
    <select v-model="selectedCiudad" @change="onCiudadChange"
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

    <!-- Localidad -->
    <select v-model="selectedLocalidad" @change="onLocalidadChange"
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

// Filtrar localidades por ciudad y departamento
const localidadesFiltradas = computed(() => {
  if (!selectedDepartamento.value || !selectedCiudad.value) return []
  return localidades.value.filter(
    l => String(l.departamentoId) === String(selectedDepartamento.value) &&
         String(l.ciudadId) === String(selectedCiudad.value)
  )
})

// Cambio de departamento
function onDepartamentoChange() {
  selectedCiudad.value = ''
  selectedLocalidad.value = ''
  const dep = departamentos.value.find(d => d.id === selectedDepartamento.value) || null
  emit('update:departamento', dep)
  emit('update:ciudad', null)
  emit('update:localidad', null)
  // No actualizamos el mapa aquí
}

// Cambio de ciudad
function onCiudadChange() {
  selectedLocalidad.value = ''
  const ciudad = ciudades.value.find(c => c.id === selectedCiudad.value)
  if (!ciudad) return
  const coordenadas = { lat: Number(ciudad.lat), lng: Number(ciudad.lng) }
  emit('update:ciudad', { ...ciudad, ...coordenadas })
  emit('update:localidad', null)
  emit('update:map', coordenadas)
}

// Cambio de localidad
function onLocalidadChange() {
  const loc = localidades.value.find(l => l.id === selectedLocalidad.value)
  if (!loc) return
  const coordenadas = { lat: Number(loc.lat), lng: Number(loc.lng) }
  emit('update:localidad', { ...loc, ...coordenadas })
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