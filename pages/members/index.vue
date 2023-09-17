<script setup>
definePageMeta({
  middleware: ["permission"],
  meta: {
    permissions: [AppPermission.CanManageUser, AppPermission.CanManageUser],
  },
});

import { AppPermission } from "@/types/enums/permission.enum";
import { onMounted, ref } from "vue";
const users = ref(null);

onMounted(() => {
  //  call api get data
  try {
    // let users = useApiGet('/users');
    users.value = [
      {
        name: "Nguyễn Văn A",
        email: "van.a@email.com",
        dateOfBirth: "15/05/1990",
        phone: "0987 123 456",
        status: "Hoạt động",
        lateCount: 3,
        major: "FE", // Front-End
        debt: 0,
      },
      {
        name: "Lê Thị B",
        email: "thi.b@email.com",
        dateOfBirth: "25/12/1988",
        phone: "0976 543 210",
        status: "Tạm nghỉ",
        lateCount: 2,
        major: "BE", // Back-End
        debt: 500000,
      },
      {
        name: "Trần Văn C",
        email: "van.c@email.com",
        dateOfBirth: "20/08/1995",
        phone: "0905 678 123",
        status: "Hoạt động",
        lateCount: 0,
        major: "AI", // Artificial Intelligence
        debt: 1200000,
      },
    ];
  } catch (error) {
    console.log(error);
  }
});

const editMember = (data, index) => {
  //
  console.log(data, index);
};
</script>

<template>
  <div class="card h-full">
    <h5>Members</h5>
    <DataTable
      :value="users"
      :rows="5"
      :paginator="true"
      responsiveLayout="scroll"
      :resizableColumns="true"
      scrollable
      removableSort
    >
      <Column
        field="name"
        frozen
        header="Name"
        :sortable="true"
        style="width: 35%; min-width: 200px"
      ></Column>
      <Column
        field="email"
        header="Email"
        :sortable="true"
        style="width: 20%; min-width: 200px"
      ></Column>
      <Column
        field="dateOfBirth"
        header="Date of Birth"
        :sortable="true"
        style="width: 15%; min-width: 150px"
      ></Column>
      <Column
        field="phone"
        header="Phone"
        :sortable="true"
        style="width: 15%; min-width: 150px"
      ></Column>
      <Column
        field="status"
        header="Status"
        :sortable="true"
        style="width: 10%; min-width: 150px"
      ></Column>
      <Column
        field="lateCount"
        header="Late Count"
        :sortable="true"
        style="width: 10%; min-width: 150px"
      ></Column>
      <Column
        field="major"
        header="Major"
        :sortable="true"
        style="width: 15%; min-width: 150px"
      ></Column>
      <Column style="flex: 0 0 4rem">
        <template #body="{ data, index }">
          <Button
            type="button"
            :icon="'pi pi-pencil'"
            text
            size="small"
            @click="editMember(data, index)"
          ></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
