<script setup lang="ts">
import { RouteLocationRaw, RouterView } from "vue-router";
import TabMenu from "primevue/tabmenu";
import Steps from "primevue/steps";
import ConfirmDialog from "primevue/confirmdialog";
import { ref, onMounted, watch, watchEffect, Ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useCalculatingStore, useSelectedItemsStore } from "./state";
import axios from "axios";
import { useStepsStore } from "./state/stepsStore";

const router = useRouter();
const route = useRoute();

const steps:
  | Ref<never[]>
  | Ref<{ label: string; route: string; command?: () => void }[]> = ref([]);

const isActive = (item: any) => {
  return item.route ? router.resolve(item.route).path === route.path : false;
};

const activeStep = ref(0);
const active = ref(0);
const items = ref([
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    route: "/",
    command: () => {
      stepsStore.setAreStepsReadonly(false);
    },
  },
  {
    label: "Documentation",
    icon: "pi pi-fw pi-file",
    route: "/documentation",
  },
]);

const selectedItems: Ref<
  { name: "algorithm" | "function"; dllsNames: string[] }[]
> = ref([]);

const selectedItemsStore = useSelectedItemsStore();
const calculatingStore = useCalculatingStore();

const setDefaultParamsForAlgorithm = async () => {
  const algorithmsDllName = selectedItems.value.find(
    ({ name }) => name === "algorithm"
  )?.dllsNames[0];

  const paramsForAlgorithm = await axios
    .get(
      `http://localhost:7224/GetParamsInfoForAlgorithm?optimizationAlgorithmName=${algorithmsDllName}`
    )
    .then((res) => {
      return res.data.map((param: any) => ({
        name: param.name,
        description: param.description,
        lowerBoundary: param.lowerBoundry,
        upperBoundary: param.upperBoundry,
        step: 0,
      }));
    });

  selectedItemsStore.setParamsForChosenAlgorithm(paramsForAlgorithm);
  selectedItemsStore.setDimForChosenAlgorithm(2);
};

watchEffect(() => {
  selectedItemsStore.setNewItems(selectedItems.value);

  const algorithms = selectedItems.value.find(
    ({ name }) => name === "algorithm"
  );

  const functions = selectedItems.value.find(({ name }) => name === "function");

  if (algorithms && functions) {
    const algorithmCount = algorithms.dllsNames.length;
    const functionCount = functions.dllsNames.length;

    if (algorithmCount === 1 && functionCount >= 1) {
      steps.value = [
        {
          label: "Choose functions and algorithms",
          route: "/",
        },
        {
          label: "Enter parameters",
          route: "/step-2",
          command: async () => {
            if (!selectedItemsStore.getParamsForChosenAlgorithm())
              await setDefaultParamsForAlgorithm();
          },
        },
        {
          label: "Summary",
          route: "/step-3",
          command: async () => {
            if (!selectedItemsStore.getParamsForChosenAlgorithm())
              await setDefaultParamsForAlgorithm();

            const items = selectedItemsStore.getItems();

            if (!items) return;
            const payload = {
              testFunctionNames: items[0].dllsNames,
              optimizationAlgorithmNames: items[1].dllsNames,
              dim: selectedItemsStore.getDimForChosenAlgorithm(),
              paramsForAlgorithm: selectedItemsStore
                .getParamsForChosenAlgorithm()
                .map(({ lowerBoundary, upperBoundary, step, name }: any) => ({
                  lowerBoundry: lowerBoundary,
                  upperBoundry: upperBoundary,
                  step,
                  name,
                })),
            };

            calculatingStore.startCalculating(payload);
            stepsStore.setAreStepsReadonly(true);
          },
        },
      ];
    } else if (algorithmCount >= 1 && functionCount == 1) {
      steps.value = [
        {
          label: "Choose functions and algorithms",
          route: "/",
        },

        {
          label: "Summary",
          route: "/step-3",
        },
      ];
    } else {
      steps.value = [];
      toast.add({
        severity: "warn",
        summary: "No operations available for selected items.",
        detail:
          algorithmCount > 1 && functionCount > 1
            ? "Too many algorithms and functions selected."
            : "No algorithms or functions selected.",
        life: 3000,
      });
    }
  }
});

