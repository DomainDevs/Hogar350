<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <!-- Fondo semi-transparente -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
      
      <!-- Caja modal principal -->
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl z-10 flex flex-col max-h-[90vh]">
        
        <!-- Encabezado de la modal -->
        <div class="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <!-- Icono de Filtros (similar al solicitado) -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" 
            stroke="currentColor" class="w-6 h-6 text-[#25d366]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros de Búsqueda
          </h2>
          <button
            class="text-gray-500 hover:text-gray-900 text-3xl font-bold transition-transform transform hover:scale-110"
            @click="close"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <!-- Contenido scrollable de los filtros -->
        <div class="flex-1 overflow-y-auto p-5 space-y-6">
          <FilterCOfferType />
          <FilterDOptionsSelector />
          <FilterEPriceRange :min="0" :max="2000000" v-model="priceRange" />
          <FilterFBenefits />

          <!-- Aquí van tus controles adicionales, si los hubiera -->
          <slot />
        </div>

        <!-- Pie de página con botones de acción -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-5 flex justify-end gap-3 rounded-b-xl">
          <button
            class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium bg-white hover:bg-gray-100 transition-colors shadow-sm"
            @click="close"
          >
            Cancelar
          </button>
          <button
            class="px-5 py-2 bg-[#ff5500] text-white rounded-md font-medium hover:bg-[#fc7836] transition-colors shadow-md"
            @click="apply"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import FilterCOfferType from '@/modules/home/components/filters/FilterCOfferType.vue';
import FilterDOptionsSelector from '@/modules/home/components/filters/FilterDOptionsSelector.vue';
import FilterEPriceRange from "@/modules/home/components/filters/FilterEPriceRange.vue";
import FilterFBenefits from '@/modules/home/components/filters/FilterFBenefits.vue';
import { ref } from 'vue'; // Importa ref para priceRange

const props = defineProps({
  isOpen: Boolean,
  close:Boolean,
  apply: String
});

const emit = defineEmits(['close', 'apply']);

// Define priceRange para que no cause un error de "no definido"
const priceRange = ref([0, 2000000]);

const close = () => emit('close');
const apply = () => emit('apply');
</script>