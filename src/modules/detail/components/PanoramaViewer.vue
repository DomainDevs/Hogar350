<template>
  <div class="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-100 rounded-lg overflow-hidden shadow-xl flex items-center justify-center">
    <canvas ref="panoramaCanvas" class="w-full h-full"></canvas>
    
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 text-white z-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-3"></div>
      <p class="text-lg">Cargando panorama...</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-red-800 bg-opacity-75 text-white z-10 p-4 text-center">
      <p class="text-lg font-semibold mb-2">Error al cargar la imagen.</p>
      <p class="text-sm">{{ error }}</p>
      <p class="text-sm mt-2">Asegúrate de que la URL de la imagen 360 sea correcta y que la imagen sea accesible.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true // La URL de la imagen 360 es obligatoria
  }
});

const panoramaCanvas = ref(null); // Referencia al elemento canvas
const loading = ref(true); // Estado de carga
const error = ref(null); // Estado de error

let scene, camera, renderer, controls, sphere, texture;
let animationFrameId = null;

const initThree = () => {
  if (!panoramaCanvas.value) {
    console.error('Canvas element not found.');
    return;
  }

  // Escena
  scene = new THREE.Scene();

  // Cámara (PerspectiveCamera para una vista 3D realista)
  // FOV, Aspect Ratio, Near, Far
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0.01, 0, 0); // Un pequeño offset para evitar que la cámara esté exactamente en el centro de la esfera
  camera.target = new THREE.Vector3(0, 0, 0); // Asegura que la cámara mire al centro

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: panoramaCanvas.value, antialias: true });
  renderer.setSize(panoramaCanvas.value.clientWidth, panoramaCanvas.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio); // Mejora la calidad en pantallas de alta densidad

  // Controles (OrbitControls para navegación tipo Street View)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false; // Desactiva el zoom
  controls.enablePan = false;  // Desactiva el paneo (movimiento lateral)
  controls.rotateSpeed = -0.3; // Invierte la dirección de rotación para un control más intuitivo
  controls.minPolarAngle = Math.PI / 4; // Limita la vista hacia arriba
  controls.maxPolarAngle = Math.PI - Math.PI / 4; // Limita la vista hacia abajo
  controls.minAzimuthAngle = -Infinity; // No limitar la rotación horizontal
  controls.maxAzimuthAngle = Infinity; // No limitar la rotación horizontal
  controls.target.set(0, 0, 0); // Asegura que la cámara siempre rote alrededor del centro
  controls.update();

  // Gestión del redimensionamiento de la ventana
  window.addEventListener('resize', onWindowResize);
};

const loadPanorama = (url) => {
  loading.value = true;
  error.value = null;

  // Carga de la textura
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    url,
    (loadedTexture) => {
      texture = loadedTexture;
      texture.mapping = THREE.EquirectangularReflectionMapping; // Tipo de mapeo para panoramas 360
      texture.colorSpace = THREE.SRGBColorSpace; // Corrección de color

      // Material de la esfera (el lado de la esfera que se renderiza hacia adentro)
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });

      // Geometría de la esfera (radio, segmentos de ancho, segmentos de alto)
      // La esfera debe ser grande para que la cámara esté dentro
      const geometry = new THREE.SphereGeometry(500, 60, 40);

      // Si ya existe una esfera, la removemos y creamos una nueva
      if (sphere) {
        scene.remove(sphere);
        sphere.geometry.dispose(); // Libera la geometría anterior
        sphere.material.dispose(); // Libera el material anterior
      }
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      loading.value = false;
    },
    (progress) => {
      // Progreso de carga
      const percentage = (progress.loaded / progress.total) * 100;
      console.log(`Cargando panorama: ${percentage.toFixed(2)}%`);
    },
    (err) => {
      // Error de carga
      console.error('Error al cargar la textura del panorama:', err);
      error.value = 'No se pudo cargar la imagen panorámica. Verifica la URL.';
      loading.value = false;
      // Puedes cargar una imagen de placeholder aquí si lo deseas
      // loadPlaceholderImage();
    }
  );
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  controls.update(); // Necesario si cambias el target o los límites
  renderer.render(scene, camera);
};

const onWindowResize = () => {
  if (panoramaCanvas.value) {
    camera.aspect = panoramaCanvas.value.clientWidth / panoramaCanvas.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(panoramaCanvas.value.clientWidth, panoramaCanvas.value.clientHeight);
  }
};

onMounted(() => {
  initThree();
  if (props.imageUrl) {
    loadPanorama(props.imageUrl);
    animate(); // Inicia la animación solo si hay una imagen para cargar
  } else {
    loading.value = false;
    error.value = 'No se proporcionó una URL de imagen 360.';
  }
});

onUnmounted(() => {
  // Limpia los recursos de Three.js y los listeners al desmontar el componente
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (renderer) {
    renderer.dispose();
  }
  if (controls) {
    controls.dispose();
  }
  if (sphere) {
    scene.remove(sphere);
    sphere.geometry.dispose();
    sphere.material.dispose();
  }
  if (texture) {
    texture.dispose();
  }
  window.removeEventListener('resize', onWindowResize);
});

// Watcher para recargar el panorama si la URL de la imagen cambia
watch(() => props.imageUrl, (newUrl) => {
  if (newUrl) {
    loadPanorama(newUrl);
  } else {
    loading.value = false;
    error.value = 'No se proporcionó una URL de imagen 360.';
    if (sphere) {
      scene.remove(sphere);
    }
  }
});
</script>

<style scoped>
/* Estilos adicionales si es necesario, aunque Tailwind debería manejar la mayoría */
.relative {
  position: relative;
}
.w-full {
  width: 100%;
}
.h-\[60vh\] {
  height: 60vh; /* Altura responsiva basada en el viewport height */
}
.md\:h-\[70vh\] {
  height: 70vh;
}
.lg\:h-\[80vh\] {
  height: 80vh;
}
.bg-gray-100 {
  background-color: #f3f4f6;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.overflow-hidden {
  overflow: hidden;
}
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.absolute {
  position: absolute;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.bg-gray-800 {
  background-color: #1f2937;
}
.bg-opacity-75 {
  background-color: rgba(31, 41, 55, 0.75);
}
.text-white {
  color: #ffffff;
}
.z-10 {
  z-index: 10;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.rounded-full {
  border-radius: 9999px;
}
.h-12 {
  height: 3rem;
}
.w-12 {
  width: 3rem;
}
.border-b-2 {
  border-bottom-width: 2px;
}
.border-white {
  border-color: #ffffff;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.p-4 {
  padding: 1rem;
}
.text-center {
  text-align: center;
}
.bg-red-800 {
  background-color: #991b1b;
}
.z-\[10\] { /* Z-index para el overlay de carga */
  z-index: 10;
}

</style>