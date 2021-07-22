import React from 'react';
import { View, Linking, Button, TouchableHighlight, TouchableNativeFeedback, Modal, Text, SafeAreaView, TextInput, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity, LayoutAnimation, ShadowPropTypesIOS, TouchableHighlightBase } from 'react-native'
import * as firebase from "firebase"
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient'
import db from "firebase"
import Fire from '../Fire'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Alert } from 'react-native'
import SideMenu from 'react-native-side-menu';
import Menu from '../Menu';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export default class HomeScreen extends React.Component {

  constructor() {
    super()

    const orderedDocs = []
    const promises = []
    this.state = {
      posts: [],
      colors: ["#FFF", "#F8E9A1"],
      modalVisible2: false,
      modalForSideBar: false,
      showModalArr: [],
      isModalVisible: false,
      isOpen: true,
      name: ''
    }

    Fire.shared.getUserData(firebase.auth().currentUser.email)
      .then(({ user }) => {
        const blockArr = user["block"];
        this.state.name = user['name']
        // TODO MOVE THIS LOGIC TO THE FIRE CLASS DONT BE GARBGE
        firebase.firestore().collection("posts").orderBy("timestamp", "desc")
          .get().then((querySnapshot) => {

            const promises = querySnapshot.docs.map((doc, i) => {
              const post = doc.data()

              return Fire.shared.getUserData(post["email"])
                .then(({ user }) => {
                  post.user = user

                  orderedDocs[i] = { ...post, id: doc.id }

                })
            })
            return Promise.all(promises)
          })
          .then(() => {

            const filteredPosts = orderedDocs.filter((post) => {
              this.state.showModalArr.push(false)
              return !blockArr.includes(post["email"]);
            });
            const withKey = filteredPosts.map(post => ({
              ...post,
              key: post.id
            }));
            this.setState({ posts: withKey });
            // doc.data() is never undefined for query doc snapshots
          });
      })
  }
  toggleModal() {
    if (this.state.modalForSideBar == true) {
      this.setState({ modalForSideBar: false })
    } else {

      this.setState({ modalForSideBar: true })

    }
  }
  toggle() {
    this.setState({
      modalForSideBar: !this.state.modalForSideBar,
    });
  }

  setModalVisible = (visible, index) => {
    const arr = this.state.showModalArr
    arr[index] = visible
    this.setState({ showModalArr: arr });
  }
  signOutUser = () => {
    firebase.auth().signOut()
  }
  blockUser = (email) => {
    Fire.shared.addBlock(email)
      .then(userCredentials => {
        alert(`User blocked`)
      })
      .catch(error => console.log("The error is", error)
      )
  }

  getUser = (email) => {
    Fire.shared.getUserData(email)
      .then(({ user }) => {
        return user
      })
  }

  openModal = () => {
    this.setState({ modalForSideBar: true });
  }

  closeModal() {
    this.setState({ modalForSideBar: false });
  }


  renderPost = (post, index) => {

    let name = post.name
    name = name.split(' ')[0]
    const modalVisible2 = this.state.showModalArr[index];
    const colorIndex = index % 2
    const oppColorIndex = (1 - (index % 2))
    let chars = post.name.split(" ")[0].substring(0, 1)
    if (post.name.split(" ").length > 1) {
      chars += post.name.split(' ')[1].substring(0, 1)
    }
    // const ref = firebase.storage().ref(post.image);
    //const url =  ref.getDownloadURL();

    {
      return (

        <View style={{
          height: "auto",
          width: "95%",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 50,
          alignSelf: 'center',
          backgroundColor: "white",
          paddingVertical: 20,
          marginVertical: 10,
          borderRadius: 3,
          borderBottomColor: 'black', borderBottomWidth: 2

        }}>

          <View style={{ flexDirection: 'row', marginRight: 20, paddingLeft: '5%', }}>
            <View style={{ width: 50, borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: "100%", backgroundColor: "#3772ff", height: 50 }}>
              <Text style={{ color: "white", textAlign: 'center', zIndex: 55 }}>{chars}</Text>
            </View>
            <View style={{ marginLeft: 20, flexDirection: 'column' }}>

              <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewProfile', {
                  otherParam: post.user
                })}><Text style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: '#3772ff',
                  marginBottom: 5
                }}>{name}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewProfile', {
                  otherParam: post.user
                })}><Text style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: '#24305e',
                  marginBottom: 5,

                }}> from {post.projectName}</Text></TouchableOpacity>
              </View>

              <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
            </View>

            <TouchableOpacity
              style={styles.openButton}
              onPress={() => {
                this.setModalVisible(true, index);
              }}
            >
              <Ionicons name="ios-more" color="#3772ff" size={24} style={{ transform: [{ rotate: "90deg" },], left: 15, position: 'absolute' }}></Ionicons>
            </TouchableOpacity>

            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                animationIn="slideInUp"
                animationInTiming="300"

                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                }}
              >

                <View style={styles.centeredView}>
                  <View style={styles.modalView}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Report', {
                      otherParam: post,
                    })}>
                      <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 5, fontWeight: "700", color: "#F76C6C", overflow: "hidden", borderRadius: 10, backgroundColor: "#F8E9A1", paddingVertical: 15, textAlignVertical: 'center', width: 250, }}>REPORT THIS POST</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 15 }} onPress={() => {

                      this.props.navigation.navigate('ReportUser', {
                        otherParam: post,
                      })
                    }}>
                      <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 5, fontWeight: "700", color: "#F76C6C", overflow: "hidden", borderRadius: 10, backgroundColor: "#F8E9A1", paddingVertical: 15, textAlignVertical: 'center', width: 250, }}>REPORT THIS USER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 15 }} onPress={() => this.blockUser(post["email"])}>
                      <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 5, fontWeight: "700", color: "#F76C6C", overflow: "hidden", borderRadius: 10, backgroundColor: "#F8E9A1", paddingVertical: 15, textAlignVertical: 'center', width: 250, }}>BLOCK THIS USER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ marginTop: 15, borderBottomColor: "#24305E", borderBottomWidth: 3 }}
                      onPress={() => {
                        this.setModalVisible(!modalVisible2, index);
                      }}
                    >
                      <Text style={{ color: "#24305E" }}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>


            </View>
            {/* <TouchableHighlight
                  style={styles.openButton}
                  onPress={() => {
                    this.setModalVisible(true, index);
                  }}
                > <Ionicons name="ios-more" color="#0a0f21" size={36}></Ionicons>
                </TouchableHighlight> */}
          </View>
          {/* Post */}
          {post.image != " " &&

            <Image
              style={styles.image}
              source={{
                uri: post.image
              }}
            />

          }


          {/* Post content /text */}
          <View style={{ position: "relative", flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start', height: "auto", width: "100%", position: 'relative' }}>
            <View style={{ height: "auto", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", }}>
              <Image style={{ width: 40, height: 40, marginRight: 20, }} source={require('../Components/rocketing.png')}></Image>
              {/* <Ionicons name="ios-rocket" size={30} color="pink" style={{ marginRight: 16 }} /> */}
            </View>

            <Text style={{ width: "80%", color: "#24305E", fontSize: 16 }}>{post.text}</Text>

          </View>
          {/* <LinearGradient
    colors={['#24305E', '#F76C6C']}
    start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
    style={{ marginTop: 15,height: 0.75, width: "98%", alignSelf: 'center',alignItems: 'center', justifyContent: 'center'}}
></LinearGradient> */}



        </View>
      )
    }
  }

  render() {

    LayoutAnimation.easeInEaseOut()

    return (
      <View style={styles.container}>
  
        <Modal
          onBackdropPress={this.closeModal}
          animationIn="slideInLeft"
          animationOut='slideOutRight'

          transparent={true}
          visible={this.state.modalForSideBar}
        >
          <View>
            <View style={{ borderBottomColor: "#24305E", borderBottomWidth: 2, borderRightColor: "#222", borderRightWidth: 2, paddingTop: hp("5%"), paddingHorizontal: 15, backgroundColor: '#fff', height: '100%', width: wp('70%') }}>
              <View style={{ alignItems: 'center', justifyContent: 'flex-start', textAlignVertical: 'center', paddingTop: 25, flexDirection: 'row' }}>
                <Text style={{ fontSize: 22, color: "#F76C6C" }}>{this.state.name.split(" ")[0]}</Text>
                <TouchableOpacity style={{ position: "absolute", top: "2.5%", right: 20, }} onPress={() => { this.toggle() }}><Ionicons size={45} color={"#24305E"} name="ios-close"></Ionicons></TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, color: "#24305E" }}>{firebase.auth().currentUser.email}</Text>


              <TouchableOpacity onPress={() => this.props.navigation.navigate("MyProfile")} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"#24305E"} name="ios-person"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "#24305E" }}>My Profile</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('http://thestarswithinreach.com')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"#24305E"} name="ios-information-circle"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "#24305E" }}>About Us</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('http://thestarswithinreach.com/privacy')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"#24305E"} name="ios-paper"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "#24305E" }}>Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity onPress={this.signOutUser} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"#24305E"} name="ios-log-out"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "#24305E" }}>Logout</Text></TouchableOpacity>
             
            </View>

          </View>
        </Modal>

        {/* <View style ={{backgroundColor: "#F76C6C", paddingBottom: hp('0.95%'),justifyContent: 'center',flexDirection: 'row', width: '100%',alignItems: 'center'}}>
       
     
          <Text style={{  paddingTop: '5%', fontSize: 28, textTransform: 'uppercase', fontStyle: 'normal', fontWeight: '600', color: "#F8E9A1", alignSelf: 'center' }}>Feed</Text>
          
         <TouchableOpacity onPress ={() => this.props.navigation.navigate("CreatePost")}style={{  paddingTop:'5%', left: "200%" }}><Ionicons size={36} style = {{fontWeight: "800"}}color={"#24305E"}  name="ios-add-circle-outline"></Ionicons></TouchableOpacity>
    
   

        </View> */}
        <View style={styles.header}>
     
          <View style={styles.linesContainer}>
            <TouchableOpacity style={{
              position: "absolute",
              left: 20,
            }} onPress={() => { console.log("Does it get here?"), this.toggle() }}><Ionicons size={36} color={"white"} name="ios-menu"></Ionicons></TouchableOpacity>
            <Text style={styles.heading}>FEED</Text>
            <View style={styles.plus}><TouchableOpacity onPress={() => this.props.navigation.navigate('CreatePost')}><Ionicons name="md-add-circle-outline" size={32} color={"#fff"} /></TouchableOpacity></View>
          </View>
        </View>
        
        <View style={styles.content}>
          {/* <TouchableOpacity onPress={() => this.props.navigation.navigate("CreatePost")} style={{ alignSelf: 'center', marginVertical: 15 }}>
          <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 5, fontWeight: "700", color: "#23405E", overflow: "hidden", borderRadius: 10, color: "#F8E9A1", backgroundColor: "#F76C6C", paddingVertical: 15, textAlignVertical: 'center', width: 250, }}>CREATE A POST</Text>
        </TouchableOpacity> */}
          <FlatList
            style={{ height: '100%'}}
            data={this.state.posts}
            renderItem={({ item, index }) => this.renderPost(item, index)}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>


      </View>

      /* <TouchableOpacity style ={{marginTop: 32}} onPress = {this.signOutUser}>
            <Text>Logout</Text>
                </TouchableOpacity> */

    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    justifyContent: "flex-end",
    flex: 0.75,
    paddingBottom: 40,
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
    right: 20,
  },
  content: {
    flex: 6,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
    top: -30,
    height: '100%'
  },
  heading: {
    fontSize: 30,
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingHorizontal: 20,
    marginBottom: 5,
    color: "#fff",
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    alignItems: 'center', justifyContent: 'center',
    position: "absolute",
    alignSelf: 'center',
    borderRadius: 20,
    marginLeft: '94%',
    marginTop: '-5%',
    width: 50,
    zIndex: 500000,
    height: 50

  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  feed: {
    backgroundColor: 'white',


  },
  feedItem: {

    flexDirection: 'column',

    textAlign: 'left',
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    width: wp('100%'),
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    borderTopWidth: 4,
    borderTopColor: "#ddd",
  },

  timestamp: {
    fontSize: 15,
    fontWeight: "500",
    color: "#24305E",
    fontStyle: 'italic'
  },
  postss: {
    marginTop: 16,
    fontSize: 14,
    color: "#24305E"
  },
  image: {
    width: "95%",
    height: 300,
    marginTop: hp("2%"),
    alignSelf: 'center'

  },

})