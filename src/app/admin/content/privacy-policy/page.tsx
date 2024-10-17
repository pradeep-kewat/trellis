"use client";

import {
  createPrivacyPolicy,
  fetchPrivacyPolicy,
  updatePrivacyPolicy,
} from "@/app/actions/PolicyAction";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const PrivacyPolicyPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const [editorContent, setEditorContent] = useState({ html: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      const termsConditionResponse: any = await fetchPrivacyPolicy();

      if (termsConditionResponse.success) {
        setEditorContent({
          text: termsConditionResponse.data[0]?.privacy_policy,
          html: termsConditionResponse.data[0]?.privacy_policy_html,
        });
      }
    };
    fetchData();
  }, []);

  const handleEditorChange = async (html: string, text: string) => {
    const doesTermsConditionExists: any = await fetchPrivacyPolicy();
    const payload = { id: doesTermsConditionExists.data[0]?.id, html, text };

    if (doesTermsConditionExists.data.length === 0) {
      const createTC = await createPrivacyPolicy(payload);

      if (!createTC.error) {
        dispatch(
          showToastWithTimeout({
            message: "Created Successfully",
            status: "success",
          })
        );
      }
    } else {
      const updateTC = await updatePrivacyPolicy(payload);
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
        placeHolder="Privacy Policy"
        defaultContent={editorContent}
        handleEditorChange={handleEditorChange}
      />
    </Flex>
  );
};

export default PrivacyPolicyPage;
