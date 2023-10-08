<template>
  <div class="card h-full">
    <h3>Members</h3>
    <h5>Download Add template CSV <a @click="downloadFile($event)">HERE</a></h5>
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
        @click="toggleMemberDialog"
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
      <Column header="Members" style="min-width: 14rem">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <!-- <Avatar :alt="data.firstName + ' ' + data.lastName" :src="data.avatar" style="width: 32px" /> -->
            <Avatar
              image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp"
              class="flex align-items-center justify-content-center mr-2"
              shape="circle"
              size="large"
            />
            <span>{{ data.firstName + " " + data.lastName }}</span>
          </div>
        </template>
      </Column>
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
            {{ importedData?.length > 0 ? importedData[0][data.value] : "-" }}
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
            :class="data.mapTo ? '' : 'border-red-200'"
            @change="onMapFieldChanged"
          >
            <template #value="slotProps">
              <div
                v-if="slotProps.value"
                class="flex align-items-center text-black"
              >
                <div>{{ slotProps.value["value"] }}</div>
              </div>
              <span v-else class="italic text-red-700">
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
  <div v-if="isShowMemberDetailsDialog">
    <MemberDialog
      :visible="isShowMemberDetailsDialog"
      :member-data="editedMember"
      @close="onCloseMemberDialog"
      @saved="onMemberCreated"
    ></MemberDialog>
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
import MemberDialog from "@/components/modules/members/MemberDialog.vue";

const toast = useToast();
const members = ref(null);
const importedColumns = ref([]);
const importedData = ref([]);
const memberProperties = ref(MEMBER_PROPERTIES);

const isShowMemberDetailsDialog = ref(false);
const isShowImportConfigDialog = ref(false);
let editedMember = ref(null);

onMounted(() => {
  MembersService.getAllMembers().then((data) => (members.value = data));
});

const editMember = (data, index) => {
  editedMember = data;
  toggleMemberDialog();
};

const downloadFile = (event) => {
  event.preventDefault();
  const csv = ["Members", "Email", "Phone", "Date of Birth", "Major", "Debt"];
  const csvString = csv.join(",");
  const blob = new Blob([csvString], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Add new members template";
  link.click();
};

const onMemberCreated = () => {
  //
};

const onCloseMemberDialog = () => {
  editedMember.value = null;
  toggleMemberDialog();
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

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const excelData = XLSX.utils.sheet_to_json(worksheet);
  if (!excelData || excelData.length === 0) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No data found in file, please check again or try another file",
      life: 3000,
    });
    return;
  }
  importedData.value = excelData;

  updateMemberPropertiesSelection();
  openImportConfigDialog();
};
// #endregion

// #region Add Member Dialog
const toggleMemberDialog = () => {
  isShowMemberDetailsDialog.value = !isShowMemberDetailsDialog.value;
};
// #endregion

// #region  Import Config Dialog
const openImportConfigDialog = () => {
  isShowImportConfigDialog.value = true;
};

const onCloseImportConfigDialog = () => {
  isShowImportConfigDialog.value = false;
};

const onImportClicked = async () => {
  toast.add({
    severity: "info",
    summary: "Info",
    detail: "Importing data...",
    life: 3000,
  });
  // TODO: update to integrate API with BE
  // members.value = [...members.value, ...createMembersByImportedData()];
  const mappedFields = {};
  importedColumns.value.forEach((importedColumn) => {
    if (importedColumn.mapTo) {
      mappedFields[importedColumn.key] = importedColumn.mapTo.key;
    }
  });

  console.log(mappedFields);
  const response = await MembersService.createMembersByImportedData(
    importedData.value,
    mappedFields
  );
  // console.log("response when upload file", response);
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
</script>
