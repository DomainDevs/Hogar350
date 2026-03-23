<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4 ">
    <div class="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      
      <!-- Encabezado -->
      <div class="flex items-center justify-between p-5 border-b bg-gray-50">
        <h2 class="text-3xl font-bold flex items-center gap-2">
          <!-- Icono -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#25d366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Bienvenido
        </h2>
      </div>

      <!-- Tabs -->
      <div class="flex">
        <button
          class="flex-1 py-3 text-center font-medium transition-all text-lg"
          :class="activeTab === 'login' ? 'border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-500'"
          @click="activeTab = 'login'"
        >
          Iniciar sesión
        </button>
        <button
          class="flex-1 py-3 text-center font-medium transition-all text-lg"
          :class="activeTab === 'register' ? 'border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-500'"
          @click="activeTab = 'register'"
        >
          Registrarse
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-6 space-y-4">
        
        <!-- Login -->
        <form v-if="activeTab === 'login'" class="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
          />

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="reset"
              class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium bg-white hover:bg-gray-100 transition-colors shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#ff5500] text-white rounded-md font-medium hover:bg-[#e66322] transition-colors shadow-md"
            >
              Ingresar
            </button>
          </div>
        </form>

        <!-- Registro -->
        <form v-if="activeTab === 'register'" class="space-y-4">
          <input
            type="text"
            placeholder="Nombres"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
          />
          <input
            type="text"
            placeholder="Apellidos"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1e1d85] focus:border-[#1e1d85] outline-none"
          />

          <!-- Checkbox -->
          <label class="flex items-start gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
            <input type="checkbox" required class="mt-1" />
            <span class="text-xs text-gray-700 leading-relaxed">
              He leído y autorizo el tratamiento de mis datos personales de acuerdo con la 
              <a href="#" class="text-[#e36e47] hover:underline font-medium">Política de Datos</a> y los 
              <a href="#" class="text-[#e36e47] hover:underline font-medium">Términos y Condiciones</a>.
            </span>
          </label>

          <!-- Botones -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="reset"
              class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium bg-white hover:bg-gray-100 transition-colors shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#ff5500] text-white rounded-md font-medium hover:bg-[#f86318] transition-colors shadow-md"
            >
              Registrarse
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const activeTab = ref("login");
</script>
