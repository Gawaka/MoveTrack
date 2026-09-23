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
import NewWorkoutPage from './pages/NewWorkoutPage';
import ExercisesPage from './pages/ExercisesPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
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
      <Route element={<RequireAuth/>}>
        <Route element={<MainLayout/>}>
          <Route path='/' element={<DashboardPage/>}/>
          <Route path='/workout/new' element={<NewWorkoutPage/>}/>
          <Route path='/workout/exercises' element={<ExercisesPage/>}/>
          <Route path='/workout/active' element={<ActiveWorkoutPage/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
