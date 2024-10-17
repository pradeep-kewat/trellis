/* eslint-disable no-unused-vars */
"use client";

import FormField from "@/components/FormField";
import MasterFieldsSchema from "@/validation/schemas/MasterFieldsSchema";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";

interface Properties {
  editData: any;
  onSuccess: () => void;
  onClose: () => void;
  handleCreate: (data: any) => void;
  handleUpdate: (data: any) => void;
}

const MasterFieldsModal = ({
  editData,
  onSuccess,
  onClose,
  handleCreate,
  handleUpdate,
}: Properties) => {
  const initialValues = {
    name: editData?.name || "",
  };

  const onSubmitForm = async (
    values: any,
    setSubmitting: (data: boolean) => void
  ) => {
    if (editData?.name) {
      handleUpdate({ ...values, actionId: editData?.id });
    } else {
      handleCreate(values);
    }
    setSubmitting(false);
    onSuccess();
  };

  return (
    <Modal variant={"masterModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>
          {editData?.name ? "Edit Field" : "Create Field"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(form, { setSubmitting }) => {
              onSubmitForm(form, setSubmitting);
            }}
            validationSchema={MasterFieldsSchema}
          >
            {({ errors, touched, isSubmitting }: any) => (
              <Form>
                <FormField
                  label="Field Name*"
                  name="name"
                  type="text"
                  placeholder="Type name here"
                  disabled={isSubmitting}
                  error={errors.name}
                  touched={touched.name}
                  styles={{ marginBottom: "1.5rem" }}
                />
                <Flex justifyContent={"end"}>
                  <Button
                    type="submit"
                    variant={"save_button"}
                    isDisabled={isSubmitting}
                  >
                    {editData?.name ? "Update" : "Create"}
                    {isSubmitting && <Spinner ml={"4"} />}
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MasterFieldsModal;
