import { fetchUserPosts, fetchUserPostsCount } from "@/app/actions/UserAction";
import TableComponent from "@/components/Table";
import { Header } from "@/types/table";

interface UserPostsProps {
  userId: number;
}

const UserPosts = ({ userId }: UserPostsProps) => {
  const headers: Header = {
    name: "User Posts",
    hasFilters: false,
    properties: [
      { id: "index", columnName: "S.No", type: "Index" },
      {
        id: "title",
        columnName: "Post Title",
        type: "String",
      },
      {
        id: "communityName",
        columnName: "Community Name",
        type: "String",
      },
      { id: "created_at", columnName: "Added Date", type: "Date" },
    ],
  };

  const fetchTableCount = async (payload: any) => {
    return (await fetchUserPostsCount({ ...payload, userId })).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchUserPosts({ ...payload, userId })).data || [];
  };

  return (
    <TableComponent
      hasTabs
      headers={headers}
      searchPlaceholder="Search by name"
      fetchTableData={fetchTableData}
      fetchTableCount={fetchTableCount}
    />
  );
};

export default UserPosts;
