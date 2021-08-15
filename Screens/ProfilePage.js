import React from "react";
import {
  View,
  Image,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import Fire from "../Fire";

import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { widthPercentageToDP } from "react-native-responsive-screen";
export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      name: "",
      shortBio: "",
      who: "",
      topics: [],
      allProjects: [],
      defaultIndex: -1,
    };
    this.fillUser();
    this.getProjects();
  }

  getProjects = () => {
    Fire.shared.getProjs(firebase.auth().currentUser.email).then((projects) => {
      this.setState({ allProjects: projects });
    });
  };
  deleteProject = (proj) => {
    Alert.alert(
      "Delete Project?",
      "This action cannot be reverted",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => Fire.shared.delProj(proj) },
      ],
      { cancelable: false }
    );
  };
  renderProj = (project) => {
    console.log("This is the project", project);
    return (
      <View
        style={{
          backgroundColor: "#fff",
          textAlign: "center",
          padding: 10,
          minWidth: widthPercentageToDP(50),
          borderRadius: 20,
          alignSelf: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("CreateProject", {
              otherParam: project,
            })
          }
          style={{
            padding: 20,
            backgroundColor: "#222",
            borderRadius: 20,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#fff",
            }}
          >
            Edit {project.proj.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  fillUser = () => {
    Fire.shared
      .getUserData(firebase.auth().currentUser.email)
      .then((user, id) => {
        console.log("this is th euser");
        this.setState(user);
        this.setState({ name: user.user["name"] });
        this.setState({ shortBio: user.user["shortBio"] });
        this.setState({ who: user.user["who"] });
        this.setState({ topics: user.user["topics"] });
        const allTopics = ["Organization", "Professional", "Student"];
        const defaultI = allTopics.indexOf(user.user.who);
        console.log("this is default", defaultI);
        this.setState({ defaultIndex: defaultI });
      });
  };

  // saveFromPfp = () => {
  //   console.log("This is who after drop", this.state.who)
  //   Fire.shared.save({ 'name': this.state.name, 'shortBio': this.state.shortBio, 'who': this.state.who.label, 'topics': this.state.topics })
  // }

  signOutUser = () => {
    firebase.auth().signOut();
  };
  render() {
    console.log("this is the user", this.state.user, this.state.allProjects);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text
              style={{
                fontSize: 35,
                color: "#3772ff",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              {this.state.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>{this.state.name}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contentTitle}>Clubs by you</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("AddClub", {
                ow: 5,
                hello: () => {
                  console.log("bro");
                  return Promise.resolve();
                },
              })
            }
            style={styles.clubButton}
          >
            <Text style={styles.clubButtonText}>Add Club</Text>
          </TouchableOpacity>
          <FlatList
            style={styles.list}
            keyExtractor={(item) => item.id}
            data={this.state.allProjects}
            renderItem={({ item }) => this.renderProj(item)}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      // <View style={styles.container}>
      //   <View style={styles.header}>
      //     <View style={styles.linesContainer}>
      //       <TouchableOpacity style={{
      //         position: "absolute",
      //         left: 20,
      //       }} onPress={() => { console.log("Does it get here?"), this.toggle() }}><Ionicons size={36} color={"white"} name="ios-menu"></Ionicons></TouchableOpacity>
      //       <Text style={styles.heading}>FEED</Text>
      //       <View style={styles.plus}><TouchableOpacity onPress={() => this.props.navigation.navigate('CreatePost')}><Ionicons name="md-add-circle-outline" size={32} color={"#fff"} /></TouchableOpacity></View>

      //     </View>
      //     <View style={styles.profile}>
      //       <View style={styles.avatar}>
      //         <Text style={styles.avatarText}>AS</Text>
      //       </View>
      //     </View>
      //     </View>
      //     <View style={styles.content}>
      //       <TextInput style={styles.type} onChangeText={who => this.setState({ who })} value={this.state.who}></TextInput>

      //     <View style={styles.bio}>
      //       <TextInput style={styles.bioContent} onChangeText={shortBio => this.setState({ shortBio })} value={this.state.shortBio}></TextInput>
      //     </View>

      /* <FlatList
        keyExtractor={item => item.id}
        data={this.state.allProjects}
        renderItem={({ item }) => this.renderProj(item)}
        showsVerticalScrollIndicator={false} />
      {this.state.defaultIndex !== -1 && <DropDownPicker
        items={[
          { label: 'Organization', value: 'Organization' },
          { label: 'Professional', value: 'Professional' },
          { label: 'Student', value: 'Student' },

        ]}
        defaultIndex={this.state.defaultIndex}
        containerStyle={{ height: 40 }}
        onChangeItem={who => this.setState({ who })}
      />} */
      /* <TouchableOpacity onPress={() => this.saveFromPfp()}>

        <Text style={{ color: 'white' }}>Save</Text>
      </TouchableOpacity>
      </View>
   
  </View> */
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  back: {
    width: 35,
    height: 35,
    alignItems: "center",
    top: "10%",
    right: "20%",
  },
  content: {
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
    zIndex: -1,
    padding: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    height: "auto",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#222",
    width: widthPercentageToDP(100),
    marginBottom: 10,
    backgroundColor: "#fff",
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 0,
    paddingHorizontal: 20,
    marginVertical: 25,
    color: "#000",
    fontWeight: "500",
    width: "100%",
    textAlign: "center",
  },
  clubButton: {
    padding: 20,
    backgroundColor: "#3772ff",
    borderRadius: 20,
    width: "80%",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clubButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 21,
  },
  contentTitle: {
    fontSize: 26,
    textTransform: "uppercase",
    letterSpacing: 0,
    paddingHorizontal: 20,
    color: "#222",
    fontSize: 22,
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 20,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    width: widthPercentageToDP(100),
    height: "auto",
  },
});
