import { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from "react-toastify";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const storageData = localStorage.getItem('@ticketsPRO');

      if (storageData) {
        setUser(JSON.parse(storageData));
        setLoading(false);
      }

      setLoading(false);
    }

    loadUser();
  }, [])

  const signIn = async (email, password) => {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
    .then(async (value) => {
      let uid = value.user.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      let data = {
        uid: uid,
        nome: docSnap.data().nome,
        email: value.user.email,
        avatarUrl: docSnap.data().avatarUrl
      }

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      navigate("/dashboard");
    })
    .catch((err) => {
      console.log(err);
      setLoadingAuth(false);
      toast.error("Ops, algo deu errado!");
    })
  }

  const signUp = async (name, email, password) => {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
    .then(async (value) => {
      let uid = value.user.uid

      await setDoc(doc(db, "users", uid), {
        nome: name,
        avatarUrl: null
      })
      .then( () => {
        let data = {
          uid: uid,
          nome: name,
          email: value.user.email,
          avatarUrl: null,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Tudo certo! Seja bem-vindo!");
        navigate("/dashboard");
      })
    })
    .catch((err) => {
      console.log(err);
      setLoadingAuth(false);
    })
  }

  const storageUser = (data) => {
    localStorage.setItem('@ticketsPRO', JSON.stringify(data));
  }

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('@ticketsPRO');
    setUser(null);
  }

  return (
    <AuthContext.Provider 
      value={{
        signed: !!user, // false
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;