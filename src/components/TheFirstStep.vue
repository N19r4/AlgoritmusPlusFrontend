<script setup lang="ts">
import axios, { AxiosError } from "axios";
import { ListWithUpload } from ".";
// import axios from "axios";

import { Ref, ref, watch, defineEmits, onMounted } from "vue";

const emit = defineEmits(["new-items-selected"]);

const objectiveFunctions: Ref<{ name: string; id: number }[]> = ref([]);

const algorithms = ref([]);

const itemsSets = ref([
  {
    name: "function",
    defaultDllsNames: objectiveFunctions,
    dllsNames: [],
  },
  {
    name: "algorithm",
    defaultDllsNames: algorithms,
    dllsNames: [],
  },
]);

itemsSets.value.forEach((itemSet) => {
  watch(
    () => itemSet.dllsNames,
    () => {
      emit("new-items-selected", itemsSets.value);
    }
  );
});

onMounted(async () => {
  // first enable chrome addon to use CORS
  const functionsResponse = await axios
    .get("http://localhost:7224/GetAllTestFunctionsNames")
    .then((res) => {
      if (res instanceof AxiosError) {
        console.log(`${res.message}`);
        return [];
      }
      return res.data;
    });

  objectiveFunctions.value = functionsResponse.map(
    (name: string, index: number) => ({
      name,
      id: index,
    })
  );

  const algorithmsResponse = await axios
    .get("http://localhost:7224/GetAllAlgorithmsNames")
    .then((res) => {
      if (res instanceof AxiosError) {
        console.log(`${res.message}`);
        return [];
      }
      return res.data;
    });

  algorithms.value = algorithmsResponse.map((name: string, index: number) => ({
    name,
    id: index,
    params: [],
  }));
});
</script>

<template>
  <ListWithUpload
    v-for="({ name, defaultDllsNames }, index) in itemsSets"
    :name="name"
    :items="defaultDllsNames"
    :key="name"
    @new-item-selected="($event) => (itemsSets[index].dllsNames = $event)"
  />
</template>
