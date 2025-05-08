import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import UserContext from '../UserContext';

export default function Login() {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {
        e.preventDefault();

        fetch('https://fitnessapp-api-ln8u.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access !== undefined) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');
                alert(`You are now logged in`);
            } else if (data.error == "Incorrect email or password") {
                alert(`Incorrect email or password`);
            } else {
                alert(`${email} does not exist`);
            }
        })
    }

    function retrieveUserDetails(token) {
        fetch('https://fitnessapp-api-ln8u.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            });
        });
    }

    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return (
        user.id !== null ?
            <Navigate to="/workouts" />
            :
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="login-form p-4 shadow-lg rounded">
                    <div className="text-center mb-4">
                        <img src="path_to_your_logo.png" alt="Logo" className="img-fluid" />
                    </div>
                    <h1 className="my-4 text-center">Login</h1>

                    <Form onSubmit={(e) => authenticate(e)}>

                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        {isActive ?
                            <Button variant="primary" type="submit" id="loginBtn">
                                Login
                            </Button>
                            :
                            <Button variant="danger" type="submit" id="loginBtn" disabled>
                                Login
                            </Button>
                        }

                        <div className="mt-3 text-center">
                            <p>Don't have an account? <a href="/register">Register here</a></p>
                        </div>
                    </Form>
                </div>
            </Container>
    );
}
