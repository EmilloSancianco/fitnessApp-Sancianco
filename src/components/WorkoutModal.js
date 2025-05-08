import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const WorkoutModal = ({ show, onHide, onEdit, onDelete }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Workout Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button variant="warning" className="w-100 mb-2" onClick={onEdit}>
                    Edit Workout
                </Button>
                <Button variant="danger" className="w-100" onClick={onDelete}>
                    Delete Workout
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default WorkoutModal;
