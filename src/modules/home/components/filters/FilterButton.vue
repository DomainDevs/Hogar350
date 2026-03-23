<template>
  <button
    @click="$emit('click')"
    class="flex items-center gap-2 border border-[#7c98a7] rounded-lg px-3 py-1.5 hover:bg-gray-100 transition">
    <SlidersHorizontal class="w-4 h-4" />
    <span class="font-semibold">Filtros</span>
  </button>
</template>

<script setup>
import { SlidersHorizontal } from 'lucide-vue-next'

defineEmits(['click'])
</script>
