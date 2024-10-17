"use client";

import {
  AddInvitations,
  createInvitation,
} from "@/app/actions/InvitationAction";
import MultiEmailInput from "@/components/MultiEmail";
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { generateAlphanumericCode } from "@/utils/global";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";

interface Properties {
  onClose: () => void;
  onSuccess: () => void;
}

const InviteModal = ({ onClose, onSuccess }: Properties) => {
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (emails: string[]) => {
    const invitations = emails.map((email) => ({
      email,
      referral_code: generateAlphanumericCode(),
      invited_by: "admin",
    }));
    const response = await createInvitation(invitations);

    if (response.success) {
      dispatch(
        showToastWithTimeout({
          message: "Invitation sent successfully",
          status: "success",
        })
      );
      await AddInvitations(invitations);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      onClose();
      dispatch(
        showToastWithTimeout({
          message: response.error,
          status: "error",
        })
      );
    }
  };

  return (
    <Modal variant={"setInviteModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h2"}>Invite</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2} as={"h5"}>
            Email address:
          </Text>
          <MultiEmailInput handleSubmit={handleSubmit} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
