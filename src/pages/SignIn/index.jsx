import './signin.css';
import logo from '../../assets/logo.png';

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (email !== '' && password !== '') {
      await signIn(email, password);
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Logo do sistema de chamados' />
        </div>
        <form onSubmit={handleSignIn}>
          <h1>Acessar</h1>
          <input 
            type='email'
            placeholder='E-mail'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type='password'
            placeholder='Senha'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type='submit'>
            {loadingAuth ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        <p>ou</p>
        <Link to='/register'>Nova conta</Link>
      </div>
    </div>
  )
}

export default SignIn;