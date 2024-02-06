import axios from "axios";
import {
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  SET_USER_INFO,
} from "../../utils/constant";

export const handleRegisterService = async ({ email, password }) => {
  const res = await axios.post(
    REGISTER_ROUTE,
    { email, password },
    { withCredentials: true }
  );
  return res;
};

export const handleLoginService = async ({ email, password }) => {
  const res = await axios.post(
    LOGIN_ROUTE,
    { email, password },
    { withCredentials: true }
  );
  return res;
};

export const userUpdateInfo = async (data) => {
  console.log(data)
  const formData = new FormData();
  if (data.image) {
    formData.append("image", data.image);
  }
  formData.append("fullName", data.fullName);
  formData.append("userName", data.userName);
  formData.append("description", data.description);
  const res = await axios.post(SET_USER_INFO, formData, {
    withCredentials: true,
    headers:{
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${data.token}`
    }
  });
  return res;
};
