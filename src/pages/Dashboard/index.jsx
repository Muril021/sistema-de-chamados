import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  }

  return (
    <div>
      <Header />
      <h1>Página inicial</h1>
      <button onClick={handleLogout}>Sair</button>
    </div>
  )
}

export default Dashboard;