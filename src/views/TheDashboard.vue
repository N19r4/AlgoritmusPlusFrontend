<script setup lang="ts">
import { TheFirstStep } from "../components";
import { defineEmits } from "vue";

const emit = defineEmits(["new-items-selected"]);
</script>

<template>
  <div class="dashboard">
    <TheFirstStep
      @new-items-selected="($event) => emit('new-items-selected', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
</style>
