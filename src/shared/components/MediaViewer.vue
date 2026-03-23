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

        <!-- Contador flotante -->
        <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {{ currentIndex + 1 }}/{{ images.length }}
        </div>

        <!-- Botones de navegación -->
        <button
          v-if="images.length > 1"
          @click="prev"
          class="nav-btn left-2"
        >‹</button>

        <button
          v-if="images.length > 1"
          @click="next"
          class="nav-btn right-2"
        >›</button>
      </div>

      <!-- Video -->
      <div v-if="activeTab === 'video' && videoUrl" class="w-full aspect-[16/9]">
        <iframe
          :src="embedUrl"
          class="w-full h-full rounded-md"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Tour 360 -->
      <div v-if="activeTab === 'tour' && tour360Url" class="w-full aspect-[16/9]">
        <iframe
          :src="tour360Url"
          class="w-full h-full rounded-md"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Tabs flotantes con iconos -->
      <div class="tabs-floating flex gap-2 absolute bottom-28 left-5 z-10 flex-col">
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
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { extractYouTubeId, extractVimeoId } from '@/shared/utils/videoUtils'
import { Image, Video, Globe } from 'lucide-vue-next'

const props = defineProps({
  images: { type: Array, default: () => [] },
  videoUrl: { type: String, default: '' },
  tour360Url: { type: String, default: '' }
})

// Emit para enviar el índice al padre
const emit = defineEmits(['change-image'])

const activeTab = ref(props.images.length ? 'images' : (props.videoUrl ? 'video' : 'tour'))
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
  padding: 0.35rem;
  background: rgba(229, 231, 235, 0.75);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: rgba(229, 231, 235, 0.95);
}

.tab-btn.active {
  background: #1e293b; /* puedes dejarlo oscuro o hacer un gris más claro */
  color: white;
  box-shadow:
    0 0 0 2px rgba(255,255,255,0.5), /* borde más blanco */
    0 0 12px rgba(255,255,255,0.6);   /* resplandor suave blanco */
  transform: scale(1.08);
}

.media-content {
  position: relative;
}

.tabs-floating {
  pointer-events: auto;
}

.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center 
         rounded-full bg-black bg-opacity-70 text-white border-2 border-white 
         hover:bg-opacity-95 transition text-4xl;
}
</style>