<template>
  <div class="multiple-options-selector">
    <Collapse name="property" title="Caracteristicas:" :iscollapse="true">
      <!-- Contenido colapsable con todos los grupos -->
        <div v-for="group in optionsGroups" :key="group.key" class="mb-4">
          <h3 class="font-semibold mb-2">{{ group.label }}</h3>
          <div class="buttons flex flex-wrap gap-2">
            <button
              v-for="option in group.options"
              :key="option.value"
              type="button"
              @click="toggleSelection(group.key, option.value)"
              :class="[
                'px-3 py-1 rounded-md border cursor-pointer select-none whitespace-nowrap',
                isSelected(group.key, option.value)
                  ? 'bg-[#22c55e] text-white border-[#22c55e]'
                  : 'bg-white border-gray-300 text-gray-800'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
    </Collapse>
  </div>
</template>

<script setup>
import { reactive, ref, watch, defineEmits } from 'vue'
import Collapse from '@/shared/components/Collapse.vue'

const emit = defineEmits(['update:selections'])

const isOpen = ref(false)

const optionsGroups = [
  {
    key: 'dormitorios',
    label: 'Dormitorios',
    options: [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5+', value: '5+' }
    ]
  },
  {
    key: 'banos',
    label: 'Baños',
    options: [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5+', value: '5+' }
    ]
  },
  {
    key: 'parqueaderos',
    label: 'Parqueadero',
    options: [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3+', value: '3+' }
    ]
  },
  {
    key: 'estratos',
    label: 'Estratos',
    options: [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 }
    ]
  },
  {
    key: 'mascotas',
    label: 'Admite mascotas',
    options: [
      { label: 'Admite', value: true }
    ]
  }
]

const selections = reactive({
  dormitorios: [],
  banos: [],
  parqueaderos: [],
  estratos: [],
  mascotas: []
})

function toggleSelection(groupKey, value) {
  const arr = selections[groupKey]
  const index = arr.indexOf(value)
  if (index >= 0) arr.splice(index, 1)
  else arr.push(value)
}

function isSelected(groupKey, value) {
  return selections[groupKey].includes(value)
}

watch(
  selections,
  (newVal) => {
    emit('update:selections', JSON.parse(JSON.stringify(newVal)))
  },
  { deep: true }
)
</script>

<style scoped>
button {
  transition: background-color 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
