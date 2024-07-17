
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


interface JobApplication {
    id: number;
    content: string;
    status: string;
    cv: string;
    recruitmentPost: {
        title: string;
        describe: string;
        level: string;
        location: string;
        salary: string;
        form: string;
    };
}

interface Props {
    application: JobApplication | null;
    show: boolean;
    handleClose: () => void;
}

const ApplicationInfoModal: React.FC<Props> = ({ application, show, handleClose }) => {
    if (!application) return null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin công việc</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Tiêu đề công việc: {application.recruitmentPost.title}</p>
                <p>Mô tả công việc: {application.recruitmentPost.describe}</p>
                <p>Trạng thái: {application.status }</p>
                <p>Mức lương: {application.recruitmentPost.salary}</p>
                <p>Địa điểm: {application.recruitmentPost.location}</p>
                <p>Level: {application.recruitmentPost.level}</p>
                <p>Form: {application.recruitmentPost.form}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default ApplicationInfoModal;