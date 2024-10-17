/* eslint-disable no-unused-vars */
// @ts-nocheck
"use client";

import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Text,
  Select,
  Input,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  useMediaQuery,
  filter,
} from "@chakra-ui/react";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  ReactElement,
  useRef,
} from "react";
import moment from "moment";
import { HEADER_HEIGHT_WITH_PADDING } from "@/utils/constants";
import { ParseEnum } from "@/utils/helpers/enumParser";
import ImageModalComponent from "../Modal";
import { LiaFilterSolid } from "react-icons/lia";
import { IoIosAdd } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { Header } from "@/types/table";
import { CiMenuKebab } from "react-icons/ci";
import ConfirmationModal from "@/modals/ConfirmationModal";
import { useRouter, useSearchParams } from "next/navigation";
import Shimmer from "./Shimmer";
import { setStatusBGColor, setStatusColor } from "@/utils/global";

interface Filter {
  column: any;
  value: string;
  columnType?: string;
  columnItem?: any[];
}

interface Properties {
  headers: Header;
  fetchTableCount: (payload: any) => Promise<number>;
  fetchTableData: (payload: any) => Promise<any[]>;

  hasTabs?: boolean;
  title?: string;
  hasKpis?: boolean;
  isClickable?: boolean;
  refetchStatus?: boolean;
  searchPlaceholder?: string;
  addlRightButton?: ReactElement;
  refetchData?: () => void;
  handleClick?: (data: any) => void;
  fetchAllData?: () => Promise<any[]>;
  handleSoftDelete?: (payload: any) => void;
  handleHardDelete?: (payload: any) => void;
  handleActionChange?: (
    actionType: string,
    data: any,
    userId?: string | any
  ) => void;
  handleMenuChange?: (
    actionType: string,
    data: any,
    userId?: string | any
  ) => void;
}

