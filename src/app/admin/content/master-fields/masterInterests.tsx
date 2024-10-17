"use client";

import {
  createMasterInterests,
  fetchMasterInterestsCount,
  fetchMasterTableInterests,
  updateMasterInterests,
} from "@/app/actions/MasterAction";
import TableComponent from "@/components/Table";
import MasterFieldsModal from "@/modals/MasterFieldsModal";
import { Header } from "@/types/table";
import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const headers: Header = {
  name: "Master Interests",
  hasFilters: false,
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    {
      id: "name",
      columnName: "Name",
      type: "String",
      tooltip: true,
    },
    { id: "created_at", columnName: "Added Date", type: "Date" },
    {
      id: "menu",
      columnName: "Status",
      actionValue: "status",
      type: "Menu",
      menuData: [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" },
        { id: "pending", name: "Pending" },
      ],
    },
    {
      id: "action",
      columnName: "Action",
      actionValue: "status",
      type: "Action",
      actionData: [{ id: "edit", name: "Edit" }],
    },
  ],
};

const MasterInterests = () => {
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [showMasterModal, setShowMasterModal] = useState({
    status: false,
    editData: {},
  });

  const fetchTableCount = async (payload: any) => {
    return (await fetchMasterInterestsCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchMasterTableInterests(payload)).data || [];
  };

  const handleMenuChange = async (actionId: string, data: any) => {
    const payload = { action: data, actionId };
    const response = await updateMasterInterests(payload);
    if (response.success) return { shouldRefetch: true };
  };
  //

  const handleActionChange = async (actionId: string, data: any) => {
    if (actionId === "edit") {
      setShowMasterModal({ status: true, editData: data });
    }
  };

  const handleCreate = async (data: any) => {
    const response = await createMasterInterests(data);
    if (response.success) return { shouldRefetch: true };
  };

  const handleUpdate = async (data: any) => {
    const response = await updateMasterInterests(data);
    if (response.success) return { shouldRefetch: true };
  };

  return (
    <>
      <TableComponent
        hasTabs
        headers={headers}
        searchPlaceholder="Search by name"
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
        handleMenuChange={handleMenuChange}
        handleActionChange={handleActionChange}
        refetchStatus={refetchTrigger}
        refetchData={() => setRefetchTrigger(false)}
        addlRightButton={
          <Button
            alignItems={"center"}
            variant={"create_button"}
            onClick={() => setShowMasterModal({ editData: {}, status: true })}
          >
            <FaPlus size={15} />
            <Text ml={2}>Create</Text>
          </Button>
        }
      />
      {showMasterModal.status && (
        <MasterFieldsModal
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          onSuccess={() => {
            setShowMasterModal({ editData: {}, status: false });
            setRefetchTrigger(true);
          }}
          editData={showMasterModal.editData}
          onClose={() => setShowMasterModal({ editData: {}, status: false })}
        />
      )}
    </>
  );
};

export default MasterInterests;
