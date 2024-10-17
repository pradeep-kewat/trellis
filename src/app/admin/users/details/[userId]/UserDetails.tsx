"use client";

import {
  fetchUserDetail,
  fetchUserIntrests,
  fetchUserPersonalityTraits,
  fetchUserSkills,
} from "@/app/actions/UserAction";
import { usersDetailsData } from "@/utils/global";
import { ParseEnum } from "@/utils/helpers/enumParser";
import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  useMediaQuery,
  Image,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface UserDetailsProps {
  userId: number;
}

const UserDetails = ({ userId }: UserDetailsProps) => {
  const [userData, setUserData] = useState(usersDetailsData);
  const [userImage, setUserImage] = useState({ loading: true, image: "" });

  const [isMobile] = useMediaQuery("(max-width: 820px)");

  useEffect(() => {
    const fetchData = async () => {
      const response: any = (await fetchUserDetail({ userId })).data;
      setUserImage({ loading: false, image: response.profile_image });

      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "personal_details"
            ? {
                ...category,
                loading: false,
                properties: category.properties?.map((property) => {
                  return {
                    ...property,
                    value: response[property.id],
                  };
                }),
              }
            : category.id === "bio"
            ? {
                ...category,
                loading: false,
                value: response["bio"],
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response: any[] = (await fetchUserIntrests({ userId })).data;

      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "interests"
            ? {
                ...category,
                loading: false,
                properties: response,
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response: any[] = (await fetchUserSkills({ userId })).data;

      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "skills"
            ? {
                ...category,
                loading: false,
                properties: response,
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response: any[] = (await fetchUserPersonalityTraits({ userId }))
        .data;

      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "personality_traits"
            ? {
                ...category,
                loading: false,
                properties: response,
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  return (
    <Flex gap={4} flexWrap={"wrap"} flexDir={"column"}>
      <Flex gap={4} width={"100%"} flexDir={isMobile ? "column" : "row"}>
        {userImage.loading ? (
          <Box className="box-shimmer" width={"400px"} height={"300px"}></Box>
        ) : (
          <Flex
            width={isMobile ? "fit-content" : "400px"}
            height={isMobile ? "fit-content" : "300px"}
            transition={"transform 0.5s ease"}
          >
            <Image
              style={{ borderRadius: "8px" }}
              src={userImage.image || "/dummy_user.png"}
              alt="User Image"
            ></Image>
          </Flex>
        )}
        <Flex
          width={"100%"}
          flexDir={"column"}
          p={4}
          borderRadius={"md"}
          bgColor={"white.900"}
          maxH={userImage.image && !isMobile ? "300px" : "unset"}
          overflow={"auto"}
        >
          <Text as={"h3"} fontWeight={"bold"} mb={4}>
            General Information
          </Text>
          <SimpleGrid
            columns={{ "mobile-s": 1, "mobile-l": 2, "2xl": 3 }}
            gap="20px"
          >
            {userData.map((user, index) => {
              return (
                <React.Fragment key={index}>
                  {user.id === "personal_details" &&
                    user.properties?.map((data, index_) => {
                      return (
                        <Flex
                          key={index_}
                          px={4}
                          py={6}
                          flexDir={"column"}
                          // boxShadow={"rgb(0 0 0 / 8%) 0px 20px 40px 4px"}
                          boxShadow={
                            "rgba(112, 144, 176, 0.08) 14px 17px 40px 4px"
                          }
                          borderRadius={"md"}
                        >
                          <Text as={"h5"}>{data.name}</Text>
                          <Text as={"h4"} fontWeight={"bold"}>
                            {data.value || "NA"}
                          </Text>
                        </Flex>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </SimpleGrid>
        </Flex>
      </Flex>
      <SimpleGrid
        columns={{ "mobile-s": 1, "mobile-l": 2, xl: 3, "2xl": 4 }}
        gap="20px"
      >
        {userData.map((user, index) => (
          <React.Fragment key={index}>
            {user.id !== "personal_details" &&
            user.id !== "profile_image" &&
            user.id !== "bio" ? (
              <Box width={"inherit"} bg={"white.900"} p={4} borderRadius={"md"}>
                <Text mb={4} as={"h4"} fontWeight={"bold"}>
                  {user.name}
                </Text>
                {user.loading ? (
                  <Flex className="box-shimmer"></Flex>
                ) : (
                  <>
                    {user.properties?.length === 0 ? (
                      <>NA</>
                    ) : (
                      <Flex
                        flexDir={"row"}
                        gap={2}
                        wrap={"wrap"}
                        maxH={"200px"}
                        overflow={"auto"}
                      >
                        {user.properties?.map((value: any, index) => {
                          return (
                            <Text
                              as={"h5"}
                              fontWeight={"bold"}
                              key={index}
                              border={"1px solid"}
                              borderColor={"gray.500"}
                              width={"fit-content"}
                              px={4}
                              py={1}
                              borderRadius={"sm"}
                            >
                              {value ? ParseEnum(value) : "Null"}
                            </Text>
                          );
                        })}
                      </Flex>
                    )}
                  </>
                )}
              </Box>
            ) : user.id === "bio" ? (
              <Box width={"inherit"} bg={"white.900"} p={4} borderRadius={"md"}>
                <Text mb={4} as={"h4"} fontWeight={"bold"}>
                  {user.name}
                </Text>
                {user.loading ? (
                  <Flex className="box-shimmer"></Flex>
                ) : (
                  <Text maxH={"200px"} overflow={"auto"} as={"h5"}>
                    {user.value || "NA"}
                  </Text>
                )}
              </Box>
            ) : (
              <></>
            )}
          </React.Fragment>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default UserDetails;
