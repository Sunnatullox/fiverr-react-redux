import axios from "axios";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../utils/constant";

export const handleLoginService = async ({ email, password }, type) => {
  const { data } = await axios.post(
    type === "login" ? LOGIN_ROUTE : REGISTER_ROUTE,
    { email, password },
    { withCredentials: true }
  );
  return data;
};
