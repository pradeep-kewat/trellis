"use client";

import React from "react";
import UserDetails from "./UserDetails";
import UserPosts from "./UserPosts";
import TabsComponent from "@/components/Tabs";

const UserDetailsContainer = ({ params }: any) => {
  const tabsConfig = [
    { label: "User Details", content: <UserDetails userId={params?.userId} /> },
    { label: "User Posts", content: <UserPosts userId={params?.userId} /> },
  ];
  return (
    <>
      <TabsComponent tabsConfig={tabsConfig} />
    </>
  );
};

export default UserDetailsContainer;
