"use client";

import {
  createTermsCondition,
  fetchTermsCondition,
  updateTermsCondition,
} from "@/app/actions/PolicyAction";
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const TermsAndConditionPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const [editorContent, setEditorContent] = useState({ html: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      const termsConditionResponse: any = await fetchTermsCondition();

      if (termsConditionResponse.success) {
        setEditorContent({
          text: termsConditionResponse.data[0]?.terms_and_conditions,
          html: termsConditionResponse.data[0]?.terms_and_conditions_html,
        });
      }
    };
    fetchData();
  }, []);

  const handleEditorChange = async (html: string, text: string) => {
    const doesTermsConditionExists: any = await fetchTermsCondition();
    const payload = { id: doesTermsConditionExists.data[0]?.id, html, text };

    if (doesTermsConditionExists.data.length === 0) {
      const createTC = await createTermsCondition(payload);

      if (!createTC.error) {
        dispatch(
          showToastWithTimeout({
            message: "Created Successfully",
            status: "success",
          })
        );
      }
    } else {
      const updateTC = await updateTermsCondition(payload);
      if (!updateTC.error) {
        dispatch(
          showToastWithTimeout({
            message: "Updated Successfully",
            status: "success",
          })
        );
      }
    }
    return true;
  };

  return (
    <Flex height={"100%"} width={"100%"}>
      <Editor
        placeHolder="T&C"
        defaultContent={editorContent}
        handleEditorChange={handleEditorChange}
      />
    </Flex>
  );
};

export default TermsAndConditionPage;
