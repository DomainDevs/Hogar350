<template>
  <div class="tour-container w-full max-w-5xl mx-auto p-4 bg-gray-100 rounded-2xl shadow-xl">
    <div class="tour360 w-full rounded-xl overflow-hidden shadow-lg relative bg-gray-900">
      <div
        v-if="panoramaExists"
        id="panorama"
        class="w-full h-[600px]"
        @mousemove="moveCursor"
        @contextmenu.prevent="handleRightClick"
      ></div>

      <div class="absolute top-2 left-10 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-20">
        Tip: Clic derecho para añadir flecha de conexión
      </div>

      <div
        v-show="cursorVisible"
        :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
        class="custom-cursor pointer-events-none"
      ></div>

      <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-10 pointer-events-none">
        <button
          v-for="(room, key) in rooms"
          :key="key"
          @click="goRoom(key)"
          class="pointer-events-auto px-4 py-2 rounded-md text-white font-semibold transition-all shadow-lg backdrop-blur-md"
          :class="currentRoom === key ? 'bg-[#ff5500] scale-105' : 'bg-black/50 hover:bg-black/80'"
        >
          {{ room.name }}
        </button>
      </div>
    </div>

    <div class="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-800">Panel de Edición</h3>
        <div class="flex gap-2">
          <button
            @click="clearAllHotspots"
            class="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Limpiar Conectores
          </button>

          <label class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
            + Añadir Imagen 360
            <input type="file" class="hidden" accept="image/*" @change="addImage" />
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(room, key) in rooms" :key="key" class="p-4 border rounded-lg bg-gray-50">
          <div class="flex items-center gap-2 mb-2">
            <input
              v-model="room.name"
              @input="syncHotspotTexts"
              class="flex-1 font-bold bg-transparent border-b border-gray-300 focus:border-orange-500 outline-none p-1"
            />
            <button @click="removeRoom(key)" class="text-red-500 text-xs font-medium">Eliminar</button>
          </div>

          <div class="text-[11px] text-gray-500 italic">
            Flechas en esta sala: {{ room.hotSpots.length }}
            <ul class="mt-2 not-italic text-gray-700 space-y-2">
              <li
                v-for="(hs, index) in room.hotSpots"
                :key="index"
                class="border rounded p-2 bg-white"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold">Conecta a:</span>
                  <button
                    @click="removeHotSpot(key, index)"
                    class="text-red-400 text-xs font-medium"
                  >
                    Quitar
                  </button>
                </div>

                <select
                  v-model="hs.sceneId"
                  @change="updateHotspotConnection(key, hs)"
                  class="w-full text-xs border rounded p-1"
                >
                  <template v-for="(r, rKey) in rooms" :key="rKey">
                    <option
                      v-if="rKey !== key"
                      :value="rKey"
                    >
                      {{ r.name }}
                    </option>
                  </template>
                </select>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, reactive } from 'vue'
//import 'pannellum/build/pannellum.css'
import '@/assets/libs/pannellum/pannellum.css'
// Importamos el JS directamente (Vite lo procesará)
import '@/assets/libs/pannellum/pannellum.js';

const viewerRef = ref(null)
const currentRoom = ref('living')
const panoramaExists = ref(false)
const cursorX = ref(0)
const cursorY = ref(0)
const cursorVisible = ref(false)

const rooms = reactive({
  living: {
    name: 'Living',
    url: '/images/3D/2150315618.jpg',
    hotSpots: []
  }
})

/**
 * Función Nueva: Sincroniza el texto visual de los hotspots con el nombre actual de las salas
 */
function syncHotspotTexts() {
  Object.keys(rooms).forEach(roomId => {
    rooms[roomId].hotSpots.forEach(hs => {
      if (rooms[hs.sceneId]) {
        hs.text = rooms[hs.sceneId].name;
      }
    });
  });
  
  // Refrescar el visor para que se vea el cambio inmediatamente
  if (viewerRef.value) {
    const currentYaw = viewerRef.value.getYaw();
    const currentPitch = viewerRef.value.getPitch();
    // Cargamos de nuevo la escena actual para forzar el re-render de los tooltips
    viewerRef.value.loadScene(currentRoom.value, currentPitch, currentYaw, 'same');
  }
}

function clearAllHotspots() {
  if (confirm("¿Estás seguro de que deseas eliminar todos los conectores?")) {
    Object.keys(rooms).forEach(key => {
      rooms[key].hotSpots = [];
      if (viewerRef.value) {
        viewerRef.value.removeScene(key);
        viewerRef.value.addScene(key, {
          type: 'equirectangular',
          panorama: rooms[key].url,
          hotSpots: rooms[key].hotSpots,
          hfov: 110
        });
      }
    });
    if (viewerRef.value) {
      viewerRef.value.loadScene(currentRoom.value);
    }
  }
}

