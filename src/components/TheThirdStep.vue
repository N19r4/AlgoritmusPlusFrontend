<script setup lang="ts">
import { ref, onMounted } from "vue";

const loaderVisible = ref(true);
onMounted(() => {
  setTimeout(() => {
    loaderVisible.value = false;
  }, 5000);
});
</script>
<template>
  <div class="center-on-screen">
    <div v-if="loaderVisible" class="loader">
      <div class="blob"></div>
      <h2>Calculating...</h2>
    </div>
    <div v-else>
      <h2>Finished!</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center-on-screen {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 70vh;
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
