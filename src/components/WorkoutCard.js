import React from 'react';
import { Card, Badge, Dropdown } from 'react-bootstrap';
import { ThreeDots } from 'react-bootstrap-icons';
import CompleteButton from './CompleteButton';

const WorkoutCard = ({ workout, onEdit, onDelete, onComplete }) => {
    const getStatusVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'secondary';
            default:
                return 'dark';
        }
    };

    return (
        <Card className="workout-card h-100 shadow-sm p-3 position-relative">
            <Card.Body>
                <Card.Title className="text-primary fw-bold">{workout.name}</Card.Title>

                <Card.Text className="mb-2">
                    <strong>Duration:</strong> {workout.duration}
                </Card.Text>

                <Card.Text className="mb-2">
                    <strong>Status:</strong>{' '}
                    <Badge bg={getStatusVariant(workout.status)}>
                        {workout.status}
                    </Badge>
                </Card.Text>

                <Card.Text className="text-muted small">
                    Added on: {new Date(workout.dateAdded).toLocaleDateString()}
                </Card.Text>

                {/* Complete Workout Button */}
                <CompleteButton workout={workout} onComplete={onComplete} />
            </Card.Body>

            {/* Dropdown for more options (three dots) */}
            <div className="position-absolute top-0 end-0 p-2">
                <Dropdown>
                    <Dropdown.Toggle
                        variant="link"
                        id="dropdown-custom-components"
                        bsPrefix="dropdown"
                        aria-label="Workout options"
                    >
                        <ThreeDots />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onEdit(workout)}>
                            Edit Workout
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onDelete(workout)}>
                            Delete Workout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Card>
    );
};

export default WorkoutCard;
