<template>
  <footer class="bg-[#334155] text-[#f3f3f7]">
    <div class="max-w-7xl mx-auto px-5 py-8">
      
      <!-- Enlaces principales -->
      <div
        v-if="footerLinks"
        class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-white/10 pb-10"
      >
        <!-- Columna de descripción -->
        <div class="col-span-1 md:col-span-2 lg:col-span-1 text-center md:text-left">
          <div class="text-xl font-bold tracking-wide">
            <a href="/" class="hover:text-[#ff5500] transition-colors">www.tuhogar360.com</a>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-gray-200">
            Portal creado por Fayda Solutions, empresa dedicada al diseño, desarrollo, 
            y operación de plataformas digitales que permiten la publicación, promoción 
            y comercialización de productos o servicios en línea.
          </p>
        </div>

        <!-- Columnas dinámicas -->
        <div
          v-for="column in footerLinks.columns"
          :key="column.title"
          class="col-span-1 text-center md:text-left"
        >
          <h4 class="font-semibold text-base mb-4">{{ column.title }}</h4>
          <ul>
            <li
              v-for="link in column.links"
              :key="link.url"
              class="mb-2"
            >
              <a
                :href="link.url"
                class="text-sm text-gray-300 hover:text-[#ff5500] transition-colors duration-200"
              >
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Redes sociales y derechos -->
      <div
        v-if="footerLinks"
        class="flex flex-col md:flex-row justify-between items-center pt-8 gap-4"
      >
        <div class="flex items-center gap-4">
          <a
            v-for="social in footerLinks.socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-[#ff5500] transition-colors duration-200"
          >
            <component :is="iconMap[social.name]" class="w-8 h-8" />
          </a>
        </div>
        <p class="text-xs text-gray-400 text-center md:text-right">
          © {{ new Date().getFullYear() }} Fayda Solutions. Todos los derechos reservados.
        </p>
      </div>

      <div v-else class="text-center py-12 text-gray-400">
        <p>Cargando pie de página...</p>
      </div>
    </div>
  </footer>
</template>


<script setup>
import { ref, onMounted } from 'vue';

// Importar iconos de Lucide
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-vue-next';

const footerLinks = ref(null);

// Mapa de iconos para redes sociales
const iconMap = {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
};

onMounted(async () => {
  try {
    const response = await fetch('/data/footerLinks.json');
    if (!response.ok) {
      throw new Error('Error al cargar los datos del pie de página');
    }
    footerLinks.value = await response.json();
  } catch (error) {
    console.error('No se pudieron obtener los datos:', error);
  }
});
</script>
