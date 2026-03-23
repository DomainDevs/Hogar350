<template>
  <div class="flex flex-col h-full">
    <!-- Contenedor scrollable para propiedades -->
    <div
      class="flex-1 overflow-y-auto grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 p-4"
    >
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
      />
    </div>

    <!-- Paginador fijo -->
    <div class="flex-shrink-0 flex justify-center p-4 border-t border-base-300 bg-base-100">
      <PaginationControl
        :page="page"
        :totalPages="totalPages"
        @changePage="fetchData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PropertyCard from './PropertyCard.vue'
import PaginationControl from './PaginationControl.vue'

const properties = ref([])
const page = ref(1)
const totalPages = ref(5)

const fetchData = async (newPage = 1) => {
  page.value = newPage
  const res = await fetch(`data/homes.json`)
  const data = await res.json()

  const pageSize = 23
  const start = (newPage - 1) * pageSize
  properties.value = data.slice(start, start + pageSize)
  totalPages.value = Math.ceil(data.length / pageSize)
}

onMounted(() => {
  fetchData()
})
</script>
