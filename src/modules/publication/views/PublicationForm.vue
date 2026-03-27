<template>
  <br/>
  <div class="w-full max-w-4xl mx-auto p-4 space-y-8 bg-white font-nunito text-gray-900 rounded-2xl">  
    <div v-if="blocked" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-orange-200 border-t-[#ff5500] rounded-full animate-spin"></div>
        <span class="text-gray-600 font-medium text-sm tracking-widest uppercase">Cargando...</span>
      </div>
    </div>

    <div ref="section1" class="step-section">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span class="w-7 h-7 rounded-md bg-orange-100 text-[#ff5500] flex items-center justify-center text-xs font-black">1</span>
        Información General
      </h2>

      <form @submit.prevent>
        <div class="mb-6">
          <label class="label1-style">Tipo de oferta <span class="text-[#ff5500]">*</span></label>
          <div class="inline-flex p-1 bg-gray-100 rounded-lg w-full sm:w-fit">
            <button
              v-for="option in ['Vender', 'Arrendar', 'Compartir']"
              :key="option"
              type="button"
              @click="form.general.tipoOferta = option"
              class="px-8 py-2 text-sm font-bold transition-all duration-200 rounded-md flex-1 sm:flex-none"
              :class="form.general.tipoOferta === option 
                ? 'bg-white text-[#ff5500] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="relative">
            <label class="label-style">Tipo de Inmueble <span class="text-[#ff5500]">*</span></label>
            <select v-model="form.general.tipoInmueble" @change="validateField('tipoInmueble')"
              class="input-style"
              :class="[errors.tipoInmueble ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500] focus:ring-2 focus:ring-orange-100']">
              <option disabled value="">Selecciona una opción</option>
              <option v-for="type in propertyTypesOptions" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
            <p v-if="errors.tipoInmueble" class="error-msg">{{ errors.tipoInmueble }}</p>
          </div>

          <div class="relative">
            <label class="label-style">Título de la publicación <span class="text-[#ff5500]">*</span></label>
            <input type="text" v-model="form.general.titulo" minlength="20" maxlength="70"
              @blur="validateField('titulo')" placeholder="Ej: Hermoso apto en el Poblado"
              :class="[errors.titulo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']"
              class="input-style" />
            <div class="flex justify-between mt-1">
              <p v-if="errors.titulo" class="error-msg !mt-0">{{ errors.titulo }}</p>
              <p v-else class="text-[10px] text-gray-400 font-bold uppercase ml-auto">{{ form.general.titulo.length }} / 70</p>
            </div>
          </div>

          <div class="relative">
            <label for="doc-number" class="label-style">Documento / NIT <span class="text-[#ff5500]">*</span></label>
            <div class="flex gap-0">
              <select v-model="form.general.tipoIdentificacion" class="w-24 input-style !px-2 bg-gray-50 border-r-0 rounded-r-none focus:ring-0">
                <option value="CC">CC</option>
                <option value="NIT">NIT</option>
                <option value="CE">CE</option>
              </select>
              <input type="number" id="doc-number" name="organization-id" inputmode="numeric"
                v-model="form.general.numeroIdentificacion" @blur="validateField('numeroIdentificacion')"
                placeholder="5 a 15 dígitos"
                :class="[errors.numeroIdentificacion ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']"
                class="input-style rounded-l-none" />
            </div>
            <p v-if="errors.numeroIdentificacion" class="error-msg">{{ errors.numeroIdentificacion }}</p>
          </div>

          <!-- validar y continuar -->
          <div class="relative">
            <label for="tel" class="label-style">Teléfono móvil <span class="text-[#ff5500]">*</span></label>
            <input type="tel" id="tel" name="tel" autocomplete="tel"
              v-model="form.general.telefonoContacto" v-mask="{ mask: '+57 000 000 0000' }"
              @blur="validateField('telefonoContacto')"
              :class="[errors.telefonoContacto ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']"
              class="input-style" />
            <p v-if="errors.telefonoContacto" class="error-msg">{{ errors.telefonoContacto }}</p>
          </div>

          <!-- razon social -->
          <div v-if="form.general.tipoIdentificacion === 'NIT'" class="relative md:col-span-2">
            <label class="label-style">
              Razón Social <span class="text-[#ff5500]">*</span>
            </label>
            <input
            type="text"
            v-model="form.general.razonSocial"
            @blur="validateField('razonSocial')"
            placeholder="Ej: Inmobiliaria XYZ S.A.S"
            class="input-style"
            />
            <p v-if="errors.razonSocial" class="error-msg">
              {{ errors.razonSocial }}
            </p>
          </div>

           <!-- nombre -->
          <div class="relative" v-if="form.general.tipoIdentificacion !== 'NIT'">
            <label for="first-name" class="label-style">Nombre contacto <span class="text-[#ff5500]">*</span></label>
            <input type="text" id="first-name" name="given-name" autocomplete="given-name"
              v-model="form.general.nombreContacto" @blur="validateField('nombreContacto')"
              placeholder="Tu nombre"
              :class="[errors.nombreContacto ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']"
              class="input-style" />
            <p v-if="errors.nombreContacto" class="error-msg">{{ errors.nombreContacto }}</p>
          </div>

          <!-- apellido -->
          <div class="relative" v-if="form.general.tipoIdentificacion !== 'NIT'">
            <label for="last-name" class="label-style">Apellido contacto <span class="text-[#ff5500]">*</span></label>
            <input type="text" id="last-name" name="family-name" autocomplete="family-name"
              v-model="form.general.apellidoContacto" @blur="validateField('apellidoContacto')"
              placeholder="Tu apellido"
              :class="[errors.apellidoContacto ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']"
              class="input-style" />
            <p v-if="errors.apellidoContacto" class="error-msg">{{ errors.apellidoContacto }}</p>
          </div>

          <!-- correo electronico -->
          <div class="md:col-span-2 relative">
            <label for="email" class="label-style">Correo Electrónico <span class="text-[#ff5500]">*</span></label>
            <input type="email" id="email" name="email" autocomplete="email" pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
              v-model="form.general.emailContacto" @blur="validateField('emailContacto')"
              placeholder="correo@ejemplo.com"
              :class="[errors.emailContacto ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']"
              class="input-style" />
            <p v-if="errors.emailContacto" class="error-msg">{{ errors.emailContacto }}</p>
          </div>
        </div>

        <!-- Descripción -->
        <div class="mt-6">
          <label class="label-style">Descripción publicación <span class="text-[#ff5500]">*</span></label>
          <textarea v-model="form.general.descripcion" rows="4" maxlength="500" @blur="validateField('descripcion')"
            placeholder="Describe los mejores detalles..."
            :class="[errors.descripcion ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']"
            class="input-style resize-none"></textarea>
          <div class="flex justify-between mt-1">
            <p class="text-gray-400 text-[10px] font-bold uppercase">{{ form.general.descripcion.length }} / 500</p>
            <p v-if="errors.descripcion" class="error-msg !mt-0">{{ errors.descripcion }}</p>
          </div>
        </div>

        <!-- validar y continuar -->
        <button type="button" @click="unlockSection(2)" class="btn-primary mt-6">Continuar a Características</button>
      </form>
    </div>

    <div ref="section2" v-show="unlockedSections[2]" class="step-section">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span class="w-7 h-7 rounded-md bg-orange-100 text-[#ff5500] flex items-center justify-center text-xs font-black">2</span>
        Características
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(value, key) in form.caracteristicas" :key="key" class="flex flex-col">
          <label class="label-style mb-2">{{ caracteristicasLabels[key] }} <span class="text-[#ff5500]">*</span></label>

          <div v-if="['habitaciones', 'banos', 'parqueaderos'].includes(key)" class="inline-flex rounded-lg bg-gray-50 p-1 border border-gray-100">
            <button
              v-for="opt in (key === 'parqueaderos' ? [0,1,2,3,'4+'] : [1,2,3,4,'5+'])"
              :key="opt"
              type="button"
              @click="form.caracteristicas[key] = opt; validateField(key)"
              class="px-4 py-2 text-sm font-bold transition-all rounded-md flex-1"
              :class="form.caracteristicas[key] === opt ? 'bg-white text-[#ff5500] shadow-sm' : 'text-gray-500 hover:bg-gray-200/50'"
            >
              {{ opt }}
            </button>
          </div>

          <select v-else-if="key === 'estrato'" v-model="form.caracteristicas.estrato" @change="validateField('estrato')"
            class="input-style" :class="[errors.estrato ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']">
            <option disabled value="">Selecciona</option>
            <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
          </select>

          <select v-else-if="key === 'tiempoConstruccion'" v-model="form.caracteristicas.tiempoConstruccion" 
            @change="validateField('tiempoConstruccion')" class="input-style" :class="[errors.tiempoConstruccion ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']">
            <option disabled value="">Selecciona</option>
            <option value="0-5">0-5 años</option>
            <option value="5-10">5-10 años</option>
            <option value="10-15">10-15 años</option>
            <option value="20-30">20-30 años</option>
            <option value="30+">Más de 30 años</option>
            <option value="0">Proyecto en nuevo</option>
          </select>

          <div v-else-if="key === 'aceptaMascotas'" class="inline-flex rounded-lg bg-gray-50 p-1 border border-gray-100">
            <button
              v-for="opt in [{l:'Sí',v:true},{l:'No',v:false}]"
              :key="opt.l"
              type="button"
              @click="form.caracteristicas.aceptaMascotas = opt.v"
              class="px-8 py-2 text-sm font-bold transition-all rounded-md flex-1"
              :class="form.caracteristicas.aceptaMascotas === opt.v ? 'bg-white text-[#ff5500] shadow-sm' : 'text-gray-500'"
            >
              {{ opt.l }}
            </button>
          </div>

          <div v-else class="relative">
            <input type="number" min="0" v-model.number="form.caracteristicas[key]" @input="validateField(key)" @blur="validateField(key)"
              :class="[errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']" class="input-style pr-10" />
            <span v-if="key.includes('area')" class="absolute right-3 top-2.5 text-[10px] font-bold text-gray-400">M²</span>
          </div>
          <p v-if="errors[key]" class="error-msg">{{ errors[key] }}</p>
        </div>
      </div>

      <button type="button" @click="unlockSection(3)" class="btn-primary mt-8">Continuar a Ubicación</button>
    </div>

    <!-- localización -->
    <div ref="section3" v-show="unlockedSections[3]" class="step-section">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span class="w-7 h-7 rounded-md bg-orange-100 text-[#ff5500] flex items-center justify-center text-xs font-black">3</span>
        Ubicación
      </h2>


      <div class="md:col-span-2">
        <label for="address" class="label-style">Dirección exacta <span class="text-[#ff5500]">*</span></label>
        <input type="text" id="address" name="street-address" autocomplete="street-address"
          v-model="form.ubicacion.direccion" 
          @blur="validateField('direccion')" class="input-style" 
          placeholder="Calle 123 # 45-67"
          :class="[errors.direccion ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']" 
          />
        <p v-if="errors.direccion" class="error-msg">{{ errors.direccion }}</p>
      </div>
      
      <!-- Solo un componente que maneja todo: departamento, municipio, localidad y dirección -->
<LocationComponent
  @update:departamento="val => form.ubicacion.departamento = val?.nombre || ''"
  @update:municipio="val => form.ubicacion.municipio = val?.nombre || ''"
  @update:localidad="val => form.ubicacion.localidad = val?.nombre || ''"
  @update:direccion="val => form.ubicacion.direccion = val"
  @update:coords="val => { form.ubicacion.lat = val.lat; form.ubicacion.lng = val.lng; }"
/>


      <button type="button" @click="unlockSection(4)" class="btn-primary mt-8">
        Continuar Precios
      </button>
    </div>

    <!-- Precios -->
    <div ref="section4" v-show="unlockedSections[4]" class="step-section">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span class="w-7 h-7 rounded-md bg-orange-100 text-[#ff5500] flex items-center justify-center text-xs font-black">4</span>
        Precios
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="relative" v-if="form.general.tipoOferta === 'Vender'">
          <label class="label-style" for="precioVenta">Precio de Venta <span class="text-[#ff5500]">*</span></label>
            <span class="absolute left-3 top-10 font-sans text-sm text-gray-500">$</span>
            <input
            type="text"
            id="precioVenta"
            v-model="form.precios.venta"
            v-mask="currencyMask"
            class="input-style"
            :class="[errors.venta ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']" 
            @blur="validateField('venta')"
            placeholder="Ej: 500.000.000"
            />
            <p v-if="errors.venta" class="error-msg">{{ errors.venta }}</p>
        </div>
        <div class="relative" v-if="form.general.tipoOferta === 'Arrendar'">
          <label class="label-style" for="precioArriendo">Valor Arriendo <span class="text-[#ff5500]">*</span></label>
            <span class="absolute left-3 top-10 font-sans text-sm text-gray-500">$</span>
            <input
              type="text"
              id="precioArriendo"
              v-model="form.precios.arriendo"
              v-mask="currencyMask"
              class="input-style"
              :class="[errors.arriendo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']" 
              @blur="validateField('arriendo')"
              placeholder="Ej: 500.000"
            />
            <p v-if="errors.arriendo" class="error-msg">{{ errors.arriendo }}</p>
        </div>
        <div class="relative" v-if="form.general.tipoOferta === 'Arrendar'" >
          <label class="label-style" for="precioAdministracion">Valor administración.<span class="text-[#ff5500]">*</span></label>
          <span class="absolute left-3 top-10 font-sans text-sm text-gray-500">$</span>
          <input
            type="text"
            id="precioAdministracion"
            v-model="form.precios.administracion"
            v-mask="currencyMask"
            class="input-style"
            :class="[errors.administracion ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']" 
            @blur="validateField('administracion')"
            placeholder="Ej: 200.000"
          />
          <p v-if="errors.administracion" class="error-msg">{{ errors.administracion }}</p>
        </div>
        <div class="relative" v-if="form.general.tipoOferta === 'Compartir'">
          <label class="label-style" for="precioCompartir">Valor Arriendo compartir <span class="text-[#ff5500]">*</span></label>
            <span class="absolute left-3 top-10 font-sans text-sm text-gray-500">$</span>
            <input
              type="text"
              id="precioCompartir"
              v-model="form.precios.compartir"
              v-mask="currencyMask"
              class="input-style"
              :class="[errors.compartir ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-[#ff5500]']" 
              @blur="validateField('compartir')"
              placeholder="Ej: 650.000"
            />
            <p v-if="errors.compartir" class="error-msg">{{ errors.compartir }}</p>
        </div>
      </div>
      <button type="button" @click="unlockSection(5)" class="btn-primary mt-8">Ir a Multimedia</button>
    </div>


    <div ref="section5" v-show="unlockedSections[5]" class="step-section border-dashed border-2">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span class="w-7 h-7 rounded-md bg-orange-100 text-[#ff5500] flex items-center justify-center text-xs font-black">4</span>
        Multimedia
      </h2>

      <!-- Imagenes -->
      <!-- <ImageUploader v-model="form.imagenes" :maxFiles="10" uploadUrl="/api/uploadImages" /> -->
      <ImageUploader v-model="form.imagenes" :maxFiles="10" />
      
      <!-- Tour 360 -->
      <div class="pt-6 border-t border-gray-100 mt-6">
        <label class="label-style">Tour 360</label>
        <Tour360 v-if="unlockedSections[5]" />
      </div>

      <!-- Video -->
      <div class="pt-6 border-t border-gray-100 mt-6">
        <label class="label-style">Video de YouTube (Opcional)</label>
        <VideoInput v-model="form.general.videoUrl" />
      </div>

    </div>

    <div class="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t border-gray-100">
      <button type="button" @click="resetForm" class="btn-secondary w-full sm:w-auto order-2 sm:order-1">
        <X class="w-4 h-4" /> Borrar Todo
      </button>
      <button type="button" @click="goPreview" class="btn-submit w-full sm:w-auto order-1 sm:order-2">
        <Eye class="w-5 h-5" /> Previsualizar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { Eye, X } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import ImageUploader from '@/modules/home/components/imagesuploader/ImageUploader.vue';
import VideoInput from '@/shared/components/VideoInput.vue';
import Tour360 from '@/shared/components/Tour360.vue';
import { 
  validateTitulo, validateNombre, validateApellido, validaterazonSocial, validateTelefonoColombia, 
  validateEmail, validateDescripcion, validateDireccion 
} from '@/modules/publication/utils/validators';

import LocationComponent from '@/modules/publication/components/LocationComponent.vue'

const router = useRouter();
const blocked = ref(false);
const propertyTypesOptions = ref([]);

const caracteristicasLabels = {
  habitaciones: 'Habitaciones', banos: 'Baños', parqueaderos: 'Parqueaderos',
  area: 'Área Const. (m²)', areapv: 'Área priv. (m²)', estrato: 'Estrato',
  piso: 'Piso (s)', tiempoConstruccion: 'Construcción', aceptaMascotas: '¿Mascotas?'
};

const form = reactive({
  general: { 
    tipoOferta: 'Vender', tipoInmueble: '', titulo: '', nombreContacto: '', 
    apellidoContacto: '',  razonSocial: '', // 👈 NUEVO
    tipoIdentificacion: 'CC', numeroIdentificacion: '',
    telefonoContacto: '', emailContacto: '', descripcion: '', videoUrl: '' 
  },
  caracteristicas: { habitaciones: 1, banos: 1, parqueaderos: 0, area: 0, areapv: 0, estrato: '', piso: '', tiempoConstruccion: '', aceptaMascotas: false },
  ubicacion: { 
    departamento: '',
    municipio: '',
    localidad: '',
    direccion: '',
    lat: null,
    lng: null
   },
  precios: { venta: 0, arriendo: 0, administracion: 0, compartir: 0 },
  imagenes: []
});

const currencyMask = {
  mask: Number,
  scale: 0, // sin decimales
  thousandsSeparator: ',', // separador de miles
  radix: '.', // separador decimal (si decides usarlo)
  padFractionalZeros: false,
  normalizeZeros: true,
  prefix: '$ ' // 👈 aquí agregamos el signo de pesos
}

const unlockedSections = reactive({ 2: false, 3: false, 4: false, 5: false });
const errors = reactive({});

//Cargar propertyTypesOptions



const validateField = (field) => {
  const g = form.general; 
  const c = form.caracteristicas; 
  const u = form.ubicacion;
  const v = form.precios;

  switch(field) {
    case 'tipoInmueble': errors.tipoInmueble = g.tipoInmueble ? '' : 'Requerido'; break;
    case 'titulo': errors.titulo = validateTitulo(g.titulo); break;
    

    case 'razonSocial': 
      if (g.tipoIdentificacion === 'NIT') {
        errors.razonSocial = validaterazonSocial(g.razonSocial);
      } else {
        errors.razonSocial = '';
      }
      break;
    case 'nombreContacto':
      if(g.tipoIdentificacion !== 'NIT'){
        errors.nombreContacto = validateNombre(g.nombreContacto);
      }
    break;

    case 'apellidoContacto':
      if(g.tipoIdentificacion !== 'NIT'){
        errors.apellidoContacto = validateApellido(g.apellidoContacto);
      }
    break;

    case 'numeroIdentificacion':
      if (!g.numeroIdentificacion) errors.numeroIdentificacion = 'Requerido';
      else if (!/^[0-9]+$/.test(g.numeroIdentificacion)) errors.numeroIdentificacion = 'Solo números';
      else if (g.numeroIdentificacion.length < 5 || g.numeroIdentificacion.length > 15) errors.numeroIdentificacion = '5 a 15 dígitos';
      else errors.numeroIdentificacion = '';
      break;
    case 'telefonoContacto': errors.telefonoContacto = validateTelefonoColombia(g.telefonoContacto); break;
    case 'emailContacto': errors.emailContacto = validateEmail(g.emailContacto); break;
    case 'descripcion': errors.descripcion = validateDescripcion(g.descripcion); break;
    case 'area': errors.area = c.area >= 6 ? '' : 'Mín 6m²'; break;
    case 'areapv': 
      if (!c.areapv || c.areapv < 6) errors.areapv = 'Mín 6m²';
      else if (Number(c.areapv) > Number(c.area)) errors.areapv = 'No puede superar el Área Const.';
      else errors.areapv = '';
      break;
    case 'estrato': errors.estrato = c.estrato ? '' : 'Requerido'; break;
    case 'piso':
      if (c.piso === '' || c.piso === null) {
        errors.piso = 'Requerido';
      } else if (c.piso < 0) {
        errors.piso = 'No puede ser negativo';
      } else {
        errors.piso = '';
      }
      break;

    case 'tiempoConstruccion': errors.tiempoConstruccion = c.tiempoConstruccion ? '' : 'Requerido'; break;
    case 'departamento': errors.departamento = u.departamento ? '' : 'Requerido'; break;
    case 'municipio': errors.municipio = u.municipio ? '' : 'Requerido'; break;
    case 'direccion': errors.direccion = validateDireccion(u.direccion); break;
    case 'venta':
      if (g.tipoOferta === 'Vender'){
        const ventaValue = Number(String(v.venta).replace(/[^0-9]/g, ''));
        if (!ventaValue) {
          errors.venta = 'Requerido';
        } else if (ventaValue < 10000000) {
          errors.venta = 'El mínimo es $10.000.000';
        } else {
          errors.venta = '';
        }
      }
    break;
    case 'arriendo': 
        if (g.tipoOferta === 'Arrendar'){
          const arriendoValue = Number(String(v.arriendo).replace(/[^0-9]/g, ''));
          if (!arriendoValue) {
            errors.arriendo = 'Requerido';
          } else if (arriendoValue < 300000) {
            errors.arriendo = 'El mínimo es $300.000';
          } else {
            errors.arriendo = '';
          }
        }
      break;
    case 'administracion': 
        if (g.tipoOferta === 'Arrendar'){
          const administracionValue = Number(String(v.administracion).replace(/[^0-9]/g, ''));
          if (!administracionValue && administracionValue != 0) {
            errors.administracion = 'Requerido';
          } else if (administracionValue != 0) {
            if (administracionValue < 100000) {
              errors.administracion = 'El mínimo de administración es $100.000';
            }
          } else {
            errors.administracion = '';
          }
        }
        break;
    case 'compartir':
      if (g.tipoOferta === 'Compartir'){
        const compartirValue = Number(String(v.compartir).replace(/[^0-9]/g, ''));
        if (!compartirValue) {
          errors.compartir = 'Requerido';
        } else if (compartirValue < 300000) {
          errors.compartir = 'El mínimo es $300.000';
        } else {
          errors.compartir = '';
        }
      }
      break;
  }
};

const unlockSection = (n) => {
  const sectionMapFields = {
    2: ['tipoInmueble', 'titulo', 'nombreContacto', 'apellidoContacto', 'numeroIdentificacion', 'telefonoContacto', 'emailContacto', 'descripcion'],
    3: ['area', 'areapv', 'estrato', 'piso', 'tiempoConstruccion'],
    4: ['departamento', 'municipio', 'direccion'],
    5: ['venta', 'arriendo', 'administracion', 'compartir']
  };
  const fields = sectionMapFields[n];
  fields.forEach(validateField);
  if (!fields.some(f => errors[f])) {
    unlockedSections[n] = true;
    setTimeout(() => {
      const sectionRefs = { 2: section2, 3: section3, 4: section4, 5: section5 };
      sectionRefs[n].value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
};

watch([form, unlockedSections], () => {
  sessionStorage.setItem('publicationForm', JSON.stringify({ form, unlockedSections }));
}, { deep: true });

onMounted(async () => {
  const saved = sessionStorage.getItem('publicationForm');
  if (saved) {
    const data = JSON.parse(saved);
    Object.assign(form, data.form);
    Object.assign(unlockedSections, data.unlockedSections);
  }
  try {
    const res = await fetch('/data/propertyTypes.json');
    if (res.ok) propertyTypesOptions.value = await res.json();
  } catch (err) { console.error(err); }
});

const resetForm = () => { if (confirm('¿Limpiar todo el formulario, esto borraría la información registrada?')) { sessionStorage.removeItem('publicationForm'); location.reload(); }};
const goPreview = () => router.push({ name: 'PublicationPreview' });
const section1 = ref(null), section2 = ref(null), section3 = ref(null), section4 = ref(null), section5 = ref(null);

//console.log(sessionStorage.getItem('publicationForm')); //ver sessionStorage
</script>

<style scoped>
.step-section { @apply bg-white border border-gray-100 p-6 sm:p-8 rounded-lg shadow-sm transition-all duration-300; }
.label1-style { @apply block text-[16px] font-black tracking-[0.15em] mb-2; }
.label-style { @apply block text-[14px] font-black text-gray-700 tracking-[0.15em] mb-2; }
.input-style { @apply w-full px-6 py-3 rounded-lg border border-gray-200 outline-none transition-all text-sm placeholder:text-gray-300 focus:border-[#ff5500] focus:ring-2 focus:ring-orange-100; }
.error-msg { @apply text-[#ff5500] text-[12px] font-bold mt-1.5 tracking-tight; }
.btn-primary { @apply w-full sm:w-auto px-10 py-3.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest; }
.btn-submit { @apply flex items-center justify-center gap-2 px-10 py-3.5 bg-[#ff5500] text-white font-bold rounded-lg hover:bg-[#e64d00] transition-all shadow-md shadow-orange-100 active:scale-95 text-xs uppercase tracking-widest; }
.btn-secondary { @apply flex items-center justify-center gap-2 px-6 py-3.5 text-gray-600 font-bold rounded-lg border border-gray-300 bg-white hover:bg-red-50 transition-all text-xs uppercase tracking-widest; }
</style>