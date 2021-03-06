import React from "react";
import {
  View,
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
import DropDownPicker from "react-native-dropdown-picker";
import CustomMultiPicker from "react-native-multiple-select-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
var userList = [
  "ASTRONOMY",
  "COMPUTER SCIENCE",
  "DEBATE",
  "ENGINEERING",
  "MED",
  "SOCIAL IMPACT",
  "SPORTS",
];
export default class AddClub extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      descrip: "",
      name: "g",
      error: null,
      topics: [],
      numStudents: null,
      signUp: "",
    };
    //  this.fillUser()
  }
  //    componentDidMount() {
  //     //this.fillUser = this.fillUser.bind(this);
  // }
  // fillUser = () => {
  //     Fire.shared.getUserData(firebase.auth().currentUser.email).then((user, id) => {
  //         console.log('this is user', user)
  //         this.setState({name: user.name})
  //     })

  //   }

  handleSignUp = () => {
    if (this.state.descrip.length == 0) {
      Alert.alert("Please describe your group.");
    } else if (this.state.topics.length == 0) {
      Alert.alert("Please enter some topics.");
    } else {
      return Fire.shared
        .addProject({
          title: this.state.title,
          descrip: this.state.descrip,
          topics: this.state.topics,
          name: this.state.name,
          numStudents: this.state.numStudents,
          signUpLink: this.state.signUp,
        })
        .then((userCredentials) => {
          const { params } = this.props.navigation.state;

          this.props.navigation.navigate("Home");

          // return userC$redentials.user.updateProfile({
          //     displayName: this.state.name
          // })
        })
        .catch((error) => Alert(error))
        .then(() => {});
    }
  };
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {/* <Image style = {{left: 305, width: 100, height: 100, marginTop: 2}}source ={require('../forreallogo.png')}></Image> */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.back}
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Ionicons
                name="ios-arrow-round-back"
                size={24}
                color="#3772ff"
                onPress={() => this.props.navigation.navigate("Home")}
              ></Ionicons>
            </TouchableOpacity>
            <Text style={styles.heading}>Add Club</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.errorMessage}>
              {this.state.errorMessage && (
                <Text style={styles.error}>{this.state.errorMessage}</Text>
              )}
            </View>

            <View style={styles.form}>
              <View style={{ marginTop: -35 }}>
                <Text style={styles.inputTitle}>Name of Club</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(title) => this.setState({ title })}
                  value={this.state.title}
                ></TextInput>
              </View>

              <View style={{ marginTop: 32 }}>
                <Text style={styles.inputTitle}>100 word description</Text>
                <TextInput
                  style={styles.longText}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(descrip) => this.setState({ descrip })}
                  value={this.state.descrip}
                ></TextInput>
              </View>

              <View style={{ marginTop: 32 }}>
                <Text style={styles.inputTitle}>
                  Number of Current Students
                </Text>
                <TextInput
                  style={styles.longText}
                  keyboardType="numeric"
                  multiline={true}
                  numberOfLines={1}
                  onChangeText={(numStudents) => this.setState({ numStudents })}
                  value={this.state.resources}
                ></TextInput>
              </View>

              <View style={{ marginTop: 32 }}>
                <Text style={styles.inputTitle}>Sign Up Link:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(signUp) => this.setState({ signUp })}
                  value={this.state.signUp}
                ></TextInput>
              </View>
            </View>
            <View
              style={{
                width: 370,
                marginLeft: 20,
                marginBottom: 32,
                zIndex: -1,
              }}
            >
              <Text style={styles.lastInputTitle}>
                What category describes your club?
              </Text>
              <CustomMultiPicker
                options={userList}
                multiple={true}
                returnValue={"label"} // label or value
                callback={(res) => {
                  this.setState({ topics: res });
                }} // callback, array of selected items
                rowHeight={40}
                rowRadius={5}
                iconColor={"#3772ff"}
                iconSize={25}
                selected={[]}
                selectedIconName={"ios-checkmark-circle-outline"}
                scrollViewHeight={130}
                //selected={[1,2]} // list of options which are selected by default
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
              <Text style={{ color: "white" }}>CREATE GROUP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollContainer: {
    height: "100%",
    width: "100%",
  },
  back: {
    width: 50,
    height: 50,
    alignItems: "center",
    zIndex: 500,
    left: wp(5),
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 50,
    color: "#fff",
  },
  arrow: {
    width: 50,
    height: 50,
    alignItems: "center",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 50,
    color: "#3772ff",
  },

  header: {
    backgroundColor: "#3772ff",
    width: wp(100),
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    height: 130,
    flexDirection: "row",
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
    fontSize: 22,
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
    alignSelf: "center",
    marginLeft: wp(-13),
  },
  greeting: {
    marginTop: 102,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    paddingLeft: 15,
    paddingRight: 15,
    color: "#F76C6C",
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
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  inputTitle: {
    color: "black",
    fontSize: 14,
    textTransform: "uppercase",
  },

  input: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "black",
    paddingTop: 10,
  },
  longText: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 80,
    fontSize: 15,
    color: "#161F3D",
  },
  lastInputTitle: {
    color: "black",
    fontSize: 13,
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
});
