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
        v-model="selectedMunicipio"
        @change="onMunicipioChange"
        class="input-style"
        :disabled="!selectedDepartamento"
        :class="[errors.municipio ? 'border-red-400 bg-red-50' : '']"
      >
        <option disabled value="">Seleccione municipio</option>
        <option v-for="m in municipiosFiltrados" :key="m.id" :value="m.id">
          {{ m.nombre }}
        </option>
      </select>
      <p v-if="errors.municipio" class="error-msg">{{ errors.municipio }}</p>
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
        :disabled="!selectedMunicipio"
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
  'update:municipio',
  'update:localidad',
  'update:map'
])

const departamentos = ref([])
const municipios = ref([])
const localidades = ref([])

const selectedDepartamento = ref('')
const selectedMunicipio = ref('')
const selectedLocalidad = ref('')

// Manejo de errores simple
const errors = ref({
  departamento: '',
  municipio: '',
  localidad: ''
})

// Datos por defecto de Bogotá
const defaultBogota = { id: '00001', nombre: 'Bogotá D.C.', lat: 4.610, lng: -74.070 }

onMounted(async () => {
  try {
    departamentos.value = await (await fetch('/data/departamentos.json')).json()
    municipios.value = await (await fetch('/data/municipios.json')).json()
    localidades.value = await (await fetch('/data/localidades.json')).json()
  } catch (err) {
    console.error('Error cargando datos', err)
  }
})

const municipiosFiltrados = computed(() => {
  if (!selectedDepartamento.value) return []
  return municipios.value.filter(m => String(m.departamentoId) === String(selectedDepartamento.value))
})

const localidadesFiltradas = computed(() => {
  if (!selectedMunicipio.value) return []
  return localidades.value.filter(l =>
    String(l.departamentoId) === String(selectedDepartamento.value) &&
    String(l.municipioId) === String(selectedMunicipio.value)
  )
})

function onDepartamentoChange() {
  selectedMunicipio.value = ''
  selectedLocalidad.value = ''
  const dep = departamentos.value.find(d => d.id === selectedDepartamento.value) || null
  emit('update:departamento', dep)
  emit('update:municipio', defaultBogota)
  emit('update:localidad', defaultBogota)
  emit('update:map', { lat: defaultBogota.lat, lng: defaultBogota.lng })
}

function onMunicipioChange() {
  selectedLocalidad.value = ''
  const municipio = municipios.value.find(m => m.id === selectedMunicipio.value)
  if (!municipio) return
  const coordenadas = { lat: Number(municipio.lat), lng: Number(municipio.lng) }
  emit('update:municipio', { ...municipio, ...coordenadas })
  emit('update:localidad', defaultBogota)
  emit('update:map', coordenadas)
}

function onLocalidadChange() {
  const loc = localidades.value.find(l => l.id === selectedLocalidad.value)
  if (!loc) return
  const coordenadas = { lat: Number(loc.lat), lng: Number(loc.lng) }

  // Emitir la localidad
  emit('update:localidad', loc)

  // 🔥 también emitir municipio para que el mapa se actualice
  const municipio = municipios.value.find(m => m.id === selectedMunicipio.value)
  if (municipio) {
    emit('update:municipio', { ...municipio, ...coordenadas })
  }

  // Map siempre recibe las coordenadas de la localidad
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