import axios from "axios";

export const checkAutorixation = async () => {
  if (typeof localStorage === "undefined") {
    console.error("localStorage is not defined");
    return false;
  }
  const token = localStorage.getItem("token");
  console.log("token", token);

  if (token) {
    const response = await axios.post(
      "https://machines.qpart.com.ua/auth.php",
      {
        token: token,
      }
    );
    console.log("response", response);

    return true;
  }
  return false;
};
