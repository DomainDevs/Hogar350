<template>
  <div class="space-y-6">
    <div
      v-for="group in amenities"
      :key="group.category"
    >
      <h3 class="text-sm font-semibold text-gray-800 mb-2">
        {{ group.category }}
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <label
          v-for="item in group.items"
          :key="item.key"
          class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
        >
          <input
            type="checkbox"
            :value="item.key"
            v-model="model"
            
          />
          <span>{{ item.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const model = defineModel();
const amenities = ref([]);

onMounted(async () => {
  const res = await fetch('/data/amenities.json');
  if (res.ok) {
    amenities.value = await res.json();
  }
});
</script>