<template>
  <div class="card h-full">
    <h3>Members</h3>
    <div class="flex justify-end my-2 gap-2">
      <Button class="cursor-pointer">
        <label for="dropzone-file"
          ><i class="pi pi-upload mr-2"></i> Import
        </label>
        <input
          id="dropzone-file"
          type="file"
          class="hidden"
          @change="handleFileUpload"
        />
      </Button>
      <Button
        label="New"
        icon="pi pi-plus"
        severity="secondary"
        class="mr-2"
        @click="onOpenDetailMemberDialog"
      ></Button>
    </div>

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
      <Column style="flex: 0 0 4rem" frozen>
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
  <Dialog
    v-model:visible="isShowAddNewMemberDialog"
    :style="{ width: '450px' }"
    header="Member detail"
    :modal="true"
    class="p-fluid"
  >
    content
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        @click="onCloseDetailMemberDialog"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        text
        @click="onSaveDetailMember"
      />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="isShowImportConfigDialog"
    maximizable
    header="Import config"
    :modal="true"
    class="p-fluid w-1/2"
    @hide="onCloseImportConfigDialog"
  >
    <div class="columns">
      <div class="required-columns">
        <h3>Required Columns</h3>
        <div
          v-for="(column, index) in requiredColumns"
          :key="index"
          class="flex gap-2 my-2 flex-column md:flex-row items-center"
        >
          <div class="w-60 font-semibold">
            {{ column.name }}
          </div>
          <div>
            <i class="pi pi-arrow-right mx-2"></i>
          </div>
          <Dropdown
            v-model="column.mapTo"
            :options="importedColumns"
            optionLabel="name"
            placeholder="Select a Column"
            class="w-full flex-1"
          ></Dropdown>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        @click="onCloseImportConfigDialog"
      />
      <Button label="Import" icon="pi pi-check" text @click="onImportClicked" />
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  middleware: [],
  meta: {
    permissions: [AppPermission.CanManageUser, AppPermission.CanManageUser],
  },
});

import { AppPermission } from "@/types/enums/permission.enum";
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import * as XLSX from "xlsx";

const toast = useToast();
const users = ref(null);
const requiredColumns = ref([
  {
    id: "name",
    name: "Name",
    mapTo: "",
  },
  {
    id: "email",
    name: "Email",
    mapTo: "",
  },
  {
    id: "dateOfBirth",
    name: "Date of Birth",
    mapTo: "",
  },
  {
    id: "phone",
    name: "Phone",
    mapTo: "",
  },
  {
    id: "status",
    name: "Status",
    mapTo: "",
  },
  {
    id: "lateCount",
    name: "Late Count",
    mapTo: "",
  },
  {
    id: "major",
    name: "Major",
    mapTo: "",
  },
  {
    id: "debt",
    name: "Debt",
    mapTo: "",
  },
]);
const importedColumns = ref([]);
const isShowAddNewMemberDialog = ref(false);
const isShowImportConfigDialog = ref(false);

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
//  #region Import Excel
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      processExcelData(data);
    };

    reader.readAsBinaryString(file);
  }
};

const processExcelData = (data) => {
  const workbook = XLSX.read(data, { type: "binary" });
  // get column header names
  const headerNames = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: 1 },
  )[0];
  importedColumns.value = headerNames.map((item) => ({ name: item }));
  // set mapTo
  requiredColumns.value.forEach((column) => {
    // just check nearest match
    const headerIndex = headerNames.findIndex((name) =>
      name.toLocaleLowerCase().includes(column.id.toLocaleLowerCase()),
    );
    // find key of column in requiredColumns and set mapTo
    if (headerIndex > -1) {
      column.mapTo = requiredColumns.value[headerIndex].id;
    }
  });

  // Assuming you have a single sheet in your Excel file
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the worksheet to an array of objects
  const excelData = XLSX.utils.sheet_to_json(worksheet);

  // Now you have the Excel data in the 'excelData' array
  console.log("Excel data:", excelData);

  console.log("Header Names:", headerNames);
  openImportConfigDialog();
};
// #endregion

// #region  Add Member Dialog
const onOpenDetailMemberDialog = () => {
  isShowAddNewMemberDialog.value = true;
};
const onCloseDetailMemberDialog = () => {
  isShowAddNewMemberDialog.value = false;
  submitted.value = false;
};

const onSaveDetailMember = () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Message Content",
    life: 3000,
  });
  isShowAddNewMemberDialog.value = false;
};
// #endregion

// #region  Import Config Dialog
const openImportConfigDialog = () => {
  isShowImportConfigDialog.value = true;
};

const onCloseImportConfigDialog = () => {
  isShowImportConfigDialog.value = false;
};

const onImportClicked = () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Message Content",
    life: 3000,
  });
  isShowImportConfigDialog.value = false;
  console.log(requiredColumns.value);
};
</script>
