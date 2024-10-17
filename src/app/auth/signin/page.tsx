"use client";

import FormField from "@/components/FormField";
import signInSchema from "@/validation/schemas/SignInSchema";
import {
  Box,
  Flex,
  Text,
  FormLabel,
  Checkbox,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useDispatch } from "react-redux";
import { showToastWithTimeout } from "@/redux/SharedSlice";
import { checkUserExistance, emailLogin } from "@/app/actions/authAction";
import PasswordField from "@/components/PasswordField";

const SignInComponent = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
    rememberLoggedIn: false,
  };

  const onSubmitForm = async (
    values: any,
    // eslint-disable-next-line no-unused-vars
    setSubmitting: (data: boolean) => void
  ) => {
    const doesUserExists: any = await checkUserExistance(values?.email);
    if (doesUserExists.success) {
      const response = await emailLogin(values);
      if (response.success) {
        router.push("/admin/dashboard?tab=0&subtab=0");
      } else {
        dispatch(
          showToastWithTimeout({
            message: response.error,
            status: "error",
          })
        );
        setSubmitting(false);
      }
    } else {
      setSubmitting(false);
      dispatch(
        showToastWithTimeout({
          message: doesUserExists?.error,
          status: "error",
        })
      );
    }
  };

  return (
    <Flex
      maxW={{ base: "100%", md: "max-content" }}
      w="100%"
      alignItems="start"
      justifyContent="center"
      p={{ base: "25px", md: "0px" }}
      flexDirection="column"
    >
      <Box w={"100%"}>
        <Text as={"h1"} fontWeight={"bold"} mb="10px" textAlign={"center"}>
          Sign In
        </Text>
        <Text mb="3rem" as={"h4"}>
          Enter your email and password to sign in!
        </Text>
      </Box>
      <Flex
        zIndex="2"
        direction="column"
        w={"100%"}
        maxW="100%"
        background="transparent"
        borderRadius="15px"
        mx={{ base: "auto", lg: "unset" }}
        mb={{ base: "20px", md: "auto" }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={(form, { setSubmitting }) => {
            onSubmitForm(form, setSubmitting);
          }}
          validationSchema={signInSchema}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }: any) => (
            <Form>
              <FormField
                label="Email address*"
                name="email"
                type="text"
                placeholder="mail@trellis.com"
                disabled={isSubmitting}
                error={errors.email}
                touched={touched.email}
                styles={{ marginBottom: "1.5rem" }}
              />
              <PasswordField
                label="Password*"
                name="password"
                placeholder="Min. 8 characters"
                disabled={isSubmitting}
                error={errors.password}
                touched={touched.password}
                styles={{ marginBottom: "1.5rem" }}
              />
              <Flex alignItems={"center"} mb="1.5rem">
                <Checkbox
                  id="rememberLoggedIn"
                  name="rememberLoggedIn"
                  disabled={isSubmitting}
                  defaultChecked={values.rememberLoggedIn}
                  onChange={(e) =>
                    setFieldValue("rememberLoggedIn", e.target.checked)
                  }
                  me="10px"
                />
                <FormLabel htmlFor="rememberLoggedIn" mb="0">
                  Keep me logged in
                </FormLabel>
              </Flex>
              <Button
                type="submit"
                variant="brand"
                w="100%"
                isDisabled={isSubmitting}
              >
                Sign In {isSubmitting && <Spinner ml={"4"} />}
              </Button>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default SignInComponent;
