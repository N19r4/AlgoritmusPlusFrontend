<script setup lang="ts">
import { Ref, ref, watch, defineEmits, defineProps, computed } from "vue";
import FileUpload from "primevue/fileupload";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import axios from "axios";

const props = defineProps<{
  name: string;
  items: any[];
}>();

const toast = useToast();

const showToastMessage = (
  severity: "success" | "error",
  summary: string,
  detail: string
) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000,
  });
};

const uploadedFile: Ref<{ name: string; path: string }> = ref({
  name: "",
  path: "",
});

const items = computed(() => props.items);
const isModalVisible = ref(false);
const nameAlreadyExists = ref(false);
const nameRequired = ref(false);

const selectedItems: Ref<string[]> = ref([]);

const emit = defineEmits(["new-item-selected"]);

watch(selectedItems, (newVal) => {
  emit("new-item-selected", newVal);
});

const uploadFile = async () => {
  const payload =
    props.name === "function"
      ? `testFunctionDLL=${uploadedFile.value.path}`
      : `optimizationAlgorithmDLL=${uploadedFile.value.path}`;

  await axios
    .post(
      `http://localhost:7224/${
        props.name === "function"
          ? "UploadTestFunctionDLL"
          : "UploadOptimizationAlgorithmDLL"
      }?${payload}`
    )
    .then((res) => {
      const maxID = Math.max(...items.value.map(({ id }) => id)) + 1;

      items.value.push({
        name: uploadedFile.value.name,
        id: maxID,
      });

      isModalVisible.value = false;

      uploadedFile.value.name = "";
      uploadedFile.value.path = "";
      showToastMessage("success", "Success", "File uploaded successfully.");

      return res;
    })
    .catch((err) => {
      showToastMessage("error", "Error", err.message);
    });
};

const finishUpload = async () => {
  // if (uploadedFile.value.name.trim() === "") {
  //   nameRequired.value = true;
  //   return;
  // }

  // nameRequired.value = false;

  if (
    items.value.map(({ name }) => name).includes(uploadedFile.value.name.trim())
  ) {
    nameAlreadyExists.value = true;
    return;
  }

  nameAlreadyExists.value = false;

  uploadFile();
};
</script>

<template>
  <div class="section">
    <Toast />
    <h2>My {{ props.name }}s</h2>
    <div class="cards">
      <div
        v-for="{ name, id, params } in items"
        :key="`${name}-${id}`"
        class="custom-card custom-card__hover"
        :class="selectedItems.includes(name) ? 'custom-card--highlighted' : ''"
      >
        <div class="checkbox-item">
          <Checkbox
            v-model="selectedItems"
            :inputId="`${name}-${id}`"
            :name="props.name"
            :value="name"
          />
          <label :for="`${name}-${id}`" class="ml-2"
            ><h2>{{ name }}</h2></label
          >
        </div>

        <div v-if="params" class="item-params">
          <span
            v-for="(param, index) in params"
            :key="`${name}-${param.name}-${index}`"
            class="item-params__param"
            >{{ param.name }} ({{ param.description }})</span
          >
        </div>
      </div>
    </div>
    <div class="custom-card flex justify-content-center">
      <Button @click="isModalVisible = true"
        >Upload new {{ props.name }}</Button
      >
    </div>
  </div>
  <Dialog
    v-model:visible="isModalVisible"
    modal
    :header="`Upload your ${props.name}`"
    :style="{ width: '20rem' }"
  >
    <div class="help-input">
      <label for="Path">Path</label>
      <InputText type="text" v-model="uploadedFile.path" />
    </div>
    <div class="help-input">
      <label for="Name">Name</label>
      <InputText
        id="Name"
        v-model="uploadedFile.name"
        aria-describedby="Name-help"
        :class="{ 'p-invalid': nameAlreadyExists || nameRequired }"
        :maxlength="30"
      />
    </div>
    <small class="p-error" id="text-error" v-if="nameAlreadyExists"
      >This name already exists.</small
    >
    <small class="p-error" id="text-error" v-if="nameRequired"
      >Name is required.</small
    >
    <template #footer>
      <Button
        label="Done"
        icon="pi pi-check"
        iconPos="right"
        @click="finishUpload"
      ></Button>
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    h2 {
      display: inline;
    }
    .ml-2 {
      cursor: pointer;
    }
  }
  .item-params {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    max-height: 200px;
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #daade6;
      border-radius: 10px;
      border: 3px solid #ffffff;
    }
    // .gradient {
    //   position: sticky;
    //   z-index: 10;
    //   bottom: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 1rem;
    //   background-color: #fff;
    //   opacity: 0.8;
    // }
  }

  .custom-card {
    min-width: 400px !important;
    max-height: 200px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .no-image {
    width: 100%;
    height: 70%;
    background-color: #eee;
    border-radius: 20px;
  }
}
</style>
