import React from 'react'
import {TouchableWithoutFeedback, Modal as ModalReact, StyleSheet, View} from "react-native";
import Card from "../Card";

const styles = StyleSheet.create({
    modalStyle: {
        maxHeight: '50%',
        minHeight: '24%',
        marginTop: '9%',
        width: '100%'
    },
    topView: {
        flex: 1,
        alignItems: 'center',
        padding: '5%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        margin: '5%',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalMargin: {
        marginHorizontal: '2%', flex: 1
    }
})

function getChildren(isBgDisabled, children, rightSideButton, modalStyle, contentStyle, title, section){
    if(isBgDisabled){
        return children
    }
    return <Card
        rightSideButton={rightSideButton}
        cardStyle={modalStyle ? modalStyle : styles.modalStyle}
        contentStyle={contentStyle}
        title={title}
        section={section}>
        {children}
    </Card>
}

export default function Modal({children, visible, modalToggle, title = '', modalStyle, contentStyle, rightSideButton, withoutBody = false, section = true}){
    return (
        <ModalReact
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={modalToggle}>

            <TouchableWithoutFeedback onPress={modalToggle}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.modalMargin}>
                {getChildren(withoutBody, children, rightSideButton, modalStyle, contentStyle, title, section)}
            </View>
        </ModalReact>
    )
}