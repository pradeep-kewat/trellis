"use client";

import {
  DeleteCommunity,
  fetchCommunityFollowersKPI,
  fetchCommunityPosts,
  fetchCommunityPostsCount,
  fetchCommunityPostsKPI,
} from "@/app/actions/communityAction";
import KpiComponent from "@/components/Kpi";
import TableComponent from "@/components/Table";
import ConfirmationModal from "@/modals/ConfirmationModal";
import { Header } from "@/types/table";
import { communityKpi } from "@/utils/global";
import { Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
const PostsModal = dynamic(() => import("@/modals/PostsModal"), { ssr: false });

const headers: Header = {
  name: "Reports",
  hasFilters: true,
  filters: [
    { id: "user_id.username", columnName: "Posted BY", columnType: "String" },
    {
      id: "community_id.name",
      columnName: "Community",
      columnType: "String",
    },
    {
      id: "status",
      columnName: "Status",
      columnType: "Enum",
      columnItem: [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" },
        { id: "pending", name: "Pending" },
      ],
    },
  ],
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "title", columnName: "Title", type: "String", tooltip: true },
    { id: "username", columnName: "Posted By", type: "String" },
    { id: "interestsName", columnName: "Interest", type: "String" },
    { id: "communityName", columnName: "Community", type: "String" },
    { id: "status", columnName: "Status", type: "Status" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
    {
      id: "action",
      columnName: "Action",
      actionValue: "status",
      type: "Action",
      actionData: [
        { id: "edit", name: "Edit" },
        { id: "delete", name: "Delete" },
      ],
    },
  ],
};

const CommunityDetails = ({ params }: any) => {
  const [kpiData, setKpiData] = useState(communityKpi);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [confirmationModal, setConfirmationModal]: any = useState({
    status: false,
    data: {},
  });
  const [showCommunityModal, setShowCommunityModal] = useState({
    status: false,
    editData: {},
  });

  const fetchTableCount = async (payload: any) => {
    return (
      (
        await fetchCommunityPostsCount({
          ...payload,
          communityId: params?.communityId,
        })
      ).count || 0
    );
  };

  const fetchTableData = async (payload: any) => {
    return (
      (
        await fetchCommunityPosts({
          ...payload,
          communityId: params?.communityId,
        })
      ).data || []
    );
  };

  const fetchKPIData = useCallback(async () => {
    const [followers, posts] = await Promise.all([
      fetchCommunityFollowersKPI({ communityId: params?.communityId }),
      fetchCommunityPostsKPI({ communityId: params?.communityId }),
    ]);

    setKpiData((prevKpiData) =>
      prevKpiData.map((kpi) => {
        if (kpi.id === "communityFollowersCount") {
          return {
            ...kpi,
            loading: false,
            value: followers.count,
            percentage: Number(followers.percentageDifference),
          };
        }
        if (kpi.id === "communityPostsCount") {
          return {
            ...kpi,
            loading: false,
            value: posts.count,
            percentage: Number(posts.percentageDifference),
          };
        }
        return kpi;
      })
    );
  }, [params?.communityId]);

  useEffect(() => {
    fetchKPIData();
  }, []);

  const handleActionChange = async (actionId: string, data: any) => {
    if (actionId === "edit") {
      setShowCommunityModal({ status: true, editData: data });
    } else if (actionId === "delete") {
      setConfirmationModal({ status: true, data });
    }
  };

  const handleConfirm = async () => {
    setConfirmationModal({ status: false, data: {} });
    await DeleteCommunity({ id: confirmationModal.data?.id });
    setRefetchTrigger(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationModal({ status: false, data: {} });
  };

  const handleCommunityModalSuccess = () => {
    setShowCommunityModal({ status: false, editData: {} });
    setRefetchTrigger(true);
  };

  return (
    <Flex flexDir={"column"} maxH={"inherit"} height={"inherit"}>
      <SimpleGrid
        width={"100%"}
        columns={{ "mobile-s": 1, "mobile-l": 2, xl: 3 }}
        gap="20px"
        mb="20px"
      >
        {kpiData.map((kpi) => (
          <KpiComponent key={kpi.id} {...kpi} />
        ))}
      </SimpleGrid>
      <TableComponent
        searchPlaceholder="Search By Post Title"
        headers={headers}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
        handleActionChange={handleActionChange}
        refetchStatus={refetchTrigger}
        refetchData={() => setRefetchTrigger(false)}
        addlRightButton={
          <Button
            alignItems={"center"}
            variant={"create_button"}
            onClick={() =>
              setShowCommunityModal({ editData: {}, status: true })
            }
          >
            <FaPlus size={15} />
            <Text ml={2} as={"h5"}>
              Create
            </Text>
          </Button>
        }
      />
      {showCommunityModal.status && (
        <PostsModal
          editData={showCommunityModal.editData}
          onSuccess={handleCommunityModalSuccess}
          onClose={() => setShowCommunityModal({ editData: {}, status: false })}
        />
      )}
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </Flex>
  );
};

export default CommunityDetails;
