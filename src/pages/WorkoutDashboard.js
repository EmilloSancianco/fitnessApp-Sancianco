import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import WorkoutCard from '../components/WorkoutCard';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default function WorkoutDashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [newWorkout, setNewWorkout] = useState({
        name: '',
        duration: '',
        status: 'Pending',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch workouts');
                }

                const data = await response.json();
                console.log('Fetched data:', data);

                if (Array.isArray(data)) {
                    setWorkouts(data);
                } else if (data && data.workouts && Array.isArray(data.workouts)) {
                    setWorkouts(data.workouts);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };

        fetchWorkouts();
    }, []);

    const handleCompleteWorkout = async (workout) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('No token found. Please log in.');
            return;
          }
      
          const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${workout._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error('Failed to update workout status');
          }
      
          const data = await response.json();
          console.log('API response:', data);
      
          const updatedWorkouts = workouts.map((w) =>
            w._id === workout._id
              ? { ...w, status: 'completed' }
              : w
          );
      
          setWorkouts(updatedWorkouts);
          notyf.success('Workout status updated to completed!');
          setShowModal(false);
          setIsEditMode(false);
      
        } catch (error) {
          console.error('Error completing workout:', error);
          notyf.error('Failed to update workout status!');
        }
      };
      
      
      
      
    
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewWorkout((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddWorkout = async () => {
        const { name, duration, status } = newWorkout;

        if (!name || !duration) {
            notyf.error('Name and duration are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, duration, status }),
            });

            if (!response.ok) {
                throw new Error('Failed to add workout');
            }

            const data = await response.json();
            setWorkouts([...workouts, data]);
            notyf.success('Workout added successfully!');
            setShowModal(false);
            setNewWorkout({ name: '', duration: '', status: 'Pending' });
        } catch (error) {
            console.error('Error adding workout:', error);
            notyf.error('Failed to add workout!');
        }
    };

    const handleEditWorkout = async () => {
        const { name, duration, status } = newWorkout;
      
        if (!name || !duration) {
          notyf.error('Name and duration are required.');
          return;
        }
      
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${selectedWorkout._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, duration, status }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to edit workout');
          }
      
          const data = await response.json();
          console.log('API response:', data);
      
          const updatedWorkouts = workouts.map((workout) =>
            workout._id === selectedWorkout._id
              ? { ...workout, name, duration, status }
              : workout
          );
      
          setWorkouts(updatedWorkouts);
          console.log('Updated workouts state:', updatedWorkouts);
      
          const fetchWorkouts = async () => {
            const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setWorkouts(data.workouts || data || []);
            }
          };
          await fetchWorkouts();
      
          notyf.success('Workout edited successfully!');
          setShowModal(false);
          setIsEditMode(false);
          setNewWorkout({ name: '', duration: '', status: 'Pending' });
        } catch (error) {
          console.error('Error editing workout:', error);
          notyf.error('Failed to edit workout!');
        }
    };

    const handleDeleteWorkout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${selectedWorkout._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete workout');
            }

            const updatedWorkouts = workouts.filter((workout) => workout._id !== selectedWorkout._id);
            setWorkouts(updatedWorkouts);
            notyf.success('Workout deleted successfully!');
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting workout:', error);
            notyf.error('Failed to delete workout!');
        }
    };

    return (
        <div className="dashboard-bg py-5" style={{ position: 'relative' }}>
            <Container>
                <section className="dashboard-header text-center mb-5">
                    <h1 className="fw-bold">My Workout Dashboard</h1>
                    <p className="text-muted">Track, plan, and dominate your workout goals</p>
                </section>

                {workouts.length === 0 ? (
                    <div className="text-center text-muted">
                        <h4>You have not yet created any workouts.</h4>
                    </div>
                ) : (
                    <Row xs={1} sm={2} md={3} className="g-4">
                        {workouts.map((workout) => (
                            <Col key={workout._id}>
                                <WorkoutCard
                                    workout={workout}
                                    onComplete={() => {
                                        setSelectedWorkout(workout);
                                        handleCompleteWorkout(workout);
                                      }}
                                    onEdit={() => {
                                        setIsEditMode(true);
                                        setSelectedWorkout(workout);
                                        setNewWorkout({
                                            name: workout.name,
                                            duration: workout.duration,
                                            status: workout.status,
                                        });
                                        setShowModal(true);
                                    }}
                                    onDelete={() => {
                                        setSelectedWorkout(workout);
                                        setShowDeleteConfirmation(true);
                                    }}
                                />
                            </Col>
                        ))}
                    </Row>
                )}

                <Button
                    variant="primary"
                    onClick={() => {
                        setIsEditMode(false);
                        setNewWorkout({
                            name: '',
                            duration: '',
                            status: 'Pending'
                        });
                        setShowModal(true);
                    }}
                    className="btn-floating"
                >
                    +
                </Button>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditMode ? 'Edit Workout' : 'Add a New Workout'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Workout Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter workout name"
                                    name="name"
                                    value={newWorkout.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g., 1 hour"
                                    name="duration"
                                    value={newWorkout.duration}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={isEditMode ? handleEditWorkout : handleAddWorkout}>
                            {isEditMode ? 'Save Changes' : 'Add Workout'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this workout?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteWorkout}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}