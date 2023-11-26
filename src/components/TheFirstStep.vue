<script setup lang="ts">
import FileUpload from "primevue/fileupload";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
// import axios from "axios";

import { Ref, ref } from "vue";

const fileType = ref("");
const nameAlreadyExists = ref(false);

const onUpload = (type: "function" | "algorithm") => {
  alert("uploaded");
  fileType.value = type;
  isModalVisible.value = true;
};

const finishUpload = async () => {
  // await axios.get("http://localhost:7224/WeatherForecast").then((res) => {
  //   console.log(res);
  // });
  switch (fileType.value) {
    case "algorithm":
      if (algorithms.value.includes(uploadedFile.value.uploadedFileNewName)) {
        nameAlreadyExists.value = true;
        return;
      }
      algorithms.value.push(uploadedFile.value.uploadedFileNewName);
      break;
    case "function":
      if (
        objectiveFunctions.value.includes(
          uploadedFile.value.uploadedFileNewName
        )
      ) {
        nameAlreadyExists.value = true;
        return;
      }
      objectiveFunctions.value.push(uploadedFile.value.uploadedFileNewName);
      break;
  }
  nameAlreadyExists.value = false;
  isModalVisible.value = false;

  uploadedFile.value.params = [];
  uploadedFile.value.uploadedFileNewName = "";
};

const objectiveFunctions = ref([
  "Rastrigin",
  "Rosenbrock",
  "Sphere",
  "Test function 1",
]);

const algorithms = ref(["Snake optimizer", "Grey wolf", "Black widow"]);

const mockedFile = {
  name: "Rastrigin",
  params: ["dim", "xmax", "xmin"],
};

const selectedFunctions: Ref<string[]> = ref([]);
const selectedAlgotithms: Ref<string[]> = ref([]);
const isModalVisible = ref(false);

const uploadedFile = ref({
  uploadedFileNewName: "",
  params: [],
});
</script>

<template>
  <div class="section functions-section">
    <h2>My functions</h2>
    <div class="functions cards">
      <div
        v-for="(objFunc, index) in objectiveFunctions"
        :key="objFunc"
        class="custom-card custom-card__hover"
        :class="
          selectedFunctions.includes(objFunc) ? 'custom-card--highlighted' : ''
        "
      >
        <div class="checkbox-item">
          <Checkbox
            v-model="selectedFunctions"
            :inputId="`f-${index}`"
            name="function"
            :value="objFunc"
          />
          <label :for="`f-${index}`" class="ml-2"
            ><h2>{{ objFunc }}</h2></label
          >
        </div>

        <div class="no-image" />
      </div>
    </div>
    <div class="custom-card flex justify-content-center">
      <FileUpload
        mode="basic"
        name="functionUpload"
        url="/api/upload"
        accept=".pdf"
        :maxFileSize="1000000"
        chooseLabel="Upload new function"
        :auto="true"
        @select="onUpload('function')"
      />
    </div>
  </div>
  <div class="section algorithms-section">
    <h2>My algorithms</h2>
    <div class="algorithms cards">
      <div
        v-for="(algorithm, index) in algorithms"
        :key="algorithm"
        class="custom-card custom-card__hover"
        :class="
          selectedAlgotithms.includes(algorithm)
            ? 'custom-card--highlighted'
            : ''
        "
      >
        <div class="checkbox-item">
          <Checkbox
            v-model="selectedAlgotithms"
            :inputId="`a-${index}`"
            name="function"
            :value="algorithm"
          />
          <label :for="`a-${index}`" class="ml-2"
            ><h2>{{ algorithm }}</h2></label
          >
        </div>
        <div class="no-image" />
      </div>
    </div>
    <div class="custom-card flex justify-content-center">
      <FileUpload
        mode="basic"
        name="algorithmUpload"
        url="/api/upload"
        accept=".dll"
        :maxFileSize="1000000"
        chooseLabel="Upload new algorithm"
        :auto="true"
        @select="onUpload('algorithm')"
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
        v-model="uploadedFile.uploadedFileNewName"
        aria-describedby="Name-help"
        :class="{ 'p-invalid': nameAlreadyExists }"
      />
      <small id="Name-help">Enter name for your {{ fileType }}.</small>
    </div>
    <small class="p-error" id="text-error" v-if="nameAlreadyExists"
      >This name already exists.</small
    >

    <div
      v-for="(param, index) in mockedFile.params"
      :key="index"
      class="help-input"
    >
      <label :for="param">{{ param }}</label>
      <InputText
        :id="param"
        v-model="uploadedFile.params[index]"
        :aria-describedby="`${param}-help`"
      />
      <small :id="`${param}-help`"
        >Enter new name for {{ `${param}` }} (optional).</small
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

  .custom-card {
    min-width: 400px !important;
    min-height: 200px !important;
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
.help-input {
  display: flex !important;
  flex-direction: column;
  max-width: 15rem;
  gap: 0.5rem;
  margin: 1rem 0;
}
</style>
