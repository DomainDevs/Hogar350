<template>
    <!-- List: Tipo de inmueble -->
    <div class="filter-group">
        <div>
            <!-- Contenido colapsable -->
            <Collapse name="property" title="Tipo de propiedad:" :iscollapse="true">
              <div v-for="option in propertyTypes" :key="option.id" class="mb-2">
              <label class="gap-2 cursor-pointer space-x-2">
                  <!-- IMPORTANTE: value es el id (string), no el objeto -->
                  <input
                  type="checkbox"
                  :value="option.id"
                  v-model="selectedPropertyTypes"
                  class="checkbox"
                  />
                  <span>{{ option.label }}</span>
              </label>
              </div>
            </Collapse>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import Collapse from '@/shared/components/Collapse.vue'

// Toggle del bloque (asegúrate que por defecto esté visible si quieres ver las opciones)
const isOpen = ref(false) 
// opcion de propertyTypes selecionada
const selectedPropertyTypes = ref(['']) 

// Array de objetos con id (código) y label (texto visible)
const propertyTypes = [
  { id: 'H01', label: 'Casa' },
  { id: 'H02', label: 'Apartamento' },
  { id: 'H03', label: 'Aparta estudio' },
  { id: 'C01', label: 'Oficina' },
  { id: 'C02', label: 'Bodega' },
  { id: 'C03', label: 'Consultorio' },
  { id: 'C04', label: 'Local comercial' },
  { id: 'L01', label: 'Lote' },
  { id: 'F01', label: 'Finca' },
  { id: 'E01', label: 'Edificio de oficinas' },
  { id: 'E02', label: 'Edificio de apartamentos' }
]

</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>