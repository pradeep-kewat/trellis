"use client";

import {
  fetchAllNotificationUsers,
  sendGroupNotification,
  sendUserNotification,
} from "@/app/actions/NotificationAction";
import VirtualizedList from "@/components/VirtualizedList";
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import ConfirmationModal from "@/modals/ConfirmationModal";

interface Properties {
  onSuccess: () => void;
  onClose: () => void;
}

const NotificationModal = ({ onSuccess, onClose }: Properties) => {
  const dispatch: AppDispatch = useDispatch();

  const [isMobile] = useMediaQuery("(max-width: 820px)");

  const [headings, setHeadings] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [items, setItems]: any = useState({ status: true, data: [] });
  const [content, setContent] = useState({ text: "", html: "" });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const handleChange = (newContent: any, _: any, __: any, html: any) => {
    const processedHtml = newContent
      .replace(/^\s*<p><br><\/p>\s*/i, "") // Remove <p><br></p> at the start of the content
      .trim(); // Remove any leading or trailing whitespace

    const processedText = html
      .getText()
      .replace(/^\n/, "") // Remove a single newline at the start of the text
      .trim(); // Remove any leading or trailing whitespace

    setContent({ html: processedHtml, text: processedText });
  };

  const handleButtonClick = () => setConfirmationModal(true);

  useEffect(() => {
    const fetchAllUser = async () => {
      const response = await fetchAllNotificationUsers();
      setItems({ status: false, data: response.data });
    };
    fetchAllUser();
  }, []);

  const headingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeadings(event.target.value);
  };

  const handleConfirm = () => {
    setConfirmationModal(false);
    handleEditorChange(content.html, content.text);
  };

  const handleEditorChange = async (content: string, text: string) => {
    setIsSubmitDisabled(true);
    const filteredExternalID = selectedUsers.map((item) => item.id);

    const payload = {
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APPID,
      headings: { en: headings },
      contents: { en: text },
      target_channel: "push",
      include_aliases: {
        external_id: filteredExternalID,
      },
      data: {
        notification_type: "admin",
        sender_id: "admin",
      },
    };

    const response = await fetch("/api/onesignal", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setIsSubmitDisabled(false);
    const res2 = await response.json();

    if (res2?.status === 200 && res2?.data?.id) {
      dispatch(
        showToastWithTimeout({
          message: "Notification sended successfully",
          status: "success",
        })
      );
      const groupNotificationPayload = {
        title: headings,
        description: text,
        onesignal_notification_id: res2.data.id,
      };
      const groupNotification: any = await sendGroupNotification(
        groupNotificationPayload
      );
      if (groupNotification.success) {
        const payload = {
          title: headings,
          sender: groupNotification.data?.id,
          receivers: filteredExternalID,
          onesignal_notification_id: res2.data.id,
          description: text,
          notification_type: "admin",
        };
        await sendUserNotification(payload);
      }
      onSuccess();
    } else {
      dispatch(
        showToastWithTimeout({
          message: "User might not have subscribed",
          status: "error",
        })
      );
      onClose();
    }
  };

  return (
    <Modal variant={"notification"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>
          Send Notification{" "}
          {selectedUsers.length > 0 && `(${selectedUsers.length})`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            flexDir={isMobile ? "column" : "row"}
          >
            <VirtualizedList
              items={items.data}
              isLoading={items.status}
              itemHeight={50}
              handleSelectChange={(data) => setSelectedUsers(data)}
            />
            <Flex
              width={isMobile ? "100%" : `calc(100% - 300px)`}
              flexDir={"column"}
              px={4}
              pb={4}
              border={"1px solid rgb(204, 204, 204)"}
              maxH={"inherit"}
              overflow={"hidden"}
            >
              <Flex flexDir={"column"} mt={6}>
                <Text mb={2} as={"h6"} fontWeight={"medium"}>
                  Notification title*
                </Text>
                <Input
                  placeholder="Type here..."
                  onChange={headingChange}
                  borderColor={"#ccc"}
                  borderRadius={"sm"}
                  fontWeight={500}
                  color={"#1B254B"}
                  _hover={{ borderColor: "#ccc" }}
                  _focusVisible={{ borderColor: "#ccc" }}
                />
              </Flex>
              <Flex
                flexDir={"column"}
                mt={4}
                h={"100%"}
                maxH={"calc(100% - 60px)"}
              >
                <Text mb={2} as={"h6"} fontWeight={"medium"}>
                  Notification description*
                </Text>
                <Flex flexDir={"column"} height={`calc(100% - 30px)`}>
                  <ReactQuill
                    theme="snow"
                    className="notification-quill-editor"
                    bounds={".notification-quill-editor"}
                    placeholder={"Enter description here"}
                    value={content.html}
                    onChange={handleChange}
                    modules={{
                      toolbar: {
                        container: [
                          [{ size: ["small", "large", "huge"] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link"],
                          ["code-block"],
                        ],
                      },
                      clipboard: {
                        matchVisual: false,
                      },
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "code-block",
                    ]}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={
              selectedUsers.length <= 0 ||
              !headings ||
              !content.text ||
              isSubmitDisabled
            }
            mt={2}
            variant={"brand"}
            onClick={handleButtonClick}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
      {confirmationModal && (
        <ConfirmationModal
          onClose={() => setConfirmationModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </Modal>
  );
};

export default NotificationModal;