const TableComponent = ({
  title,
  headers,
  fetchTableData,
  fetchTableCount,
  isClickable = false,
  hasTabs = false,
  hasKpis = false,
  handleActionChange,
  handleMenuChange,
  handleClick,
  handleSoftDelete,
  handleHardDelete,
  fetchAllData,
  addlRightButton,
  refetchStatus,
  refetchData,
  searchPlaceholder = "Search...",
}: Properties) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tableData, setTableData] = useState<any[]>([]);
  const [popoverStatus, setPopoverStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalTableCountData, setTotalTableCountData] = useState(0);
  const tableReference = useRef(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    nbPerPage: 10,
    searchQuery: "",
    sortField: "",
    sortOrder: "asc",
  });
  const [filters, setFilters] = useState({
    filtersData: [],
    shouldUpdate: false,
  });
  const [tempFilters, setTempFilters] = useState({ filtersData: [] });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [confirmationModal, setConfirmationModal]: any = useState({
    status: false,
    deleteType: "",
  });
  const [showImageModal, setShowImageModal] = useState({
    status: false,
    imagesHeader: {},
    imagesData: {},
  });

  const [isMobile] = useMediaQuery("(max-width: 780px)");

  const addFilter = () => {
    setTempFilters({
      ...tempFilters,
      filtersData: [...tempFilters.filtersData, { column: "", value: "" }],
    });
  };

  const handleFilterChange = (
    index: number,
    key: keyof Filter,
    value: string
  ) => {
    if (key === "column" && headers.filters) {
      const selectedOption = headers.filters.find(
        (header) => header.id === value
      );
      if (selectedOption?.columnType === "Enum") {
        setTempFilters({
          ...tempFilters,
          filtersData: tempFilters.filtersData.map((filter, i) =>
            i === index
              ? {
                  ...filter,
                  [key]: value,
                  columnType: selectedOption?.columnType,
                  columnItem: selectedOption?.columnItem,
                  value: selectedOption?.columnItem?.[0]?.id ?? "",
                }
              : filter
          ),
        });
      } else {
        const newFilters = tempFilters.filtersData.map((filter, i) =>
          i === index
            ? {
                ...filter,
                [key]: value,
                columnType: selectedOption?.columnType,
                columnItem: selectedOption?.columnItem,
                value: "",
              }
            : filter
        );
        setTempFilters({ ...tempFilters, filtersData: newFilters });
      }
    } else {
      const newFilters = tempFilters.filtersData.map((filter, i) =>
        i === index
          ? {
              ...filter,
              [key]: value,
            }
          : filter
      );
      setTempFilters({ ...tempFilters, filtersData: newFilters });
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = tempFilters.filtersData.filter((_, i) => i !== index);
    setTempFilters({ ...tempFilters, filtersData: newFilters });
  };

  const fetchCount = async () => {
    const payload = {
      searchQuery: pagination.searchQuery,
      filters: filters.filtersData,
    };

    if (fetchTableCount) {
      const data = await fetchTableCount(payload);
      setCount(data);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const startIndex = (pagination.currentPage - 1) * pagination.nbPerPage;
    const endIndex = startIndex + pagination.nbPerPage - 1;
    const payload = {
      searchQuery: pagination.searchQuery,
      startIndex,
      endIndex,
      sortField: pagination.sortField,
      sortOrder: pagination.sortOrder,
      filters: filters.filtersData,
    };
    const data = await fetchTableData(payload);
    setTableData(data || []);
    tableReference.current.scrollTop = 0;
    setLoading(false);
  };

  const fetchTotalCountData = async () => {
    const getAllUsersData = await fetchAllData();
    setTotalTableCountData(getAllUsersData.map((item) => item.id));
  };

  useEffect(() => {
    if (filters.shouldUpdate) {
      fetchData();
      fetchCount();
      setFilters({ ...filters, shouldUpdate: false });
    }
  }, [filters.shouldUpdate]);

  useEffect(() => {
    if (headers.hasSelect) {
      fetchTotalCountData();
    }
  }, []);

  useEffect(() => {
    if (refetchStatus && refetchData) {
      fetchData();
      fetchCount();
      if (headers.hasSelect) {
        fetchTotalCountData();
      }
      refetchData();
    }
  }, [refetchStatus]);

  useEffect(() => {
    fetchData();
    fetchCount();
  }, [
    pagination.currentPage,
    pagination.nbPerPage,
    pagination.searchQuery,
    pagination.sortField,
    pagination.sortOrder,
  ]);

  useEffect(() => {
    if (popoverStatus === true) {
      setTempFilters({ filtersData: filters.filtersData });
    }
  }, [popoverStatus]);

  const handleAction = async (actionId: string, data: any) => {
    if (handleActionChange) {
      const response: any = await handleActionChange(actionId, data);
      if (response?.shouldRefetch) {
        fetchData();
      }
    }
  };

  const handleMenu = async (actionId: string, data: any) => {
    if (handleMenuChange) {
      const response: any = await handleMenuChange(actionId, data);
      if (response?.shouldRefetch) {
        fetchData();
      }
    }
  };

  const debounce = useCallback(
    (func: (value: string) => void, delay: number) => {
      // eslint-disable-next-line no-undef
      let timer: NodeJS.Timeout;
      return (value: string) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => func(value), delay);
      };
    },
    []
  );

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });

        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          searchQuery: value,
        }));
      }, 400),
    [debounce]
  );

  const numberOfPages = useMemo(() => {
    return Math.ceil(count / pagination.nbPerPage);
  }, [count, pagination.nbPerPage]);

  const getPageNumbers = useCallback(() => {
    const start = Math.max(pagination.currentPage - 1, 1);
    const end = Math.min(pagination.currentPage + 2, numberOfPages);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [pagination.currentPage, numberOfPages]);

  const handleNbPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      params.set("nbperpage", Number(event.target.value).toString());
      router.push(`?${params.toString()}`, { scroll: false });

      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
        nbPerPage: Number(event.target.value),
      }));
    },
    []
  );

  const handleRowClick = (record: any) => {
    if (isClickable && handleClick) handleClick(record);
  };

  const handleSort = (field: string) => {
    setPagination((prev) => ({
      ...prev,
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const applyFilters = () => {
    setFilters({
      ...filters,
      filtersData: tempFilters.filtersData,
      shouldUpdate: true,
    });
    setPopoverStatus(false);
  };

  const handleSelectRow = (id: string) => {
    const updatedIds = selectedIds.includes(id)
      ? selectedIds.filter((itemId) => itemId !== id)
      : [...selectedIds, id];
    setSelectedIds(updatedIds);
    if (updatedIds.length === totalTableCountData.length) {
      setIsSelectAll(true);
    }
  };

  const handleSelectAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (fetchAllData) {
        setIsSelectAll(true);
        setSelectedIds(totalTableCountData);
      }
    } else {
      setIsSelectAll(false);
      setSelectedIds([]);
    }
  };

  const hardDelete = async () => {
    setConfirmationModal({ status: true, deleteType: "hard_delete" });
  };

  const softDelete = async () => {
    setConfirmationModal({ status: true, deleteType: "soft_delete" });
  };

  const handleConfirm = async () => {
    setConfirmationModal({ status: false, deleteType: "" });
    if (confirmationModal.deleteType === "soft_delete") {
      setSelectedIds([]);
      if (handleSoftDelete) {
        const response: any = await handleSoftDelete(selectedIds);
        if (response?.shouldRefetch) {
          fetchData();
          fetchCount();
        }
      }
    } else {
      setSelectedIds([]);
      if (handleHardDelete) {
        const response: any = await handleHardDelete(selectedIds);
        if (response?.shouldRefetch) {
          fetchData();
          fetchCount();
        }
      }
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationModal({ status: false, deleteType: "" });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePopoverClose = () => {
    setTempFilters({ filtersData: [] });
    setPopoverStatus(false);
  };

  return (
    <Box px={4} py={4} bg="white" borderRadius="md" overflow={"hidden"}>
      <Flex
        alignItems="center"
        mb={4}
        justifyContent={"space-between"}
        zIndex={2}
      >
        {title && !isMobile ? (
          <Text as={"h3"} fontWeight={"bold"} ml={4}>
            {title}
          </Text>
        ) : (
          <Input
            variant={"table"}
            placeholder={searchPlaceholder}
            onChange={(e) => handleSearchChange(e.target.value)}
            width="250px"
            mr={4}
          />
        )}
        <Flex gap={4} alignItems={"center"}>
          {title && !isMobile && (
            <Input
              variant={"table"}
              placeholder={searchPlaceholder}
              onChange={(e) => handleSearchChange(e.target.value)}
              width="250px"
              mr={4}
            />
          )}
          {headers.hasDelete && selectedIds.length > 0 && (
            <>
              <Button
                variant={"default"}
                onClick={softDelete}
                isDisabled={selectedIds.length === 0}
              >
                Soft Delete
              </Button>
              <Button
                variant={"default"}
                onClick={hardDelete}
                isDisabled={selectedIds.length === 0}
              >
                Hard Delete
              </Button>
            </>
          )}
          {headers.hasFilters === true && (
            <Popover
              variant={"brand"}
              isLazy
              isOpen={popoverStatus}
              onOpen={() => setPopoverStatus(true)}
              onClose={() => {
                handlePopoverClose();
              }}
              placement="bottom-start"
            >
              <PopoverTrigger>
                <Button
                  p={".7rem 2rem"}
                  borderRadius={"6px"}
                  height={"fit-content"}
                >
                  <LiaFilterSolid />
                  {isMobile ? (
                    <>
                      {tempFilters.filtersData.length > 0 && (
                        <Text ml={2} as={"h4"}>
                          {tempFilters.filtersData.length > 0 &&
                            `${tempFilters.filtersData.length}`}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text fontWeight={"bold"} as={"h5"} ml={2}>
                      {filters.filtersData.length > 0
                        ? `${filters.filtersData.length} Filters Applied`
                        : "Filters"}
                    </Text>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent width={isMobile ? "xs" : "md"}>
                <PopoverHeader>
                  {!isMobile && (
                    <Text as={"h4"} fontWeight={"bold"}>
                      Filters
                    </Text>
                  )}
                </PopoverHeader>
                <Divider borderColor={"gray.500"} />
                <PopoverBody>
                  <Flex
                    flexDir={"column"}
                    gap={2}
                    px={4}
                    py={4}
                    minH={"100px"}
                    maxH={"30vh"}
                    overflow={"auto"}
                    className="scroll"
                  >
                    {tempFilters.filtersData.length > 0 ? (
                      <>
                        {tempFilters.filtersData.map((filter, index) => (
                          <Flex key={index} gap={2}>
                            <Select
                              variant={"table"}
                              borderRadius={"0"}
                              value={filter.column}
                              onChange={(e) =>
                                handleFilterChange(
                                  index,
                                  "column",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select column</option>
                              {headers.filters?.map((header, index) => (
                                <option key={index} value={header.id}>
                                  {header.columnName}
                                </option>
                              ))}
                            </Select>
                            {filter.columnType === "Enum" ? (
                              <Select
                                variant={"table"}
                                borderRadius={"0"}
                                value={filter.value}
                                onChange={(e) =>
                                  handleFilterChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                              >
                                {filter?.columnItem?.map((header, index) => {
                                  return (
                                    <option key={index} value={header.id}>
                                      {header.name}
                                    </option>
                                  );
                                })}
                              </Select>
                            ) : (
                              <Input
                                variant={"auth"}
                                type="text"
                                placeholder="Search"
                                color={"gray.900"}
                                borderRadius={0}
                                fontSize={"md"}
                                value={filter.value}
                                onChange={(e) =>
                                  handleFilterChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                            <IoCloseOutline
                              onClick={() => removeFilter(index)}
                              size={40}
                            />
                          </Flex>
                        ))}
                      </>
                    ) : (
                      <Text as={"h4"}>No Selected Filters</Text>
                    )}
                  </Flex>
                  <Divider borderColor={"gray.500"} />
                  <Flex justifyContent={"space-between"} px={2} py={3}>
                    <Button
                      variant={"default"}
                      as={"h6"}
                      cursor={"pointer"}
                      leftIcon={<IoIosAdd />}
                      onClick={addFilter}
                    >
                      Add filters
                    </Button>
                    <Button
                      variant={"default"}
                      cursor={"pointer"}
                      as={"h6"}
                      onClick={applyFilters}
                    >
                      Apply
                    </Button>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
          {addlRightButton && addlRightButton}
        </Flex>
      </Flex>
      <Flex
        ref={tableReference}
        width={"inherit"}
        maxW={"inherit"}
        minH={`calc(100vh - ${HEADER_HEIGHT_WITH_PADDING} - ${
          isMobile ? "202px" : "162px"
        } - ${hasTabs ? "40px" : "0px"} - ${hasKpis ? "146px" : "0px"})`}
        maxH={`calc(100vh - ${HEADER_HEIGHT_WITH_PADDING} - ${
          isMobile ? "202px" : "162px"
        } - ${hasTabs ? "40px" : "0px"} - ${hasKpis ? "146px" : "0px"})`}
        overflow={"auto"}
        className="scroll"
      >
        {!loading && tableData.length === 0 ? (
          <Flex width={"100%"} justifyContent={"center"} alignItems={"center"}>
            <Text as={"h5"}>No Data Found</Text>
          </Flex>
        ) : (
          <Table variant="users">
            <Thead>
              <Tr>
                {headers.properties.map((heading, index) => (
                  <React.Fragment key={index}>
                    {heading.type === "Delete" && headers.hasSelect ? (
                      <Th>
                        <Checkbox
                          isChecked={
                            isSelectAll &&
                            selectedIds.length === totalTableCountData.length
                          }
                          onChange={handleSelectAll}
                        />
                        {selectedIds.length > 0 && (
                          <Text ml={1}>{selectedIds.length}</Text>
                        )}
                      </Th>
                    ) : (
                      <Th
                        cursor="pointer"
                        onClick={() => {
                          heading.shouldSort && handleSort(heading.id);
                        }}
                      >
                        {heading.columnName}
                        {heading.shouldSort &&
                        pagination.sortField === heading.id
                          ? pagination.sortOrder === "asc"
                            ? " ▲"
                            : " ▼"
                          : null}
                      </Th>
                    )}
                  </React.Fragment>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <>
                  {Array.from({ length: pagination.nbPerPage }, (_, index) => (
                    <Shimmer key={index} headers={headers.properties} />
                  ))}
                </>
              ) : (
                <>
                  {tableData.map((record, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Tr
                          key={record.id}
                          cursor={isClickable ? "pointer" : "default"}
                        >
                          {headers.properties.map((header, index_) => {
                            return (
                              <React.Fragment key={index_}>
                                {header.type === "Delete" &&
                                headers.hasSelect ? (
                                  <Td key={index_}>
                                    <Checkbox
                                      isChecked={selectedIds.includes(
                                        record.id
                                      )}
                                      onChange={() =>
                                        handleSelectRow(record.id)
                                      }
                                    />
                                  </Td>
                                ) : header.type === "Index" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {(pagination.currentPage - 1) *
                                      pagination.nbPerPage +
                                      index +
                                      1}
                                  </Td>
                                ) : header.type === "String" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {header.tooltip ? (
                                      <Tooltip
                                        label={
                                          record[header.id]
                                            ? ParseEnum(record[header.id])
                                            : "NA"
                                        }
                                      >
                                        {record[header.id]
                                          ? ParseEnum(record[header.id])
                                          : "NA"}
                                      </Tooltip>
                                    ) : (
                                      <>
                                        {record[header.id]
                                          ? ParseEnum(record[header.id])
                                          : "NA"}
                                      </>
                                    )}
                                  </Td>
                                ) : header.type === "Email" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {header.tooltip ? (
                                      <Tooltip label={record[header.id]}>
                                        {record[header.id] || "NA"}
                                      </Tooltip>
                                    ) : (
                                      <>{record[header.id] || "NA"}</>
                                    )}
                                  </Td>
                                ) : header.type === "Boolean" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {record[header.id] === false
                                      ? "False"
                                      : "True"}
                                  </Td>
                                ) : header.type === "Date" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {record[header.id]
                                      ? moment(record[header.id]).format(
                                          "DD-MM-YYYY"
                                        )
                                      : "NA"}
                                  </Td>
                                ) : header.type === "Number" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {record[header.id] || 0}
                                  </Td>
                                ) : header.type === "Action" ? (
                                  <Td key={index_}>
                                    <Menu variant={"table"}>
                                      {({ isOpen }) => (
                                        <>
                                          <MenuButton>
                                            <CiMenuKebab />
                                          </MenuButton>
                                          {isOpen && (
                                            <MenuList>
                                              {header.actionData?.map(
                                                (action, index) => (
                                                  <MenuItem
                                                    key={index}
                                                    onClick={() => {
                                                      if (handleActionChange) {
                                                        handleAction(
                                                          action.id,
                                                          record
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    {action.name}
                                                  </MenuItem>
                                                )
                                              )}
                                            </MenuList>
                                          )}
                                        </>
                                      )}
                                    </Menu>
                                  </Td>
                                ) : header.type === "Menu" ? (
                                  <Td key={index_}>
                                    <Select
                                      width={"150px"}
                                      variant={"brand"}
                                      defaultValue={
                                        record[header.actionValue]
                                          ? record[header.actionValue]
                                          : ""
                                      }
                                      onChange={(event) => {
                                        if (handleMenuChange) {
                                          handleMenu(
                                            record.id,
                                            event.target.value
                                          );
                                        }
                                      }}
                                    >
                                      <option value="" disabled>
                                        Select column
                                      </option>
                                      {header.menuData?.map((action, index) => (
                                        <option value={action.id} key={index}>
                                          {action.name}
                                        </option>
                                      ))}
                                    </Select>
                                  </Td>
                                ) : header.type === "Status" ? (
                                  <Td key={index_}>
                                    <Box borderRadius={"sm"}>
                                      <Text
                                        width={"fit-content"}
                                        borderRadius={"sm"}
                                        px={2}
                                        bgColor={() =>
                                          setStatusBGColor(record[header.id])
                                        }
                                        color={() =>
                                          setStatusColor(record[header.id])
                                        }
                                      >
                                        {record[header.id]
                                          ? ParseEnum(record[header.id])
                                          : "NA"}
                                      </Text>
                                    </Box>
                                  </Td>
                                ) : (
                                  <></>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </Tr>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </Tbody>
          </Table>
        )}
      </Flex>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        mt={4}
        wrap={"wrap"}
        flexDir={isMobile ? "column" : "row"}
        gap={4}
      >
        <Select
          isDisabled={tableData.length <= 0}
          width="fit-content"
          value={pagination.nbPerPage}
          onChange={handleNbPerPageChange}
          mr={2}
        >
          {[10, 15, 20].map((perPage, index) => (
            <option key={index} value={perPage}>
              {perPage} per page
            </option>
          ))}
        </Select>
        {!isMobile && (
          <Flex justifyContent="center">
            <Text as={"h5"}>
              Page {pagination.currentPage} of {numberOfPages} of {count}{" "}
              entries
            </Text>
          </Flex>
        )}
        <Flex alignItems="center" gap={2}>
          <Button
            isDisabled={pagination.currentPage === 1 || tableData.length === 0}
            onClick={() =>
              handlePageChange(Math.max(pagination.currentPage - 1, 1))
            }
            disabled={pagination.currentPage === 1}
          >
            Prev
          </Button>
          <Flex>
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                isActive={pagination.currentPage === page}
                mx={1}
              >
                {page}
              </Button>
            ))}
          </Flex>
          <Button
            isDisabled={
              pagination.currentPage === numberOfPages || tableData.length === 0
            }
            onClick={() =>
              handlePageChange(
                Math.min(pagination.currentPage + 1, numberOfPages)
              )
            }
            disabled={pagination.currentPage === numberOfPages}
          >
            Next
          </Button>
        </Flex>
      </Flex>
      {showImageModal.status === true && (
        <ImageModalComponent
          imagesData={showImageModal.imagesData}
          imagesHeader={showImageModal.imagesHeader}
          handleClose={() => {
            setShowImageModal({
              status: false,
              imagesData: {},
              imagesHeader: {},
            });
          }}
        />
      )}
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </Box>
  );
};

export default TableComponent;
