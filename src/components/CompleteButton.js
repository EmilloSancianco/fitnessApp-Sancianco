// src/components/CompleteButton.js

import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const CompleteButton = ({ workout, onComplete }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleClose = () => setShowConfirmModal(false);
    const handleShow = () => setShowConfirmModal(true);

    const handleConfirmComplete = () => {
        onComplete(workout.id);  // Mark the workout as complete
        setShowConfirmModal(false);  // Close the confirmation modal
    };

    if (workout.status === 'completed') return null;

    return (
        <>
            <Button
                variant="primary"
                className="w-100 mt-2"
                onClick={handleShow}  // Show the confirmation modal
            >
                Complete Workout
            </Button>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Completion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to mark this workout as completed?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmComplete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CompleteButton;
