<template>
  <div class="py-8 max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-2xl pt-[10px] ">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">Publica tu Inmueble</h1>
    <p class="text-center text-gray-950 mb-8">Paso {{ currentStep }} de {{ totalSteps }}</p>

    <!-- Barra de progreso -->
    <div class="mb-8">
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-[#10c4d7] h-2.5 rounded-full transition-all duration-500"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Contenido dinámico -->
    <div class="min-h-[500px]">
      <component
        :is="currentStepComponent"
        v-model:form-data="formData"
        @next-step="nextStep"
        @prev-step="prevStep"
        @publish="publish"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Importa cada paso del wizard
import Step1 from '@/modules/publication/views/steps/Step1.vue'
import Step2 from '@/modules/publication/views/steps/Step2.vue'
import Step3 from '@/modules/publication/views/steps/Step3.vue'
import Step4 from '@/modules/publication/views/steps/Step4.vue'
import FinalStep from '@/modules/publication/views/steps/FinalStep.vue'

const currentStep = ref(1)
const totalSteps = 5

// Objeto que guarda toda la info
const formData = ref({
  general: {},         // datos generales del inmueble
  caracteristicas: {}, // número de cuartos, baños, etc.
  ubicacion: {},       // departamento, ciudad, localidad, barrio, dirección y contacto
  imagenes: []         // fotos cargadas
})

// Mapea pasos a componentes
const stepComponents = {
  1: Step1,
  2: Step2,
  3: Step3,
  4: Step4,
  5: FinalStep
}

const currentStepComponent = computed(() => stepComponents[currentStep.value])

const progress = computed(() => (currentStep.value / totalSteps) * 100)

// Navegación
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Acción final
const publish = () => {
  console.log('Datos del inmueble listos para publicar:', formData.value)
  // Aquí puedes hacer un fetch/axios POST hacia tu backend
}
</script>
