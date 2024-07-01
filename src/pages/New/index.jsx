import { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import './new.css';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const New = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [complemento, setComplemento] = useState('');
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [idCustomer, setIdCustomer] = useState(false);

  const listRef = collection(db, 'customers');

  useEffect(() => {
    const loadCustomers = async () => {
      await getDocs(listRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })
        })

        if (snapshot.docs.size === 0) {
          setCustomers([{ id: 1, nomeFantasia: 'Freela' }]);
          setLoadCustomer(false);
          return;
        }

        setCustomers(lista);
        setLoadCustomer(false);

        if (id) {
          loadId(lista);
        }
      })
      .catch((error) => {
        console.log('Erro ao buscar os clientes', error);
        setLoadCustomer(false);
        setCustomers([{ id: 1, nomeFantasia: 'Freela' }]);
      });
    }

    loadCustomers();
  }, [id])

  const loadId = async (lista) => {
    const docRef = doc(db, 'tickets', id);
    await getDoc(docRef)
    .then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);

      let index = lista.findIndex(
        item => item.id === snapshot.data().clienteId
      );
      setCustomerSelected(index);
      setIdCustomer(true);
    })
    .catch((error) => {
      console.log(error);
      setIdCustomer(false);
    })
  }

  const handleOptionChange = (e) => {
    setStatus(e.target.value);
  }

  const handleChangeSelect = (e) => {
    setAssunto(e.target.value);
  }

  const handleChangeCustomer = (e) => {
    setCustomerSelected(e.target.value);
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (idCustomer) {
      const docRef = doc(db, 'tickets', id);
      await updateDoc(docRef, {
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid
      })
      .then(() => {
        toast.success('Chamado atualizado!');
        setCustomerSelected(0);
        setComplemento('');
        navigate('/dashboard');
      })
      .catch(() => {
        toast.error('Ops! Erro ao atualizar.');
      })

      return;
    }

    await addDoc(collection(db, 'tickets'), {
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid
    })
    .then(() => {
      toast.success('Chamado registrado!');
      setComplemento('');
      setAssunto('Suporte');
      setCustomerSelected(0);
    })
    .catch((error) => {
      toast.error('Ops! Erro ao registrar.');
      console.log(error);
    })
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name={id ? "Editando chamado" : "Novo chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Clientes</label>
            {loadCustomer ? (
              <input type="text" disabled={true} value='Carregando...' />
            ) : (
              <select
                value={customerSelected}
                onChange={handleChangeCustomer}
              >
                {customers.map((customer, index) => {
                  return (
                    <option key={index} value={index}>
                      {customer.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Técnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <span>Em aberto</span>
              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <span>Progresso</span>
              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)"
              value={complemento}
              onChange={e => setComplemento(e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default New;