<template>
  <div v-if="mantenimientoActivo" class="fixed inset-0 
  text-[#12162d]
  bg-gray-100 z-[9999] flex flex-col items-center justify-center text-center">
    <img src="/images/logo.png" alt="Logo" class="h-14 mb-6" />
    <br/><br/>
    <img
      src="https://cdn-icons-png.flaticon.com/512/3002/3002556.png"
      alt="Mantenimiento"
      class="w-40 mx-auto animate-bounce mb-6"
    />
    <h1 class="text-3xl font-bold text-[#111]">Portal en mantenimiento 🚧</h1>
    <p class="text-gray-600 mt-4 max-w-lg">
      Estamos trabajando para mejorar tu experiencia.  
      Nuestro portal inmobiliario estará disponible nuevamente muy pronto.  
      ¡Gracias por tu paciencia! 🙌
    </p>
  </div>
</template>

<script setup>
const mantenimientoActivo = true; // 🔧 cambia a false cuando el sitio vuelva
</script>
