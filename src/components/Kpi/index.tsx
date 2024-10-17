import { Box, Flex, Text } from "@chakra-ui/react";
import { FaFlag, FaRegUserCircle, FaUserSlash } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { IoStatsChart } from "react-icons/io5";
import { RiPagesFill, RiUserFollowFill } from "react-icons/ri";

const KpiComponent = (payload: any) => {
  const getIconComponent = (iconName: string) => {
    return iconName === "IoStatsChart" ? (
      <IoStatsChart style={{ color: "#702F6F" }} size={40} />
    ) : iconName === "FaRegUserCircle" ? (
      <FaRegUserCircle style={{ color: "#702F6F" }} size={40} />
    ) : iconName === "IoIosPeople" ? (
      <IoIosPeople style={{ color: "#702F6F" }} size={40} />
    ) : iconName === "RiPagesFill" ? (
      <RiPagesFill style={{ color: "#702F6F" }} size={40} />
    ) : iconName === "RiUserFollowFill" ? (
      <RiUserFollowFill style={{ color: "#702F6F" }} size={40} />
    ) : iconName === "FaUserSlash" ? (
      <FaUserSlash style={{ color: "#702F6F" }} size={40} />
    ) : iconName === "FaFlag" ? (
      <FaFlag style={{ color: "#702F6F" }} size={40} />
    ) : null;
  };

  return (
    <>
      {payload.loading ? (
        <Box className="box-shimmer" height={"126px"}></Box>
      ) : (
        <Flex
          bgColor={"white.900"}
          boxShadow={"rgba(112, 144, 176, 0.08) 1px 1px 10px"}
          p={6}
          borderRadius={"sm"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Flex flexDir={"column"}>
            <Text as={"h6"} color={"gray.600"}>
              {payload.title}
            </Text>
            <Text as={"h3"} fontWeight={"bold"}>
              {payload.value}
            </Text>
            <Flex alignItems={"center"}>
              <Text
                mr={1}
                color={payload.percentage >= 0 ? "green.200" : "red.900"}
              >
                {payload.percentage >= 0 ? "+" : ""}
                {payload.percentage}%
              </Text>
              <Text as={"h6"} color={"gray.600"}>
                since last week
              </Text>
            </Flex>
          </Flex>
          <Flex>{getIconComponent(payload.icon)}</Flex>
        </Flex>
      )}
    </>
  );
};

export default KpiComponent;
