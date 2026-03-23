<template>
  <!-- Filtro: Precio -->
  <div class="filter-group">
    <div>
      <!-- Contenido colapsable -->
      <Collapse name="property" title="Precio y área:" :iscollapse="true">
          <!-- Inputs uno debajo del otro -->
          <label class="label">Precio</label>
          <div class="flex flex-col gap-2 mb-2">
            <div>
              <label class="block text-sm text-gray-500">Desde</label>
              <div class="flex items-center border border-gray-300 rounded-md px-3 py-1">
                <span class="text-[#33be6d] mr-1">$</span>
                <input
                  type="text"
                  :value="formatPrice(localMinPrice)"
                  @input="handleMinPriceInput"
                  @blur="handleMinPriceBlur"
                  :min="min"
                  :max="localMaxPrice"
                  class="outline-none w-32 bg-transparent text-right"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-500">Hasta</label>
              <div class="flex items-center border border-gray-300 rounded-md px-3 py-1">
                <span class="text-[#33be6d] mr-1">$</span>
                <input
                  type="text"
                  :value="formatPrice(localMaxPrice)"
                  @input="handleMaxPriceInput"
                  @blur="handleMaxPriceBlur"
                  :min="localMinPrice"
                  :max="max"
                  class="outline-none w-32 bg-transparent text-right"
                />
              </div>
            </div>
          </div>

          <!-- Slider doble -->
          <div class="relative mt-2">
            <input
              type="range"
              :min="min"
              :max="max"
              step="10000"
              v-model.number="localMinPrice"
              class="w-full pointer-events-none"
              style="pointer-events: auto;"
            />
            <input
              type="range"
              :min="min"
              :max="max"
              step="10000"
              v-model.number="localMaxPrice"
              class="w-full pointer-events-none"
              style="pointer-events: auto;"
            />
          </div>
          </Collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Collapse from '@/shared/components/Collapse.vue'; // Asegúrate de que la ruta sea correcta

const props = defineProps({
  modelValue: Object // Recibe { min: number, max: number }
});

const emit = defineEmits(['update:modelValue']);

const min = 300000;
const max = 80000000000;

// Crea refs locales inicializados con la prop
const localMinPrice = ref(props.modelValue.min || min);
const localMaxPrice = ref(props.modelValue.max || max);

// --- Funciones de formato y parseo ---
const formatPrice = (value) =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(value);

const parseNumber = (value) =>
  Number(String(value).replace(/\./g, '').replace(/,/g, '')) || 0;

// --- Manejadores de Input para Campos de Texto ---
const handleMinPriceInput = (event) => {
  localMinPrice.value = parseNumber(event.target.value);
};

const handleMaxPriceInput = (event) => {
  localMaxPrice.value = parseNumber(event.target.value);
};

// --- Manejadores de Blur para Campos de Texto (Nueva lógica) ---
const handleMinPriceBlur = (event) => {
  // Al perder el foco, formatea el valor
  event.target.value = formatPrice(localMinPrice.value);

  // Asegura que minPrice no supere a maxPrice
  if (localMinPrice.value > localMaxPrice.value) {
    localMaxPrice.value = localMinPrice.value; // Ajusta maxPrice si minPrice lo supera
  }
};

const handleMaxPriceBlur = (event) => {
  // Al perder el foco, formatea el valor
  event.target.value = formatPrice(localMaxPrice.value);

  // Asegura que maxPrice no sea menor que minPrice
  // ESTA ES LA LÓGICA CLAVE SOLICITADA:
  if (localMaxPrice.value < localMinPrice.value) {
    localMinPrice.value = localMaxPrice.value; // Ajusta minPrice si maxPrice es menor
  }
};

// --- Watchers para Sincronizar con el Componente Padre y Sliders ---

// Este watcher asegura que el precio mínimo siempre sea <= al máximo
// cuando se modifica el mínimo o al inicializar los componentes del slider.
// Se mantiene inmediato porque es un comportamiento esperado para la relación min-max.
watch(localMinPrice, (newMin) => {
  if (newMin > localMaxPrice.value) {
    localMaxPrice.value = newMin; // Ajusta maxPrice inmediatamente si minPrice lo supera
  }
  // Emite al padre para que siempre tenga el valor actualizado después de cualquier ajuste
  emit('update:modelValue', { min: localMinPrice.value, max: localMaxPrice.value });
});

// Este watcher ahora solo se encarga de emitir el valor de maxPrice al padre
// La lógica de ajuste de minPrice cuando maxPrice es menor se movió al handleMaxPriceBlur.
watch(localMaxPrice, (newMax) => {
  // Si maxPrice es menor que el mínimo, esto se corregirá en el blur
  // o si el minPrice lo empuja hacia arriba (por el watcher de minPrice).
  // Aquí solo nos enfocamos en emitir el valor actual de maxPrice.
  emit('update:modelValue', { min: localMinPrice.value, max: newMax });
});

</script>

<style scoped>
/* Tus estilos existentes */
</style>