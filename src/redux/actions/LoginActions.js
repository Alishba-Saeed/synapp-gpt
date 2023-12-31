//AXIOS
import axios from "axios";
//COMMON API
import { ApiServer } from "../../ApiConstant";

//JWT-DECODER
import jwt from "jwt-decode";
//LOGIN CONSTANTS
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
} from "../constants/LoginConstants";

//LOGIN ACTIONS
export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });
    var bodyFormData = new FormData();
    bodyFormData.append("email", username);
    bodyFormData.append("password", password);
    const { data } = await axios.post(ApiServer + "/api/login/", bodyFormData);
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
      username:data.username,
    });
    localStorage.setItem('access_token', data.token.access)
    localStorage.setItem('refresh_token', data.token.refresh)
    localStorage.setItem('username', data.username)
    // useEffect(() => {
    //   const removeAfter30Minutes = setTimeout(() => {
    //     // Remove the data from local storage
    //     localStorage.removeItem("access_token");
    //   }, 29 * 60 * 1000) // 30 minutes in milliseconds
     
    //   return () => {
    //     clearTimeout(removeAfter30Minutes);
    //     //clearTimeout(removeusernameAfter30Minutes);
    //   };
    // }, []);
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILURE,
      payload: error
    });
   
    //console.log(error.response.status);
  }
};

// Logout Actions

export const Logout = () => (dispatch) => {
  window.localStorage.clear();
  localStorage.clear();
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')

  window.location.reload();
  dispatch({ type: USER_LOGOUT });
};
