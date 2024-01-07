import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref, Ref } from "vue";
import { useSelectedItemsStore } from ".";

export const useCalculatingStore = defineStore("calculatingStore", () => {
  const isCalculating: Ref<boolean> = ref(false);

  const calculatingResultMessage: Ref<{
    severity: "success" | "info" | "warn" | "error";
    summary: string;
    detail: string;
  }> = ref({ severity: "info", summary: "", detail: "" });

  const getIsCalculating = () => {
    return isCalculating.value;
  };

  const getCalculatingResultMessage = () => {
    return calculatingResultMessage.value;
  };

  const startCalculating = async (payload: any) => {
    isCalculating.value = true;
    calculatingResultMessage.value = {
      severity: "info",
      summary: "Calculation started",
      detail: "This may take a while.",
    };

    console.log(payload);

    const response = await axios
      .post("http://localhost:7224/RunAlgorithm", payload)
      .then((res) => {
        console.log(res.data);
        calculatingResultMessage.value = {
          severity: "success",
          summary: "Success",
          detail: "Calculation finished successfully.",
        };
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          calculatingResultMessage.value = {
            severity: "error",
            summary: "Error",
            detail: "error",
          };
        }
      });

    // setTimeout(() => {
    //   isCalculating.value = false;
    //   calculatingResultMessage.value = {
    //     severity: "success",
    //     summary: "Success",
    //     detail: "Calculation finished successfully.",
    //   };
    // }, 20000);
  };

  const pauseCalculating = () => {
    isCalculating.value = false;
    calculatingResultMessage.value = {
      severity: "warn",
      summary: "Paused",
      detail: "Calculation paused.",
    };
  };
  return {
    startCalculating,
    getIsCalculating,
    pauseCalculating,
    getCalculatingResultMessage,
  };
});
