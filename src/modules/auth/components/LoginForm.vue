<template>
  <!-- Modal -->
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
      >
        <!-- Cerrar -->
        <button
          @click="close"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <!-- Tabs -->
        <div class="flex border-b mb-6">
          <button
            :class="activeTab === 'login' ? activeClass : inactiveClass"
            @click="activeTab = 'login'"
          >
            Iniciar Sesión
          </button>
          <button
            :class="activeTab === 'register' ? activeClass : inactiveClass"
            @click="activeTab = 'register'"
          >
            Registrarse
          </button>
        </div>

        <!-- Contenido dinámico -->
        <div v-if="activeTab === 'login'">
          <h2 class="text-lg font-semibold mb-4">Bienvenido de nuevo</h2>
          <form @submit.prevent="onLogin">
            <div class="mb-4">
              <label class="block text-sm mb-1">Email</label>
              <input
                v-model="login.email"
                type="email"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e1d85]"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm mb-1">Contraseña</label>
              <input
                v-model="login.password"
                type="password"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e1d85]"
                placeholder="********"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full bg-[#1e1d85] hover:bg-[#16156a] text-white py-2 rounded-lg font-medium"
            >
              Ingresar
            </button>
          </form>
        </div>

        <div v-else>
          <h2 class="text-lg font-semibold mb-4">Crear cuenta</h2>
          <form @submit.prevent="onRegister">
            <div class="mb-4">
              <label class="block text-sm mb-1">Nombre</label>
              <input
                v-model="register.name"
                type="text"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e1d85]"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm mb-1">Email</label>
              <input
                v-model="register.email"
                type="email"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e1d85]"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm mb-1">Contraseña</label>
              <input
                v-model="register.password"
                type="password"
                class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e1d85]"
                placeholder="********"
                required
              />
            </div>
            <div class="flex items-center mb-4">
              <input
                id="terms"
                type="checkbox"
                v-model="register.terms"
                required
                class="mr-2"
              />
              <label for="terms" class="text-sm text-gray-600">
                Acepto los
                <a href="#" class="text-[#e36e47] hover:underline">Términos y Condiciones</a>
                y la
                <a href="#" class="text-[#e36e47] hover:underline">Política de Privacidad</a>.
              </label>
            </div>
            <button
              type="submit"
              class="w-full bg-[#1e1d85] hover:bg-[#16156a] text-white py-2 rounded-lg font-medium"
            >
              Registrarme
            </button>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";

const show = ref(false);
const activeTab = ref("login");

// Datos
const login = ref({ email: "", password: "" });
const register = ref({ name: "", email: "", password: "", terms: false });

// Estilos tabs
const activeClass =
  "flex-1 py-2 text-center border-b-2 border-[#1e1d85] text-[#1e1d85] font-medium";
const inactiveClass =
  "flex-1 py-2 text-center text-gray-500 hover:text-[#1e1d85]";

function close() {
  show.value = false;
}

function onLogin() {
  console.log("Login:", login.value);
  close();
}

function onRegister() {
  if (!register.value.terms) return alert("Debes aceptar los términos.");
  console.log("Registro:", register.value);
  close();
}
</script>
