<template>
  <div class="filter-group flex flex-col md:flex-row md:items-center md:gap-4 w-full">

    <!-- Tabs + Select -->
    <div class="tabs tabs-box bg-base-300 m-0 inline-flex flex-wrap w-full md:flex-nowrap gap-2">

      <!-- Tabs: (comprar o arrendar o compartir) -->
      <input
        type="radio"
        name="offer_tab"
        role="tab"
        class="tab w-1/3 md:w-auto"
        aria-label="Comprar"
        :checked="offerType === 'comprar'"
        @change="offerType = 'comprar'"
      />

      <input
        type="radio"
        name="offer_tab"
        role="tab"
        class="tab w-1/3 md:w-auto"
        aria-label="Arrendar"
        :checked="offerType === 'arrendar'"
        @change="offerType = 'arrendar'"
      />

      <input
        type="radio"
        name="offer_tab"
        role="tab"
        class="tab w-1/3 md:w-auto"
        aria-label="Compartir"
        :checked="offerType === 'compartir'"
        @change="offerType = 'compartir'"
      />

      <!-- Select: Tipo de compra (solo si "comprar") -->
      <select
        v-model="selectedOption"
        :disabled="offerType !== 'comprar'"
        class="select select-bordered w-full md:w-auto max-w-xs bg-base-200 border-slate-400"
      >
        <option disabled value="">Selecciona una opción</option>
        <option
          v-for="opt in options"
          :key="opt.id"
          :value="opt.id"
        >
          {{ opt.label }}
        </option>
      </select>

    </div>
    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const offerType = ref('comprar')
const selectedOption = ref('')

// Aquí definimos el array que se llenará desde el JSON
const options = ref([])

// Si necesitas restaurar form y secciones desbloqueadas
const form = reactive({ general: {} })  // ajusta según tu estructura real
const unlockedSections = reactive({})  // ajusta según tus secciones

onMounted(async () => {
  // 1️⃣ Restaurar datos guardados en sessionStorage
  const saved = sessionStorage.getItem('publicationForm')
  if (saved) {
    const data = JSON.parse(saved)
    Object.assign(form, data.form)
    Object.assign(unlockedSections, data.unlockedSections)
  }

  // 2️⃣ Cargar JSON externo
  try {
    const res = await fetch('/data/propertyPurchaseOptions.json')
    if (!res.ok) throw new Error(res.statusText)
    options.value = await res.json()
  } catch (err) {
    console.error('No se pudo cargar propertyPurchaseOptions.json', err)
  }
})

</script>

<style scoped>
.filter-group input,
.filter-group select {
  font-size: 16px;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Línea inferior animada solo en radio seleccionado */
.tabs input.tab {
  border-bottom: 3px solid transparent; /* espacio para la línea */
  transition: border-color 0.4s ease;  /* animación suave */
}

.tabs input.tab:checked {
  border-bottom-color: #FF5500; /* línea naranja seleccionado */
}
</style>