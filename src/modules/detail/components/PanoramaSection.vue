
<template>
  <section class="panorama-section bg-white rounded-xl shadow-lg p-6 my-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4 text-center">
      Explora Nuestros Espacios en 360°
    </h2>
    <p class="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
      Sumérgete en un recorrido virtual y descubre cada detalle de nuestras propiedades.
      Cambia el panorama para explorar diferentes ambientes.
    </p>

    <!-- El componente PanoramaViewer incrustado -->
    <PanoramaViewer :image-url="currentPanoramaUrl" />

    <!-- Controles para cambiar el panorama -->
    <div class="mt-6 flex flex-wrap justify-center gap-4">
      <button 
        @click="changePanorama('apartment')" 
        :class="['px-6 py-3 rounded-md text-white font-semibold shadow-md text-lg transition-all duration-300', 
                 currentPanoramaUrl === apartmentPanorama ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700']"
      >
        Apartamento Moderno
      </button>
      <button 
        @click="changePanorama('office')" 
        :class="['px-6 py-3 rounded-md text-white font-semibold shadow-md text-lg transition-all duration-300',
                 currentPanoramaUrl === officePanorama ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700']"
      >
        Oficina Luminosa
      </button>
      <button 
        @click="changePanorama('city')" 
        :class="['px-6 py-3 rounded-md text-white font-semibold shadow-md text-lg transition-all duration-300',
                 currentPanoramaUrl === cityPanorama ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700']"
      >
        Vista de la Ciudad
      </button>
    </div>

    <div class="mt-8 p-4 bg-gray-100 rounded-md text-sm text-gray-600 text-center">
      <p>
        **Nota:** Las imágenes usadas son de ejemplo y deben ser reemplazadas con panoramas equirectangulares reales para un resultado óptimo.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import PanoramaViewer from '@/modules/detail/components/PanoramaViewer.vue';

// URLs de ejemplo para imágenes 360 grados.
// **IMPORTANTE**: Para que la experiencia sea auténtica, estas URLs deben apuntar a imágenes panorámicas equirectangulares reales.
// Puedes buscar "equirectangular panorama example" para encontrar imágenes de prueba.
const apartmentPanorama = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/equirectangular/fairway_v0.jpg';
const officePanorama = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/equirectangular/circus_v0.jpg';
const cityPanorama = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/equirectangular/venice_sunset_v0.jpg';

const currentPanoramaUrl = ref(apartmentPanorama); // Panorama inicial

const changePanorama = (type) => {
  if (type === 'apartment') {
    currentPanoramaUrl.value = apartmentPanorama;
  } else if (type === 'office') {
    currentPanoramaUrl.value = officePanorama;
  } else if (type === 'city') {
    currentPanoramaUrl.value = cityPanorama;
  }
};
</script>

<style scoped>
/* No se necesitan estilos adicionales si Tailwind CSS cubre todo */
</style>