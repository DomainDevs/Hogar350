<template>
  <br/>
  <div v-if="loaded" class="max-w-4xl mx-auto p-1 space-y-2">

    <!-- Bloqueo mientras publica -->
    <div v-if="blocked" class="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <span class="text-white text-lg">Enviando publicación...</span>
    </div>

  <div>

    <MediaViewer
    :images="form.imagenes.map(i => i.url || i)"
    :video-url="form.general.videoUrl"
    :tour360-url="tourUrl"
    @change-image="currentImageIndex = $event"
    />


  </div>

  <!-- Información general -->
  <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
    
    <!-- Header -->
    <div class="border-b pb-4">
      <h2 class="text-5xl font-bold">
        {{ form.general.titulo }}
      </h2>
    </div>


    <!-- Grid principal -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Tipo de oferta -->
      <div class="flex items-start gap-3">
        <Clock class="w-5 h-5 text-[#ff5500] mt-1" />
        <div>
          <p class="text-xs uppercase text-gray-400 tracking-wide">
            Tipo de oferta
          </p>
          <p class="font-semibold text-gray-800">
            {{ form.general.tipoOferta }}
          </p>
        </div>
      </div>

      <!-- Tipo de inmueble -->
      <div class="flex items-start gap-3">
        <Building class="w-5 h-5 text-[#ff5500] mt-1" />
        <div>
          <p class="text-xs uppercase text-gray-400 tracking-wide">
            Tipo de inmueble
          </p>
          <p class="font-semibold text-gray-800">
            {{ form.general.tipoInmueble }}
          </p>
        </div>
      </div>

      <!-- Contacto (solo nombre, sin datos sensibles) -->
      <div class="flex items-start gap-3">
        <Home class="w-5 h-5 text-[#ff5500] mt-1" />
        <div>
          <p class="text-xs uppercase text-gray-400 tracking-wide">
            Publicado por
          </p>
          <p class="font-semibold text-gray-800">
            <span v-if="form.general.tipoIdentificacion === 'NIT'">
              {{ form.general.razonSocial }}
            </span>

            <span v-else>
              {{ form.general.nombreContacto }} {{ form.general.apellidoContacto }}
            </span>
          </p>
          <p class="text-gray-600 text-xs">
            • {{ form.general.telefonoContacto }} • {{ form.general.emailContacto }}
          </p>
        </div>
      </div>

      <!-- Precios -->
      <div class="flex flex-col gap-3">
      <div class="flex items-start gap-3">
        <BadgeDollarSign class="w-5 h-5 text-[#ff5500] mt-1" />
        <div>
          <p v-if="form.general.tipoOferta === 'Vender'" class="text-xs uppercase text-gray-400 tracking-wide">
            Precio de Venta
          </p>
          <p v-if="form.general.tipoOferta === 'Arrendar'" class="text-xs uppercase text-gray-400 tracking-wide">
            Valor Arriendo
          </p>
          <p v-if="form.general.tipoOferta === 'Compartir'" class="text-xs uppercase text-gray-400 tracking-wide">
            Valor Arriendo compartir
          </p>
          <p class="font-semibold text-gray-800 text-3xl">
            <span v-if="form.general.tipoOferta === 'Vender'">
            {{ form.precios.venta }}
            </span>
            <span v-if="form.general.tipoOferta === 'Arrendar'">
            {{ form.precios.arriendo }}
            </span>
            <span v-if="form.general.tipoOferta === 'Compartir'">
            {{ form.precios.compartir }}
            </span>
          </p>
        </div>
      </div>

      <!-- administración-->
      <div v-if="form.general.tipoOferta === 'Arrendar'" class="flex items-start gap-3">
        <BadgeDollarSign class="w-5 h-5 text-[#ff5500] mt-1" />
        <div>
          <p class="text-xs uppercase text-gray-400 tracking-wide">
            Valor administración
          </p>
          <p class="font-semibold text-gray-800">
            {{ form.precios.administracion }}
          </p>
        </div>
      </div>
      </div>


    </div>

    <!-- Descripción -->
    <div>
      <p class="text-xs uppercase text-gray-400 tracking-wide mb-2">
        Descripción
      </p>
      <hr/>
      <p class="text-gray-700 leading-relaxed text-sm">
        {{ form.general.descripcion }}
      </p>
    </div>

  </div>

    <!-- Características -->
    <div class="step-section shadow-md">
      <h3 class="text-xl font-semibold mb-4">Características</h3>
      <hr/><br/>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">


        <!-- Habitaciones -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Bed class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">{{ form.caracteristicas.habitaciones }}</span>
          <span class="text-sm text-gray-600">Habitaciones</span>
        </div>

        <!-- Baños -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Bath class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">{{ form.caracteristicas.banos }}</span>
          <span class="text-sm text-gray-600">Baños</span>
        </div>

        <!-- Parqueaderos -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Car class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">{{ form.caracteristicas.parqueaderos }}</span>
          <span class="text-sm text-gray-600">Parqueaderos</span>
        </div>

        <!-- Área Construida -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Layers class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">{{ form.caracteristicas.area }}</span>
          <span class="text-sm text-gray-600">Área Construida (m²)</span>
        </div>

        <!-- Área privada -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Layers class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">{{ form.caracteristicas.areapv }}</span>
          <span class="text-sm text-gray-600">Área privada (m²)</span>
        </div>
        
        <!-- Estrato -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Home class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">{{ form.caracteristicas.estrato }}</span>
          <span class="text-sm text-gray-600">Estrato</span>
        </div>

        <!-- Piso -->
      <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
        <Building class="w-6 h-6 text-[#ff5500]" />
        <span class="mt-1 font-semibold">{{ form.caracteristicas.piso }}</span>
        <span class="text-sm text-gray-600">Piso</span>
      </div>

        <!-- Tiempo de construcción -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Clock class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">
            {{
              form.caracteristicas.tiempoConstruccion === '0' ? 'Proyecto nuevo' :
              form.caracteristicas.tiempoConstruccion === '0-5' ? 'Entre 0 y 5 años' :
              form.caracteristicas.tiempoConstruccion === '5-10' ? 'Entre 5 y 10 años' :
              form.caracteristicas.tiempoConstruccion === '10-15' ? 'Entre 10 y 15 años' :
              form.caracteristicas.tiempoConstruccion === '20-30' ? 'Entre 20 y 30 años' :
              form.caracteristicas.tiempoConstruccion === '30+' ? 'Mayor de 30 años' :
              '-'
            }}
          </span>
          <span class="text-sm text-gray-600">Tiempo de construcción</span>
        </div>

        <!-- Acepta Mascotas -->
        <div class="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm">
          <Heart class="w-6 h-6 text-[#ff5500]" />
          <span class="mt-1 font-semibold">
            {{ form.caracteristicas.aceptaMascotas ? 'Sí' : 'No' }}
          </span>
          <span class="text-sm text-gray-600">Acepta Mascotas</span>
        </div>

      </div>
    </div>

    <!-- Ubicación -->
    <div class="step-section shadow-md">
      <h3 class="text-xl font-semibold mb-4">Ubicación</h3>
      <hr class="mb-4"/>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div 
          v-for="item in ubicacionItems" 
          :key="item.label"
          class="flex items-start gap-3"
          :class="item.full ? 'md:col-span-2' : ''"
        >
          <component :is="item.icon" class="w-5 h-5 text-[#ff5500] mt-1" />

          <div>
            <p class="text-xs uppercase text-gray-400 tracking-wide">
              {{ item.label }}
            </p>
            <p class="font-semibold text-gray-800">
              {{ item.value() }} <!-- <- Llamar la función -->
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Botones -->
    <div class="flex gap-4 mt-6 justify-end">
      <button @click="goBack" class="py-3 px-6 rounded-md bg-slate-600 text-white hover:bg-slate-900 font-semibold transition-colors duration-200">
        Volver a editar
      </button>
      <button @click="publish" class="py-3 px-6 rounded-md bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-colors duration-200 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 13l4 4L19 7"/>
        </svg>
        Publicar
      </button>
    </div>
    
  </div>
