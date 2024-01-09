import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import { Navigate } from "react-router-dom";

const Private = ({ children }) => {
  const { signed } = useContext(AuthContext)

  if (signed === false) {
    return <Navigate to="/" />
  }

  return children;
}

export default Private;