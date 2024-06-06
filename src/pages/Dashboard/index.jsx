import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";

import { Link } from "react-router-dom";

import "./dashboard.css";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const listRef = collection(db, 'tickets');

  useEffect(() => {
    const loadChamados = async () => {
      const q = query(
        listRef,
        orderBy('created', 'desc'),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      await updateState(querySnapshot);

      setLoading(false);
    }

    loadChamados();

    return () => {}
  }, [])

  const updateState = async (querySnapshot) => {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((chamado) => {
        lista.push({
          id: chamado.id,
          assunto: chamado.data().assunto,
          cliente: chamado.data().cliente,
          clienteId: chamado.data().clienteId,
          complemento: chamado.data().complemento,
          created: chamado.data().created,
          createdFormat: format(
            chamado.data().created.toDate(), 'dd/MM/yyyy'
          ),
          status: chamado.data().status
        })
      })

      setChamados([...lista]);
    } else {
      setIsEmpty(true);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="content">
          <Title name='Tickets'>
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name='Tickets'>
          <FiMessageSquare size={25} />
        </Title>
        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado.</span>
              <Link to='/new' className='new'>
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to='/new' className='new'>
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((chamado, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{chamado.cliente}</td>
                        <td data-label="Assunto">{chamado.assunto}</td>
                        <td data-label="Status">
                          <span className="badge" style={{ backgroundColor: '#999' }}>
                            {chamado.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{chamado.createdFormat}</td>
                        <td data-label="#">
                          <button className="action" style={{ backgroundColor: '#3586f6' }}>
                            <FiSearch color="#FFF" size={17} />
                          </button>
                          <button className="action" style={{ backgroundColor: '#f6a935' }}>
                            <FiEdit2 color="#FFF" size={17} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </>
          )}
        </>
      </div>
      {/* <button onClick={handleLogout}>Sair</button> */}
    </div>
  )
}

export default Dashboard;