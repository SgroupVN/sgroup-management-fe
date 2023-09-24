<template>
  <Dialog
    v-model:visible="dialogVisible"
    :style="{ width: '450px' }"
    header="Member Details"
    :modal="true"
    class="p-fluid"
    @hide="cancel"
  >
    <div class="field">
      <label for="name">Name</label>
      <InputText
        id="name"
        v-model.trim="member.name"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !member.name }"
      />
      <small class="p-error" v-if="submitted && !member.name"
        >Name is required.</small
      >
    </div>
    <div class="field">
      <label for="email">Email</label>
      <InputText id="email" v-model.trim="member.email" required="true" />
      <small class="p-error" v-if="submitted && !member.email"
        >Email is required.</small
      >
    </div>
    <div class="field">
      <label for="phoneNumber">Phone Number</label>
      <InputText
        id="phoneNumber"
        v-model.trim="member.phoneNumber"
        required="true"
      />
      <small class="p-error" v-if="submitted && !member.phoneNumber"
        >Phone Number is required.</small
      >
    </div>
    <div class="field">
      <label for="address">Address</label>
      <InputText id="address" v-model.trim="member.address" />
    </div>
    <div class="field">
      <label for="dateOfBirth">Date of Birth</label>
      <Calendar
        id="dateOfBirth"
        v-model="member.dateOfBirth"
        :showIcon="true"
        :showButtonBar="true"
      ></Calendar>
    </div>
    <div class="field">
      <label for="debt">Debt</label>
      <InputNumber
        id="debt"
        v-model="member.debt"
        mode="currency"
        currency="VND"
        locale="vi-VN"
      />
    </div>
    <div class="field">
      <label for="status" class="mb-3">Status</label>
      <Dropdown
        id="status"
        v-model="member.status"
        :options="statuses"
        optionLabel="label"
        placeholder="Select a Status"
      >
        <!-- ... (template for Dropdown) -->
      </Dropdown>
    </div>
    <div class="field">
      <div class="flex gap-3">
        <label for="major" class="mb-3">Group Major</label>

        <div v-for="(majorGroup, index) in MAJOR_GROUPS" :key="index">
          <div class="field-radiobutton mb-0">
            <RadioButton
              :id="majorGroup.key"
              v-model="selectedMajorGroup"
              name="option"
              :value="majorGroup.key"
            />
            <label :for="majorGroup.key">{{ majorGroup.value }}</label>
          </div>
        </div>
      </div>
      <Dropdown
        id="major"
        v-model="selectedMajorGroup.major"
        :options="selected"
        optionLabel="label"
        placeholder="Select a Major"
      >
        <!-- ... (template for Dropdown) -->
      </Dropdown>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="cancel"></Button>
      <Button label="Save" icon="pi pi-check" text @click="save"></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import {
  MAJOR_GROUPS,
  PROGRAMMING_MAJORS,
} from "@/types/constants/members/major.const";
import { MajorType } from "@/types/enums/members/major.enum";

const props = defineProps({
  visible: Boolean, // Define a prop named 'visible' of type Boolean
});
const emits = defineEmits(["close", "saved"]); // Define a custom 'close' event

const dialogVisible = ref(props.visible);
const selectedMajorGroup = ref(MAJOR_GROUPS[0]);

const member = ref({
  id: "", // Initialize with the member's ID
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: null,
  debt: 0,
  status: "",
  major: "",
  image: "", // You may initialize this with a default image URL
});
const submitted = ref(false);

const statuses = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const majors = [
  { label: "Computer Science", value: "cs" },
  { label: "Mathematics", value: "math" },
  { label: "Engineering", value: "eng" },
];

const createMember = () => {
  member.value = {};
  submitted.value = false;
  dialogVisible.value = true;
};

const cancel = () => {
  emits("close");
  dialogVisible.value = false;
  submitted.value = false;
};

const save = () => {
  submitted.value = true;
  emits("saved");
};
</script>
