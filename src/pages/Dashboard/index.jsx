import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";

import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns";

import "./dashboard.css";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);

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

      const lastDoc = querySnapshot.docs[
        querySnapshot.docs.length - 1
      ]; // pegando o último item

      setChamados(chamados => [...chamados, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  const handleMore = async () => {
    setLoadingMore(true);

    const q = query(
      listRef,
      orderBy('created', 'desc'),
      startAfter(lastDocs),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
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
                          <span
                            className="badge"
                            style={{
                              backgroundColor: chamado.status === 'Aberto' ?
                              '#5CB85C' : '#999'
                            }}
                          >
                            {chamado.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">
                          {chamado.createdFormat}
                        </td>
                        <td data-label="#">
                          <button
                            className="action"
                            style={{ backgroundColor: '#3586f6' }}
                          >
                            <FiSearch color="#FFF" size={17} />
                          </button>
                          <Link
                            to={`/new/${chamado.id}`}
                            className="action"
                            style={{ backgroundColor: '#f6a935' }}
                          >
                            <FiEdit2 color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {
                loadingMore &&
                <h3 style={{ marginTop: '0.8em' }}>
                  Buscando mais chamados...
                </h3>
              }
              {
                !loadingMore &&
                !isEmpty &&
                <button className="btn-more" onClick={handleMore}>
                  Mais
                </button>
              }
            </>
          )}
        </>
      </div>
      {/* <button onClick={handleLogout}>Sair</button> */}
    </div>
  )
}

export default Dashboard;