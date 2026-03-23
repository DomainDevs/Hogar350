<template>
  <div class="card bg-white rounded-2xl border border-gray-200 overflow-hidden">

    <!-- Imagen con favorito -->
    <div class="relative">
      <img
        :src="property.image"
        alt="Imagen propiedad"
        class="w-full h-48 object-cover cursor-pointer"
        @click="openDetail(property.id)"
      />

      <!-- Favorito con estilo claro -->
<button
  class="absolute top-3 right-3 rounded-full p-2 shadow-md backdrop-blur-sm transition border-2 flex items-center justify-center"
  :class="property.favorite
    ? 'bg-white  text-[#ff5500]'  // texto/contorno naranja
    : 'bg-[#E3E6EEFF]/60 border-transparent hover:bg-white text-white'"
  @click.stop.prevent="toggleFavorite(property)"
>
  <Star
    :fill="property.favorite ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="2"
    class="w-4 h-4"
  />
</button>

    </div>

    <!-- Contenido -->
    <div class="p-4">
      <h3 class="  text-[#383736] truncate">{{ property.title }}</h3>
      <h4 class="text-[#1A1414FF] font-semibold text-lg mt-1">
        ${{ property.price?.toLocaleString() }}
      </h4>

      <p class="text-sm text-gray-500 mt-1 truncate">
        {{ property.address || property.title }}
      </p>
      <p class="text-xs text-gray-400">{{ property.location }}</p>

      <!-- Badges -->
      <div class="flex flex-wrap gap-2 mt-3">
        <div class="flex border border-[#ddd] items-center gap-1 bg-gray-50 text-gray-800 text-xs px-3 py-1 rounded-lg">
          <RulerIcon class="w-4 h-4" /> {{ property.area }} m²
        </div>
        <div class="flex border border-[#ddd] items-center gap-1 bg-gray-50 text-gray-800 text-xs px-3 py-1 rounded-lg">
          <BedIcon class="w-4 h-4" /> {{ property.bedrooms }}
        </div>
        <div class="flex border border-[#ddd] items-center gap-1 bg-gray-50 text-gray-800 text-xs px-3 py-1 rounded-lg">
          <BathIcon class="w-4 h-4" /> {{ property.bathrooms }}
        </div>
        <div v-if="property.parkingSpaces > 0"
          class="flex border border-[#ddd] items-center gap-1 bg-gray-50 text-gray-800 text-xs px-3 py-1 rounded-lg">
          <CarIcon class="w-4 h-4" /> {{ property.parkingSpaces }}
        </div>
      </div>
    </div>

    <!-- Botón Contactar -->
    <div class="px-4 pb-4">
      <button 
          class="px-6 py-2 rounded-lg bg-gray-700 text-white font-medium text-sm 
         hover:bg-gray-600 transition flex items-center justify-center gap-2"
        @click="showContact = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" 
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 8v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" />
        </svg>
        Contactar
      </button>
    </div>

    <!-- Modal contacto -->
    <ContactForm
      :show="showContact"
      :property-id="property.id"
      :property-title="property.title"
      title="Solicitar más información"
      @update:show="showContact = $event"
      @send="handleSend"
    />

    <!-- Modal detalle -->
    <div
      v-if="showDetail"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeDetail"
    >
      <transition name="fade-zoom">
        <div
          class="bg-white rounded-xl w-11/12 md:w-3/4 p-4 relative shadow-lg"
          v-show="showDetail"
        >
          <PropertyDetail :id="selectedId" @close="closeDetail" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { BedIcon, BathIcon, RulerIcon, CarIcon, Star } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import ContactForm from '@/modules/contact/ContactForm.vue'
import PropertyDetail from '@/modules/detail/views/PropertyDetail.vue' // Ajusta la ruta

defineProps({ property: Object })

const showContact = ref(false)
const showDetail = ref(false)
const selectedId = ref(null)

function handleSend(data) {
  console.log('Formulario enviado:', data)
}

function toggleFavorite(item) {
  item.favorite = !item.favorite
}

function openDetail(id) {
  selectedId.value = id
  showDetail.value = true
  document.body.style.overflow = 'hidden'
}

function closeDetail() {
  showDetail.value = false
  document.body.style.overflow = ''
}

// Cerrar con ESC
function handleKey(e) {
  if (e.key === 'Escape') closeDetail()
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})
</script>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.25s ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
