<template>
  <div class="filter-group">
    <div>
      <!-- Header clickeable -->
      <button @click="toggle"
        class=" w-full flex justify-between items-center bg-base-300 px-3 py-2
        rounded-t-box font-semibold">
        <span>{{ title }}</span>
        <svg :class="{'rotate-180': isOpen}" class="w-5 h-5 transition-transform duration-200"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Contenido colapsable -->
      <transition name="fade">
        <fieldset v-show="isOpen" class="fieldset bg-base-100 border-base-300 rounded-box border p-3 text-base">
          <slot />
        </fieldset>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  iscollapse: { type: Boolean, default: true }
})

const isOpen = ref(!props.iscollapse)

watch(() => props.iscollapse, val => {
  isOpen.value = !val
})

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
