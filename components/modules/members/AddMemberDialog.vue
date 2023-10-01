<template>
  <Dialog
    v-model:visible="isVisible"
    :style="{ width: '650px' }"
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
        :class="{ 'p-invalid': isSubmitted && !member.name }"
      />
      <small class="p-error" v-if="isSubmitted && !member.name"
        >Name is required.</small
      >
    </div>
    <div class="field">
      <label for="email">Email</label>
      <InputText
        id="email"
        v-model.trim="member.email"
        required="true"
        type="email"
      />
      <small class="p-error" v-if="isSubmitted && !member.email"
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
      <small class="p-error" v-if="isSubmitted && !member.phoneNumber"
        >Phone Number is required.</small
      >
    </div>
    <div class="field">
      <label for="address">Address</label>
      <InputText id="address" v-model.trim="member.address" />
      <small class="p-error" v-if="isSubmitted && !member.address"
        >Address is required.</small
      >
    </div>
    <div class="field">
      <label for="dateOfBirth">Date of Birth</label>
      <Calendar
        id="dateOfBirth"
        v-model="member.dateOfBirth"
        :showIcon="true"
        :showButtonBar="true"
        dateFormat="dd/mm/yy"
      ></Calendar>
      <small class="p-error" v-if="isSubmitted && !member.dateOfBirth"
        >Date of Birth is required.</small
      >
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
        :options="MEMBER_STATUS"
        optionLabel="value"
        optionValue="key"
        placeholder="Select a Status"
        @change="onStatusChanged"
      >
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
              name="majorGroup"
              :value="majorGroup.key"
              @change="onMajorGroupChange"
            />
            <label :for="majorGroup.key">{{ majorGroup.value }}</label>
          </div>
        </div>
      </div>
      <Dropdown
        id="major"
        v-model="member.major"
        :options="selectedMajorGroupItems"
        optionLabel="value"
        optionValue="key"
        placeholder="Select a Major"
      >
      </Dropdown>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="cancel"></Button>
      <Button
        label="Save"
        icon="pi pi-check"
        text
        @click="onCreateMemberButtonClicked"
      ></Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import {
  MAJOR_GROUPS,
  PROGRAMMING_MAJORS,
  DESIGN_MAJORS,
  MEMBER_STATUS,
} from "@/types/constants/members";
import { MembersService } from "@/service/members";
import { MemberStatus, MajorType } from "@/types/enums/members";

const toast = useToast();
const props = defineProps({
  visible: Boolean, // Define a prop named 'visible' of type Boolean
});
const emits = defineEmits(["close", "saved"]); // Define a custom 'close' event

const selectedMajorGroup = ref(MAJOR_GROUPS[0].key);
const selectedMajorGroupItems = ref(PROGRAMMING_MAJORS);
const member = ref({
  id: "",
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: null,
  debt: 0,
  status: MemberStatus.Active,
  major: PROGRAMMING_MAJORS[0].key,
  image: "",
});
const isVisible = ref(props.visible);
const isSubmitted = ref(false);

const onMajorGroupChange = () => {
  switch (selectedMajorGroup.value) {
    case MajorType.Programming:
      selectedMajorGroupItems.value = PROGRAMMING_MAJORS;
      break;
    case MajorType.Design:
      selectedMajorGroupItems.value = DESIGN_MAJORS;
      break;
    default:
      selectedMajorGroupItems.value = PROGRAMMING_MAJORS;
      break;
  }
};

const onStatusChanged = (event) => {
  member.value.status = event.value;
};

const checkIsDataValid = () => {
  return (
    member.value.name &&
    member.value.email &&
    member.value.phoneNumber &&
    member.value.status &&
    member.value.major
  );
};

const onCreateMemberButtonClicked = async () => {
  const isDataValid = checkIsDataValid();
  isSubmitted.value = true;
  if (!isDataValid) {
    return;
  }

  // call api to create member
  const newMember = await MembersService.createMember(member.value);
  if (newMember) {
    isSubmitted.value = false;
    isVisible.value = true;
    emits("saved");
    toast.add({
      severity: "success",
      detail: "You have created new member",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      detail: "Something went wrong, please try again",
      life: 3000,
    });
  }
};

const cancel = () => {
  emits("close");
  isVisible.value = false;
  isSubmitted.value = false;
};
</script>
