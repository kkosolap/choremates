import { Alert } from 'react-native';


// simple popup function for testing buttonss
const showHelloPopup = () => {
  Alert.alert(
    "Notification", // Title of the popup
    "Hello World!", // Message in the popup
    [
      {
        text: "OK", // Dismiss button
        onPress: () => console.log("OK Pressed"), // Optional action when pressed
      }
    ],
    { cancelable: true } // Allow dismissing by tapping outside the alert
  );
};

export default showHelloPopup;