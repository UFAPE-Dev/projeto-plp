import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        height: 70,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        marginTop: '2%',
        padding: '2%',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    addButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderRadius: 100,
        padding: '2%',
        backgroundColor: 'blue',
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
