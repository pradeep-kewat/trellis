"use client";

import {
  Flex,
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import BreadCrumbComponent from "../Breadcrumb";
import { signOut } from "@/app/actions/authAction";
import { useState } from "react";
import LogoutModal from "@/modals/LogoutModal";
import ChangePasswordModal from "@/modals/ChangePasswordModal";
import { faker } from "@faker-js/faker";
import { generateAlphanumericCode } from "@/utils/global";
import {
  AddInvitations,
  createInvitation,
} from "@/app/actions/InvitationAction";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useDispatch } from "react-redux";
import { showToastWithTimeout } from "@/redux/SharedSlice";

const HeaderComponent = () => {
  const dispatch: AppDispatch = useDispatch();

  const [logoutModal, setLogoutModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  const handleConfirmLogout = () => {
    signOut();
    setLogoutModal(false);
  };

  const handleConfirmPassword = () => {
    // signOut();
    setChangePasswordModal(false);
  };

  const handleLogOut = () => setLogoutModal(true);

  const handleChangePassword = () => setChangePasswordModal(true);

  const createFakeUsers = async (count: number) => {
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = {
        email: `${faker.internet.userName().toLowerCase()}@mailinator.com`,
        referral_code: generateAlphanumericCode(),
        invited_by: "admin",
      };
      users.push(user);
    }
    createInvitation(users);
    AddInvitations(users);
    dispatch(
      showToastWithTimeout({
        message: "Creating Fake Users",
        status: "success",
      })
    );
  };

  return (
    <Flex
      width={"100%"}
      justifyContent={"space-between"}
      bg={"white.900"}
      p={4}
    >
      <BreadCrumbComponent />
      <Menu variant={"header"}>
        <MenuButton>AP</MenuButton>
        <MenuList>
          <Flex w="100%" mb="0px">
            <Text
              as={"h6"}
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              fontWeight="700"
            >
              👋&nbsp; Hey, Admin wassup
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem onClick={() => createFakeUsers(10)}>
              <Text as={"h6"}>Create 10 Fake Users</Text>
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              <Text as={"h6"}>Create 50 Fake Users</Text>
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              <Text as={"h6"}>Create 100 Fake Users</Text>
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              <Text as={"h6"}>Change Password</Text>
            </MenuItem>
            <MenuItem color="red.400" onClick={handleLogOut}>
              <Text as={"h6"}>Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
      {logoutModal && (
        <LogoutModal
          onClose={() => setLogoutModal(false)}
          onConfirm={handleConfirmLogout}
        />
      )}
      {changePasswordModal && (
        <ChangePasswordModal
          onClose={() => setChangePasswordModal(false)}
          onConfirm={handleConfirmPassword}
        />
      )}
    </Flex>
  );
};

export default HeaderComponent;
