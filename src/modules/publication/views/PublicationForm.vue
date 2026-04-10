<template>
  <div class="w-full max-w-4xl mx-auto p-4 space-y-8 bg-white font-nunito text-gray-900 rounded-2xl">
    <!-- Loader -->
    <div v-if="blocked" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-orange-200 border-t-brand rounded-full animate-spin"></div>
        <span class="text-gray-600 font-medium text-sm tracking-widest uppercase">Cargando...</span>
      </div>
    </div>

    <!-- SECCIÓN 1: Información General -->
    <section :ref="el => sectionRefs[1] = el" class="step-section">
      <h2 class="section-title"><span class="step-number">1</span> Información General</h2>

      <div class="space-y-6">
        <!-- Tipo de oferta -->
        <div>
          <label class="label-style">Tipo de oferta <span class="text-brand">*</span></label>
          <div class="inline-flex p-1 bg-gray-100 rounded-lg w-full sm:w-fit">
            <button v-for="opt in ['Vender', 'Arrendar', 'Compartir']" :key="opt" type="button"
              @click="form.general.tipoOferta = opt"
              :class="['tab-btn', form.general.tipoOferta === opt ? 'active' : 'inactive']">
              {{ opt }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tipo de Inmueble -->
          <div class="form-group">
            <label class="label-style">Tipo de Inmueble <span class="text-brand">*</span></label>
            <select v-model="form.general.tipoInmueble" @change="validateField('tipoInmueble')"
              :class="['input-style', { 'error-ring': errors.tipoInmueble }]">
              <option disabled value="">Selecciona una opción</option>
              <option v-for="t in propertyTypesOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
            <p v-if="errors.tipoInmueble" class="error-msg">{{ errors.tipoInmueble }}</p>
          </div>

          <!-- Título -->
          <div class="form-group">
            <label class="label-style">Título de la publicación <span class="text-brand">*</span></label>
            <input v-model="form.general.titulo" maxlength="70" @blur="validateField('titulo')"
              placeholder="Ej: Hermoso apto en el Poblado" :class="['input-style', { 'error-ring': errors.titulo }]" />
            <div class="flex justify-between mt-1">
              <p v-if="errors.titulo" class="error-msg !mt-0">{{ errors.titulo }}</p>
              <p class="char-count">{{ form.general.titulo.length }} / 70</p>
            </div>
          </div>

          <!-- Documento -->
          <div class="form-group">
            <label class="label-style">Documento / NIT <span class="text-brand">*</span></label>
            <div class="flex">
              <select v-model="form.general.tipoIdentificacion" class="w-24 input-style !px-2 bg-gray-50 border-r-0 rounded-r-none">
                <option v-for="opt in ['CC', 'NIT', 'CE']" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <input type="number" v-model="form.general.numeroIdentificacion" @blur="validateField('numeroIdentificacion')"
                placeholder="5 a 15 dígitos" class="input-style rounded-l-none" :class="{ 'error-ring': errors.numeroIdentificacion }" />
            </div>
            <p v-if="errors.numeroIdentificacion" class="error-msg">{{ errors.numeroIdentificacion }}</p>
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label class="label-style">Teléfono móvil <span class="text-brand">*</span></label>
            <input v-model="form.general.telefonoContacto" v-mask="{ mask: '+57 000 000 0000' }"
              @blur="validateField('telefonoContacto')" :class="['input-style', { 'error-ring': errors.telefonoContacto }]" />
            <p v-if="errors.telefonoContacto" class="error-msg">{{ errors.telefonoContacto }}</p>
          </div>

          <!-- Campos Dinámicos según Identificación -->
          <div v-if="isCompany" class="md:col-span-2 form-group">
            <label class="label-style">Razón Social <span class="text-brand">*</span></label>
            <input v-model="form.general.razonSocial" @blur="validateField('razonSocial')" class="input-style" />
            <p v-if="errors.razonSocial" class="error-msg">{{ errors.razonSocial }}</p>
          </div>

          <template v-else>
            <div class="form-group">
              <label class="label-style">Nombre contacto <span class="text-brand">*</span></label>
              <input v-model="form.general.nombreContacto" @blur="validateField('nombreContacto')"
                class="input-style" :class="{ 'error-ring': errors.nombreContacto }" />
              <p v-if="errors.nombreContacto" class="error-msg">{{ errors.nombreContacto }}</p>
            </div>
            <div class="form-group">
              <label class="label-style">Apellido contacto <span class="text-brand">*</span></label>
              <input v-model="form.general.apellidoContacto" @blur="validateField('apellidoContacto')"
                class="input-style" :class="{ 'error-ring': errors.apellidoContacto }" />
              <p v-if="errors.apellidoContacto" class="error-msg">{{ errors.apellidoContacto }}</p>
            </div>
          </template>

          <div class="md:col-span-2 form-group">
            <label class="label-style">Correo Electrónico <span class="text-brand">*</span></label>
            <input type="email" v-model="form.general.emailContacto" @blur="validateField('emailContacto')"
              class="input-style" :class="{ 'error-ring': errors.emailContacto }" />
            <p v-if="errors.emailContacto" class="error-msg">{{ errors.emailContacto }}</p>
          </div>
        </div>

        <div>
          <label class="label-style">Descripción publicación <span class="text-brand">*</span></label>
          <textarea v-model="form.general.descripcion" rows="4" maxlength="500" @blur="validateField('descripcion')"
            class="input-style resize-none" :class="{ 'error-ring': errors.descripcion }"></textarea>
          <div class="flex justify-between mt-1">
            <p class="char-count">{{ form.general.descripcion.length }} / 500</p>
            <p v-if="errors.descripcion" class="error-msg !mt-0">{{ errors.descripcion }}</p>
          </div>
        </div>

        <button type="button" @click="handleUnlock(2)" class="btn-primary">Siguiente: Características</button>
      </div>
    </section>

    <!-- SECCIÓN 2: Características -->
    <section v-show="unlockedSections[2]" :ref="el => sectionRefs[2] = el" class="step-section">
      <h2 class="section-title"><span class="step-number">2</span> Características</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(label, key) in caracteristicasLabels" :key="key" class="flex flex-col">
          <label class="label-style mb-2">{{ label }} <span class="text-brand">*</span></label>

          <!-- Toggles Numéricos -->
          <div v-if="['habitaciones', 'banos', 'parqueaderos'].includes(key)" class="toggle-group">
            <button v-for="opt in getOptionsForKey(key)" :key="opt" type="button"
              @click="form.caracteristicas[key] = opt; validateField(key)"
              :class="['toggle-btn', form.caracteristicas[key] === opt ? 'active' : '']">
              {{ opt }}
            </button>
          </div>

          <!-- Selects -->
          <select v-else-if="key === 'estrato'" v-model="form.caracteristicas.estrato" @change="validateField('estrato')"
            :class="['input-style', { 'error-ring': errors.estrato }]">
            <option disabled value="">Selecciona</option>
            <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
          </select>

          <select v-else-if="key === 'tiempoConstruccion'" v-model="form.caracteristicas.tiempoConstruccion" 
            @change="validateField('tiempoConstruccion')" :class="['input-style', { 'error-ring': errors.tiempoConstruccion }]">
            <option disabled value="">Selecciona</option>
            <option v-for="t in tiempoOptions" :key="t.v" :value="t.v">{{ t.l }}</option>
          </select>

          <!-- Mascotas -->
          <div v-else-if="key === 'aceptaMascotas'" class="toggle-group">
            <button v-for="opt in [{l:'Sí',v:true},{l:'No',v:false}]" :key="opt.l" type="button"
              @click="form.caracteristicas.aceptaMascotas = opt.v"
              :class="['toggle-btn', form.caracteristicas.aceptaMascotas === opt.v ? 'active' : '']">
              {{ opt.l }}
            </button>
          </div>

          <!-- Áreas / Piso -->
          <div v-else class="relative">
            <input type="number" v-model.number="form.caracteristicas[key]" @input="validateField(key)"
              class="input-style pr-10" :class="{ 'error-ring': errors[key] }" />
            <span v-if="key.includes('area')" class="unit-tag">M²</span>
          </div>
          <p v-if="errors[key]" class="error-msg">{{ errors[key] }}</p>
        </div>
      </div>

      <button type="button" @click="handleUnlock(3)" class="btn-primary mt-8">Siguiente: Ubicación</button>
    </section>

    <!-- SECCIÓN 3: Ubicación -->
    <section v-show="unlockedSections[3]" :ref="el => sectionRefs[3] = el" class="step-section">
      <h2 class="section-title"><span class="step-number">3</span> Ubicación</h2>
      
    <LocationComponent
      :municipio="form.ubicacion.municipio"
      :direccion="form.ubicacion.direccion"
      :codigo="form.ubicacion.codigo"
      :localidad="form.ubicacion.localidad"
      :coords="{ lat: form.ubicacion.lat, lng: form.ubicacion.lng }"
      @update:municipio="val => form.ubicacion.municipio = val"
      @update:direccion="val => form.ubicacion.direccion = val"
      @update:codigo="val => form.ubicacion.codigo = val"
      @update:localidad="val => form.ubicacion.localidad = val"
      @update:coords="val => { 
        form.ubicacion.lat = val.lat; 
        form.ubicacion.lng = val.lng; 
      }"
    />
      <p v-if="errors.direccion" class="error-msg">{{ errors.direccion }}</p>
      
      <button type="button" @click="handleUnlock(4)" class="btn-primary mt-8">Siguiente: Definir precios</button>
    </section>

    <!-- SECCIÓN 4: Precios -->
    <section v-show="unlockedSections[4]" :ref="el => sectionRefs[4] = el" class="step-section">
      <h2 class="section-title"><span class="step-number">4</span> Precios</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="field in activePriceFields" :key="field.id" class="relative">
          <label class="label-style" :for="field.id">{{ field.label }} <span class="text-brand">*</span></label>
          <span class="currency-symbol">$</span>
          <input type="text" :id="field.id" v-model="form.precios[field.model]" v-mask="currencyMask"
            class="input-style pl-8" :class="{ 'error-ring': errors[field.model] }" 
            @blur="validateField(field.model)" :placeholder="field.placeholder" />
          <p v-if="errors[field.model]" class="error-msg">{{ errors[field.model] }}</p>
        </div>
      </div>
      <button type="button" @click="handleUnlock(5)" class="btn-primary mt-8">Ir a Multimedia</button>
    </section>

    <!-- SECCIÓN 5: Multimedia -->
    <section v-show="unlockedSections[5]" :ref="el => sectionRefs[5] = el" class="step-section border-dashed border-2">
      <h2 class="section-title"><span class="step-number">5</span> Multimedia</h2>
      <ImageUploader v-model="form.imagenes" :maxFiles="10" />
      <div class="media-footer">
        <label class="label-style">Tour 360</label>
        <Tour360 v-if="unlockedSections[5]" />
      </div>
      <div class="media-footer">
        <label class="label-style">Video de YouTube (Opcional)</label>
        <VideoInput v-model="form.general.videoUrl" />
      </div>
    </section>

    <!-- Footer Actions -->
    <footer class="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t border-gray-100">
      <button type="button" @click="resetForm" class="btn-secondary w-full sm:w-auto order-2 sm:order-1">
        <X class="w-4 h-4" /> Borrar Todo
      </button>
      <button type="button" @click="goPreview" class="btn-submit w-full sm:w-auto order-1 sm:order-2">
        <Eye class="w-5 h-5" /> Previsualizar
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { Eye, X } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import ImageUploader from '@/modules/home/components/imagesuploader/ImageUploader.vue';
import VideoInput from '@/shared/components/VideoInput.vue';
import Tour360 from '@/shared/components/Tour360.vue';
import LocationComponent from '@/modules/publication/components/LocationComponent.vue';
import * as validators from '@/modules/publication/utils/validators';

