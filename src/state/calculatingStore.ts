import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref, Ref } from "vue";

export const useCalculatingStore = defineStore("calculatingStore", () => {
  const isCalculating: Ref<boolean> = ref(false);

  const calculatingResult = ref();

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

  const getCalculatingResult = () => {
    return calculatingResult.value;
  };

  const resumeCalculating = async () => {
    isCalculating.value = true;
    calculatingResultMessage.value = {
      severity: "info",
      summary: "Calculation resumed",
      detail: "This may take a while.",
    };

    calculatingResult.value = await axios
      .post("http://localhost:7224/ResumeAlgorithm")
      .then((res) => {
        calculatingResultMessage.value = {
          severity: "success",
          summary: "Success",
          detail: "Calculation finished successfully.",
        };
        return res.data;
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
    isCalculating.value = false;
  };

  const startCalculating = async (payload: any) => {
    calculatingResult.value = undefined;
    isCalculating.value = true;
    calculatingResultMessage.value = {
      severity: "info",
      summary: "Calculation started",
      detail: "This may take a while.",
    };

    calculatingResult.value = await axios
      .post("http://localhost:7224/RunAlgorithm", payload)
      .then((res) => {
        calculatingResultMessage.value = {
          severity: "success",
          summary: "Success",
          detail: "Calculation finished successfully.",
        };
        return res.data;
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
    isCalculating.value = false;
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
    resumeCalculating,
    getCalculatingResult,
  };
});
