<template>
  <div class="card h-full">
    <h3>Members</h3>
    <div class="flex justify-end my-2 gap-2">
      <Button class="cursor-pointer">
        <label for="dropzone-file">
          <i class="pi pi-upload mr-2"></i>
          Import
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
      :value="members"
      :rows="5"
      :paginator="true"
      responsiveLayout="scroll"
      :resizableColumns="true"
      scrollable
      removableSort
    >
      <template #empty> No member found. </template>
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
        ><template #body="{ data }">
          {{ data.email || "-" }}
        </template></Column
      >
      <Column
        field="dateOfBirth"
        header="Date of Birth"
        :sortable="true"
        style="width: 15%; min-width: 150px"
        ><template #body="{ data }">
          {{ data.dateOfBirth || "-" }}
        </template></Column
      >
      <Column
        field="phone"
        header="Phone"
        :sortable="true"
        style="width: 15%; min-width: 150px"
        ><template #body="{ data }">
          {{ data.phone || "-" }}
        </template></Column
      >
      <Column
        field="status"
        header="Status"
        :sortable="true"
        style="width: 10%; min-width: 150px"
        ><template #body="{ data }">
          {{ data.status || "-" }}
        </template></Column
      >
      <Column
        field="lateCount"
        header="Late Count"
        :sortable="true"
        style="width: 10%; min-width: 150px"
      >
        <template #body="{ data }">
          {{ data.lateCount || "-" }}
        </template></Column
      >
      <Column
        field="major"
        header="Major"
        :sortable="true"
        style="width: 15%; min-width: 150px"
        ><template #body="{ data }">
          {{ data.major || "-" }}
        </template></Column
      >
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
    v-model:visible="isShowImportConfigDialog"
    header="Import config"
    :modal="true"
    class="p-fluid"
    @hide="onCloseImportConfigDialog"
  >
    <DataTable
      scrollable
      removableSort
      :value="importedColumns"
      :rows="10"
      :paginator="false"
      responsiveLayout="scroll"
      :resizableColumns="true"
      :contentStyle="{ height: '300px' }"
    >
      <Column
        field="value"
        frozen
        header="Imported Columns"
        class="min-w-[200px]"
      ></Column>
      <Column frozen header="Preview data" class="min-w-[200px]">
        <template #body="{ data }">
          <div class="flex-1">
            {{ importedData[0][data.value] }}
          </div>
        </template>
      </Column>
      <Column frozen header="S-Member Columns" class="min-w-[200px]">
        <template #body="{ data }">
          <Dropdown
            v-model="data.mapTo"
            :options="memberProperties"
            optionLabel="value"
            optionDisabled="disabled"
            placeholder="Select a Column"
            class="w-full flex-1"
            @change="onMapFieldChanged"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                <div>{{ slotProps.value["value"] }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <div>{{ slotProps.option["value"] }}</div>
              </div>
            </template>
          </Dropdown>
        </template>
      </Column>
    </DataTable>
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
  <div v-if="isShowAddNewMemberDialog">
    <AddMemberDialog
      :visible="isShowAddNewMemberDialog"
      @close="onCloseDetailMemberDialog"
      @saved="onCreateMember"
    ></AddMemberDialog>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: [permission],
  meta: {
    permissions: [AppPermission.CanManageUser, AppPermission.CanManageUser],
  },
});

import { AppPermission } from "@/types/enums/permission.enum";
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import * as XLSX from "xlsx";
import { MembersService } from "@/service/members/member.service";
import { MEMBER_PROPERTIES } from "@/types/constants/members/member-properties.const";
import permission from "@/middleware/permission";
import AddMemberDialog from "@/components/modules/members/AddMemberDialog.vue";

const toast = useToast();
const members = ref(null);
const importedColumns = ref([]);
const importedData = ref([]);
const memberProperties = ref(MEMBER_PROPERTIES);

const isShowAddNewMemberDialog = ref(false);
const isShowImportConfigDialog = ref(false);

onMounted(() => {
  members.value = MembersService.getAllMembers();
});

const editMember = (data, index) => {
  //
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
  const headerNames = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: 1 }
  )[0];
  importedColumns.value = headerNames.map((name) => ({
    key: name,
    value: name,
    mapTo: MEMBER_PROPERTIES.find((x) => {
      return (
        x.key.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(x.key.toLowerCase())
      );
    }),
  }));

  updateMemberPropertiesSelection();
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const excelData = XLSX.utils.sheet_to_json(worksheet);
  importedData.value = excelData;

  updateMemberPropertiesSelection();
  openImportConfigDialog();
};
// #endregion

// #region Add Member Dialog
const onOpenDetailMemberDialog = () => {
  isShowAddNewMemberDialog.value = true;
};

const onCloseDetailMemberDialog = () => {
  isShowAddNewMemberDialog.value = false;
  submitted.value = false;
};

const onCreateMember = () => {
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
  // TODO: update to integrate API with BE
  members.value = [...members.value, ...createMembersByImportedData()];
  //
  isShowImportConfigDialog.value = false;
};

const onMapFieldChanged = (event) => {
  updateMemberPropertiesSelection();
};

const updateMemberPropertiesSelection = () => {
  const mappedColumns = importedColumns.value
    .filter((importedColumn) => importedColumn.mapTo)
    .map((importedColumn) => importedColumn.mapTo.key);
  memberProperties.value = MEMBER_PROPERTIES.filter(
    (memberProperty) => !mappedColumns.includes(memberProperty.key)
  );
};

const createMembersByImportedData = () => {
  const members = importedData.value.map((data) => {
    const member = {};
    importedColumns.value.forEach((importedColumn) => {
      member[importedColumn.mapTo?.key] = data[importedColumn.key];
    });
    return member;
  });

  return members;
};
</script>
