"use client";

import {
  fetchGroupNotifications,
  fetchGroupNotificationsCount,
} from "@/app/actions/NotificationAction";
import TableComponent from "@/components/Table";
import { setSelectedTab } from "@/redux/SharedSlice";
import { Header } from "@/types/table";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { Button, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { useDispatch } from "react-redux";
const NotificationModal = dynamic(() => import("@/modals/NotificationModal"), {
  ssr: false,
});

const NotificationPage = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const headers: Header = {
    name: "Notifications",
    hasFilters: false,
    properties: [
      { id: "index", columnName: "S.No", type: "Index" },
      { id: "title", columnName: "Title", type: "String", tooltip: true },
      {
        id: "description",
        columnName: "Description",
        type: "String",
        tooltip: true,
      },
      { id: "created_at", columnName: "Sended At", type: "Date" },
    ],
  };

  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [shownotificationModal, setShowNotificationModal] = useState(false);

  const fetchTableCount = async (payload: any) => {
    return (await fetchGroupNotificationsCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchGroupNotifications(payload)).data || [];
  };

  const handleNotificationClick = () =>
    setShowNotificationModal(!shownotificationModal);

  const handleRowClick = (data: any) => {
    dispatch(setSelectedTab({ id: 5, subTab: "Details", subTabId: null }));
    router.push(`/admin/notification/details/${data.id}?tab=5&subTab=Details`);
  };

  const handleNotificationSuccess = () => {
    setShowNotificationModal(false);
    setRefetchTrigger(true);
  };

  return (
    <>
      <TableComponent
        searchPlaceholder="Search By Title"
        isClickable
        headers={headers}
        handleClick={handleRowClick}
        fetchTableCount={fetchTableCount}
        fetchTableData={fetchTableData}
        refetchStatus={refetchTrigger}
        refetchData={() => setRefetchTrigger(false)}
        addlRightButton={
          <Button
            alignItems={"center"}
            variant={"create_button"}
            onClick={handleNotificationClick}
          >
            <IoIosNotifications />
            <Text ml={2} as={"h5"}>
              Create
            </Text>
          </Button>
        }
      />
      {shownotificationModal && (
        <NotificationModal
          onClose={handleNotificationClick}
          onSuccess={handleNotificationSuccess}
        />
      )}
    </>
  );
};

export default NotificationPage;
