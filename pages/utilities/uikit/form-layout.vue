<script setup>
import { ref } from "vue";

const dropdownItems = ref([
  { name: "Option 1", code: "Option 1" },
  { name: "Option 2", code: "Option 2" },
  { name: "Option 3", code: "Option 3" },
]);

const dropdownItem = ref(null);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Vertical</h5>
        <div class="field">
          <label for="name1">Name</label>
          <InputText id="name1" type="text" />
        </div>
        <div class="field">
          <label for="email1">Email</label>
          <InputText id="email1" type="text" />
        </div>
        <div class="field">
          <label for="age1">Age</label>
          <InputText id="age1" type="text" />
        </div>

        <div class="h-[1px] w-full bg-gray-200 my-5"></div>

        <h5>Help Text</h5>
        <div class="field p-fluid">
          <label for="username">Username</label>
          <InputText id="username" type="text" />
          <small>Enter your username to reset your password.</small>
        </div>

        <div class="field col-12">
          <label for="address">Address</label>
          <Textarea id="address" rows="4" />
        </div>
        <div class="field col-12 md:col-6">
          <label for="state">State</label>
          <Dropdown
            id="state"
            v-model="dropdownItem"
            :options="dropdownItems"
            optionLabel="name"
            placeholder="Select One"
          ></Dropdown>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <h5>Inline</h5>
        <div class="formgroup-inline">
          <div class="field flex-1">
            <label for="firstname1" class="p-sr-only">Firstname</label>
            <InputText
              id="firstname1"
              type="text"
              placeholder="Firstname"
              class="w-full"
            />
          </div>
          <div class="field flex-1">
            <label for="lastname1" class="p-sr-only">Lastname</label>
            <InputText
              id="lastname1"
              type="text"
              placeholder="Lastname"
              class="w-full"
            />
          </div>
          <Button label="Submit"></Button>
        </div>
      </div>
    </div>
  </div>
</template>
