"use client";

import {
  getSelectedTab,
  getSidebarData,
  getSidebarStatus,
  setSelectedTab,
  toggleSideBar,
} from "@/redux/SharedSlice";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useEffect, useState } from "react";
import {
  MdContactPage,
  MdHome,
  MdInsertInvitation,
  MdPerson,
} from "react-icons/md";
import { IoIosNotifications, IoIosPeople } from "react-icons/io";
import { RiAdminFill, RiPagesFill } from "react-icons/ri";
import { signOut } from "@/app/actions/authAction";
import { FaFlag } from "react-icons/fa";
import LogoutModal from "@/modals/LogoutModal";
import { GiHamburgerMenu } from "react-icons/gi";
import packageJson from "../../../package.json";

const SideBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispath: AppDispatch = useDispatch();

  const sidebarData = useSelector(getSidebarData);
  const selectedTab = useSelector(getSelectedTab);
  const showSidebar = useSelector(getSidebarStatus);

  const [logoutModal, setLogoutModal] = useState(false);
  const [accordionIndex, setAccordionIndex] = useState<number[]>(() =>
    searchParams.get("tab") ? [Number(searchParams.get("tab"))] : []
  );

  const [isMobile] = useMediaQuery("(max-width: 780px)");

  useEffect(() => {
    const tab = searchParams.get("tab");
    const subTab = searchParams.get("subTab");
    const subTabId = searchParams.get("subTabId");
    if (tab) {
      dispath(
        setSelectedTab({
          id: Number(tab),
          subTab: subTab || null,
          subTabId: subTabId !== null ? Number(subTabId) : null,
        })
      );
      setAccordionIndex([Number(tab)]);
    }
  }, []);

  const getIcon = (icon: string, tabId: number, selectedId: number) => {
    return icon === "MdPerson" ? (
      <MdPerson
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "MdHome" ? (
      <MdHome
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "IoIosPeople" ? (
      <IoIosPeople
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "MdInsertInvitation" ? (
      <MdInsertInvitation
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "IoIosNotifications" ? (
      <IoIosNotifications
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "RiAdminFill" ? (
      <RiAdminFill
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "RiPagesFill" ? (
      <RiPagesFill
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "FaFlag" ? (
      <FaFlag
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "MdContactPage" ? (
      <MdContactPage
        size={showSidebar ? 23 : 20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : (
      <></>
    );
  };

  const handleNavigate = (
    href: string,
    tab: number,
    subTab: string | null,
    subTabId: number | null
  ) => {
    dispath(
      setSelectedTab({
        id: tab,
        subTab: subTab || null,
        subTabId: subTabId !== null ? subTabId : null,
      })
    );
    router.push(href);
  };

  const handleAccordionChange = (index: number | number[]) => {
    setAccordionIndex(Array.isArray(index) ? index : [index]);
  };

  const handleConfirm = () => {
    signOut();
    setLogoutModal(false);
  };

  const handleMenuClick = () => {
    dispath(toggleSideBar(!showSidebar));
  };

  const handleAccordianButton = () => {
    if (showSidebar) {
      dispath(toggleSideBar(false));
    }
  };

  return (
    <>
      {isMobile && !showSidebar ? (
        <Flex
          position={"absolute"}
          left={0}
          zIndex={"sidebar"}
          width={"300px"}
          bgColor={"white.900"}
          height={"inherit"}
          flexDir={"column"}
        >
          <Flex
            w={"100%"}
            justifyContent={"space-evenly"}
            borderRight={"1px solid"}
            borderColor={"gray.100"}
            alignItems={"center"}
            py={7}
          >
            <Text as={"h3"} fontWeight={"bold"} textAlign={"center"}>
              Trellis
            </Text>
            <GiHamburgerMenu onClick={handleMenuClick} cursor={"pointer"} />
          </Flex>
          <Divider />
          <Flex
            h={"inherit"}
            flexDir={"column"}
            overflow={"auto"}
            justifyContent={"space-between"}
          >
            <Accordion
              index={accordionIndex}
              variant={"sidebar"}
              allowMultiple
              onChange={handleAccordionChange}
              p={4}
            >
              {sidebarData.map((tab, index) => (
                <AccordionItem key={index} py={2}>
                  {tab.subTabs?.length > 0 ? (
                    <AccordionButton
                      onClick={() => {
                        setAccordionIndex([tab.id]);
                      }}
                    >
                      <Flex alignItems={"center"} flex="1" textAlign="left">
                        <Box mr={2}>
                          {getIcon(tab.icon, tab.id, selectedTab.id)}
                        </Box>
                        <Text
                          as={"h5"}
                          color={tab.id === selectedTab.id ? "" : "gray.600"}
                          fontWeight={
                            tab.id === selectedTab.id ? "bold" : "normal"
                          }
                        >
                          {tab.label}
                        </Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  ) : (
                    <AccordionButton>
                      <Flex
                        alignItems={"center"}
                        flex="1"
                        textAlign="left"
                        onClick={() =>
                          handleNavigate(tab.href, tab.id, null, null)
                        }
                      >
                        <Box mr={2}>
                          {getIcon(tab.icon, tab.id, selectedTab.id)}
                        </Box>
                        <Text
                          as={"h5"}
                          color={tab.id === selectedTab.id ? "" : "gray.600"}
                          fontWeight={
                            tab.id === selectedTab.id ? "bold" : "normal"
                          }
                        >
                          {tab.label}
                        </Text>
                      </Flex>
                    </AccordionButton>
                  )}
                  {tab.subTabs?.length > 0 && (
                    <AccordionPanel>
                      {tab.subTabs?.map((subTab, index) => {
                        return (
                          <Text
                            as={"h6"}
                            py={1}
                            cursor={"pointer"}
                            onClick={() =>
                              handleNavigate(
                                subTab.href,
                                tab.id,
                                subTab.label,
                                subTab.id
                              )
                            }
                            key={index}
                            color={
                              tab.id === selectedTab.id &&
                              subTab.id === selectedTab.subTabId
                                ? "brand.200"
                                : "gray.600 "
                            }
                          >
                            {subTab.label}
                          </Text>
                        );
                      })}
                    </AccordionPanel>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
            <Text as={"h5"} textAlign={"center"} fontWeight={"bold"}>
              {"Version"} : {packageJson.version}
            </Text>
          </Flex>
          {logoutModal && (
            <LogoutModal
              onClose={() => setLogoutModal(false)}
              onConfirm={handleConfirm}
            />
          )}
        </Flex>
      ) : !isMobile ? (
        <Flex
          position={isMobile ? "absolute" : "initial"}
          left={0}
          width={showSidebar ? "85px" : "300px"}
          bgColor={"white.900"}
          height={"inherit"}
          flexDir={"column"}
        >
          <Flex
            w={"100%"}
            justifyContent={showSidebar ? "center" : "space-evenly"}
            borderRight={"1px solid"}
            borderColor={"gray.100"}
            alignItems={"center"}
            py={showSidebar ? 9.5 : 7}
          >
            <Text as={"h3"} fontWeight={"bold"} textAlign={"center"}>
              {!showSidebar && "Trellis"}
            </Text>
            <GiHamburgerMenu onClick={handleMenuClick} cursor={"pointer"} />
          </Flex>
          <Divider />
          <Flex
            h={"inherit"}
            flexDir={"column"}
            overflow={"auto"}
            justifyContent={"space-between"}
          >
            <Accordion
              index={accordionIndex}
              variant={"sidebar"}
              allowMultiple
              onChange={handleAccordionChange}
              p={4}
            >
              {sidebarData.map((tab, index) => (
                <AccordionItem key={index} py={2}>
                  {tab.subTabs?.length > 0 ? (
                    <AccordionButton
                      onClick={() => {
                        handleAccordianButton();
                        setAccordionIndex([tab.id]);
                      }}
                    >
                      <Flex
                        alignItems={"center"}
                        flex="1"
                        textAlign="left"
                        justifyContent={showSidebar ? "center" : "inherit"}
                      >
                        <Box mr={showSidebar ? 0 : 2}>
                          {getIcon(tab.icon, tab.id, selectedTab.id)}
                        </Box>
                        {!showSidebar && (
                          <Text
                            as={"h5"}
                            color={tab.id === selectedTab.id ? "" : "gray.600"}
                            fontWeight={
                              tab.id === selectedTab.id ? "bold" : "normal"
                            }
                          >
                            {tab.label}
                          </Text>
                        )}
                      </Flex>
                      {!showSidebar && <AccordionIcon />}
                    </AccordionButton>
                  ) : (
                    <AccordionButton>
                      <Flex
                        alignItems={"center"}
                        flex="1"
                        textAlign="left"
                        justifyContent={showSidebar ? "center" : "inherit"}
                        onClick={() =>
                          handleNavigate(tab.href, tab.id, null, null)
                        }
                      >
                        <Box mr={showSidebar ? 0 : 2}>
                          {getIcon(tab.icon, tab.id, selectedTab.id)}
                        </Box>
                        {!showSidebar && (
                          <Text
                            as={"h5"}
                            color={tab.id === selectedTab.id ? "" : "gray.600"}
                            fontWeight={
                              tab.id === selectedTab.id ? "bold" : "normal"
                            }
                          >
                            {tab.label}
                          </Text>
                        )}
                      </Flex>
                    </AccordionButton>
                  )}
                  {tab.subTabs?.length > 0 && !showSidebar && (
                    <AccordionPanel>
                      {tab.subTabs?.map((subTab, index) => {
                        return (
                          <Text
                            as={"h6"}
                            py={1}
                            cursor={"pointer"}
                            onClick={() =>
                              handleNavigate(
                                subTab.href,
                                tab.id,
                                subTab.label,
                                subTab.id
                              )
                            }
                            key={index}
                            color={
                              tab.id === selectedTab.id &&
                              subTab.id === selectedTab.subTabId
                                ? "brand.200"
                                : "gray.600 "
                            }
                          >
                            {subTab.label}
                          </Text>
                        );
                      })}
                    </AccordionPanel>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
            <Text mb={2} as={"h5"} textAlign={"center"} fontWeight={"bold"}>
              {showSidebar ? "V" : "Version"} : {packageJson.version}
            </Text>
          </Flex>
          {logoutModal && (
            <LogoutModal
              onClose={() => setLogoutModal(false)}
              onConfirm={handleConfirm}
            />
          )}
        </Flex>
      ) : null}
    </>
  );
};

export default SideBar;
