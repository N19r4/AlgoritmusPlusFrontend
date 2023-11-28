<script setup lang="ts">
import { onMounted, ref } from "vue";
import InputText from "primevue/inputtext";
import Slider from "primevue/slider";
// const props = defineProps<{
//   selectedItems: any[];
// }>();

const enteredParams = ref();

const mockedSelectedItems = [
  {
    name: "function",
    selectedItems: [
      { name: "Sphere", id: "3", params: [] },
      { name: "Rosenbrock", id: "2", params: [] },
    ],
  },
  {
    name: "algorithm",
    selectedItems: [
      {
        name: "Snake optimizer",
        id: "1",
        params: ["xmin", "xmax", "dim"],
      },
    ],
  },
];

onMounted(() => {
  enteredParams.value = mockedSelectedItems.find(
    ({ name }) => name === "algorithm"
  )!.selectedItems[0].params;
  enteredParams.value = enteredParams.value.map((item: any) => {
    return {
      name: item,
      value: 0,
      step: 0,
    };
  });
});
</script>

<template>
  <div class="second-step">
    <div
      v-for="{ name, selectedItems } in mockedSelectedItems"
      :key="name"
      class=""
    >
      <div v-if="selectedItems.length === 1">
        <h2>
          Selected {{ name }}: <b>{{ selectedItems[0].name }}</b>
        </h2>
        <div v-if="selectedItems.length">
          <div
            v-for="({ name, value }, index) in enteredParams"
            :key="index"
            class="param-options"
          >
            <div class="help-input">
              <label :for="name">{{ name }}</label>

              <InputText
                :id="name"
                v-model="enteredParams[index].value"
                :aria-describedby="`${name}-help`"
                :class="{ 'p-invalid': !`${value}`.length }"
                :maxlength="10"
              />
              <small
                class="p-error"
                :id="`${name}-required-error`"
                v-if="!`${value}`.length"
                >This param is required.</small
              >
            </div>

            <div>
              <div class="w-14rem">
                <div class="help-input">
                  <label :for="`${name}-step`">{{ name }} step</label>
                  <InputText
                    :id="`${name}-step`"
                    v-model.number="enteredParams[index].step"
                    class="w-full"
                  />
                </div>

                <Slider v-model="enteredParams[index].step" class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.second-step {
  display: flex;
  margin-top: 4rem;
  justify-content: center;
  height: 60vh;
}
.param-options {
  display: flex;
  gap: 20px;
  height: 8rem;
}
</style>