// Importamos constantes y helpers
import { caracteristicasLabels, tiempoOptions, currencyMask, getOptionsForKey, cleanPrice } from '../utils/constants.js';

const router = useRouter();
const blocked = ref(false);
const propertyTypesOptions = ref([]);
const sectionRefs = reactive({});

// Estado Reactivo Centralizado
const form = reactive({
  general: { 
    tipoOferta: 'Vender', tipoInmueble: '', titulo: '', nombreContacto: '', 
    apellidoContacto: '', razonSocial: '', tipoIdentificacion: 'CC', 
    numeroIdentificacion: '', telefonoContacto: '', emailContacto: '', 
    descripcion: '', videoUrl: '' 
  },
  caracteristicas: { 
    habitaciones: 1, banos: 1, parqueaderos: 0, area: 0, areapv: 0, 
    estrato: '', piso: '', tiempoConstruccion: '', aceptaMascotas: false 
  },
  ubicacion: { municipio: {}, direccion: '', lat: null, lng: null, codigo: null, localidad: null },
  precios: { venta: 0, arriendo: 0, administracion: 0, compartir: 0 },
  imagenes: []
});

const unlockedSections = reactive({ 2: false, 3: false, 4: false, 5: false });
const errors = reactive({});

// Computeds
const isCompany = computed(() => form.general.tipoIdentificacion === 'NIT');

