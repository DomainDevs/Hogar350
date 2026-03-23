<template>
<section
  class="relative w-full h-[430px] rounded-lg bg-no-repeat bg-center bg-cover pt-10" 
  :style="{
    backgroundImage: `url(${image})`,
    backgroundSize: backgroundSize,
    backgroundPosition: backgroundPosition
  }"
>
  <!-- Solo visible en desktop -->
  <h3 class="hidden lg:block text-[#000] text-[34px] font-bold text-center">
    {{ titulobanner }}
  </h3>

  <h4
    class="hidden lg:block text-[#000] text-[22px] text-center"
  >
    {{ subtitulobanner }}
  </h4>

  <slot></slot>
</section>
</template>

<script>
export default {
  name: "HeroBanner",
  props: {
    image: { type: String, required: true },
    titulobanner: { type: String, required: true },
    subtitulobanner: { type: String, required: true },
    backgroundSize: { type: String, default: "cover" },
    backgroundPosition: { type: String, default: "center" }
  }
};
</script>

<style scoped>

h3, h4 {
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
}
/* Mantiene la estructura del contenedor, puedes añadir más estilos si quieres */
</style>
