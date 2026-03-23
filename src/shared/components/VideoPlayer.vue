<script setup>
import { computed } from 'vue';
import { generateEmbedUrl } from '../utils/videoUtils';

const props = defineProps({
  modelValue: String
});

const embedUrl = computed(() =>
  props.modelValue ? generateEmbedUrl(props.modelValue) : null
);
</script>

<template>
  <div v-if="embedUrl" class="aspect-video">
    <iframe
      :src="embedUrl"
      class="w-full h-full rounded-xl"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>