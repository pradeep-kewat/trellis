/* eslint-disable no-unused-vars */

"use client";

import {
  fetchMasterEditInterests,
  fetchMasterInterests,
} from "@/app/actions/communityAction";
import {
  createPost,
  fetchMasterCommunities,
  fetchMasterEditCommunities,
  updatePost,
} from "@/app/actions/PostsAction";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormMenu";
import PostsSchema from "@/validation/schemas/PostsSchema";
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
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Properties {
  editData: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PostsModal = ({ editData, onClose, onSuccess }: Properties) => {
  const reactQuillRef = useRef<ReactQuill>(null);
  const [masterInterests, setMasterInterests]: any = useState([]);
  const [masterCommunity, setMasterCommunity]: any = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  const initialValues = {
    title: editData?.title || "",
    body_html: editData?.body_html || "",
    body_text: editData?.body_text || "",
    body_delta: editData?.body_delta || "",
    interests: editData?.interestsId || "",
    community: editData?.communityId || "",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (editData?.name) {
        setMasterInterests((await fetchMasterEditInterests()).data || []);
        setMasterCommunity((await fetchMasterEditCommunities()).data || []);
      } else {
        setMasterInterests((await fetchMasterInterests()).data || []);
        setMasterCommunity((await fetchMasterCommunities()).data || []);
      }
    };
    fetchData();
  }, []);

  const onSubmitForm = async (
    values: any,
    setSubmitting: (data: boolean) => void
  ) => {
    const updatedValues = { ...values };
    updatedValues.body_delta = JSON.stringify(values.body_delta);

    if (editData?.title) {
      await updatePost({ ...updatedValues, postId: editData?.id });
      onSuccess();
    } else {
      await createPost(updatedValues);
      onSuccess();
    }
    setSubmitting(false);
  };

  const uploadToS3 = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/s3", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data?.url;
  };

  const imageHandler = useCallback(() => {
    if (typeof document !== "undefined") {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const quill = reactQuillRef.current;
        if (quill && input.files) {
          const file = input.files[0];
          const editor = quill.getEditor();
          const range = editor.getSelection();

          if (range) {
            const placeholderImageUrl = "/loader.png";
            editor.insertEmbed(range.index, "image", placeholderImageUrl);
            setImageLoading(true);
            try {
              const url = await uploadToS3(file);
              setImageLoading(false);

              if (url) {
                editor.deleteText(range.index, 1);
                editor.insertEmbed(range.index, "image", url);
              }
            } catch (error) {
              console.error("Image upload failed", error);
              setImageLoading(false);
            }
          }
        }
      };
    }
  }, []);

  const videoHandler = useCallback(() => {
    if (typeof document !== "undefined") {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.click();

      input.onchange = async () => {
        const quill = reactQuillRef.current;
        if (quill && input.files) {
          const file = input.files[0];
          const editor = quill.getEditor();
          const range = editor.getSelection();

          if (range) {
            const placeholderVideoUrl = "/loader.png";
            editor.insertEmbed(range.index, "video", placeholderVideoUrl);
            setImageLoading(true);
            try {
              const url = await uploadToS3(file);
              setImageLoading(false);
              if (url) {
                editor.deleteText(range.index, 1);
                editor.insertEmbed(range.index, "video", url);
              }
            } catch (error) {
              console.error("Video upload failed", error);
              setImageLoading(false);
            }
          }
        }
      };
    }
  }, []);

  const handleChange = (
    newContent: any,
    delta: any,
    name: any,
    editor: any,
    setFieldValue = (name: string, content: string) => {}
  ) => {
    const processedHtml = newContent
      .replace(/^\s*<p><br><\/p>\s*/i, "") // Remove <p><br></p> at the start of the content
      .trim(); // Remove any leading or trailing whitespace

    const processedText = editor
      .getText()
      .replace(/^\n/, "") // Remove a single newline at the start of the text
      .trim(); // Remove any leading or trailing whitespace

    setFieldValue("body_html", processedHtml);
    setFieldValue("body_text", processedText);
    setFieldValue("body_delta", editor.getContents());
  };

  return (
    <Modal variant={"postModal"} isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={"h3"}>
          {editData?.title ? "Edit Post" : "Create Post"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(form, { setSubmitting }) => {
              onSubmitForm(form, setSubmitting);
            }}
            validationSchema={PostsSchema}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
            }: any) => {
              return (
                <Form style={{ height: "100%", maxHeight: "100%" }}>
                  <FormField
                    label="Post Title*"
                    name="title"
                    type="text"
                    placeholder="Type name here"
                    disabled={isSubmitting}
                    error={errors.title}
                    touched={touched.title}
                    styles={{ marginBottom: "1.5rem" }}
                  />
                  <FormSelect
                    label="Post Interest*"
                    name="interests"
                    disabled={isSubmitting}
                    options={
                      masterInterests.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                      })) || []
                    }
                    placeholder="Select option"
                    error={errors.interests}
                    touched={touched.interests}
                    styles={{ marginBottom: "1.5rem" }}
                  />
                  <FormSelect
                    label="Community*"
                    name="community"
                    disabled={isSubmitting}
                    options={
                      masterCommunity.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                      })) || []
                    }
                    placeholder="Select option"
                    error={errors.community}
                    touched={touched.community}
                    styles={{ marginBottom: "1.5rem" }}
                  />
                  <ReactQuill
                    ref={reactQuillRef}
                    className="post-quill-editor"
                    onBlur={() => {
                      if (!touched.body_html) {
                        setFieldTouched("body_html", true);
                      }
                    }}
                    theme="snow"
                    bounds={".post-quill-editor"}
                    placeholder="Enter description here"
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
                          ["link", "image", "video"],
                          ["code-block"],
                        ],
                        handlers: {
                          image: imageHandler,
                          video: videoHandler,
                        },
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
                      "image",
                      "video",
                      "code-block",
                    ]}
                    value={values.body_html}
                    onChange={(content, delta, name, editor) => {
                      handleChange(content, delta, name, editor, setFieldValue);
                    }}
                  />
                  {errors.body_text && touched.body_html && (
                    <Text color={"red.500"}>This field is required</Text>
                  )}
                  <Flex justifyContent={"end"} mt={4}>
                    <Button
                      type="submit"
                      variant={"save_button"}
                      isDisabled={isSubmitting || imageLoading}
                    >
                      {editData?.title ? "Update" : "Create"}
                      {isSubmitting && <Spinner ml={"4"} />}
                    </Button>
                  </Flex>
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostsModal;
