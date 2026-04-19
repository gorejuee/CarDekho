<template>
  <v-app>
    <v-main style="background: #F5F7FA;">
      <WizardView />
      <v-footer color="transparent" class="justify-center py-4">
        <span class="text-caption text-medium-emphasis">
          Built with ❤️ by CarDekho
        </span>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script setup>
import WizardView from './components/WizardView.vue'
</script>