</template>

<script setup>
import { Bed, Bath, Home, Car, Layers, Clock, Heart, Building, MapPin, BadgeDollarSign } from 'lucide-vue-next'
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MediaViewer from '@/shared/components/MediaViewer.vue'

const tourUrl = 'https://kuula.co/share/collection/798qV?logo=0&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1'


const router = useRouter();
const blocked = ref(false);
const loaded = ref(false);
const currentImageIndex = ref(0)

const form = reactive({
  general: { tipoOferta:'', tipoInmueble:'', titulo:'', nombreContacto:'', apellidoContacto:'', telefonoContacto:'', emailContacto:'', descripcion:'' },
  caracteristicas: { 
    habitaciones:0, 
    banos:0, 
    parqueaderos:0, 
    area:0,
    areapv:0,
    estrato:'',
    aceptaMascotas:null },
  ubicacion: { departamento:'', municipio:'', localidad:'', direccion:'' },
  imagenes: []
});

const ubicacionItems = [
  { label: 'Departamento', value: () => form.ubicacion.departamento, icon: MapPin },
  { label: 'Municipio', value: () => form.ubicacion.municipio, icon: MapPin },
  { label: 'Localidad', value: () => form.ubicacion.localidad, icon: MapPin },
  { label: 'Dirección', value: () => form.ubicacion.direccion, icon: Home, full: true }
]

onMounted(() => {
  const saved = sessionStorage.getItem('publicationForm');
  if(saved) {
    const data = JSON.parse(saved);
    Object.assign(form, data.form);
    // Datos de prueba para test
    form.imagenes = [
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_1_x.jpg?w=1080&q=80',
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_2_x.jpg?w=1080&q=80',
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_3_x.jpg?w=1080&q=80',
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_4_x.jpg?w=1080&q=80',
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_5_x.jpg?w=1080&q=80',
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_6_x.jpg?w=1080&q=80',
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_7_x.jpg?w=1080&q=80',
      'https://multimedia.metrocuadrado.com/13439-M6448066/13439-M6448066_8_x.jpg?w=1080&q=80'
    ];
    //form.general.videoUrl = 'https://www.youtube.com/watch?v=aVFial7-AvM';
    //form.general.titulo = 'Departamento de prueba';
  }
  loaded.value = true;
});

const goBack = () => router.back();

const publish = async () => {
  blocked.value = true;
  try {
    const payload = { ...form, imagenes: form.imagenes.map(img=>img.url||img) };
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
    console.error(err);
    alert('Error al publicar, revisa la consola.');
    blocked.value = false;
  }
};

const removeImage = (index) => {
  form.imagenes.splice(index, 1);
};
</script>

<style scoped>
.step-section {
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom:1rem;
  background: white;
}
</style>