import axios from "axios";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../../utils/constant";

export const handleRegisterService = async ({ email, password }) => {
  const res = await axios.post(REGISTER_ROUTE,
    { email, password },
    { withCredentials: true }
  );
  return res;
};


export const handleLoginService = async ({ email, password }) => {
  const res = await axios.post(LOGIN_ROUTE,
    { email, password },
    { withCredentials: true }
  );
  return res;
};
