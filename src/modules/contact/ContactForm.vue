<template>
  <Teleport to="body">
    <dialog v-if="show" class="modal modal-open flex items-center justify-center p-4">
      <!-- Fondo semi-transparente y desenfocado -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>

      <!-- Caja modal principal -->
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md z-10 flex flex-col max-h-[90vh]">
        
        <!-- Encabezado de la modal con icono -->
        <div class="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <!-- Icono de correo -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#25d366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactar
          </h2>
          <!-- Botón de cierre -->
          <button
            class="text-gray-500 hover:text-gray-900 text-3xl font-bold transition-transform transform hover:scale-110"
            @click="close"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <!-- Contenido principal (formulario) -->
        <div class="p-5 overflow-y-auto">
          <!-- Encabezado dinámico para la propiedad -->
          <div v-if="propertyId || propertyTitle" class="mb-4 text-gray-600 text-sm">
            <p v-if="propertyId"><strong class="font-semibold">ID:</strong> #{{ propertyId }}</p>
            <p v-if="propertyTitle"><strong class="font-semibold">Título:</strong> {{ propertyTitle }}</p>
          </div>

          <form @submit.prevent="sendMessage" class="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
              v-model="form.name"
              required
            />
            <input
              type="tel"
              placeholder="Número de celular"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
              v-model="form.phone"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
              v-model="form.email"
              required
            />
            <textarea
              placeholder="Escribe tu mensaje..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none h-32 resize-y"
              v-model="form.message"
              required
            ></textarea>

            <!-- Checkbox de aceptación de términos -->
            <label class="flex items-start gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                class="checkbox checkbox-accent mt-1"
                v-model="form.accept"
                required
              />
              <span class="text-xs text-gray-700 leading-relaxed">
                Declaro de manera libre y expresa, que he leído y autorizo al portal TuHogar360.com, para el tratamiento de mis datos personales acorde a la <a href="#" class="text-[#e36e47] hover:underline font-medium">Política de datos personales</a> en vigencia por el estado Colombiano y a la <a href="#" class="text-[#e36e47] hover:underline font-medium">Política de cookies</a>.
                Acepto los <a href="#" class="text-[##e36e47] hover:underline font-medium">términos</a> y <a href="#" 
                class="text-[##e36e47] hover:underline font-medium">Condiciones del portal</a>.
              </span>
            </label>

            <!-- Botones de acción -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium bg-white hover:bg-gray-100 transition-colors shadow-sm"
                @click="close"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#ff5500] text-white rounded-md font-medium hover:bg-[#f56b26] transition-colors shadow-md"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Contactar' }, // Propiedad 'title' no se usa directamente en el template actual, pero se mantiene por si acaso
  propertyId: [String, Number],
  propertyTitle: String
});
const emit = defineEmits(['update:show', 'send']);

const form = ref({ name: '', phone: '', email: '', message: '', accept: false });

function close() {
  emit('update:show', false);
}

function sendMessage() {
  if (!form.value.accept) {
    // Podrías mostrar un mensaje más amigable aquí
    alert('Debes aceptar las políticas de tratamiento de datos y los términos y condiciones.');
    return;
  }
  emit('send', { ...form.value, propertyId: props.propertyId, propertyTitle: props.propertyTitle });
  // Opcional: limpiar el formulario después de enviar
  form.value = { name: '', phone: '', email: '', message: '', accept: false };
  close();
}
</script>