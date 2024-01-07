<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import InputNumber from "primevue/inputnumber";
import { useSelectedItemsStore } from "../state";
import Slider from "primevue/slider";

const selectedItemsStore = useSelectedItemsStore();

const dim = ref(selectedItemsStore.getDimForChosenAlgorithm());
</script>

<template>
  <div class="second-step">
    <div
      v-for="{ name, dllsNames } in selectedItemsStore.getItems()"
      :key="name"
      class=""
    >
      <div v-if="name === 'algorithm' && dllsNames.length === 1">
        <h2>
          Selected {{ name }}: <b>{{ dllsNames[0] }}</b>
        </h2>
        <div>
          <div class="help-input">
            <label for="dim">Dimension (dim):</label>
            <InputNumber
              :id="`dim`"
              v-model="dim"
              @update:modelValue="
                selectedItemsStore.setDimForChosenAlgorithm(dim)
              "
              :aria-describedby="`dim-help`"
              locale="pl-PL"
              :allowEmpty="false"
              :showButtons="true"
              :min="2"
            />
          </div>
          <div
            v-for="(
              param, index
            ) in selectedItemsStore.getParamsForChosenAlgorithm()"
            :key="index"
            class="param-section"
          >
            <h3>{{ param.name }} ({{ param.description }})</h3>
            <div class="param-options">
              <div class="help-input">
                <label :for="param.name">Lower boundary:</label>
                <InputNumber
                  :id="`${param.name}-lower-boundary`"
                  v-model="
                    selectedItemsStore.getParamsForChosenAlgorithm()[index]
                      .lowerBoundary
                  "
                  :aria-describedby="`${param.name}-lower-boundary-help`"
                  locale="pl-PL"
                  :allowEmpty="false"
                  :min="
                    selectedItemsStore.getParamsForChosenAlgorithm()[index]
                      .lowerBoundary
                  "
                />
              </div>

              <div class="help-input">
                <label :for="param.name">Upper boundary:</label>
                <InputNumber
                  :id="`${param.name}-upper-boundary`"
                  v-model="
                    selectedItemsStore.getParamsForChosenAlgorithm()[index]
                      .upperBoundary
                  "
                  :aria-describedby="`${param.name}-upper-boundary-help`"
                  locale="pl-PL"
                  :allowEmpty="false"
                  :max="
                    selectedItemsStore.getParamsForChosenAlgorithm()[index]
                      .upperBoundary
                  "
                />
              </div>

              <div>
                <div class="w-14rem">
                  <div class="help-input">
                    <label :for="`${param.name}-step`"
                      >{{ param.name }} step:</label
                    >
                    <InputNumber
                      :id="`${param.name}-step`"
                      v-model="
                        selectedItemsStore.getParamsForChosenAlgorithm()[index]
                          .step
                      "
                      class="w-full"
                      :useGrouping="false"
                      :allowEmpty="false"
                      readonly
                      disabled
                    />
                  </div>

                  <Slider
                    v-model="
                      selectedItemsStore.getParamsForChosenAlgorithm()[index]
                        .step
                    "
                    :min="0"
                    :max="100"
                    class="w-full"
                    :step="10"
                  />
                </div>
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
  width: 60vw;
  height: 60vh;
}
.param-options {
  display: flex;
  gap: 3rem;
  height: 8rem;
}
.param-section {
  display: flex;
  flex-direction: column;
}
</style>
