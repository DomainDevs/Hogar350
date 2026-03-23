<template>
  <div v-if="property" class="w-full max-h-[90vh] flex flex-col bg-gray-50 rounded-lg shadow-lg overflow-hidden">
    <div class="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <div class="flex flex-col md:flex-row md:items-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800">{{ property.titulo }}</h2>
        <span class="text-sm md:text-base text-gray-500 mt-1 md:mt-0 md:ml-3">ID: {{ property.id }}</span>
      </div>

      <!-- Botón de cierre -->
      <button
        class="text-gray-500 hover:text-gray-800 text-3xl font-bold transition-transform transform hover:scale-110"
        @click="emit('close')"
      >
        &times;
      </button>

    </div>

     <!-- CONTENIDO RESTANTE (igual que antes) -->
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      <section class="rounded-xl overflow-hidden shadow-md">
        <Splide :options="splideOptions">
          <SplideSlide v-for="(img, idx) in property.imagenes" :key="idx">
            <img
              :src="img"
              alt="Imagen de la propiedad"
              class="w-full h-full md:h-[500px] object-cover"
            />
          </SplideSlide>
        </Splide>
      </section>

      <section class="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-xl shadow-sm">
        <div class="flex items-center mb-4 md:mb-0">
          <div>
            <span class="block text-sm text-gray-500">Precio</span>
            <h3 class="text-3xl font-bold text-[#444] mt-1">${{ property.precio.toLocaleString() }}</h3>
          </div>
        </div>
        <div class="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-lg">{{ property.direccion }}, {{ property.barrio }}, {{ property.ciudad }}</span>
        </div>
      </section>

      <section v-if="property.descripcion" class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Descripción</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ property.descripcion }}</p>
      </section>

      <section class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Detalles clave</h3>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 ">
          <div class="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#0da5b6] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p><span class="font-medium">Área:</span> {{ property.area }} m²</p>
          </div>
          <div class="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#0da5b6] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
            <p><span class="font-medium">Tipo:</span> {{ property.tipo }}</p>
          </div>
          <div class="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#0da5b6] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-3v3m0 3a2 2 0 10-4 0 2 2 0 004 0z" />
            </svg>
            <p><span class="font-medium">Estado:</span> {{ property.estado }}</p>
          </div>
          <div class="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#0da5b6] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17a5 5 0 100-10 5 5 0 000 10z" />
            </svg>
            <p><span class="font-medium">Habitaciones:</span> {{ property.habitaciones }}</p>
          </div>
          <div class="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#0da5b6] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5V19.5" />
            </svg>
            <p><span class="font-medium">Baños:</span> {{ property.banos }}</p>
          </div>
          <div class="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#0da5b6] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1z" />
            </svg>
            <p><span class="font-medium">Parqueaderos:</span> {{ property.parqueaderos }}</p>
          </div>
        </div>
      </section>

      <section v-if="property.caracteristicas?.length" class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Características</h3>
        <ul class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <li v-for="(carac, i) in property.caracteristicas" :key="i" class="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#0da5b6] mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ carac }}
          </li>
        </ul>
      </section>

      <section v-if="property.contacto" class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-xl font-bold mb-4">Información de Contacto</h3>
        <div class="space-y-2 text-[#333]]">
          <p><span class="font-medium">Nombre:</span> {{ property.contacto.nombre }}</p>
          <p><span class="font-medium">Teléfono:</span> {{ property.contacto.telefono }}</p>
          <p><span class="font-medium">Email:</span> {{ property.contacto.email }}</p>
        </div>
      </section>

      <section v-if="property?.ubicacion" class="bg-white p-6 rounded-xl shadow-sm">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Ubicación</h3>
        <div id="map" class="w-full h-80 rounded-lg shadow-inner mb-4"></div>
        <a
          :href="`https://www.google.com/maps/search/?api=1&query=${property.ubicacion.lat},${property.ubicacion.lng}`"
          target="_blank"
          class="text-[#333] font-semibold hover:underline"
        >
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 10 110-4 2 2 0 010 4z" clip-rule="evenodd" />
            </svg>
            Abrir en Google Maps
          </div>
        </a>
      </section>

    </div>
  </div>

<!-- Cargando -->


<!-- No se encontró -->
<div v-else="!property" class="text-center py-4  text-gray-400 text-sm">
  No se encontró información de esta propiedad.
</div>
  
</template>

<script setup>

import { ref, onMounted, watch, nextTick } from 'vue'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Se crea un icono personalizado de color morado
const purpleIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg fill="#7130BB" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
})

const props = defineProps({ id: { type: Number, required: true } })
const emit = defineEmits(['close'])
const property = ref(null)
const map = ref(null)

const splideOptions = {
  type: 'loop',
  perPage: 1,
  autoplay: true,
  interval: 3000,
  arrows: true,
  pagination: true,
  height: '500px',
}

onMounted(async () => {
  try {
    const res = await fetch('/data/properties.json')
    const data = await res.json()
    property.value = data.find((p) => p.id === props.id) || null
  } catch (err) {
    console.error('Error cargando propiedad:', err)
  }
})

// Inicializar mapa cuando la propiedad tenga ubicación
watch(property, async (val) => {
  if (val?.ubicacion && !map.value) {
    await nextTick() // espera que el DOM se actualice
    map.value = L.map('map').setView([val.ubicacion.lat, val.ubicacion.lng], 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value)
    
    // Usa el nuevo icono morado en el marcador
    L.marker([val.ubicacion.lat, val.ubicacion.lng], { icon: purpleIcon }).addTo(map.value)
  }
})
</script>

<style scoped>
.splide__slide img {
  border-radius: 8px;
}

#map {
  height: 320px;
  border-radius: 8px;
}
</style>