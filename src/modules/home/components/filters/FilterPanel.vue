<template>
  <div class="filter-panel">
    <!-- Primera fila -->
    <div class="flex items-center gap-4">
      <FilterBLocationType v-model="filtersData.locationType" />
      <FilterButton @click="isModalOpen = true" />
    </div>

    <!-- Segunda fila -->
    <div class="mt-1">
      <FilterAAutocomplete @select="updateFilterLocation" />
    </div>

    <FilterModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @apply="aplicarFiltros"
    />
  </div>
</template>


<script setup>
import { ref, reactive } from 'vue';
import FilterAAutocomplete from '@/modules/home/components/filters/FilterAAutocomplete.vue';
import FilterBLocationType from '@/modules/home/components/filters/FilterBLocationType.vue';
import FilterButton from '@/modules/home/components/filters/FilterButton.vue';
import FilterModal from '@/modules/home/components/filters/FilterModal.vue';

// Objeto reactivo central para guardar el estado de todos los filtros
const filtersData = reactive({
  location: null, // Para FilterAAutocomplete
  locationType: { // Para FilterBLocationType
    offerType: 'comprar',
    selectedOption: ''
  },
  propertyType: [], // Para FilterCOfferType (array de IDs seleccionados)
  optionsSelector: { // Para FilterDOptionsSelector (objeto de arrays)
    dormitorios: [],
    banos: [],
    parqueaderos: [],
    estratos: [],
    mascotas: []
  },
  priceRange: { // Para FilterEPriceRange
    min: 350000,
    max: 1200000
  },
  benefits: [] // Para FilterFBenefits (array de IDs seleccionados)
});

const isModalOpen = ref(false);

// Función para actualizar la ubicación seleccionada del autocomplete
const updateFilterLocation = (location) => {
  filtersData.location = location;
};

// Función que se llama al aplicar los filtros desde la modal
const aplicarFiltros = (currentFiltersData) => {
  // Aquí puedes acceder a currentFiltersData que contiene todo el estado actualizado
  console.log("Filtros aplicados:", currentFiltersData);
  // Por ejemplo, aquí podrías enviar esta data a una API de búsqueda
  // o actualizar el listado de propiedades
  isModalOpen.value = false;
};
</script>

<style scoped>
.filter-panel {
  margin:50px auto 0 auto; /* centrado horizontal */
  width: 90%; /* ocupa casi todo el ancho en pantallas pequeñas */
  max-width: 900px; /* no se expanda demasiado en pantallas grandes */
  padding: 18px;
  border-radius: 10px;

  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);

  display: flex;
  flex-direction: column; /* todo vertical */
  gap: 10px; /* espacio entre filas */
}

</style>