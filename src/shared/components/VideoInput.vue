<script setup>
import { ref, watch, onMounted } from 'vue';
import { generateEmbedUrl, validateVideoUrl } from '../utils/videoUtils';

const props = defineProps({ modelValue: String });
const emit = defineEmits(['update:modelValue']);

const inputUrl = ref('');
const embedUrl = ref('');
const errorMessage = ref('');
let initialLoad = true; // flag

watch(inputUrl, async (newUrl) => {
  emit('update:modelValue', newUrl);

  // Evitamos borrar al inicio
  if (!newUrl && initialLoad) return;

  const result = await validateVideoUrl(newUrl);
  errorMessage.value = result.valid ? '' : result.reason;
  embedUrl.value = result.valid ? generateEmbedUrl(newUrl) : '';
});

const onBlurInput = async () => {
  if (!inputUrl.value) return;

  const result = await validateVideoUrl(inputUrl.value);

  if (!result.valid) {
    errorMessage.value = result.reason;
    inputUrl.value = '';
    embedUrl.value = '';
  } else {
    embedUrl.value = generateEmbedUrl(inputUrl.value);
    errorMessage.value = '';
  }
};

onMounted(() => {
  const saved = sessionStorage.getItem('publicationForm');

  if (!saved) return;

  const data = JSON.parse(saved);
  const savedUrl = data?.form?.general?.videoUrl;

  console.log(savedUrl);

  if (savedUrl) {
    inputUrl.value = savedUrl;
    embedUrl.value = generateEmbedUrl(savedUrl);
  }

  initialLoad = false;
});
</script>

<template>
  <div>
    <label class="block font-medium text-sm">
      <span class="text-[#ff5500] font-bold">IMPORTANTE: </span>
      El título del video debe coincidir con la terminología inmobiliaria.
    </label>
    <input
      type="text"
      v-model="inputUrl"
      class="mt-1 block w-full border rounded-md p-2"
      placeholder="Pega la URL"
      @blur="onBlurInput"
    />
    <p v-if="errorMessage" class="text-[#ff5500] font-bold mt-3 m-2">{{ errorMessage }}</p>
    <div v-if="embedUrl" class="mt-4 aspect-video">
      <iframe
        :src="embedUrl"
        class="w-full h-full rounded-md"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>