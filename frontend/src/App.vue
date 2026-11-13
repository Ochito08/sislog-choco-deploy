<template>
  <UpdateNotifier />
  <RouterView v-slot="{ Component, route }">
    <Transition name="sislog-page" mode="out-in">
      <div :key="route.fullPath" class="sislog-route-view">
        <component :is="Component" />
      </div>
    </Transition>
  </RouterView>
</template>

<script setup>
import UpdateNotifier from './components/UpdateNotifier.vue'
</script>
