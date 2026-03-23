<template>
    <!-- List: Tipo de inmueble -->
    <div class="filter-group">
        <div>
          <!-- Contenido colapsable -->
          <Collapse name="property" title="Beneficios:" :iscollapse="true">
              
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
  { id: 'C01', label: 'Piscina' },
  { id: 'C02', label: 'Gimnasio' },
  { id: 'C03', label: 'Ascensor' },
  { id: 'C04', label: 'Jardín' },
  { id: 'C05', label: 'Balcon/Terraza' },
  { id: 'C06', label: 'Zonas verdes' },
  { id: 'C07', label: 'Zona infantil' }
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