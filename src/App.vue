<script setup lang="ts">
import { RouteLocationRaw, RouterView } from "vue-router";
import TabMenu from "primevue/tabmenu";
import Steps from "primevue/steps";
import ConfirmDialog from "primevue/confirmdialog";
import { ref, onMounted, watch, watchEffect, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();

const steps: Ref<never[]> | Ref<{ label: string; route: string }[]> = ref([]);

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
  },
  {
    label: "Documentation",
    icon: "pi pi-fw pi-file",
    route: "/documentation",
  },
]);

const selectedItems = ref([]);

watchEffect(() => {
  const algorithms = selectedItems.value.find(
    ({ name }) => name === "algorithm"
  );
  const functions =
    selectedItems.value.find(({ name }) => name === "function") ?? {};

  if (algorithms && functions) {
    const algorithmCount = algorithms.selectedElements.length;
    const functionCount = functions.selectedElements.length;

    if (algorithmCount === 1 && functionCount >= 1) {
      steps.value = [
        {
          label: "Choose functions and algorithms",
          route: "/",
        },
        {
          label: "Enter parameters",
          route: "/step-2",
        },
        {
          label: "Summary",
          route: "/step-3",
        },
      ];
    } else if (algorithmCount >= 1 && functionCount >= 1) {
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
    } else steps.value = [];
  }
});

onMounted(() => {
  activeStep.value = steps.value.findIndex(
    (item: { route: RouteLocationRaw }) =>
      route.path === router.resolve(item.route).path
  );
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

const confirm1 = (e: any, routerProps: any) => {
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      routerProps.navigate(e);
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};
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
                :readonly="false"
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.sidebar {
  height: 100%;
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
    height: 100vh;
    display: flex;

    .router-view {
      flex: 1;
      padding: 0 50px;
    }
  }
}
</style>
