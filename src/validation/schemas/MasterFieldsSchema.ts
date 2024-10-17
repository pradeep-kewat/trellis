import * as yup from "yup";

import * as MESSAGES from "../messages";

const MasterFieldsSchema = yup.object().shape({
  name: yup.string().trim().required(MESSAGES.REQUIRE_MESSAGE),
});

export default MasterFieldsSchema;
