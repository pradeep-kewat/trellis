"use client";

import {
  fetchUsersNotifications,
  fetchUsersNotificationsCount,
} from "@/app/actions/NotificationAction";
import TableComponent from "@/components/Table";
import { toggleBackButton } from "@/redux/SharedSlice";
import { Header } from "@/types/table";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const headers: Header = {
  name: "Users Notification",
  hasFilters: false,
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "title", columnName: "Title", type: "String", tooltip: true },
    { id: "receiver_name", columnName: "Receiver Name", type: "String" },
    { id: "created_at", columnName: "Sended At", type: "Date" },
  ],
};

const NotificationDetail = ({ params }: any) => {
  const dispatch: AppDispatch = useDispatch();

  const fetchTableCount = async () => {
    return (
      await fetchUsersNotificationsCount({
        notificationId: params?.notificationId,
      })
    ).count;
  };

  const fetchTableData = async (payload: any) => {
    return (
      (
        await fetchUsersNotifications({
          ...payload,
          notificationId: params?.notificationId,
        })
      ).data || []
    );
  };

  useEffect(() => {
    return () => {
      dispatch(toggleBackButton(false));
    };
  }, []);

  return (
    <TableComponent
      headers={headers}
      fetchTableData={fetchTableData}
      fetchTableCount={fetchTableCount}
    />
  );
};

export default NotificationDetail;
