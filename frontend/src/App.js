import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import AddEmail from './pages/addEmail';
import EmailList from './pages/EmailList';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import OnBoard from './pages/OnBoard';
import Report from './pages/Report';

function App() {
  // const token = localStorage.getItem('token');
  return (
    <div>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={
        token ? <Navigate to="/getEmail" /> : <Navigate to="/login" />  
        } /> */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <EmailList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/getEmail" 
          element={
            <ProtectedRoute>
              <EmailList />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginForm />} />        

        <Route path="/onBoard" element={ <OnBoard/> } />

        <Route 
          path="/addEmail" 
            element={
              <ProtectedRoute>
                <AddEmail />
              </ProtectedRoute>
            }
        />
        <Route 
          path="/report" 
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
        />
      </Routes>
    </div>
  );
}

export default App;