function handleRightClick(e) {
  if (!viewerRef.value) return
  const [pitch, yaw] = viewerRef.value.mouseEventToCoords(e)
  const roomKeys = Object.keys(rooms)
  const otherRooms = roomKeys.filter(id => id !== currentRoom.value)

  if (otherRooms.length === 0) {
    alert("Sube otra imagen primero.")
    return
  }

  const destinationId = otherRooms[0]
  const destinationName = rooms[destinationId].name

  if (confirm(`¿Añadir conexión hacia "${destinationName}"?`)) {
    const newHS = {
      pitch: pitch,
      yaw: yaw,
      type: "scene",
      text: destinationName,
      sceneId: destinationId
    }
    const roomId = currentRoom.value;
    const currentYaw = viewerRef.value.getYaw();
    const currentPitch = viewerRef.value.getPitch();

    rooms[roomId].hotSpots.push(newHS)
    viewerRef.value.loadScene(roomId, currentPitch, currentYaw, 'same');
  }
}

function updateHotspotConnection(roomKey, hs) {
  if (!viewerRef.value) return
  if (rooms[hs.sceneId]) {
    hs.text = rooms[hs.sceneId].name;
  }
  viewerRef.value.loadScene(roomKey)
}

function removeHotSpot(roomKey, index) {
  if (!viewerRef.value) return;
  const currentYaw = viewerRef.value.getYaw();
  const currentPitch = viewerRef.value.getPitch();
  const currentHfov = viewerRef.value.getHfov();

  rooms[roomKey].hotSpots.splice(index, 1);

  const activeHotspots = document.querySelectorAll('.pnlm-hotspot-base');
  activeHotspots.forEach(hs => hs.remove());
  const activeTooltips = document.querySelectorAll('.pnlm-tooltip');
  activeTooltips.forEach(tt => tt.remove());

  viewerRef.value.removeScene(roomKey);
  viewerRef.value.addScene(roomKey, {
    type: 'equirectangular',
    panorama: rooms[roomKey].url,
    hotSpots: rooms[roomKey].hotSpots,
    hfov: 110
  });

  viewerRef.value.loadScene(roomKey, currentPitch, currentYaw, currentHfov);
}

function addImage(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const newId = 'room_' + Date.now()
    rooms[newId] = {
      name: file.name.split('.')[0],
      url: e.target.result,
      hotSpots: []
    }
    if (!panoramaExists.value) initViewer()
    else {
      viewerRef.value.addScene(newId, {
        type: 'equirectangular',
        panorama: e.target.result,
        hotSpots: rooms[newId].hotSpots
      })
    }
  }
  reader.readAsDataURL(file)
}

function removeRoom(key) {
  if (Object.keys(rooms).length <= 1) return
  delete rooms[key]
  if (currentRoom.value === key) goRoom(Object.keys(rooms)[0])
}

function goRoom(key) {
  if (viewerRef.value) viewerRef.value.loadScene(key)
}

async function initViewer() {
  panoramaExists.value = true
  await nextTick()
  const scenesConfig = {}
  Object.entries(rooms).forEach(([key, room]) => {
    scenesConfig[key] = {
      type: 'equirectangular',
      panorama: room.url,
      hotSpots: room.hotSpots,
      hfov: 110
    }
  })
  viewerRef.value = window.pannellum.viewer('panorama', {
    default: {
      firstScene: currentRoom.value,
      sceneFadeDuration: 1000,
      autoLoad: true,
      autoRotate: -1,
      autoRotateInactivityDelay: 3000
    },
    scenes: scenesConfig
  })
  viewerRef.value.on('scenechange', (id) => currentRoom.value = id)
}

function moveCursor(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  cursorX.value = e.clientX - rect.left
  cursorY.value = e.clientY - rect.top
  cursorVisible.value = true
}

onMounted(async () => {
  await nextTick()
  // 1. Cargar el CSS dinámicamente (si no lo pusiste en index.html)
  if (!document.getElementById('pannellum-css')) {
    const link = document.createElement('link');
    link.id = 'pannellum-css';
    link.rel = 'stylesheet';
    link.href = '/libs/pannellum/pannellum.css';
    document.head.appendChild(link);
  }

  // 2. Cargar el Script
  if (!window.pannellum) {
    const script = document.createElement('script');
    script.src = '/libs/pannellum/pannellum.js';
    script.onload = initViewer;
    document.body.appendChild(script);
  } else {
    initViewer();
  }
});
</script>

<style scoped>
:deep(.pnlm-hotspot-base) {
    height: 26px !important;
    width: 26px !important;
    border-radius: 50%;
    background: rgba(255, 85, 0, 0.5);
    border: 3px solid white;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    cursor: pointer;
    display: block !important;
}
:deep(.pnlm-hotspot-base)::after {
    content: '';
    position: absolute;
    top: 0px; left: 0px;
    width: 26px; height: 26px;
    border-radius: 50%;
    border: 2px solid rgba(245, 225, 216, 0.8);
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
}
:deep(.pnlm-hotspot-base:hover) {
    background: #ff5500;
    transform: scale(1.2);
}
:deep(.pnlm-tooltip span) {
    background: rgba(0, 0, 0, 0.7) !important;
    color: white !important;
    padding: 5px 10px !important;
    border-radius: 5px !important;
}
</style>