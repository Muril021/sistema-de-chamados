import logo from '../../assets/logo.png';

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name !== '' && email !== '' && password !== '') {
      await signUp(name, email, password);
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Logo do sistema de chamados' />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Nova conta</h1>
          <input
            type='text'
            placeholder='Nome'
            value={name}
            onChange={e => setName(e.target.value)}
          />
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
            {loadingAuth ? 'Carregando...' : 'Cadastrar'}
          </button>
        </form>
        <p>ou</p>
        <Link to='/'>Já possui uma conta? Faça login</Link>
      </div>
    </div>
  )
}

export default SignUp;