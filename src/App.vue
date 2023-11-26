<script setup lang="ts">
import { RouterView } from "vue-router";
import TabMenu from "primevue/tabmenu";
import Steps from "primevue/steps";
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const steps = ref([
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
  {
    label: "Calculate",
    route: "/step-4",
  },
]);

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

onMounted(() => {
  activeStep.value = steps.value.findIndex(
    (item) => route.path === router.resolve(item.route).path
  );
});

watch(
  route,
  () => {
    activeStep.value = steps.value.findIndex(
      (item) => route.path === router.resolve(item.route).path
    );
  },
  { immediate: true }
);
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
          <div v-if="router.currentRoute.value.path !== '/documentation'">
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
          <RouterView v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </RouterView>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
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
