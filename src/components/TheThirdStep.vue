<script setup lang="ts">
import { ref, computed, watch, defineEmits } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import { useCalculatingStore, useSelectedItemsStore } from "@/state";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import SelectButton from "primevue/selectbutton";

const emit = defineEmits(["new-items-selected"]);

const toast = useToast();

const showToastMessage = (
  severity: "success" | "error" | "info" | "warn",
  summary: string,
  detail: string
) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000,
  });
};

const calculatingStore = useCalculatingStore();
const selectedItemsStore = useSelectedItemsStore();

const isCalculating = computed(() => calculatingStore.getIsCalculating());
const calculatingRes = computed(() =>
  calculatingStore.getCalculatingResultMessage()
);
const calculatingResponse = computed(() =>
  calculatingStore.getCalculatingResult()
);

watch(calculatingRes, (newVal) => {
  if (newVal) {
    showToastMessage(newVal.severity, newVal.summary, newVal.detail);
  }
});

const currentClickedButton = ref(null);
const options = ref([
  { value: "Resume", icon: "pi pi-play" },
  { value: "Pause", icon: "pi pi-pause" },
]);

const changeCalculatingState = ({ value }: { value: string }) => {
  if (value === "Resume") {
    calculatingStore.resumeCalculating();
  } else if (value === "Pause") {
    calculatingStore.pauseCalculating();
  }
};

watch(currentClickedButton, (newVal) => {
  if (newVal) {
    changeCalculatingState(newVal);
  }
});

const downloadCSV = () => {
  const csv = calculatingResponse.value;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "results.csv");

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
</script>
<template>
  <Toast />
  <div class="third-step">
    <div
      v-if="
        !calculatingResponse ||
        calculatingResponse === 'Calculations stopped' ||
        calculatingResponse.data === 'Calculations stopped'
      "
      class="center-on-screen"
    >
      <div v-if="isCalculating" class="loader">
        <ProgressSpinner />
        <h2>Calculating...</h2>
      </div>
      <div class="flex-column" v-else>
        <i class="pi pi-power-off" style="font-size: 3rem; color: #ba4cd6"></i>
        <h2>Calculating paused.</h2>
      </div>
      <SelectButton
        v-model="currentClickedButton"
        :options="options"
        :allowEmpty="false"
        optionLabel="value"
        dataKey="value"
      >
        <template #option="slotProps">
          <i :class="slotProps.option.icon"></i>
        </template>
      </SelectButton>
    </div>
    <div v-else class="center-on-screen">
      <h2>Calculations finished!</h2>
      <Button label="Download results" @click="downloadCSV" />
    </div>
    <h2>Summary</h2>
    <div class="summary">
      <div
        class="summary-item"
        v-for="item in selectedItemsStore.getItems()"
        :key="item.name"
      >
        <h3 class="bolded">Selected {{ item.name }}(s):</h3>
        <p v-for="dll in item.dllsNames" :key="dll">
          <i class="pi pi-check"></i> {{ dll }}
        </p>
      </div>
      <div class="summary-item">
        <h3 class="bolded">Dimension:</h3>
        <p>{{ selectedItemsStore.getDimForChosenAlgorithm() }}</p>
      </div>
      <div class="summary-item">
        <h3 class="bolded">Parameters:</h3>
        <div class="summary-item-params">
          <p v-if="selectedItemsStore.getParamsForChosenAlgorithm()">
            {{
              selectedItemsStore
                .getParamsForChosenAlgorithm()
                .map((param: any) => param.name)
                .join(", ")
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.center-on-screen {
  height: 30vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  .loader {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  h2 {
    color: #ba4cd6 !important;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.third-step {
  height: 70vh;
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
