<template>
  <div class="join flex justify-center mt-8">
    <!-- Botón Anterior -->
    <button
      class="join-item btn btn-sm"
      :disabled="page <= 1"
      @click="$emit('changePage', page - 1)"
    >
      ◀
    </button>

    <!-- Botones de páginas -->
    <button
      v-for="p in totalPages"
      :key="p"
      class="join-item btn btn-sm"
      :class="{ 'btn-active': p === page }"
      @click="$emit('changePage', p)"
    >
      {{ p }}
    </button>

    <!-- Botón Siguiente -->
    <button
      class="join-item btn btn-sm"
      :disabled="page >= totalPages"
      @click="$emit('changePage', page + 1)"
    >
      ▶
    </button>
  </div>
</template>

<script setup>
defineProps({ page: Number, totalPages: Number })
defineEmits(['changePage'])
</script>
