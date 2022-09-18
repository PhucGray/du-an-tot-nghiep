import api from "../../api";

export default signIn = (payload) => {
  // return axios.post(URL)
  return api.post("", payload);
};
