import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref, Ref } from "vue";

export const useSelectedItemsStore = defineStore("selectedItemsStore", () => {
  const items: Ref<{ name: string; dllsNames: string[] }[] | undefined> = ref();

  const paramsForChosenAlgorithm: Ref<any> = ref();

  let dimForChosenAlgorithm = 2;

  const setNewItems = (newItems: any) => {
    items.value = newItems;
  };

  const getItems = () => {
    return items.value;
  };

  const setParamsForChosenAlgorithm = (params: any) => {
    paramsForChosenAlgorithm.value = params;
  };
  const getParamsForChosenAlgorithm = () => {
    return paramsForChosenAlgorithm.value ?? [];
  };

  const setDimForChosenAlgorithm = (dim: number) => {
    dimForChosenAlgorithm = dim;
  };
  const getDimForChosenAlgorithm = () => {
    return dimForChosenAlgorithm;
  };

  return {
    setNewItems,
    getItems,
    setParamsForChosenAlgorithm,
    getParamsForChosenAlgorithm,
    setDimForChosenAlgorithm,
    getDimForChosenAlgorithm,
  };
});
