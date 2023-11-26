<script setup lang="ts">
const instructionItems = [
  "Go to main page called dashboard",
  "Choose one or more algorithms and functions. Upload new if needed.",
  "Go to step nr 2 if exists - enter all needed parameters.",
  'Start calculations by hitting "START TESTING"',
];
</script>

<template>
  <div class="documentation">
    <h2>Documentation</h2>
    <div class="documentation-section">
      <h3>Introduction</h3>
      <p>
        This app contains all basic meta-heuristic algorithms and objective
        functions. It allows the user to choose the algorithm(s) and function(s)
        and perform some tests on chosen set.
      </p>
    </div>
    <div class="documentation-section">
      <h3>Instruction</h3>
      <p>
        <span
          class="list-item"
          v-for="(text, index) in instructionItems"
          :key="index"
          >👉 {{ text }}</span
        >
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.documentation {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 30vw;
  &-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .list-item {
      display: block;
    }
  }
}
</style>
