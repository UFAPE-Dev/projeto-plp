import {StyleSheet} from "react-native";

export default StyleSheet.create({
    testeStyle: {
        backgroundColor: 'red'
    }, addButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderRadius: 100,
        padding: '2%',
        backgroundColor: '#4169E1',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        elevation: 15,
        marginRight: '1%',
        marginBottom: '1%'
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
})
