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

const scenarios = [
  {
    title: "Uploading new .DLL file",
    steps: [
      "Go to the first step.",
      "Click the Upload button in the section you want to upload new .DLL file.",
      "Enter the absolute path to the .DLL file on your computer. You can go to the folder where .DLL is placed and copy the path from the top bar of the file explorer using <i>copy path</i> option. You don't need to remove quotation marks.",
      "Click the Done button.",
      "The .DLL file will be uploaded and added to the list of available functions or algorithms with the name of the file.",
    ],
  },
  {
    title: "Resuming calculations",
    steps: [
      "When the calculations were paused or stopped, the app will remember the last state of the calculations.",
      "You can resume the calculations by clicking the Resume button on the appearing modal in first app load.",
      "The calculations will resume with the same parameters as before, you'll be moved to the Summary step.",
    ],
  },
  {
    title: "Pausing calculations",
    steps: [
      "When the calculations are running, you can pause them by clicking the Pause button in Summary step.",
      "You can resume the calculations by clicking the Resume button placed next to Pause button.",
    ],
  },
  {
    title: "Specifying parameters",
    steps: [
      "When you go to the second step, you can see the default parameters for the chosen algorithm.",
      "You can change them by entering new values for the upper and lower boundaries and step.",
      "You can also change the dim (dimension) variable.",
    ],
  },
  {
    title: "Using default parameters",
    steps: [
      "When you omit the second step, the app will use default parameters for the chosen algorithm.",
      "You can check the default parameters in Summary step.",
    ],
  },
];
</script>

<template>
  <div class="documentation">
    <h2>Documentation</h2>
    <div class="documentation-section">
      <h3>Introduction</h3>
      <p>
        This app is a tool for calculating the global minimum or maximum of a
        function. It uses the algorithms of the following types:
        <b>random search</b>, <b>evolutionary</b>, <b>swarm</b> and
        <b>gradient</b>. The user can choose one or more algorithms and
        functions. The app will calculate the global minimum (or maximum) of the
        function using the chosen algorithms. The user can also upload new
        function(s) and algorithm(s) in .DLL files.
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
      <h3>Scenarios</h3>
      <p v-for="({ title, steps }, index) in scenarios" :key="index">
        <span class="bolded list-item">👉 {{ title }}</span>
        <ul>
          <li
            class="list-item"
            v-for="(text, index) in steps"
            :key="index"
            >{{index + 1}}. {{ text }}</li
          >
        </ul>
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
    .bolded {
      font-weight: bold;
    }
  }
}
</style>
