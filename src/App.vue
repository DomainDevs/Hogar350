<template>
  <div class="text-[#12162d] bg-base-300">
      <!-- Navbar fijo -->
      <header class="navbar-container">
        <Logo />
        <Navbar />
      </header>
      <br /><br /><br />
      <router-view />
  </div>
</template>

<script setup>
import Logo from '@/shared/ui/Logo.vue';
import Navbar from '@/shared/ui/Navbar.vue';
</script>

<style scoped>
/* Navbar fijo */
.navbar-container {
  position: fixed;
  top: 50;
  left: 0;
  width: 100%;
  z-index: 50;
  background-color: white;
}
</style>