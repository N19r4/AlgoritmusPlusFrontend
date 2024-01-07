<script setup lang="ts">
const instructionItems = [
  "Go to main page called Home",
  "Choose one or more algorithms and functions. Upload new if needed.",
  "If you upload a new function, you must name it put absolute path to the .DLL file on your computer.",
  "Go to step nr 2 if exists - enter values for the parameters or leave them default. Specify the upper and lower boundaries for each parameter and value of the step. Specify value for the dim (dimension) variable too.",
  "Start calculations by going to the last step - Summary.",
  "You can pause the calculations or restart them.",
  "When the calculations end, you'll recive the report on the website. You can also download it by hitting the visible button.",
  "You can go back in steps and change some elements, then go to Summary step to start new calculations.",
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
    <div class="documentation-section">
      <h3>Authors</h3>
      <p>Kinga Grabarczyk</p>
      <p>Ewa Kędziera</p>
      <p>Ireneusz Kosek</p>
      <p>Adrian Adamek</p>
    </div>
    <div class="documentation-section">
      <h3>Tech stack</h3>
      <p>Created with ❤️ using Vue.js 3</p>
      <p>Components by PrimeVue 💚</p>
    </div>
    <div class="documentation-section">
      <h3>Copyrights</h3>
      <p>
        Algorithmus + was created for study project in 2023. All rights
        reserved.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.documentation {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 40vw;
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