const activePriceFields = computed(() => {
  const fields = [];
  const { tipoOferta } = form.general;
  if (tipoOferta === 'Vender') 
    fields.push({ id: 'precioVenta', model: 'venta', label: 'Precio de Venta', placeholder: 'Ej: 500.000.000' });
  if (tipoOferta === 'Arrendar') {
    fields.push(
      { id: 'precioArriendo', model: 'arriendo', label: 'Valor Arriendo', placeholder: 'Ej: 1.500.000' },
      { id: 'precioAdmin', model: 'administracion', label: 'Valor administración', placeholder: 'Ej: 200.000' }
    );
  }
  if (tipoOferta === 'Compartir')
    fields.push({ id: 'precioCompartir', model: 'compartir', label: 'Valor Arriendo compartir', placeholder: 'Ej: 650.000' });
  return fields;
});

// Validación de campos
const validateField = (field) => {
  const g = form.general;
  const c = form.caracteristicas;
  const u = form.ubicacion;
  const v = form.precios;

  const rules = {
    tipoInmueble: () => errors.tipoInmueble = g.tipoInmueble ? '' : 'Requerido',
    titulo: () => errors.titulo = validators.validateTitulo(g.titulo),
    razonSocial: () => errors.razonSocial = isCompany.value ? validators.validaterazonSocial(g.razonSocial) : '',
    nombreContacto: () => errors.nombreContacto = !isCompany.value ? validators.validateNombre(g.nombreContacto) : '',
    apellidoContacto: () => errors.apellidoContacto = !isCompany.value ? validators.validateApellido(g.apellidoContacto) : '',
    numeroIdentificacion: () => {
      const val = g.numeroIdentificacion?.toString() || '';
      if (!val) errors.numeroIdentificacion = 'Requerido';
      else if (!/^\d+$/.test(val)) errors.numeroIdentificacion = 'Solo números';
      else if (val.length < 5 || val.length > 15) errors.numeroIdentificacion = '5 a 15 dígitos';
      else errors.numeroIdentificacion = '';
    },
    telefonoContacto: () => errors.telefonoContacto = validators.validateTelefonoColombia(g.telefonoContacto),
    emailContacto: () => errors.emailContacto = validators.validateEmail(g.emailContacto),
    descripcion: () => errors.descripcion = validators.validateDescripcion(g.descripcion),
    area: () => errors.area = c.area >= 6 ? '' : 'Mín 6m²',
    areapv: () => {
      if (!c.areapv || c.areapv < 6) errors.areapv = 'Mín 6m²';
      else if (Number(c.areapv) > Number(c.area)) errors.areapv = 'No puede superar el Área Const.';
      else errors.areapv = '';
    },
    estrato: () => errors.estrato = c.estrato ? '' : 'Requerido',
    piso: () => errors.piso = (c.piso === '' || c.piso < 0 || c.piso > 100) ? 'Requerido/Inválido' : '',
    tiempoConstruccion: () => errors.tiempoConstruccion = c.tiempoConstruccion ? '' : 'Requerido',
    direccion: () => errors.direccion = validators.validateDireccion(u.direccion),
    venta: () => errors.venta = (g.tipoOferta === 'Vender' && cleanPrice(v.venta) < 10000000) ? 'Mínimo $10.000.000' : '',
    arriendo: () => errors.arriendo = (g.tipoOferta === 'Arrendar' && cleanPrice(v.arriendo) < 300000) ? 'Mínimo $300.000' : '',
    administracion: () => errors.administracion = (g.tipoOferta === 'Arrendar' && cleanPrice(v.administracion) > 0 && cleanPrice(v.administracion) < 100000) ? 'Mínimo $100.000' : '',
    compartir: () => errors.compartir = (g.tipoOferta === 'Compartir' && cleanPrice(v.compartir) < 300000) ? 'Mínimo $300.000' : ''
  };

  if (rules[field]) rules[field]();
};

