<template>
  <div class="media-viewer-preview">
    <div class="media-content relative w-full rounded overflow-hidden bg-gray-100">
      
      <!-- Carrusel de imágenes -->
      <div v-if="activeTab === 'images' && images.length" class="relative w-full aspect-[16/9]">
        <img
          :src="images[currentIndex]"
          alt="Imagen propiedad"
          class="w-full h-full object-cover rounded-md"
        />

        <!-- Contador flotante (Añadido z-20) -->
        <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm z-20">
          {{ currentIndex + 1 }}/{{ images.length }}
        </div>

        <button v-if="images.length > 1" @click="prev" class="nav-btn left-2 z-20">‹</button>
        <button v-if="images.length > 1" @click="next" class="nav-btn right-2 z-20">›</button>
      </div>

      <!-- Video -->
      <div v-if="activeTab === 'video' && videoUrl" class="w-full aspect-[16/9]">
        <iframe :src="embedUrl" class="w-full h-full rounded-md" frameborder="0" allowfullscreen></iframe>
      </div>

      <!-- Tour 360 -->
      <div v-if="activeTab === 'tour' && tour360Url" class="w-full aspect-[16/9]">
        <iframe :src="tour360Url" class="w-full h-full rounded-md" frameborder="0" allowfullscreen></iframe>
      </div>

      <!-- Mapa (Añadido div contenedor con z-0 y key para asegurar redimensión) -->
      <div v-if="activeTab === 'map' && lat !== null && lng !== null" class="w-full aspect-[16/9] relative z-0">
        <MapSelector
          :key="`${lat}-${lng}`" 
          :lat="lat"
          :lng="lng"
          :readonly="true"
          class="w-full h-full rounded-md"
        />
      </div>

      <!-- Tabs flotantes (Subido z-index a 30 para que siempre esté arriba) -->
      <div class="tabs-floating flex gap-2 absolute bottom-4 left-5 z-30 flex-col">
        <button
          :class="['tab-btn', activeTab === 'images' ? 'active' : '']"
          @click="activeTab = 'images'"
          v-if="images && images.length"
        >
          <Image class="w-4 h-4"/>
        </button>

        <button
          :class="['tab-btn', activeTab === 'video' ? 'active' : '']"
          @click="activeTab = 'video'"
          v-if="videoUrl"
        >
          <Video class="w-4 h-4"/>
        </button>

        <button
          :class="['tab-btn', activeTab === 'tour' ? 'active' : '']"
          @click="activeTab = 'tour'"
          v-if="tour360Url"
        >
          <Globe class="w-4 h-4"/>
        </button>

        <button
          :class="['tab-btn', activeTab === 'map' ? 'active' : '']"
          @click="activeTab = 'map'"
          v-if="lat !== null && lng !== null"
        >
          <MapPin class="w-4 h-4"/>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { extractYouTubeId, extractVimeoId } from '@/shared/utils/videoUtils'
import { Image, Video, Globe, MapPin } from 'lucide-vue-next'
import MapSelector from '@/modules/publication/components/MapSelector.vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  videoUrl: { type: String, default: '' },
  tour360Url: { type: String, default: '' },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null }
})

const emit = defineEmits(['change-image'])

const activeTab = ref(
  props.images.length
    ? 'images'
    : props.videoUrl
      ? 'video'
      : props.tour360Url
        ? 'tour'
        : (props.lat !== null && props.lng !== null ? 'map' : '')
)

const currentIndex = ref(0)

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  emit('change-image', currentIndex.value)
}

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
  emit('change-image', currentIndex.value)
}

const embedUrl = computed(() => {
  if (!props.videoUrl) return ''
  const ytId = extractYouTubeId(props.videoUrl)
  if (ytId) return `https://www.youtube.com/embed/${ytId}`
  const vimeoId = extractVimeoId(props.videoUrl)
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`
  return ''
})

watch(activeTab, (tab) => {
  if(tab !== 'images') currentIndex.value = 0
})
</script>

<style scoped>
.media-viewer-preview {
  width: 100%;
}

.tab-btn {
  padding: 0.5rem; /* Aumentado ligeramente para mejor clic */
  background: rgba(255, 255, 255, 0.9); /* Más opaco para resaltar sobre el mapa */
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 1);
}

.tab-btn.active {
  background: #1e293b;
  color: white;
  transform: scale(1.08);
}

.media-content {
  position: relative;
}

/* Forzamos que el mapa use todo el espacio del contenedor aspect-ratio */
:deep(.vue-map-container), :deep(.leaflet-container) {
  height: 100% !important;
  width: 100% !important;
}

.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center 
          rounded-full bg-black bg-opacity-70 text-white border-2 border-white 
          hover:bg-opacity-95 transition text-4xl;
}
</style>