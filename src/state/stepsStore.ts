import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useStepsStore = defineStore("StepsStore", () => {
  const areStepsReadonly: Ref<boolean> = ref(false);

  const getAreStepsReadonly = () => {
    return areStepsReadonly.value;
  };

  const setAreStepsReadonly = (value: boolean) => {
    areStepsReadonly.value = value;
  };

  return {
    getAreStepsReadonly,
    setAreStepsReadonly,
  };
});