// Desbloqueo de secciones
const handleUnlock = (n) => {
  const validationMap = {
    2: ['tipoInmueble', 'titulo', isCompany.value ? 'razonSocial' : 'nombreContacto', 'apellidoContacto', 'numeroIdentificacion', 'telefonoContacto', 'emailContacto', 'descripcion'],
    3: ['area', 'areapv', 'estrato', 'piso', 'tiempoConstruccion'],
    4: ['direccion'],
    5: activePriceFields.value.map(f => f.model)
  };
  
  validationMap[n].forEach(validateField);
  
  if (!validationMap[n].some(f => errors[f])) {
    unlockedSections[n] = true;
    setTimeout(() => {
      sectionRefs[n]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
};

// Persistencia en sessionStorage
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
  } catch (err) { console.error('Error cargando tipos:', err); }
});

// Funciones de utilidad
const resetForm = () => { 
  if (confirm('¿Limpiar todo el formulario?')) { 
    sessionStorage.removeItem('publicationForm'); 
    location.reload(); 
  }
};

const goPreview = () => router.push({ name: 'PublicationPreview' });

</script>

<style scoped>
/* Tokens de Diseño */
.text-brand { @apply text-[#ff5500]; }
.section-title { @apply text-xl font-bold text-gray-800 mb-6 flex items-center gap-2; }
.step-section { @apply bg-white border border-gray-100 p-6 sm:p-8 rounded-lg shadow-sm transition-all duration-300 mb-8; }
.step-number { @apply w-7 h-7 rounded-md bg-orange-100 text-[#ff5500] flex items-center justify-center text-xs font-black; }

/* Form Elements */
.label-style { @apply block text-sm font-black text-gray-700 tracking-widest mb-2 uppercase; }
.input-style { @apply w-full px-6 py-3 rounded-lg border border-gray-200 outline-none transition-all text-sm placeholder:text-gray-300 focus:border-[#ff5500] focus:ring-2 focus:ring-orange-100; }
.error-ring { @apply border-red-400 bg-red-50; }
.error-msg { @apply text-[#ff5500] text-xs font-bold mt-1.5; }
.char-count { @apply text-[10px] text-gray-400 font-bold uppercase ml-auto; }

/* Toggles / Buttons */
.tab-btn { @apply px-8 py-2 text-sm font-bold transition-all rounded-md flex-1 sm:flex-none; }
.tab-btn.active { @apply bg-white text-[#ff5500] shadow-sm; }
.tab-btn.inactive { @apply text-gray-500 hover:text-gray-700; }

.toggle-group { @apply inline-flex rounded-lg bg-gray-50 p-1 border border-gray-100; }
.toggle-btn { @apply px-4 py-2 text-sm font-bold transition-all rounded-md flex-1 text-gray-500 hover:bg-gray-200/50; }
.toggle-btn.active { @apply bg-white text-[#ff5500] shadow-sm; }

/* Utility */
.unit-tag { @apply absolute right-3 top-2.5 text-[10px] font-bold text-gray-400; }
.currency-symbol { @apply absolute left-3 top-10 font-sans text-sm text-gray-500; }
.media-footer { @apply pt-6 border-t border-gray-100 mt-6; }

/* Buttons Action */
.btn-primary { @apply w-full sm:w-auto px-10 py-3.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest; }
.btn-submit { @apply flex items-center justify-center gap-2 px-10 py-3.5 bg-[#ff5500] text-white font-bold rounded-lg hover:bg-[#e64d00] transition-all shadow-md shadow-orange-100 active:scale-95 text-xs uppercase tracking-widest; }
.btn-secondary { @apply flex items-center justify-center gap-2 px-6 py-3.5 text-gray-600 font-bold rounded-lg border border-gray-300 bg-white hover:bg-red-50 transition-all text-xs uppercase tracking-widest; }
</style>