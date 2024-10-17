/* eslint-disable no-unused-vars */
import { Checkbox, Flex, Input, Text, useMediaQuery } from "@chakra-ui/react";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

interface VirtualizedListProps {
  items: any[];
  itemHeight: number;
  windowHeight?: number;
  isLoading: boolean;
  handleSelectChange: (selectedItems: any[]) => void;
}

const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items,
  itemHeight,
  windowHeight = window.innerHeight - 450,
  isLoading,
  handleSelectChange,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 820px)");
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item?.preferred_name
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase())
      ),
    [items, searchQuery]
  );

  const totalHeight = useMemo(
    () => filteredItems.length * itemHeight,
    [filteredItems.length, itemHeight]
  );

  const startIndex = useMemo(
    () => Math.floor(scrollTop / itemHeight),
    [scrollTop, itemHeight]
  );

  const endIndex = useMemo(
    () =>
      Math.min(
        filteredItems.length - 1,
        Math.floor((scrollTop + windowHeight) / itemHeight)
      ),
    [scrollTop, windowHeight, filteredItems.length, itemHeight]
  );

  const visibleItems = useMemo(
    () => filteredItems.slice(startIndex, endIndex + 1),
    [filteredItems, startIndex, endIndex]
  );

  const onScroll = useCallback(() => {
    if (listRef.current) {
      setScrollTop(listRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const listElem = listRef.current;
    if (listElem) {
      listElem.addEventListener("scroll", onScroll);
      return () => listElem.removeEventListener("scroll", onScroll);
    }
  }, [onScroll]);

  const handleCheckboxClick = (item: any) => {
    if (item?.id === "all") {
      if (isAllSelected) {
        setSelectedItems([]);
        handleSelectChange([]);
      } else {
        setSelectedItems(filteredItems);
        handleSelectChange(filteredItems);
      }
      setIsAllSelected(!isAllSelected);
    } else {
      const isSelected = selectedItems.some(
        (selectedItem) => selectedItem.id === item.id
      );
      const newSelectedItems = isSelected
        ? selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
        : [...selectedItems, item];

      setSelectedItems(newSelectedItems);
      handleSelectChange(newSelectedItems);
      setIsAllSelected(newSelectedItems.length === filteredItems.length);
    }
  };

  return (
    <Flex
      flexDir={"column"}
      width={isMobile ? "initial" : "300px"}
      ref={containerRef}
      border={"1px #ccc solid"}
    >
      {visibleItems.length > 0 && (
        <Input
          variant={"default"}
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={2}
        />
      )}
      <div
        ref={listRef}
        style={{
          backgroundColor: "white",
          overflowY: "auto",
          height: isMobile ? 200 : windowHeight,
          width: "100%",
          zIndex: "2",
        }}
      >
        {isLoading ? (
          <Flex
            h={"100%"}
            w={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            Loading
          </Flex>
        ) : (
          <div
            style={{
              height: totalHeight,
              position: "relative",
            }}
          >
            {visibleItems.length > 0 ? (
              <>
                {visibleItems.map((item, index) => (
                  <Flex
                    cursor={"pointer"}
                    _hover={{ bgColor: "secondaryGray.200" }}
                    px={2}
                    gap={2}
                    fontSize={"h4"}
                    alignItems={"center"}
                    key={startIndex + index}
                    style={{
                      position: "absolute",
                      top: (startIndex + index) * itemHeight,
                      height: itemHeight,
                      width: "100%",
                    }}
                  >
                    <Checkbox
                      isChecked={
                        item.id === "all"
                          ? isAllSelected
                          : selectedItems.some(
                              (selectedItem) => selectedItem.id === item.id
                            )
                      }
                      onChange={() => handleCheckboxClick(item)}
                    ></Checkbox>
                    {item.preferred_name}
                  </Flex>
                ))}
              </>
            ) : (
              <Text as={"h5"} p={2}>
                No Data Found
              </Text>
            )}
          </div>
        )}
      </div>
    </Flex>
  );
};

export default VirtualizedList;
