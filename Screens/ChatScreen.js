import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; // 0.3.0
import {
  Platform,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import Fire from "../Fire";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
disableYellowBox = true;
export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    console.log("This is paramsv2 baby", params);
    const userID = params["id"];
    const otherUserName = params["name"];
    const nm = params["newestMessage"];

    const newMesEmail = params["newestMessagEmail"];

    this.state = {
      otherName: otherUserName,
      messages: [],
      currUserName: "",
      currID: userID,

      newestMessage: nm,
    };

    Fire.shared
      .getUserData(firebase.auth().currentUser.email)
      .then(({ user }) => {
        this.state.currUserName = user["name"];
      });
    console.log("this is sbit", nm);
    if (
      nm.chat.newestMessage.seenByUserThatDidntSend != undefined &&
      nm.chat.newestMessage.user.email != firebase.auth().currentUser.email &&
      nm.chat.newestMessage.seenByUserThatDidntSend == false
    ) {
      console.log("this is nm", nm.chat.newestMessage);
      Fire.shared.toggleSeenBy(userID, nm.chat.newestMessage);
    }
  }
  get user() {
    return {
      _id: Fire.shared.uid,
      name: this.state.currUserName,
      email: firebase.auth().currentUser.email,
    };
  }
  componentDidMount() {
    console.log("This is curr", this.state.currID);
    Fire.shared.get((message) => {
      console.log("message is ", message);
      this.setState((previous) => ({
        messages: GiftedChat.append(previous.messages, message),
      }));
    }, this.state.currID);
  }
  componentWillUnmount() {
    Fire.shared.off();
  }

  render() {
    console.log("Thisi s messages", this.state.messages);
    console.log("This i suer", this.user);
    const chat = (
      <GiftedChat
        style={{ zIndex: -1, position: "absolute" }}
        messages={this.state.messages}
        onSend={(messages) =>
          Fire.shared.send(
            messages,
            this.state.currID,
            this.user,
            firebase.auth().currentUser.email
          )
        }
        user={this.user}
      />
    );

    return (
      <View
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
        enabled
      >
        <View style={styles.header}>
          <View style={styles.linesContainer}>
            <View style={styles.plus}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Chat")}
                style={{
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  borderRadius: 50,
                  color: "#3772ff",
                }}
              >
                <Ionicons
                  name="ios-arrow-round-back"
                  size={32}
                  color={"#3772ff"}
                />
              </TouchableOpacity>
            </View>
            {this.state.otherName !== undefined &&
              this.state.otherName.length > 20 && (
                <Text style={styles.heading}>
                  {this.state.otherName.substring(0, 20)}...
                </Text>
              )}
            {this.state.otherName !== undefined &&
              this.state.otherName.length <= 20 && (
                <Text style={styles.heading}>{this.state.otherName}</Text>
              )}
          </View>
        </View>
        <View style={styles.content}>{chat}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#3772ff",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 130,
  },
  linesContainer: {
    backgroundColor: "transparent",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  plus: {
    position: "absolute",
    left: 20,
    zIndex: 5000,
  },
  content: {
    flex: 6,
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
    top: -30,
  },
  heading: {
    fontSize: 26,
    textTransform: "uppercase",
    letterSpacing: 0,
    paddingHorizontal: 20,
    marginBottom: 5,
    color: "#fff",
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
  },
  back: {
    marginHorizontal: 15,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    backgroundColor: "rgba(21,22,48,0.1)",
    justifyContent: "center",
  },
});
