<template>
  <div class="min-h-screen flex items-start justify-center bg-base-300 pt-[10px]">
    <div class="w-full max-w-[92%] h-full m-5 rounded-md bg-base-100 shadow-lg p-2">

      <!-- Hero Banner solo con imagen -->
      <HeroBanner image="/images/banner/midascode-kitchen-1336160.jpg" 
      titulobanner="Encuentra tu espacio ideal" subtitulobanner="Transformando sueños en direcciones...">
        <!-- Panel de filtros centrado dentro del slot -->
        <div class="filter-panel-container">
          <FilterPanel />
        </div>
      </HeroBanner>

      <!-- Contenido principal -->
      <main class="main-layout flex flex-col md:flex-row gap-3">
        <!-- Lista de propiedades -->
        <aside class="properties-container flex-1 min-w-0 overflow-y-auto">
          <PropertyList />
        </aside>
      </main>

      <!-- Footer -->
      <Footer />
      <br/>

    </div>
  </div>
</template>

<script setup>
import HeroBanner from '@/modules/home/components/HeroBanner.vue';
import FilterPanel from '@/modules/home/components/filters/FilterPanel.vue';
import PropertyList from '@/modules/home/components/grid/PropertyList.vue';
import Footer from '@/shared/ui/Footer.vue';
</script>

<style scoped>
/* Filtro centrado dentro del HeroBanner */
.filter-panel-container {
  width: 95%;             /* ancho fijo */
  height: 60%;             /* ocupa toda la altura del HeroBanner */
  display: flex;
  justify-content: center;   /* centra horizontalmente */
  align-items: center;       /* centra verticalmente */
  margin: 0 auto;            /* opcional, centra el contenedor en su padre */
}
</style>
