import React, { useState } from "react";
import {
  View,
  DropDownList,
  Modal,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import Fire from "../Fire";

import SearchableDropdown from "searchable-dropdown-react-native";
import CustomMultiPicker from "react-native-multiple-select-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CheckBox from "react-native-check-box";
var userList = [
  "Spaceship design",
  "Special materials",
  "Eating food grown in space",
  "New propulsion designs",
  "Building  on mars and the moon",
  "Women astronauts",
  "Space diplomats",
  "Life on other planets",
  "AI and the coming Quantum Brain",
  "Have you seen a UFO?",
];

let items = [
  {
    id: 1,
    name: "JavaScript",
    value: "JavaScript",
  },
  {
    id: 2,
    name: "Java",
    value: "Java",
  },
  {
    id: 3,
    name: "Ruby",
    value: "Ruby",
  },
  {
    id: 4,
    name: "React Native",
    value: "React Native",
  },
  {
    id: 5,
    name: "PHP",
    value: "PHP",
  },
  {
    id: 6,
    name: "Python",
    value: "Python",
  },
  {
    id: 7,
    name: "Go",
    value: "Go",
  },
  {
    id: 8,
    name: "Swift",
    value: "Swift",
  },
];
export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    name: "",
    email: "",
    password: "",
    errorMessage: null,
    who: "Space Enthusiast",
    shortBio: "",
    topics: [],
    modalVisible: false,
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  renderDropdown = () => {
    const [selectedValues, setSelectedValues] = useState([]);
    return (
      <SearchableDropdown
        options={items}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        label="test dropdown"
        placeholder="Test placeholder"
        inputSize={300}
      />
    );
  };
  handleSignUp = () => {
    if (this.state.name.length <= 0) {
      this.setState({ errorMessage: "Please enter your name." });
    } else if (this.state.shortBio.length <= 0) {
      this.setState({
        errorMessage: "Please enter something in the short bio field.",
      });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((userCredentials) => {
          Fire.shared
            .addUser({
              name: this.state.name,
              email: this.state.email,
              pass: this.state.password,
              who: this.state.who,
              shortBio: this.state.shortBio,
              projects: [],
              topics: this.state.topics,
            })
            .then((userCredentials) => {
              // return userCredentials.user.updateProfile({
              //     displayName: this.state.name
              // })
            })
            .catch((error) => console.log("The error is", error));
          return userCredentials.user.updateProfile({
            displayName: this.state.name,
          });
        })
        .catch((error) => this.setState({ errorMessage: error.message }));
    }
  };
  render() {
    const { modalVisible } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          <StatusBar barStyle="light-content"></StatusBar>
          <Image
            style={{
              alignSelf: "center",
              width: 200,
              height: 100,
              marginTop: 60,
            }}
            source={require("../hyprlnkv2.png")}
          ></Image>
          <TouchableOpacity
            style={styles.back}
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons
              name="ios-arrow-round-back"
              size={32}
              color="black"
            ></Ionicons>
          </TouchableOpacity>
          <Text
            style={styles.greeting}
          >{`Hello.\nSign up to get started.`}</Text>

          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>

          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>Name</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
              ></TextInput>
            </View>
            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Email address</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>
            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              ></TextInput>
            </View>

            {/* {this.renderDropdown()} */}
          </View>
          <View
            style={{ width: 370, marginLeft: 20, marginBottom: 32, zIndex: -1 }}
          >
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                }}
              >
                <View
                  style={{ width: "100%", marginTop: 15, textAlign: "left" }}
                >
                  <View style={styles.modalView}>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          top: hp("-1%"),
                          left: wp("60%"),
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                        }}
                        onPress={() => {
                          this.setModalVisible(!modalVisible);
                        }}
                      >
                        <Ionicons
                          name="ios-close"
                          size={52}
                          color="black"
                        ></Ionicons>
                      </TouchableOpacity>
                      <View
                        style={{
                          alignSelf: "center",
                          borderBottomColor: "#F8E9A1",
                          borderBottomWidth: 5,
                          marginBottom: 15,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            paddingVertical: 5,
                            fontSize: 25,
                            color: "#F76C6C",
                          }}
                        >
                          Terms and Services
                        </Text>
                      </View>
                    </View>
                    <ScrollView>
                      <Text>
                        By using the Stars Within Reach Application you are
                        agreeing to be bound by the following terms and
                        conditions ("Terms of Use"). {"\n"}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 15,
                          color: "black",
                        }}
                      >
                        {"\n"}Responsibilities of the Users:
                      </Text>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users may not share any content that can cause a
                            negative effect on the overall environment of the
                            app
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users may not share anything that would be
                            considered inappropriate
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users may not share anything that targets a specific
                            race, religion or person in a derogatory way
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users should report any content that violates their
                            rights or any content that they believe is unfit for
                            this learning environment
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users may not use the SWR Application for any
                            illegal or unauthorized purpose.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users are responsible for any activity that occurs
                            under your screen name.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users are responsible for keeping their password
                            secure.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users are solely responsible for their conduct and
                            any data, text, information, screen names, graphics,
                            photos, profiles, links ("Content") that they
                            submit, post, and display on the SWR service.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            Users may not modify, adapt or hack Stars Within
                            Reach software or modify another website so as to
                            falsely imply that it is associated with Stars
                            Within Reach.
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 15,
                          color: "black",
                        }}
                      >
                        {"\n"}General Conditions:
                      </Text>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            We reserve the right to modify or terminate the SWR
                            Application for any reason, without notice at any
                            time.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            We reserve the right to refuse service to anyone for
                            any reason at any time.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            We reserve the right to force forfeiture of any
                            username that becomes inactive, violates trademark,
                            or may mislead other users.
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.bullet}>
                          <Text>{"\u2022" + " "}</Text>
                        </View>
                        <View style={styles.bulletText}>
                          <Text>
                            We will remove Content and accounts containing
                            Content that we determine in our sole discretion are
                            unlawful, offensive, threatening, libelous,
                            defamatory, obscene or otherwise objectionable or
                            violates any party's intellectual property or these
                            Terms of Use.
                          </Text>
                        </View>
                      </View>
                      <View style={{ height: 200 }}></View>
                    </ScrollView>
                  </View>
                </View>
              </Modal>

              <TouchableOpacity
                style={styles.openButton}
                onPress={() => {
                  this.setModalVisible(true);
                }}
              >
                <Text
                  style={{
                    lineHeight: 25,
                    paddingHorizontal: 12,
                    marginTop: 25,
                    fontSize: 15,
                    color: "black",
                  }}
                >
                  By signing up you agree to our{" "}
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: "#24305E",
                    }}
                  >
                    Terms and Services
                  </Text>
                  . You can always contact us with any questions.
                </Text>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
            <Text
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: "500",
                textTransform: "uppercase",
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 32 }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={{ color: "#414959", fontSize: 13 }}>
              Already have an account?{" "}
              <Text style={{ fontWeight: "500", color: "#3772ff" }}>Login</Text>
            </Text>
          </TouchableOpacity>
          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 1400,
  },
  greeting: {
    marginTop: 22,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "#24305E",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  error: {
    color: "#F76C6C",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  inputTitle: {
    color: "#24305E",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8a8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D",
    paddingTop: 10,
  },
  longText: {
    borderBottomColor: "#8a8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 80,
    fontSize: 15,
    color: "#161F3D",
  },
  lastInputTitle: {
    color: "#24305E",
    fontSize: 10,
    textTransform: "uppercase",
    marginLeft: 6,
    marginBottom: 5,
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#3772ff",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    flex: 1,
    marginVertical: 4,
  },
  bullet: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  back: {
    position: "absolute",
    top: 40,
    left: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",

    justifyContent: "center",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "auto",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
