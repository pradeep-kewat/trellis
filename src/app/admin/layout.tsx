import React from "react";
import RWContainer from "@/components/Container";
import SideBar from "@/components/Sidebar";
import { Box } from "@chakra-ui/react";
import HeaderComponent from "@/components/Header";
import { HEADER_HEIGHT } from "@/utils/constants";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RWContainer containerAs={"Flex"} position={"relative"}>
      <SideBar />
      <RWContainer>
        <HeaderComponent />
        <Box
          maxH={`calc(100% - ${HEADER_HEIGHT})`}
          className="scroll"
          overflow={"auto"}
          p={4}
        >
          {children}
        </Box>
      </RWContainer>
    </RWContainer>
  );
}
