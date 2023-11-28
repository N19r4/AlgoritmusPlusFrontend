<script setup lang="ts">
import { ListWithUpload } from ".";
// import axios from "axios";

import { Ref, ref, watch, defineEmits } from "vue";

const emit = defineEmits(["new-items-selected"]);

const objectiveFunctions: Ref<{ name: string; id: string }[]> = ref([
  { name: "Rastrigin", id: "1" },
  { name: "Rosenbrock", id: "2" },
  { name: "Sphere", id: "3" },
  { name: "Test function 1", id: "4" },
]);

const algorithms = ref([
  { name: "Snake optimizer", id: "1", params: ["xmin", "xmax", "dim"] },
  {
    name: "Grey wolf",
    id: "2",
    params: ["xmin", "xmax", "dim", "forest type", "animals around", "flora"],
  },
  { name: "Black widow", id: "3", params: ["xmin", "xmax", "dim"] },
]);

const itemsSets = ref([
  {
    name: "function",
    originalElements: objectiveFunctions,
    selectedElements: [],
  },
  {
    name: "algorithm",
    originalElements: algorithms,
    selectedElements: [],
  },
]);

itemsSets.value.forEach((itemSet) => {
  watch(
    () => itemSet.selectedElements,
    () => {
      emit("new-items-selected", itemsSets.value);
    }
  );
});
</script>

<template>
  <ListWithUpload
    v-for="({ name, originalElements }, index) in itemsSets"
    :name="name"
    :items="originalElements"
    :key="name"
    @new-item-selected="
      ($event) => (itemsSets[index].selectedElements = $event)
    "
  />
</template>
