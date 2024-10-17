"use client";

import {
  hardDeleteUsers,
  fetchAllUsers,
  fetchUsers,
  fetchUsersCount,
  handleUserStatus,
  softDeleteUsers,
  fetchTotalUsersKPI,
  fetchActiveUsersKPI,
  fetchInactiveUsersKPI,
} from "@/app/actions/UserAction";
import KpiComponent from "@/components/Kpi";
import TableComponent from "@/components/Table";
import ConfirmationModal from "@/modals/ConfirmationModal";
import { setSelectedTab, showToastWithTimeout } from "@/redux/SharedSlice";
import { Header } from "@/types/table";
import { usersKpi } from "@/utils/global";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const headers: Header = {
  name: "Users",
  hasFilters: true,
  hasDelete: true,
  hasSelect: true,
  filters: [
    { id: "username", columnName: "Name", columnType: "String" },
    { id: "email_id", columnName: "Email id", columnType: "String" },
    {
      id: "age_group",
      columnName: "Age group",
      columnType: "Enum",
      columnItem: [
        { id: "eighteen_to_thirty", name: "18-30" },
        { id: "thirty_one_to_fourty_five", name: "31-45" },
        { id: "fourty_six_to_sixty", name: "45-60" },
        { id: "sixty_plus", name: "60+" },
      ],
    },
    {
      id: "status",
      columnName: "Status",
      columnType: "Enum",
      columnItem: [
        { id: "active", name: "Active" },
        { id: "pending", name: "Pending" },
        { id: "inactive", name: "Inactive" },
        { id: "suspended", name: "Suspended" },
        { id: "soft_delete", name: "Soft Delete" },
      ],
    },
  ],
  properties: [
    { id: "delete", columnName: "Select", type: "Delete" },
    { id: "index", columnName: "S.No", type: "Index" },
    {
      id: "username",
      columnName: "Name",
      type: "String",
      shouldSort: true,
      tooltip: true,
    },
    {
      id: "email_id",
      columnName: "Email ID",
      type: "Email",
      tooltip: true,
      shouldSort: true,
    },
    { id: "age_group", columnName: "Age Group", type: "String" },
    { id: "profession", columnName: "Profession", type: "String" },
    { id: "country", columnName: "Country", type: "String" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
    {
      id: "menu",
      columnName: "Status",
      actionValue: "status",
      type: "Menu",
      menuData: [
        { id: "active", name: "Active" },
        { id: "pending", name: "Pending" },
        { id: "inactive", name: "Inactive" },
        { id: "suspended", name: "Suspended" },
        { id: "soft_delete", name: "Soft Delete" },
      ],
    },
  ],
};

const UsersPage = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [kpiData, setKpiData] = useState(usersKpi);
  const [confirmationModal, setConfirmationModal]: any = useState({
    status: false,
    data: {},
  });

  const fetchKpiData = useCallback(async () => {
    try {
      const [total, active, inactive] = await Promise.all([
        fetchTotalUsersKPI(),
        fetchActiveUsersKPI(),
        fetchInactiveUsersKPI(),
      ]);

      setKpiData((prevKpiData) =>
        prevKpiData.map((kpi) => {
          if (kpi.id === "usersCount") {
            return {
              ...kpi,
              loading: false,
              value: total.count ?? 0,
              percentage: Number(total.percentageDifference),
            };
          }
          if (kpi.id === "activeUsersCount") {
            return {
              ...kpi,
              loading: false,
              value: active.count ?? 0,
              percentage: Number(active.percentageDifference),
            };
          }
          if (kpi.id === "inactiveUsersCount") {
            return {
              ...kpi,
              loading: false,
              value: inactive.count ?? 0,
              percentage: Number(inactive.percentageDifference),
            };
          }
          return kpi;
        })
      );
    } catch (error) {
      console.error("Failed to fetch KPI data", error);
    }
  }, []);

  useEffect(() => {
    fetchKpiData();
  }, [fetchKpiData]);

  const fetchTableCount = useCallback(async (payload: any) => {
    return (await fetchUsersCount(payload)).count || 0;
  }, []);

  const fetchTableData = useCallback(async (payload: any) => {
    return (await fetchUsers(payload)).data || [];
  }, []);

  const fetchAllData = useCallback(async () => {
    return (await fetchAllUsers()).data || [];
  }, []);

  const handleConfirm = useCallback(async () => {
    setConfirmationModal({ status: false, data: {} });
  }, []);

  const handleConfirmationClose = useCallback(() => {
    setConfirmationModal({ status: false, data: {} });
  }, []);

  const handleMenuChange = useCallback(async (actionId: string, data: any) => {
    const payload = { action: data, actionId };
    const response = await handleUserStatus(payload);
    if (response.success) return { shouldRefetch: true };
  }, []);

  const handleRowClick = useCallback((data: any) => {
    dispatch(setSelectedTab({ id: 1, subTab: "Details", subTabId: null }));
    router.push(`/admin/users/details/${data.id}?tab=1&subTab=Details`);
  }, []);

  const handleSoftDelete = useCallback(async (users: any) => {
    dispatch(
      showToastWithTimeout({
        message: "It might take some time to delete the users",
        status: "success",
      })
    );
    const response = await softDeleteUsers({ users });
    if (response.success) {
      dispatch(
        showToastWithTimeout({
          message: "Users deleted successfully",
          status: "success",
        })
      );
    } else {
      dispatch(
        showToastWithTimeout({
          message: response.error,
          status: "error",
        })
      );
    }
    return { shouldRefetch: true };
  }, []);

  const handleHardDelete = useCallback(async (users: any) => {
    dispatch(
      showToastWithTimeout({
        message: "It might take some time to delete the users",
        status: "success",
      })
    );
    const response = await hardDeleteUsers({ users });
    if (response.success) {
      dispatch(
        showToastWithTimeout({
          message: "Users deleted successfully",
          status: "success",
        })
      );
    } else {
      dispatch(
        showToastWithTimeout({
          message: response.error,
          status: "error",
        })
      );
    }
    return { shouldRefetch: true };
  }, []);

  return (
    <Flex flexDir={"column"} maxH={"inherit"} height={"inherit"}>
      <SimpleGrid width={"100%"} columns={{ laptop: 3 }} gap="20px" mb={4}>
        {kpiData.map((kpi) => (
          <KpiComponent key={kpi.id} {...kpi} />
        ))}
      </SimpleGrid>
      <TableComponent
        isClickable
        headers={headers}
        searchPlaceholder="Search by name/email"
        handleMenuChange={handleMenuChange}
        handleClick={handleRowClick}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
        handleHardDelete={handleHardDelete}
        handleSoftDelete={handleSoftDelete}
        fetchAllData={fetchAllData}
      />
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </Flex>
  );
};

export default UsersPage;
