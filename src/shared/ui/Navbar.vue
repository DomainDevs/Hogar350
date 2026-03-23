<template>
  <div class="navbar px-4 py-2 min-h-[3rem] bg-white border-b border-gray-100 shadow-sm ">

    <!-- Menú móvil -->
    <div class="navbar-start">
      <div class="dropdown">
        <button tabindex="0" class="btn btn-ghost btn-sm lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <ul tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-white/80 backdrop-blur-lg rounded-xl w-56 border border-gray-100 transition transform origin-top scale-95 hover:scale-100">
          <template v-for="(item, index) in menuItems" :key="'mobile-' + index">
            <li :class="index !== 0 ? 'border-t border-gray-100 mt-2 pt-2' : ''">
              <!-- Item sin submenu -->
              <template v-if="!item.submenu || item.submenu.length === 0">
                <a
                  :href="item.link"
                  :aria-disabled="!item.enabled"
                  :class="[item.highlight ? 'text-red-500 font-semibold' : 'text-gray-600 hover:text-red-500',
                    !item.enabled ? 'pointer-events-none opacity-50' : '']"
                >
                  {{ item.title }}
                </a>
              </template>

              <!-- Item con submenu -->
              <template v-else>
                <details :open="false" :class="!item.enabled ? 'opacity-60' : ''">
                  <summary
                    :class="[item.highlight ? 'text-red-500 font-semibold' : 'text-gray-600 hover:text-red-500',
                      !item.enabled ? 'pointer-events-none' : '']"
                  >
                    {{ item.title }}
                  </summary>
                  <ul class="p-2 space-y-1">
                    <li v-for="(sub, sidx) in item.submenu" :key="'mobile-sub-' + sidx">
                      <a
                        :href="sub.link"
                        :aria-disabled="!sub.enabled"
                        :class="[sub.highlight ? 'text-red-500 font-semibold' : 'text-gray-500 hover:text-red-500',
                          !sub.enabled ? 'pointer-events-none opacity-50' : '']"
                      >
                        {{ sub.title }}
                      </a>
                    </li>
                  </ul>
                </details>
              </template>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <!-- Menú escritorio -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-2">
        <template v-for="(item, index) in menuItems" :key="'desktop-' + index">
          <li class="relative flex items-center"
              :class="index !== 0 ? 'border-l border-gray-100 mx-4 pl-4' : ''">
            
            <!-- Item sin submenú -->
            <template v-if="!item.submenu || item.submenu.length === 0">
              <a
                :href="item.link"
                :aria-disabled="!item.enabled"
                :class="[item.highlight 
                          ? 'bg-orange-500 text-white font-semibold rounded-md px-5 py-3 text-base hover:bg-[#ff6a2a] transition'
                          : 'text-[#334155] text-base px-5 py-3 hover:text-[#ff5500] transition',
                        !item.enabled ? 'pointer-events-none opacity-50' : '']"
              >
                {{ item.title }}
              </a>
            </template>

            <!-- Item con submenú -->
            <template v-else>
              <details :class="!item.enabled ? 'opacity-60' : ''" class="group relative top-2">
                <summary
                  :class="[item.highlight 
                            ? 'text-red-500 font-semibold text-base cursor-pointer'
                            : 'text-gray-600 hover:text-red-500 text-base cursor-pointer',
                          !item.enabled ? 'pointer-events-none' : '']"
                >
                  {{ item.title }}
                </summary>
                <ul class="absolute left-0 mt-1 w-max p-3 bg-white shadow-md rounded-xl border border-gray-100 text-base
                          transition transform origin-top scale-95 group-hover:scale-100">
                  <li v-for="(sub, sidx) in item.submenu" :key="'desktop-sub-' + sidx">
                    <a
                      :href="sub.link"
                      :aria-disabled="!sub.enabled"
                      :class="[sub.highlight ? 'text-[#0C0B5F] font-semibold' : 'text-gray-500 hover:text-[#e36f46]',
                              !sub.enabled ? 'pointer-events-none opacity-50' : '']"
                    >
                      {{ sub.title }}
                    </a>
                  </li>
                </ul>
              </details>
            </template>

          </li>
        </template>
      </ul>
    </div>

    <!-- Área de usuario -->
    <div class="navbar-end">
      <template v-if="!loggedIn">
        <a href="/login"
           class="btn btn-sm flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1 
           text-[##19192f] hover:text-[##111130FF] hover:border-[#19192f] hover:shadow-sm transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[##262334]"
               fill="currentColor" viewBox="0 0 25 25">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z" />
            <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Ingresar</span>
        </a>
      </template>

      <template v-else>
        <div class="dropdown dropdown-end">
          <label tabindex="0"
                 class="btn btn-sm flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1 text-gray-600 hover:text-red-500 hover:border-red-400 hover:shadow-sm transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5.121 17.804A9 9 0 1 1 18.88 6.196M15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z"/>
            </svg>
            <span>Mi cuenta</span>
          </label>
          <ul tabindex="0"
              class="menu menu-sm dropdown-content mt-3 p-3 shadow-md bg-white rounded-xl w-56 border border-gray-100 transition transform origin-top scale-95 hover:scale-100">
            <li><a href="/perfil" class="text-gray-600 hover:text-red-500">Actualizar datos</a></li>
            <li><a href="/logout" class="text-gray-600 hover:text-red-500">Cerrar sesión</a></li>
          </ul>
        </div>
      </template>
    </div>

  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')
const menuItems = ref([])

//cambiar theme
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
}

//cargar opciónes de menú
onMounted(async () => {
  document.documentElement.setAttribute('data-theme', theme.value)

  try {
    const res = await fetch('/data/menuData.json', { cache: 'no-store' })
    if (!res.ok) throw new Error(res.statusText)
    menuItems.value = await res.json()
  } catch (err) {
    console.warn('No se pudo cargar menuData.json', err)
  }
})

//cargar opciónes de login
const loggedIn = ref(false) // cambia a true si el usuario está logueado

onMounted(async () => {
  try {
    const res = await fetch('/data/loginMenuData.json', { cache: 'no-store' })
    if (!res.ok) throw new Error(res.statusText)
    menuItems.value = await res.json()

    // Simulación de login (reemplazar con tu lógica real)
    loggedIn.value = Boolean(localStorage.getItem('usuario'))
  } catch (err) {
    console.warn('No se pudo cargar loginMenuData.json', err)
  }
})

</script>

