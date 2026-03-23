<!-- Photo360.vue -->
<template>
  <div ref="viewerContainer" class="photo360-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PhotoSphereViewer from 'photo-sphere-viewer';
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
});

const viewerContainer = ref(null);
let viewerInstance = null;

onMounted(() => {
  if (viewerContainer.value && props.imageUrl) {
    viewerInstance = new PhotoSphereViewer.Viewer({
      container: viewerContainer.value,
      panorama: props.imageUrl,
      caption: 'Vista 360°',
      defaultLong: 0,
      navbar: ['zoom', 'fullscreen'],
      size: {
        width: '100%',
        height: 400
      }
    });
  }
});
</script>

<style scoped>
.photo360-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
</style>