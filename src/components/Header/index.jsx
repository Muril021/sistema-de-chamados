import { useContext } from 'react';
import avatar from '../../assets/avatar.png';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import './header.css';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img 
          src={user.avatarUrl === null ? avatar : user.avatarUrl}
          alt="foto do usuário"
        />
      </div>
      <Link to='/dashboard'>
        <FiHome color='#FFF' size={24} />
        Chamados
      </Link>
      <Link to='/customers'>
        <FiUser color='#FFF' size={24} />
        Clientes
      </Link>
      <Link to='/profile'>
        <FiSettings color='#FFF' size={24} />
        Perfil
      </Link>
    </div>
  )
}

export default Header;