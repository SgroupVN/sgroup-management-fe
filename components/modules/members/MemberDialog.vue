<template>
  <Dialog
    v-model:visible="isVisible"
    :style="{ width: '550px' }"
    :header="props.memberData ? 'Member Details' : 'Add Member'"
    :modal="true"
    class="p-fluid"
    @hide="cancel"
  >
    <div class="field flex justify-content-between">
      <div>
        <label for="name">First Name</label>
        <InputText
          id="name"
          v-model.trim="member.firstName"
          required="true"
          autofocus
          :class="{ 'p-invalid': isSubmitted && !member.firstName }"
        />
        <small class="p-error" v-if="isSubmitted && !member.firstName"
          >Name is required.</small
        >
      </div>
      <div>
        <label for="name">Last Name</label>
        <InputText
          id="name"
          v-model.trim="member.lastName"
          required="true"
          autofocus
          :class="{ 'p-invalid': isSubmitted && !member.lastName }"
        />
        <small class="p-error" v-if="isSubmitted && !member.lastName"
          >Name is required.</small
        >
      </div>
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
      <label for="phone">Phone Number</label>
      <InputText id="phone" v-model.trim="member.phone" required="true" />
      <small class="p-error" v-if="isSubmitted && !member.phone"
        >Phone Number is required.</small
      >
    </div>
    <!-- <div class="field">
      <label for="address">Address</label>
      <InputText id="address" v-model.trim="member.address" />
      <small class="p-error" v-if="isSubmitted && !member.address"
        >Address is required.</small
      >
    </div> -->
    <div class="field">
      <label for="birthDate">Date of Birth</label>
      <Calendar
        id="birthDate"
        v-model="member.birthDate"
        :showIcon="true"
        :showButtonBar="true"
        dateFormat="dd/mm/yy"
      ></Calendar>
      <small class="p-error" v-if="isSubmitted && !member.birthDate"
        >Date of Birth is required.</small
      >
    </div>
    <!-- <div class="field">
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
    </div> -->
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="cancel"></Button>
      <Button
        label="Save"
        icon="pi pi-check"
        text
        @click="onSaveButtonClicked()"
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
  memberData: Object,
});
const emits = defineEmits(["close", "saved"]); // Define a custom 'close' event

const selectedMajorGroup = ref(MAJOR_GROUPS[0].key);
const selectedMajorGroupItems = ref(PROGRAMMING_MAJORS);
const member = ref(
  props.memberData || {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // address: "",
    birthDate: null,
    // debt: 0,
    // status: MemberStatus.Active,
    // major: PROGRAMMING_MAJORS[0].key,
    // avatar: "",
  }
);
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

onMounted(() => {
  console.log("onMounted the dialog");
});

const onStatusChanged = (event) => {
  member.value.status = event.value;
};

const checkIsDataValid = () => {
  return (
    member.value.firstName &&
    member.value.lastName &&
    member.value.email &&
    member.value.phone &&
    member.value.birthDate
  );
};

const onSaveButtonClicked = async () => {
  const isDataValid = checkIsDataValid();
  const isUpdated = props.memberData ? true : false;
  let response = undefined;
  isSubmitted.value = true;
  if (!isDataValid) {
    return;
  }

  if (isUpdated) {
    response = await MembersService.updateMemberInformation(member.value);
  } else {
    response = await MembersService.createNewMembers([
      {
        firstName: member.value.firstName,
        lastName: member.value.lastName,
        email: member.value.email,
        phone: member.value.phone,
        birthDate: member.value.birthDate,
      },
    ]);
  }

  if (response.success) {
    isSubmitted.value = false;
    isVisible.value = false;
    emits("saved");
    toast.add({
      severity: "success",
      detail: isUpdated
        ? `You have updated members ${member.value.firstName}`
        : `You have created new member ${member.value.firstName}`,
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
