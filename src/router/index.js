import { createRouter, createWebHistory } from 'vue-router'

import Home from "@/modules/home/views/home.vue";
import PropertyDetail from "@/modules/detail/views/PropertyDetail.vue";
import Publish from "@/modules/publication/views/PublicationForm.vue";
import PublicationPreview from "@/modules/publication/views/PublicationPreview.vue";
import Price from "@/modules/publication/views/price.vue";
import About from "@/modules/home/views/AboutView.vue";
import Maintenance from "@/modules/maintenance/views/maintenance.vue";
import Login from "@/modules/auth/views/LoginView.vue";
/*-----------------------URL DE DESARROLLO-------------------------------*/
import Tester from "@/modules/tester/views/PruebasDireccion.vue";

const mantenimientoActivo = false; // 🔧 Cambia a false cuando el sitio vuelva

const routes = [
  { path: "/", component: Home },
  { path: "/detalle", component: PropertyDetail },
  { path: "/publicar", component: Publish },
  { path: "/publicar/preview", name: "PublicationPreview", component: PublicationPreview }, // <-- aquí
  { path: "/planes", component: Price },
  { path: "/about", component: About },
  { path: "/mantenimiento", component: Maintenance },
  { path: "/login", component: Login },
  { path: "/tester", component: Tester }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})


// 🔐 Bloqueo global
router.beforeEach((to, from, next) => {
  if (mantenimientoActivo && to.path !== "/mantenimiento") {
    // 🔒 Si está activo, fuerza al mantenimiento
    next("/mantenimiento");
  } else if (!mantenimientoActivo && to.path === "/mantenimiento") {
    // 🚀 Si ya terminó el mantenimiento, saca al home
    next("/");
  } else {
    next();
  }
});

export default router
