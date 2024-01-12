import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import { Navigate } from "react-router-dom";

const Private = ({ children }) => {
  const { signed, loading } = useContext(AuthContext);

  if (loading === true) {
    return (
      <div></div>
    )
  }

  if (signed === false) {
    return <Navigate to="/" />
  }

  return children;
}

export default Private;