onMounted(async () => {
  activeStep.value = steps.value.findIndex(
    (item: { route: RouteLocationRaw }) =>
      route.path === router.resolve(item.route).path
  );
  // call for api to check if calculations were paused
  await axios
    .get(`http://localhost:7224/IfCalculationsFinished`)
    .then((res) => {
      if (!res.data) confirm1();
    });
});

watch(
  route,
  () => {
    activeStep.value = steps.value.findIndex(
      (item: { route: RouteLocationRaw }) =>
        route.path === router.resolve(item.route).path
    );
  },
  { immediate: true }
);

const confirm = useConfirm();
const toast = useToast();

const confirm1 = () => {
  confirm.require({
    message: "Last calculations were not finished. Do you want to resume?",
    header: "Resume calculations?",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      router.push("/step-3");
      calculatingStore.resumeCalculating();
      stepsStore.setAreStepsReadonly(true);
    },
    reject: () => {
      toast.add({
        severity: "info",
        summary: "Rejected",
        detail: "You can start new calculations now.",
        life: 3000,
      });
    },
  });
};

const stepsStore = useStepsStore();

const areStepsReadonly = computed(() => stepsStore.getAreStepsReadonly());
</script>

<template>
  <div id="app">
    <main>
      <div class="header">
        <h1>Algorithmus ➕</h1>
      </div>
      <div class="main">
        <div class="sidebar">
          <TabMenu v-model:activeIndex="active" :model="items">
            <template #item="{ label, item, props }">
              <router-link
                v-if="item.route"
                v-slot="routerProps"
                :to="item.route"
                custom
              >
                <a
                  :href="routerProps.href"
                  v-bind="props.action"
                  @click="($event) => routerProps.navigate($event)"
                >
                  <span v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </router-link>
            </template>
          </TabMenu>
        </div>
        <div class="router-view">
          <div class="steps-container">
            <Transition>
              <div
                v-if="
                  router.currentRoute.value.path !== '/documentation' &&
                  steps.length !== 0
                "
              >
                <Steps
                  :model="steps"
                  aria-label="Form Steps"
                  :readonly="areStepsReadonly"
                  :pt="{
                    menuitem: ({ context }) => ({
                      class:
                        isActive(context.item) && 'p-highlight p-steps-current',
                    }),
                  }"
                >
                  <template #item="{ label, item, index, props }">
                    <router-link
                      v-if="item.route"
                      v-slot="routerProps"
                      :to="item.route"
                      custom
                    >
                      <a
                        :href="routerProps.href"
                        v-bind="props.action"
                        @click="($event) => routerProps.navigate($event)"
                      >
                        <span v-bind="props.step">{{ index + 1 }}</span>
                        <span v-bind="props.label">{{ label }}</span>
                      </a>
                    </router-link>
                    <a
                      v-else
                      :href="item.url"
                      :target="item.target"
                      v-bind="props.action"
                    >
                      <span v-bind="props.step">{{ index + 1 }}</span>
                      <span v-bind="props.label">{{ label }}</span>
                    </a>
                  </template>
                </Steps>
              </div>
            </Transition>
          </div>

          <RouterView v-slot="{ Component }">
            <keep-alive>
              <component
                :is="Component"
                @new-items-selected="($event: any) => selectedItems = $event"
              />
            </keep-alive>
          </RouterView>
        </div>
      </div>
    </main>
  </div>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped lang="scss">
.steps-container {
  height: 100px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.sidebar {
  padding: 2rem 6rem 2rem 1rem;
  border-radius: 0.6875rem;
  background: linear-gradient(180deg, #5f1fc7 0%, #9820c8 100%);

  box-shadow: 0px 0px 24px 7px rgba(89, 89, 89, 0.22);
}
main {
  padding: 20px;
  .header {
    margin: 20px;
    margin-bottom: 30px;
  }
  .main {
    height: 100%;
    display: flex;

    .router-view {
      flex: 1;
      padding: 0 50px;
    }
  }
}
</style>
