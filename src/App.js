import './App.css';
import { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';

import Login from './pages/Login';
import Register from './pages/Register';
import WorkoutDashboard from './pages/WorkoutDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        });
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data._id) {
                    setUser({
                        id: data._id,
                        isAdmin: data.isAdmin
                    });
                }
            });
        }
    }, []);

    return (
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
            <Container>
                <Routes>
                    {/* Redirect root (/) to /login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Other routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} /> 
                    <Route
                        path="/workouts"
                        element={
                            <PrivateRoute>
                                <WorkoutDashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Container>
        </Router>
      </UserProvider>
    );
}

export default App;
