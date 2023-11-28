<script setup lang="ts">
import { ref, onMounted } from "vue";

const loaderVisible = ref(true);
onMounted(() => {
  setTimeout(() => {
    loaderVisible.value = false;
  }, 5000);
});

const isCalculating = ref(false);
</script>
<template>
  <div class="center-on-screen">
    <div v-if="loaderVisible" class="loader">
      <div class="blob"></div>
      <h2>Calculating...</h2>
    </div>
    <!-- <div class="pause-button">
      <i
        @click="isCalculating = !isCalculating"
        class="pi circled-icon"
        :class="`${isCalculating ? 'pi-pause' : 'pi-replay'}`"
        style="font-size: 3rem; color: #ba4cd6"
      ></i>
      <h2>{{ isCalculating ? "Stop" : "Continue" }}</h2>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.center-on-screen {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 70vh;
  .pause-button {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .circled-icon {
    border: 5px solid #ba4cd6;
    border-radius: 50%;
    padding: 1rem;
  }
  .loader {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  h2 {
    color: #ba4cd6 !important;
  }
}

.blob {
  width: 144px;
  height: 144px;
  display: grid;
  background: #fff;
  filter: blur(5.8px) contrast(10);
  padding: 14.4px;
  mix-blend-mode: darken;
  transform: rotate(90deg);
}

.blob:before,
.blob:after {
  content: "";
  grid-area: 1/1;
  background: linear-gradient(#8e69d8 0 0) left,
    linear-gradient(#8e69d8 0 0) right;
  background-size: 28.8px 57.6px;
  background-origin: content-box;
  background-repeat: no-repeat;
}

.blob:after {
  height: 28.8px;
  width: 28.8px;
  margin: auto 0;
  border-radius: 50%;
  background: #7b68a1;
  animation: blob-drop 1s infinite ease-in-out alternate-reverse;
}

@keyframes blob-drop {
  90%,
  100% {
    transform: translate(300%);
  }
}
</style>
