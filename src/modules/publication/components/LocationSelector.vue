<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 py-3">


          
    <!-- Departamento -->
    <div class="flex flex-col">
      <label class="label-style">
        Departamento <span class="text-[#ff5500]">*</span>
      </label>
      <select
        v-model="selectedDepartamento"
        @change="onDepartamentoChange"
        class="input-style"
        :class="[errors.departamento ? 'border-red-400 bg-red-50' : '']"
      >
        <option disabled value="">Seleccione departamento</option>
        <option v-for="d in departamentos" :key="d.id" :value="d.id">
          {{ d.nombre }}
        </option>
      </select>
      <p v-if="errors.departamento" class="error-msg">{{ errors.departamento }}</p>
    </div>

    <!-- Municipio -->
    <div class="flex flex-col">
      <label class="label-style">
        Municipio <span class="text-[#ff5500]">*</span>
      </label>
      <select
        v-model="selectedCiudad"
        @change="onCiudadChange"
        class="input-style"
        :disabled="!selectedDepartamento"
        :class="[errors.ciudad ? 'border-red-400 bg-red-50' : '']"
      >
        <option disabled value="">Seleccione municipio</option>
        <option v-for="c in ciudadesFiltradas" :key="c.id" :value="c.id">
          {{ c.nombre }}
        </option>
      </select>
      <p v-if="errors.ciudad" class="error-msg">{{ errors.ciudad }}</p>
    </div>

    <!-- Localidad -->
    <div class="flex flex-col">
      <label class="label-style">
        Localidad <span class="text-[#ff5500]">*</span>
      </label>
      <select
        v-model="selectedLocalidad"
        @change="onLocalidadChange"
        class="input-style"
        :disabled="!selectedCiudad"
        :class="[errors.localidad ? 'border-red-400 bg-red-50' : '']"
      >
        <option disabled value="">Seleccione localidad</option>
        <option v-for="l in localidadesFiltradas" :key="l.id" :value="l.id">
          {{ l.nombre }}
        </option>
      </select>
      <p v-if="errors.localidad" class="error-msg">{{ errors.localidad }}</p>
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

// Manejo de errores simple
const errors = ref({
  departamento: '',
  ciudad: '',
  localidad: ''
})

// Datos por defecto de Bogotá
const defaultBogota = { id: '00001', nombre: 'Bogotá D.C.', lat: 4.610, lng: -74.070 }

onMounted(async () => {
  try {
    departamentos.value = await (await fetch('/data/departamentos.json')).json()
    ciudades.value = await (await fetch('/data/municipios.json')).json()
    localidades.value = await (await fetch('/data/localidades.json')).json()
  } catch (err) {
    console.error('Error cargando datos', err)
  }
})

const ciudadesFiltradas = computed(() => {
  if (!selectedDepartamento.value) return []
  return ciudades.value.filter(c => String(c.departamentoId) === String(selectedDepartamento.value))
})

const localidadesFiltradas = computed(() => {
  if (!selectedCiudad.value) return []
  return localidades.value.filter(l =>
    String(l.departamentoId) === String(selectedDepartamento.value) &&
    String(l.municipioId) === String(selectedCiudad.value)
  )
})

function onDepartamentoChange() {
  selectedCiudad.value = ''
  selectedLocalidad.value = ''
  const dep = departamentos.value.find(d => d.id === selectedDepartamento.value) || null
  emit('update:departamento', dep)
  emit('update:ciudad', defaultBogota)
  emit('update:localidad', defaultBogota)
}

function onCiudadChange() {
  selectedLocalidad.value = ''
  const ciudad = ciudades.value.find(c => c.id === selectedCiudad.value)
  if (!ciudad) return
  const coordenadas = { lat: Number(ciudad.lat), lng: Number(ciudad.lng) }
  emit('update:ciudad', { ...ciudad, ...coordenadas })
  emit('update:localidad', defaultBogota)
  emit('update:map', coordenadas)
}

function onLocalidadChange() {
  const loc = localidades.value.find(l => l.id === selectedLocalidad.value)
  if (!loc) return
  const coordenadas = { lat: Number(loc.lat), lng: Number(loc.lng) }
  emit('update:ciudad', { ...loc, ...coordenadas })
  emit('update:map', coordenadas)
}
</script>

<style scoped>
.step-section { @apply bg-white border border-gray-100 p-6 sm:p-8 rounded-lg shadow-sm transition-all duration-300; }
.label1-style { @apply block text-[16px] font-black tracking-[0.15em] mb-2; }
.label-style { @apply block text-[14px] font-black text-gray-700 tracking-[0.15em] mb-2; }
.input-style { @apply w-full px-6 py-3 rounded-lg border border-gray-200 outline-none transition-all text-sm placeholder:text-gray-300 focus:border-[#ff5500] focus:ring-2 focus:ring-orange-100; }
.error-msg { @apply text-[#ff5500] text-[12px] font-bold mt-1.5 tracking-tight; }


</style>

