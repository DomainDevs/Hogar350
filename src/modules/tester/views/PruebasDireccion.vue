<template>
  <div class="py-20">
    <!-- Ejemplo: combos de selección -->
    <select v-model="selectedDepartamento">
      <option value="Cundinamarca">Cundinamarca</option>
      <option value="Antioquia">Antioquia</option>
      <option value="Valle del Cauca">Valle del Cauca</option>
    </select>

    <select v-model="selectedCiudad">
      <option value="Bogotá">Bogotá</option>
      <option value="Medellín">Medellín</option>
      <option value="Cali">Cali</option>
    </select>

    <select v-model="selectedLocalidad">
      <option value="Chapinero">Chapinero</option>
      <option value="Usaquén">Usaquén</option>
      <option value="El Poblado">El Poblado</option>
    </select>
    <!-- Autocomplete -->
    <AddressAutocompleteAdvanced
      :pais="'Colombia'"
      :ciudad="selectedCiudad"
      :mapRef="mapSelector"
      @update:coords="handleCoordsUpdate"
      @update:address="address = $event"
    />

    <!-- Mapa -->
    <MapSelector
      ref="mapSelector"
      :lat="coords.lat"
      :lng="coords.lng"
      :codigo="coords.codigo"
      :address="coords.address"
      @update:coords="handleCoordsUpdate"
    />
    

    <!-- Datos -->
    <div>
      <p>Latitud: {{ coords.lat }}</p>
      <p>Longitud: {{ coords.lng }}</p>
      <p>Código: {{ coords.codigo }}</p>
      <p>Dirección coords: {{ coords.address }}</p>
      <p>Dirección: {{ address }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddressAutocompleteAdvanced from '@/modules/tester/components/AddressAutocompleteAdvanced.vue'
import MapSelector from '@/modules/tester/components/MapSelector.vue'

const selectedDepartamento = ref('Cundinamarca')
const selectedCiudad = ref('Bogotá')
const selectedLocalidad = ref('Chapinero')

// ← Incluye 'codigo' desde el inicio
const coords = ref({ lat: null, lng: null, codigo: null })
const address = ref('')
const mapSelector = ref(null)

// Usar handler para mantener reactividad del ref
function handleCoordsUpdate(payload) {
  coords.value = { ...coords.value, ...payload }
}
</script>
