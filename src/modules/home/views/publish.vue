<!-- Publish.vue -->
<template>
  <div class="publish-container">
    <h1>Publicar propiedad</h1>
    <!-- Aquí tu formulario -->
    <form>
      <label>Título</label>
      <input type="text" placeholder="Ej: Apartamento en Bogotá" />

      <label>Precio</label>
      <input type="number" placeholder="Ej: 300000000" />

      <label>Descripción</label>
      <textarea placeholder="Detalles de la propiedad"></textarea>

      <button type="submit">Publicar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Publish",
};
</script>

<style scoped>
.publish-container {
  padding: 1rem;
}
</style>
