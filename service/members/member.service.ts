import {
  MemberInformation,
  MembersResponseModel,
  GetMembersResponseModel,
} from "@/types/models/members";
import useApiPatch from "@/composables/userApiPatch";

export const MembersService = {
  UserAPIEndPoint: "/users",

  async getAllMembers() {
    const data = await useApiGet<GetMembersResponseModel>(
      this.UserAPIEndPoint,
      {
        method: "GET",
      }
    );
    console.log(data.data);
    return data.data;
  },

  async createNewMembers(userInfo: MemberInformation[]) {
    console.log("services post new", userInfo);
    if (!userInfo) return;

    const data = await useApiPost<MemberInformation>(
      this.UserAPIEndPoint,
      userInfo
    );

    console.log("Have created new members", data);
    return data;
  },

  async createMembersByImportedData(importedData: any[], mappedField: any) {
    const data = await useApiPost<MemberInformation>(
      this.UserAPIEndPoint + `/import`,
      {
        importedData: importedData,
        mappedField: mappedField,
      }
    );
    return data;
  },

  async updateMemberInformation(userInfo: MemberInformation) {
    if (!userInfo) return;

    const data = await useApiPatch<MemberInformation>(
      this.UserAPIEndPoint + `/${userInfo.id}`,
      {
        method: "PATCH",
        body: userInfo,
      }
    );
    console.log("Have updated", data);

    return data;
  },
};
