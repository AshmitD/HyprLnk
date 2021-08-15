import firebase from "firebase";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
} from "react-native";
import filter from "lodash.filter";
import { topic } from "firebase-functions/lib/providers/pubsub";
import { TouchableOpacity } from "react-native-gesture-handler";
import Fire from "../Fire";
import { user } from "firebase-functions/lib/providers/auth";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: [
        "ASTRONOMY",
        "COMPUTER SCIENCE",
        "DEBATE",
        "ENGINEERING",
        "MED",
        "SOCIAL IMPACT",
        "SPORTS",
      ],
      everyone: [],
      whoToSearchThrough: [],
      filteredData: [],
      keepData: [],
      modalVisible2: false,
      modalForSideBar: false,
      showModalArr: [],
      isModalVisible: false,
      isOpen: true,
      name: "",
      query: "",
      setQuery: "",
      fullData: [],
      setFullData: [],
      isLoading: false,
      error: null,
      setData: [],
      colorOnClick: [
        "white",
        "white",
        "white",
        "white",
        "white",
        "white",
        "white",
      ],
      arrWithAllTopics: [],
    };
    this.fillUsers();
    this.getUserName();
  }
  fillUsers = () => {
    let everyone = [];
    let setData = [];
    const db = firebase.firestore();

    const onReceive = (querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        everyone.push({ projects: doc.data(), id: doc.id });
        // doc.data() is never undefined for query doc snapshots
      });
      setData = everyone;
      this.setState({ everyone, setData });
    };
    db.collection("projects").get().then(onReceive.bind(this));
  };
  handleSearch = (text) => {
    let t = text;
    console.log("This is t", t);
    console.log("these is query", this.state.setQuery);
    const filteredData = filter(this.state.everyone, (club) => {
      return this.contains(club.projects, t);
    });
    this.setState({ setData: filteredData, setQuery: text });
  };
  getUserName = () => {
    Fire.shared
      .getUserData(firebase.auth().currentUser.email)
      .then(({ user }) => {
        this.state.name = user["name"];
      });
  };

  signOutUser = () => {
    firebase.auth().signOut();
  };
  contains = ({ title, descrip, topics }, text) => {
    const formattedQuery = text.toLowerCase();
    console.log("this is name and formatted query", descrip, formattedQuery);
    if (
      title.toLowerCase().includes(formattedQuery) ||
      descrip.toLowerCase().includes(formattedQuery) ||
      topics.toString().toLowerCase().includes(formattedQuery)
    ) {
      return true;
    }
    console.log("these is contains query", this.state.setQuery);
    return false;
  };
  // onClick=(index) => {
  //   let a = this.state.colorOnClick
  //   let newColor = ''
  //   if(a[index]=='white') {
  //     newColor = 'green'
  //   }
  //   else {
  //     newColor = 'white'
  //   }
  //   a[index] = newColor
  //   this.setState({colorOnClick: a})
  //   this.addToTopics()
  // }
  // addToTopics=() =>{
  //   let fullArr = []
  //   for (let i = 0; i < this.state.colorOnClick.length; i++) {
  //     if(this.state.colorOnClick[i]=='green'){
  //       fullArr.push(this.state.userList[i])

  //     }
  //   }
  //   console.log("this is full Arr", fullArr)
  //   this.setState({arrWithAllTopics:fullArr})
  //   console.log("this is arr all topics v4 baby", this.state.arrWithAllTopics)
  //   this.handleFilter()
  // }
  // handleFilter=()=> {

  //     const filteredData = filter(this.state.setData, club => {
  //       console.log("this is arrsbaby", this.state.arrWithAllTopics)
  //       return club.projects.topics.some(r=> this.state.arrWithAllTopics.indexOf(r) >= 0)
  //     });

  //     console.log("this is filtered data", filteredData)
  //     this.setState({setData: filteredData})

  // }

  openModal = () => {
    this.setState({ modalForSideBar: true });
  };

  closeModal() {
    this.setState({ modalForSideBar: false });
  }
  toggleModal() {
    if (this.state.modalForSideBar == true) {
      this.setState({ modalForSideBar: false });
    } else {
      this.setState({ modalForSideBar: true });
    }
  }
  toggle() {
    this.setState({
      modalForSideBar: !this.state.modalForSideBar,
    });
  }

  setModalVisible = (visible, index) => {
    const arr = this.state.showModalArr;
    arr[index] = visible;
    this.setState({ showModalArr: arr });
  };
  renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          padding: 10,
          marginVertical: 10,
          borderRadius: 20,
          width: "100%",
          fontSize: 20,
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={true}
          clearButtonMode="always"
          value={this.state.setQuery}
          onChangeText={(text) => this.handleSearch(text)}
          placeholder="Search"
          style={styles.searchBar}
        />
        <View>
          {/* <View style={styles.container}>
     <TouchableOpacity style={{backgroundColor: this.state.colorOnClick[0]}}  onPress={() => this.onClick(0)}><Text>Click me</Text></TouchableOpacity>
     <TouchableOpacity style={{backgroundColor: this.state.colorOnClick[1]}}  onPress={() => this.onClick(1)}><Text>Click me</Text></TouchableOpacity>
     <TouchableOpacity style={{backgroundColor: this.state.colorOnClick[2]}}  onPress={() => this.onClick(2)}><Text>Click me</Text></TouchableOpacity>
    </View> */}
        </View>
      </View>
    );
  };
  render() {
    console.log("this state name", this.state.name);

    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#5500dc" />
        </View>
      );
    }

    if (this.state.error) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18 }}>
            Error fetching data... Check your network connection!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal
          onBackdropPress={this.closeModal}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          transparent={true}
          visible={this.state.modalForSideBar}
        >
          <View>
            <View
              style={{
                borderBottomColor: "#24305E",
                borderBottomWidth: 2,
                borderRightColor: "#222",
                borderRightWidth: 2,
                paddingTop: hp("5%"),
                paddingHorizontal: 15,
                backgroundColor: "#fff",
                height: "100%",
                width: wp("70%"),
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                  textAlignVertical: "center",
                  paddingTop: 25,
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontSize: 22, color: "#F76C6C" }}>
                  {this.state.name.split(" ")[0]}
                </Text>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    this.toggle();
                  }}
                >
                  <Ionicons
                    size={45}
                    color={"#24305E"}
                    name="ios-close"
                  ></Ionicons>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, color: "#24305E" }}>
                {firebase.auth().currentUser.email}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("MyProfile")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: hp("5%"),
                }}
              >
                <Ionicons
                  size={35}
                  color={"#24305E"}
                  name="ios-person"
                ></Ionicons>
                <Text
                  style={{
                    marginLeft: wp("5%"),
                    fontSize: 20,
                    color: "#24305E",
                  }}
                >
                  My Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("http://thestarswithinreach.com")
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: hp("5%"),
                }}
              >
                <Ionicons
                  size={35}
                  color={"#24305E"}
                  name="ios-information-circle"
                ></Ionicons>
                <Text
                  style={{
                    marginLeft: wp("5%"),
                    fontSize: 20,
                    color: "#24305E",
                  }}
                >
                  About Us
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("http://thestarswithinreach.com/privacy")
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: hp("5%"),
                }}
              >
                <Ionicons
                  size={35}
                  color={"#24305E"}
                  name="ios-paper"
                ></Ionicons>
                <Text
                  style={{
                    marginLeft: wp("5%"),
                    fontSize: 20,
                    color: "#24305E",
                  }}
                >
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.signOutUser}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: hp("5%"),
                }}
              >
                <Ionicons
                  size={35}
                  color={"#24305E"}
                  name="ios-log-out"
                ></Ionicons>
                <Text
                  style={{
                    marginLeft: wp("5%"),
                    fontSize: 20,
                    color: "#24305E",
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.pageHeader}>
          <Text style={styles.text}>Clubs</Text>
          {/* <TouchableOpacity  style = {styles.icon} onPress={() => { console.log("Does it get here?"), this.toggle() }}> */}
          <TouchableOpacity
            onPress={() => {
              console.log("Does it get here?"), this.toggle();
            }}
            style={styles.icon}
          >
            <Ionicons size={36} color={"black"} name="ios-menu"></Ionicons>
          </TouchableOpacity>
          {/* </TouchableOpacity> */}
        </View>
        <FlatList
          ListHeaderComponent={this.renderHeader}
          style={styles.list}
          data={this.state.setData}
          keyExtractor={(item) => item.first}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("ViewProfile", {
                    otherParam: item.projects,
                  })
                }
              >
                <View style={styles.metaInfo}>
                  <View style={styles.avatar}>
                    {!item.projects.image && (
                      <Text
                        style={{
                          fontSize: 25,
                          color: "#3772ff",
                          textAlign: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.projects.title.charAt(0)}
                      </Text>
                    )}
                    {
                      item.projects.image && (
                        <Image
                          source={{ uri: item.projects.image }}
                          style={styles.avatar}
                        ></Image>
                      )

                      /* {this.state.projectNames.length !== 0 &&   <DropDownPicker style={{
                            backgroundColor: '#3772ff',padding: 25, width: '100%',
                            }}
                            items={this.state.projectNames}
                                containerStyle={{height: 40, width: '55%'}}
                                onChangeItem={selectedProjectName => this.setState({ selectedProjectName })}
                          />} */
                    }
                  </View>
                  {console.log("this is item", item)}
                  <View style={styles.infoBlurb}>
                    <Text style={styles.header}>
                      {`${item.projects.title}`}
                    </Text>

                    <Text style={styles.tag}>
                      {`${item.projects.topics
                        .toString()
                        .toUpperCase()
                        .split(",")
                        .join(" · ")}`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    borderRadius: 40,
    borderColor: "#222",
    borderWidth: 2,
    position: "relative",
    marginHorizontal: "auto",
    alignContent: "center",
    shadowColor: "#000",
    fontSize: 16,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontSize: 22,
    color: "#101010",
    fontWeight: "700",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
  },

  hamburger: {},
  icon: {},
  pageHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: hp(5),
    position: "relative",
    padding: 10,
    borderBottomColor: "#222",
    borderBottomWidth: 2,
    width: wp(100),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  list: {
    flexDirection: "column",
    padding: 10,
    width: wp(100),
    position: "relative",
    marginHorizontal: "auto",
  },
  listItem: {
    marginVertical: 10,
    padding: 20,
    alignItems: "flex-start",
    backgroundColor: "#fff",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
    borderRadius: 0,
    height: "auto",
    backgroundColor: "rgba(55, 115, 255, 0.05)",
    borderRadius: 20,
  },
  listItemText: {
    flex: 1,
    fontSize: 18,
  },
  metaInfo: {
    display: "flex",
    flexDirection: "row",
  },
  header: {
    fontSize: 20,
    textAlign: "left",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 1000,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#222",
    borderWidth: 3,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  infoBlurb: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: wp(54.5),
    left: 10,
  },
  header: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 22,
  },
  tag: {
    textAlign: "center",
    marginVertical: 10,
    textTransform: "capitalize",
    fontWeight: "500",
    fontSize: 16,
  },
});
