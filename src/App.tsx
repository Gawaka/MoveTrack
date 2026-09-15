import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { setUser, clearUser, setLoading } from './store/authSlice';
import MainLayout from './layouts/MainLayout';
import RequireAuth from './components/routing/RequireAuth';
import type { User } from './types/types';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/Dashboard';
import './App.css';



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
        const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
        };

        dispatch(setUser(userData));
    } else {
        dispatch(clearUser());
    }
      
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/' element={<DashboardPage/>}/>
      <Route element={<RequireAuth/>}>
        <Route element={<MainLayout/>}>
          <Route path='/' element={<h2>Головна панель</h2>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App
