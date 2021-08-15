import React from "react";
import {
  View,
  Modal,
  TextInput,
  TouchableHighlight,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import firebase from "firebase";
import Fire from "../Fire";
import DropDownPicker from "react-native-dropdown-picker";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default class ViewProfile extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const thisclub = params ? params.otherParam : null;
    this.state = {
      club: thisclub,
    };
  }
  handleChat = () => {
    // this.state.club.email
    // firebase.auth().current.club.email
    console.log(
      "This is email in handle",
      this.state.club.repEmail,
      firebase.auth().currentUser.email
    );
    Fire.shared
      .addChat({
        email1: this.state.club.repEmail,
        email2: firebase.auth().currentUser.email,
      })
      .then((thisID) => {
        console.log("this is id in handle chat", thisID);
        this.props.navigation.navigate("ChatScreen", {
          id: thisID,
          name: this.state.club.name,
        });
      });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Ionicons
              name="ios-arrow-round-back"
              size={24}
              color="#fff"
            ></Ionicons>
          </TouchableOpacity>
          <View style={styles.avatar}>
            {!this.state.club.image && (
              <Text
                style={{
                  fontSize: 35,
                  color: "#3772ff",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                {this.state.club.title.charAt(0)}
              </Text>
            )}
            {this.state.club.image && (
              <Image
                source={{ uri: this.state.club.image }}
                style={styles.avatar}
              ></Image>
            )}
          </View>
          <Text style={styles.name}>{this.state.club.title}</Text>
          <Text style={styles.description}>{this.state.club.descrip}</Text>
          <View
            style={{ marginTop: 25, width: "85%", alignSelf: "center" }}
          ></View>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => this.handleChat()}
            style={{
              backgroundColor: "#3772ff",
              width: "80%",
              alignSelf: "center",
              marginTop: 10,
              paddingVertical: 15,
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "500",
                fontSize: 21,
              }}
            >
              Chat With Club Rep
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(this.state.club.signUpLink)}
            style={{
              backgroundColor: "#3772ff",
              width: "80%",
              alignSelf: "center",
              marginTop: 15,
              paddingVertical: 15,
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "500",
                fontSize: 21,
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",

    flexDirection: "column",
  },
  back: {
    width: 50,
    height: 50,
    alignItems: "center",
    top: "10%",
    left: "2%",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 50,
    color: "#fff",
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    width: "100%",
    backgroundColor: "#fff",
    zIndex: -1,
    paddingTop: 15,
  },
  header: {
    height: "auto",
    flexDirection: "column",
    padding: 10,
    width: wp(100),
    borderBottomColor: "#222",
    borderBottomWidth: 2,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "#222",
    borderWidth: 2,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  name: {
    marginTop: 25,
    fontSize: 28,
    color: "#000",
    fontWeight: "600",
    alignSelf: "center",
  },
  info: {
    fontSize: 16,
    color: "black",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "black",
    marginTop: 10,
    textAlign: "center",
    zIndex: 5000,
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  Text: {
    textTransform: "capitalize",
  },
});
