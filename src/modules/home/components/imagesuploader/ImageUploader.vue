<template>
  <div class="image-uploader">
    <div 
      class="drop-area"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        type="file"
        ref="fileInput"
        multiple
        :accept="acceptString"
        @change="handleFiles"
        class="hidden"
      />
      <p v-if="!images.length">
        Arrastra los archivos aquí o haz click para seleccionar (máx {{ maxFiles }})
      </p>
      <div v-else class="preview-grid">
        <div v-for="(img, index) in images" :key="index" class="preview-item">
          <img :src="img.url" alt="preview" />
          <button type="button" @click.stop="removeImage(index)">✖</button>
          <div class="progress-bar">
            <div class="progress" :style="{ width: img.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <button 
      type="button" 
      @click="uploadImages" 
      :disabled="!images.length || uploading"
      class="upload-btn"
    >
      {{ uploading ? 'Subiendo...' : 'Subir archivos' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  maxFiles: { type: Number, default: 5 },
  maxSizeMB: { type: Number, default: 3 },
  uploadUrl: { type: String, required: false }, //Esto generaa el error, pasar url requerida: uploadUrl: { type: String, required: true },
  allowedExtensions: { type: Array, default: () => ['*'] }, // ej: ['.jpg','.png','.pdf']
  folderPath: { type: String, default: 'uploads' }
});

const fileInput = ref(null);
const images = ref([]);
const uploading = ref(false);

const acceptString = computed(() => {
  if (!props.allowedExtensions || props.allowedExtensions.includes('*')) return '';
  return props.allowedExtensions.join(',');
});

function triggerFileInput() {
  fileInput.value.click();
}

function handleFiles(event) {
  const selectedFiles = Array.from(event.target.files);
  processFiles(selectedFiles);
  event.target.value = '';
}

function handleDrop(event) {
  const droppedFiles = Array.from(event.dataTransfer.files);
  processFiles(droppedFiles);
}

function processFiles(filesList) {
  for (const file of filesList) {
    if (images.value.length >= props.maxFiles) {
      alert(`Solo puedes subir un máximo de ${props.maxFiles} archivos`);
      break;
    }

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (props.allowedExtensions.length && !props.allowedExtensions.includes(ext) && !props.allowedExtensions.includes('*')) {
      alert(`El archivo ${file.name} no está permitido`);
      continue;
    }

    if (file.size / 1024 / 1024 > props.maxSizeMB) {
      alert(`El archivo ${file.name} excede ${props.maxSizeMB} MB`);
      continue;
    }

    const reader = new FileReader();
    reader.onload = e => {
      images.value.push({ file, url: e.target.result, progress: 0 });
    };
    reader.readAsDataURL(file);
  }
}

function removeImage(index) {
  images.value.splice(index, 1);
}

async function uploadImages() {
  if (!images.value.length) return;
  uploading.value = true;

  const uploadPromises = images.value.map((img, idx) => uploadSingle(img, idx));
  await Promise.all(uploadPromises);

  alert('Todos los archivos se subieron correctamente');
  images.value = [];
  uploading.value = false;
}

function uploadSingle(img, index) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', img.file);
    formData.append('folderPath', props.folderPath);
    formData.append('allowedExtensions', JSON.stringify(props.allowedExtensions));
    formData.append('maxFileSizeBytes', props.maxSizeMB * 1024 * 1024);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', props.uploadUrl, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        images.value[index].progress = Math.round((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(`Error al subir el archivo: ${img.file.name}`);
    };

    xhr.onerror = () => reject(`Error de red con el archivo: ${img.file.name}`);
    xhr.send(formData);
  });
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.drop-area {
  border: 2px dashed #aaa;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  border-radius: 6px;
}

.drop-area p {
  margin: 0;
}

.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.preview-item {
  position: relative;
  width: 120px;
}

.preview-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}

.preview-item button {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(255,0,0,0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.progress-bar {
  width: 100%;
  height: 5px;
  background: #eee;
  border-radius: 3px;
  margin-top: 3px;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  width: 0%;
  border-radius: 3px;
  transition: width 0.2s;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background-color: #1e293b; /* slate-900 */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background-color: #111827; /* slate-800 */
}

.upload-btn:disabled {
  background-color: #64748b; /* slate-400 */
  cursor: not-allowed;
}
</style>
