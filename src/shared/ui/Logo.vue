<template>

  
  <!-- Logo + texto fijo arriba a la izquierda -->
  <div class="fixed top-2 left-16 z-[800] flex items-center gap-3">
    <a href="/" class="label text-xl text-[#1a1a1a] font-bold">
      <!-- Logo -->
      <div 
        class="flex items-center justify-center"
        style="width: 41px; height: 41px; padding: 0px;"
      >
        
        <img 
          src="/images/logo.png" 
          alt="Logo de la empresa" 
          class="w-full h-full object-contain"
        />
        
      </div>

      <!-- Texto grande adaptativo -->
      <p class="text-xl sm:text-2xl font-bold">
        TuHogar<span class="font-normal text-[#ff681d] font-lato">360</span>
      </p>
    </a>

  </div>
</template>