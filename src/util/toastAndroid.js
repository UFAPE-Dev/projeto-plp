import {ToastAndroid} from "react-native";

export default function exibirToast(props) {
    ToastAndroid.showWithGravity(
        `${props}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
    );
}