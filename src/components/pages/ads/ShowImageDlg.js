import Modal from 'react-bootstrap/Modal'
import classifiedAdService from '../../shared/services/classifiedAdService'
import postAdService from '../../shared/services/postAdService'
import { useState } from 'react';
import './ShowImageDlg.css';

export function ShowImageDlg({ showModal, onClose, imageIdToShow, source}) {
    const [title, setTitle] = useState('');
    const [imageToShow, setImageToShow] = useState('');
    
    const closeModal = () => {
        setImageToShow('');
        onClose();
    }

    const onShowModal = async () => {
        if(!imageIdToShow || imageIdToShow.length === 0)
        {
            setTitle('Nothing to load');
            return;
        }

        setTitle('Loading Image');
        var image = source === "classifieds" ? await classifiedAdService.loadImage(imageIdToShow) : 
                               await postAdService.loadImage(imageIdToShow);
        if(!image || image === null || image === undefined){
            onClose();
            return;
        }
        setImageToShow(image.image);
        setTitle('');
    }

    const renderImage = () => {
        if(!imageToShow || imageToShow.length < 2){
            return;
        }

        return(<img 
                class="img1"
                src={`data:image/jpeg;base64,${imageToShow}`}
                alt=''/>
        );
    }

    return (
        <section>
            <Modal show={showModal} onHide={closeModal} onShow={onShowModal} size="lg">
                <Modal.Header closeButton style={{ borderBottom: "none", borderTop: "none" }}>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: 'calc(150vh - 210px)', overflowY: 'auto' }}>
                    {renderImage()}
                </Modal.Body>
            </Modal>
        </section>
    );
}

export default ShowImageDlg;