import Modal from 'react-bootstrap/Modal'
import { View, Text, StyleSheet } from 'react-native';
import { CirclePicker } from 'react-color';
import '../../pages/Home.css';
import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

export function ColorPickerDlg({onClose, showModal, onColorPicked, onDefaultColorPicked}) {
    const [color, setColor] = useState('#fff');
    const ref = useRef(null);
    const [modalWidth, setModalWidth] = useState(0);

    useEffect(() => {
        setModalWidth(ref.current.offsetWidth);
    }, []);

    const closeModal = () => {
        onClose();
    }

    const handleChangeComplete = (pickedColor) => {
        //console.log(pickedColor)
        setColor(pickedColor);
    };

    const styles = StyleSheet.create({        
        text: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: 'bold',
            letterSpacing: 0.2,
            color: 'white',
          },
    });

    const renderPickBtn = () => {
        return (
            <View style={{ flex:1, justifyContent: "flex-end", flexDirection: "row", marginTop: 10}}>
                <Button onClick={()=>onDefault()}>
                    <Text style={styles.text}>Default</Text>
                </Button>

                <View style={{ flex:0.5, justifyContent: "flex-end", flexDirection: "row", marginRight: 10}}>
                    <Button onClick={()=>onSubmit()}>
                        <Text style={styles.text}>Submit</Text>
                    </Button>
                </View>
            </View>
        );
    }

    const onDefault = async () => {
        onDefaultColorPicked();
    }

    const onSubmit = async () => {
        onColorPicked(color);
    }

    return (
        <div ref={ref}>
            <section>
                <Modal show={showModal} onHide={closeModal} size="sm">
                <Modal.Header closeButton style={{borderBottom:"none", borderTop:"none"}}>
                <Modal.Title>
                Pick color
                </Modal.Title>
                </Modal.Header>
                <Modal.Body scrollable="true">
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'}}>
                    <CirclePicker 
                    color={color}
                    onChangeComplete={handleChangeComplete}
                    width={modalWidth}
                    />
                </View>
                {renderPickBtn()}
                </Modal.Body>
                </Modal>
            </section>
        </div>
    );
}

export default ColorPickerDlg;