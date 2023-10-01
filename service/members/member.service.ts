export const MembersService = {
  getAllMembers() {
    return [
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
  },

  createMember(member) {
    // TODO: Call API to create member
    return {
      ...member,
      id: 1,
    };
  },
};
