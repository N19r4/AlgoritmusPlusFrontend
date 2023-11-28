<script setup lang="ts">
import { Ref, ref, watch, defineEmits, defineProps } from "vue";
import FileUpload from "primevue/fileupload";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

const props = defineProps<{
  name: string;
  items: any[];
}>();

// uploaded function
const mockedFile = {
  name: "Rastrigin",
  params: ["dim", "xmax", "xmin"],
};

const uploadedFile: Ref<{ name: string; params: any[] }> = ref({
  name: "",
  params: [],
});

const items = ref(props.items);
const isModalVisible = ref(false);
const nameAlreadyExists = ref(false);

const selectedItems: Ref<string[]> = ref([]);

const emit = defineEmits(["new-item-selected"]);

watch(selectedItems, (newVal) => {
  emit("new-item-selected", newVal);
});

const onUpload = () => {
  uploadedFile.value.name = mockedFile.name;
  uploadedFile.value.params = [...mockedFile.params];
  isModalVisible.value = true;
};

const finishUpload = async () => {
  // await axios.get("http://localhost:7224/WeatherForecast").then((res) => {
  //   console.log(res);
  // });

  if (
    items.value.map(({ name }) => name).includes(uploadedFile.value.name.trim())
  ) {
    nameAlreadyExists.value = true;
    return;
  }

  nameAlreadyExists.value = false;

  if (uploadedFile.value.params.some((param) => !param)) return;

  const maxID = Math.max(...items.value.map(({ id }) => id)) + 1;

  items.value.push({
    name: uploadedFile.value.name,
    params: uploadedFile.value.params,
    id: maxID,
  });

  isModalVisible.value = false;

  uploadedFile.value.params = [];
  uploadedFile.value.name = "";
};
</script>

<template>
  <div class="section">
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
            :key="`${name}-${param}-${index}`"
            class="item-params__param"
            >{{ param }}</span
          >
        </div>
      </div>
    </div>
    <div class="custom-card flex justify-content-center">
      <FileUpload
        mode="basic"
        name="fileUpload"
        url="/api/upload"
        accept=".pdf"
        :maxFileSize="1000000"
        :chooseLabel="`Upload new ${props.name}`"
        :auto="true"
        @select="onUpload()"
      />
    </div>
  </div>
  <Dialog
    v-model:visible="isModalVisible"
    modal
    header="Enter additional info"
    :style="{ width: '30rem' }"
  >
    <div class="help-input">
      <label for="Name">Name</label>
      <InputText
        id="Name"
        v-model="uploadedFile.name"
        aria-describedby="Name-help"
        :class="{ 'p-invalid': nameAlreadyExists }"
        :maxlength="30"
      />
      <small id="Name-help"
        >Enter new name for your {{ props.name }} (optional)</small
      >
    </div>
    <small class="p-error" id="text-error" v-if="nameAlreadyExists"
      >This name already exists.</small
    >

    <div
      v-for="(param, index) in mockedFile.params"
      :key="index"
      class="help-input"
    >
      <InputText
        :id="param"
        v-model="uploadedFile.params[index]"
        :aria-describedby="`${param}-help`"
        :class="{ 'p-invalid': !uploadedFile.params[index].length }"
        :maxlength="20"
      />
      <small :id="`${param}-help`"
        >Enter new name for {{ `${param}` }} (optional)</small
      >
      <small
        class="p-error"
        :id="`${param}-required-error`"
        v-if="!uploadedFile.params[index].length"
        >This name is required.</small
      >
    </div>

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
