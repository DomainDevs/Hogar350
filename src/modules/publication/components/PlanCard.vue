<template>
  <div
    :class="[
      'bg-white p-6 flex flex-col transition-all duration-300 rounded-lg',
      /* Resaltado importante: Usando el naranja de la plantilla maestra */
      plan.highlight 
        ? 'ring-2 ring-[#ff5500] border-transparent shadow-lg shadow-orange-100 scale-[1.02] z-10' 
        : 'border border-gray-100 shadow-sm hover:shadow-md'
    ]"
  >
    <div class="flex items-start justify-between mb-2">
      <h2 class="text-xl font-bold text-gray-800 leading-tight">{{ plan.title }}</h2>
      
      <span v-if="plan.isNew" 
            class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-500 text-[#fff]">
        Nuevo
      </span>
    </div>
    
    <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">{{ plan.duration }}</p>

    <div v-if="plan.features && plan.features.length" class="flex-grow mb-6">
      <ul class="space-y-3">
        <li v-for="(feature, idx) in displayedFeatures" :key="idx" class="flex items-start gap-3 text-sm text-gray-600">
          <svg v-if="feature.type === 'check'" class="h-4 w-4 text-[#ff5500] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span :class="{'font-bold text-gray-800': feature.highlight}">{{ feature.text }}</span>
        </li>
      </ul>
      
      <button
        v-if="plan.features.length > 3"
        @click="toggleFeatures"
        class="mt-4 text-[11px] font-bold text-[#ff5500] uppercase tracking-widest hover:text-[#e64d00] transition-colors focus:outline-none"
      >
        {{ showMore ? '- Ver menos' : '+ Ver más detalles' }}
      </button>
    </div>

    <div v-if="plan.price" class="mt-auto pt-6 border-t border-gray-100">
      <p v-if="plan.oldPrice" class="text-xs text-gray-400 line-through font-medium mb-1">
        ${{ plan.oldPrice.toLocaleString('es-CO') }}
      </p>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-extrabold text-gray-900 tracking-tight">
          ${{ plan.price.toLocaleString('es-CO') }}
        </span>
        <span v-if="plan.discount" class="text-[#fff] font-bold text-[12px] bg-blue-600 px-2 py-0.5 rounded uppercase">
          -{{ plan.discount }}%
        </span>
      </div>
      <p v-if="plan.priceDescription" class="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">
        {{ plan.priceDescription }}
      </p>
    </div>

    <button
      @click="selectPlan(plan.id)"
      :class="[
        'mt-6 w-full py-3 font-bold rounded-lg transition-all active:scale-95 text-sm flex items-center justify-center gap-2',
        plan.highlight || plan.buttonVariant === 'primary'
          ? 'bg-[#ff5500] text-white hover:bg-[#e64d00] shadow-md shadow-orange-100' 
          : 'border border-[#ff5500] bg-white text-gray-500 hover:bg-red-50 hover:border-red-400 hover:text-[#ff5500]'
      ]"
    >
      {{ plan.buttonText }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  plan: { type: Object, required: true }
});

const emit = defineEmits(['select-plan']);
const showMore = ref(false);

const displayedFeatures = computed(() => {
  return showMore.value ? props.plan.features : props.plan.features.slice(0, 3);
});

const toggleFeatures = () => { showMore.value = !showMore.value; };
const selectPlan = (planId) => { emit('select-plan', planId); };
</script>