export const getStatusBGColor = (status: string) => {
  return status === "active"
    ? "green.100"
    : status === "inactive"
      ? "red.100"
      : "yellow.100";
};

export const dashboardKpi = [
  {
    id: "usersCount",
    title: "Total Users",
    value: 0,
    percentage: 0,
    icon: "FaRegUserCircle",
    loading: true,
  },
  {
    id: "communitiesCount",
    title: "Total Communities",
    value: 0,
    percentage: 0,
    icon: "IoIosPeople",
    loading: true,
  },
  {
    id: "postsCount",
    title: "Total Posts",
    value: 0,
    percentage: 0,
    icon: "RiPagesFill",
    loading: true,
  },
];

export const usersKpi = [
  {
    id: "usersCount",
    title: "Total Users",
    value: 0,
    percentage: 0,
    icon: "IoIosPeople",
    loading: true,
  },
  {
    id: "activeUsersCount",
    title: "Active Users",
    value: 0,
    percentage: 0,
    icon: "FaRegUserCircle",
    loading: true,
  },
  {
    id: "inactiveUsersCount",
    title: "Inactive Users",
    value: 0,
    percentage: 0,
    icon: "FaUserSlash",
    loading: true,
  },
];

export const communityKpi = [
  {
    id: "communityFollowersCount",
    title: "Followers",
    value: 0,
    percentage: 0,
    icon: "RiUserFollowFill",
    loading: true,
  },
  {
    id: "communityPostsCount",
    title: "Posts",
    value: 0,
    percentage: 0,
    icon: "RiPagesFill",
    loading: true,
  },
  {
    id: "test",
    title: "Pending",
    value: 0,
    percentage: 0,
    icon: "RiPagesFill",
    loading: false,
  },
];

export const usersDetailsData = [
  {
    id: "personal_details",
    name: "General Information",
    properties: [
      { id: "firstname", name: "First Name", value: "" },
      { id: "lastname", name: "Last Name", value: "" },
      { id: "email_id", name: "Email", value: "" },
      { id: "profession", name: "Profession", value: "" },
      { id: "country", name: "Country", value: "" },
      { id: "created_at", name: "Join date", value: "" },
    ],
    value: "",
    loading: true,
  },
  {
    id: "profile_image",
    name: "Image",
    value: "",
    loading: true,
  },
  {
    id: "bio",
    name: "Bio",
    value: "",
    loading: true,
  },
  {
    id: "interests",
    name: "Interests",
    properties: [],
    value: "",
    loading: true,
  },
  {
    id: "skills",
    name: "Skills",
    properties: [],
    value: "",
    loading: true,
  },
  {
    id: "personality_traits",
    name: "Personality Traits",
    properties: [],
    value: "",
    loading: true,
  },
];

export const setStatusBGColor = (status: string) => {
  return status === "active"
    ? "green.100"
    : status === "pending"
      ? "yellow.100"
      : status === "inactive"
        ? "gray.100"
        : status === "suspended"
          ? "red.100"
          : status === "soft_delete"
            ? "blackAlpha.100"
            : "";
};

export const setStatusColor = (status: string) => {
  return status === "active"
    ? "green.900"
    : status === "pending"
      ? "yellow.900"
      : status === "inactive"
        ? "gray.900"
        : status === "suspended"
          ? "red.900"
          : status === "soft_delete"
            ? "blackAlpha.900"
            : "";
};

export const generateAlphanumericCode = () => {
  const characters = "0123456789";
  return Array.from({ length: 6 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};
