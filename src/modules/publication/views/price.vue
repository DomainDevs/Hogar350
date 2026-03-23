<!--solo se preocupa de mostrar la UI (template) y manejar la interacción-->
<template>
  <div class="py-12 bg-gray-50 min-h-screen font-nunito text-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold sm:text-5xl tracking-tight">{{ pageData.mainTitle }}</h1>
        <p class="mt-5 text-xl text-gray-600 max-w-2xl mx-auto">{{ pageData.mainSubtitle }}</p>
      </div>

      <!-- Link superior -->
      <a 
        :href="pageData.topLink.url"
        class="group flex items-center gap-4 text-[#ff5500] hover:text-white hover:bg-[#ff5500] font-bold text-md uppercase tracking-[0.2em] transition-all mb-7"
        aria-label="Ver comparativa completa de planes"
      >
        {{ pageData.topLink.text }}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>

      <!-- Loading / Empty / Grid -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-[#DF724A] rounded-full animate-spin"></div>
      </div>

      <div v-else-if="pageData.plans.length === 0" class="text-center py-20 text-gray-500">
        No hay planes disponibles en este momento
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
        <PlanCard 
          v-for="plan in pageData.plans"
          :key="plan.id"
          :plan="plan"
          @select-plan="handlePlanSelection"
          class="h-full transition-transform hover:-translate-y-1"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import PlanCard from '@/modules/publication/components/PlanCard.vue';
import { usePlans } from '@/modules/publication/utils/usePlans.js';

// Lógica de carga centralizada
const { pageData, loading } = usePlans();

const handlePlanSelection = (planId) => {
  console.log(`Plan seleccionado: ${planId}`);
  // Aquí puedes redirigir o abrir checkout
};
</script>

<style scoped>
/* Optimización de renderizado de fuentes */
div {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>