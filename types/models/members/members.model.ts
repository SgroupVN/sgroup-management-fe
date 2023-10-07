export class MemberInformation {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
}

export class MembersResponseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone: string;
}

export class GetMembersResponseModel {
  data: MembersResponseModel[];
}
