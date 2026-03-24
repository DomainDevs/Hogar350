<template>
  <div class="address-autocomplete-advanced">
    <!-- Selector de ubicación -->
    <LocationSelector
      @municipio-selected="onMunicipioSelected"
    />

    <!-- Mapa centrado en el municipio seleccionado -->
    <MapSelector :center="mapCenter" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LocationSelector from './LocationSelector.vue';
import MapSelector from './MapSelector.vue';

// Centro inicial del mapa (Medellín por defecto)
const mapCenter = ref({ lat: 6.2442, lng: -75.5812 });

// Función que actualiza el mapa al seleccionar un municipio
function onMunicipioSelected(municipio) {
  if (municipio?.lat != null && municipio?.lng != null) {
    mapCenter.value = { lat: municipio.lat, lng: municipio.lng };
  }
}
</script>

<style scoped>
.address-autocomplete-advanced {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>