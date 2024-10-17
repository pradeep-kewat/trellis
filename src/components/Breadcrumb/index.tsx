"use client";

import {
  getSelectedTab,
  getSidebarData,
  getSidebarStatus,
  setSelectedTab,
  toggleSideBar,
} from "@/redux/SharedSlice";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";

const BreadCrumbComponent = () => {
  const router = useRouter();
  const dispath: AppDispatch = useDispatch();

  const [headingData, setHeadingData]: any = useState({
    heading: "",
  });

  const sidebarData = useSelector(getSidebarData);
  const selectedTab = useSelector(getSelectedTab);
  const showSidebar = useSelector(getSidebarStatus);

  const [isMobile] = useMediaQuery("(max-width: 780px)");

  useEffect(() => {
    const heading = sidebarData.find(
      (data: any) => selectedTab.id === data?.id
    );
    setHeadingData({ heading: heading });
  }, [selectedTab]);

  const handleHeadingRoute = (headingId: number, headingUrl: string) => {
    dispath(setSelectedTab({ id: headingId, subTab: null, subTabId: null }));
    router.push(headingUrl);
  };

  const handleHomeRoute = () => {
    dispath(setSelectedTab({ id: 0, subTab: null, subTabId: null }));
    router.push("/admin/dashboard?tab=0");
  };

  const handleMenuClick = () => {
    dispath(toggleSideBar(!showSidebar));
  };

  return (
    <Box py={selectedTab.id === 0 ? 3 : 0}>
      {selectedTab.id !== 0 && (
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={handleHomeRoute}>Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() =>
                handleHeadingRoute(
                  headingData?.heading?.id,
                  headingData?.heading?.href
                )
              }
            >
              {headingData?.heading?.label || "..."}
            </BreadcrumbLink>
          </BreadcrumbItem>

          {selectedTab.subTab && (
            <BreadcrumbItem>
              <Text>{selectedTab.subTab}</Text>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
      )}
      <Flex alignItems={"center"}>
        {showSidebar && isMobile && (
          <GiHamburgerMenu
            style={{ marginRight: 12 }}
            cursor={"pointer"}
            onClick={handleMenuClick}
          />
        )}
        <Text as={"h3"} fontWeight={"900"}>
          {headingData?.heading?.label || "..."}
        </Text>
      </Flex>
    </Box>
  );
};

export default BreadCrumbComponent;
