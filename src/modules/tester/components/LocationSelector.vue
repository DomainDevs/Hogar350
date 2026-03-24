<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    <!-- Selector Departamento -->
    <select v-model="selectedDepartamento" @change="onDepartamentoChange"
      class="border px-2 py-1 rounded w-full">
      <option value="">Seleccione departamento</option>
      <option v-for="d in departamentos" :key="d.id" :value="d.id">
        {{ d.nombre }}
      </option>
    </select>

    <!-- Selector Municipio -->
    <select v-model="selectedCiudad" @change="onCiudadChange"
      class="border px-2 py-1 rounded w-full"
      :disabled="!selectedDepartamento">
      <option value="">Seleccione municipio</option>
      <option v-for="c in ciudadesFiltradas" :key="c.id" :value="c.id">
        {{ c.nombre }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Emitir cambios hacia el padre
const emit = defineEmits([
  'update:departamento',
  'update:ciudad'
])

// Datos
const departamentos = ref([])
const ciudades = ref([])

const selectedDepartamento = ref('')
const selectedCiudad = ref('')

// Cargar JSON desde /public/data
onMounted(async () => {
  try {
    const depRes = await fetch('/data/departamentos.json')
    departamentos.value = await depRes.json()

    const cityRes = await fetch('/data/municipios.json')
    ciudades.value = await cityRes.json()
  } catch (err) {
    console.error('Error cargando datos', err)
  }
})

// Computed: filtrar municipios según departamento
const ciudadesFiltradas = computed(() => {
  return ciudades.value.filter(c => String(c.departamentoId) === String(selectedDepartamento.value))
})

// Cuando cambias departamento
function onDepartamentoChange() {
  selectedCiudad.value = '' // limpiar selección de municipio
  const dep = departamentos.value.find(d => d.id === selectedDepartamento.value)
  emit('update:departamento', dep || null)
}

// Cuando cambias municipio
function onCiudadChange() {
  const ciudad = ciudades.value.find(c => c.id === selectedCiudad.value)
  emit('update:ciudad', ciudad || null)
}
</script>

<style scoped>
select {
  min-height: 2rem;
}
</style>