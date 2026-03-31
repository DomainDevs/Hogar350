<template>
  <br/>
  <div v-if="loaded" class="max-w-4xl mx-auto p-1 space-y-2">
    <!-- Overlay de carga -->
    <div v-if="blocked" class="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <span class="text-white text-lg font-medium">Enviando publicación...</span>
    </div>

    <!-- Media -->
    <!-- Media -->
    <MediaViewer
      :images="form.imagenes.map(i => i.url || i)"
      :video-url="form.general.videoUrl"
      :tour360-url="tourUrl"
      :lat="form.ubicacion.lat"
      :lng="form.ubicacion.lng"
      @change-image="currentImageIndex = $event"
    />

    <!-- Card Principal -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div class="border-b pb-4">
        <h2 class="text-5xl font-bold">{{ form.general.titulo }}</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Info General -->
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <Clock class="w-5 h-5 text-[#ff5500] mt-1" />
            <div>
              <p class="text-xs uppercase text-gray-400">Tipo de oferta</p>
              <p class="font-semibold text-gray-800">{{ form.general.tipoOferta }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Building class="w-5 h-5 text-[#ff5500] mt-1" />
            <div>
              <p class="text-xs uppercase text-gray-400">Tipo de inmueble</p>
              <p class="font-semibold text-gray-800">{{ form.general.tipoInmueble }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Home class="w-5 h-5 text-[#ff5500] mt-1" />
            <div>
              <p class="text-xs uppercase text-gray-400">Publicado por</p>
              <p class="font-semibold text-gray-800">
                {{ form.general.tipoIdentificacion === 'NIT' ? form.general.razonSocial : `${form.general.nombreContacto} ${form.general.apellidoContacto}` }}
              </p>
              <p class="text-gray-600 text-xs">• {{ form.general.telefonoContacto }} • {{ form.general.emailContacto }}</p>
            </div>
          </div>
        </div>

        <!-- Precios -->
        <div class="flex flex-col gap-3">
          <div class="flex items-start gap-3">
            <BadgeDollarSign class="w-5 h-5 text-[#ff5500] mt-1" />
            <div>
              <p class="text-xs uppercase text-gray-400 tracking-wide">{{ labelPrecio }}</p>
              <p class="font-semibold text-gray-800 text-3xl">$ {{ valorMostrado }}</p>
            </div>
          </div>
          <div v-if="form.general.tipoOferta === 'Arrendar'" class="flex items-start gap-3">
            <BadgeDollarSign class="w-5 h-5 text-[#ff5500] mt-1" />
            <div>
              <p class="text-xs uppercase text-gray-400">Valor administración</p>
              <p class="font-semibold text-gray-800">{{ form.precios.administracion }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="text-xs uppercase text-gray-400 mb-2">Descripción</p>
        <hr/>
        <p class="text-gray-700 leading-relaxed text-sm mt-2 whitespace-pre-wrap">{{ form.general.descripcion }}</p>
      </div>
    </div>

    <!-- Características -->
    <div class="step-section shadow-md">
      <h3 class="text-xl font-semibold mb-4">Características</h3>
      <hr/><br/>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div v-for="feat in listaCaracteristicas" :key="feat.label" class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <component :is="feat.icon" class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">{{ feat.value }}</span>
          <span class="text-sm text-gray-600">{{ feat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Ubicación -->
    <div class="step-section shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Ubicación</h3>
        <a v-if="form.ubicacion.lat" :href="googleMapsUrl" target="_blank" class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-200">
          <MapPin class="w-3.5 h-3.5" /> VER EN GOOGLE MAPS
        </a>
      </div>
      <hr class="mb-4"/>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="item in ubicacionVisible" :key="item.label" class="flex items-start gap-3" :class="{ 'md:col-span-2': item.full }">
          <component :is="item.icon" class="w-5 h-5 text-[#ff5500] mt-1" />
          <div>
            <p class="text-xs uppercase text-gray-400">{{ item.label }}</p>
            <p class="font-semibold text-gray-800">{{ item.value() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Acciones -->
    <div class="flex gap-4 mt-6 justify-end">
      <button @click="goBack" class="py-3 px-6 rounded-md bg-slate-600 text-white hover:bg-slate-900 font-semibold transition-colors">
        Volver a editar
      </button>
      <button @click="publish" class="py-3 px-6 rounded-md bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-colors flex items-center gap-2">
        <CheckCircle class="w-5 h-5" /> Publicar
      </button>
    </div>
  </div>
</template>

<script setup>
import { Bed, Bath, Home, Car, Layers, Clock, Heart, Building, MapPin, BadgeDollarSign, CheckCircle } from 'lucide-vue-next'
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MediaViewer from '@/shared/components/MediaViewer.vue'

const router = useRouter();
const blocked = ref(false);
const loaded = ref(false);
const currentImageIndex = ref(0)
const tourUrl = 'https://kuula.co/share/collection/798qV?logo=0&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1'

const form = reactive({
  general: { tipoOferta:'', tipoInmueble:'', titulo:'', nombreContacto:'', apellidoContacto:'', telefonoContacto:'', emailContacto:'', descripcion:'', tipoIdentificacion:'', razonSocial:'', videoUrl:'' },
  precios: { venta:0, arriendo:0, compartir:0, administracion:'' },
  caracteristicas: { habitaciones:0, banos:0, parqueaderos:0, area:0, areapv:0, estrato:'', piso:'', tiempoConstruccion:'', aceptaMascotas:null },
  ubicacion: { departamento:'', municipio:'', localidad:'', direccion:'', lat:null, lng:null },
  imagenes: []
});

// --- LOGICA COMPUTADA PARA LIMPIAR EL TEMPLATE ---

const labelPrecio = computed(() => {
  if (form.general.tipoOferta === 'Vender') return 'Precio de Venta';
  if (form.general.tipoOferta === 'Arrendar') return 'Valor Arriendo';
  return 'Valor Arriendo compartir';
});

const valorMostrado = computed(() => {
  if (form.general.tipoOferta === 'Vender') return form.precios.venta;
  if (form.general.tipoOferta === 'Arrendar') return form.precios.arriendo;
  return form.precios.compartir;
});

const tiempoTexto = computed(() => {
  const opciones = { '0': 'Proyecto nuevo', '0-5': '0-5 años', '5-10': '5-10 años', '10-15': '10-15 años', '20-30': '20-30 años', '30+': '30+ años' };
  return opciones[form.caracteristicas.tiempoConstruccion] || '-';
});

const listaCaracteristicas = computed(() => [
  { label: 'Habitaciones', value: form.caracteristicas.habitaciones, icon: Bed },
  { label: 'Baños', value: form.caracteristicas.banos, icon: Bath },
  { label: 'Parqueaderos', value: form.caracteristicas.parqueaderos, icon: Car },
  { label: 'Área Const.', value: `${form.caracteristicas.area} m²`, icon: Layers },
  { label: 'Área Priv.', value: `${form.caracteristicas.areapv} m²`, icon: Layers },
  { label: 'Estrato', value: form.caracteristicas.estrato, icon: Home },
  { label: 'Piso', value: form.caracteristicas.piso, icon: Building },
  { label: 'Construcción', value: tiempoTexto.value, icon: Clock },
  { label: 'Mascotas', value: form.caracteristicas.aceptaMascotas ? 'Sí' : 'No', icon: Heart },
]);

const ubicacionVisible = computed(() => [
  { label: 'Departamento', value: () => typeof form.ubicacion.departamento === 'object' ? form.ubicacion.departamento?.nombre : form.ubicacion.departamento, icon: MapPin },
  { label: 'Municipio', value: () => typeof form.ubicacion.municipio === 'object' ? form.ubicacion.municipio?.nombre : form.ubicacion.municipio, icon: MapPin },
  { label: 'Localidad', value: () => typeof form.ubicacion.localidad === 'object' ? form.ubicacion.localidad?.nombre : form.ubicacion.localidad, icon: MapPin },
  { label: 'Dirección', value: () => form.ubicacion.direccion || '-', icon: Home } //, full: true
]);

const googleMapsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${form.ubicacion.lat},${form.ubicacion.lng}`);

// --- CICLO DE VIDA Y MÉTODOS ---

onMounted(() => {
  const saved = sessionStorage.getItem('publicationForm');
  if(saved) {
    const data = JSON.parse(saved);
    Object.assign(form, data.form);
    if(!form.imagenes.length) {
       form.imagenes = [
        'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_1_x.jpg?w=1080&q=80',
        'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_2_x.jpg?w=1080&q=80'
      ];
    }
  }
  loaded.value = true;
});

const goBack = () => router.back();

const publish = async () => {
  blocked.value = true;
  try {
    const payload = { ...form, imagenes: form.imagenes.map(img => img.url || img) };
    const res = await fetch('https://localhost:5001/api/publications', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('Error al publicar');
    sessionStorage.removeItem('publicationForm');
    alert('¡Publicación realizada con éxito!');
    router.push('/');
  } catch(err) {
    alert('Error al publicar.');
    blocked.value = false;
  }
};
</script>

<style scoped>
.step-section {
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background: white;
}
</style>