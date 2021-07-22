import React from 'react'
import { View, Modal, TouchableHighlight, FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import CustomMultiPicker from "react-native-multiple-select-list";
import firebase from 'firebase'
import Fire from '../Fire'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const userList = {
//     "student": "Student",
//     "prof": "Professional",
//     "org": "Organization"
// }
export default class FindChat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            everyone: [],
            whoToSearchThrough: [],
            filteredData: [],
            keepData: [],
            modalVisible2: false,
            modalForSideBar: false,
            showModalArr: [],
            isModalVisible: false,
            isOpen: true,
            name: ''
        }
        this.fillUsers()
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
    
    
    handleChat = (email, name) => {
        // this.state.user.email
        // firebase.auth().current.user.email
        console.log("This is email in handle", email, firebase.auth().currentUser.email)
        Fire.shared.addChat({ "email1": email, "email2": firebase.auth().currentUser.email }).then((thisID) => {
            console.log("this is id in handle chat", thisID)
            this.props.navigation.navigate('ChatScreen', {
                "id": thisID, "name": name
            })
        })
    }
    filterData = (users, keep) => {
        console.log("thes are the length", users.length);
        console.log("This is dataaa and keep", users.filter(keep));

        return users.filter(users.data)
    }

    fillUsers = () => {
        let everyone = []
        console.log("this is who to search through?", this.state.whoToSearchThrough)
        const db = firebase.firestore();
        console.log("herehehrehrhehr?")
        const onReceive = (querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                everyone.push({ 'user': doc.data(), 'id': doc.id })
                // doc.data() is never undefined for query doc snapshots
            });
            console.log("this is everyone in fillUsers", everyone)
            this.setState({ everyone })

        }
        db.collection("users").get()
            .then(onReceive.bind(this));
    }
    renderUser = user => {
        console.log("hellenr")
        let chars = user.user.name.split(" ")[0].substring(0, 1)
        if (user.user.name.split(" ").length > 1) {
            chars += user.user.name.split(' ')[1].substring(0, 1)
        }
        return (
            <View style={styles.showContainer}>


                <View style={styles.showAvatar}>
                    <Text style={styles.showAvatarText}>{chars}</Text>
                </View>

                <Text style={styles.showName}>{user.user['name']}</Text>
                <Text style={styles.showBio}>{user.user['shortBio']}</Text>

                <TouchableOpacity onPress = {() => {this.handleChat(user.user.email,user.user.name)}}><Text style={styles.showChat}>Chat Now</Text></TouchableOpacity>
            </View>
        )
    }


    render() {

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
            <View style={{ borderBottomColor: "white ", borderBottomWidth: 2, borderRightColor: "#222", borderRightWidth: 2, paddingTop: hp("5%"), paddingHorizontal: 15, backgroundColor: '#fff', height: '100%', width: wp('70%') }}>
              <View style={{ alignItems: 'center', justifyContent: 'flex-start', textAlignVertical: 'center', paddingTop: 25, flexDirection: 'row' }}>
                <Text style={{ fontSize: 22, color: "#F76C6C" }}>{this.state.name.split(" ")[0]}</Text>
                <TouchableOpacity style={{ position: "absolute", top: "2.5%", right: 20, }} onPress={() => { this.toggle() }}><Ionicons size={45} color={"white"} name="ios-close"></Ionicons></TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, color: "white" }}>{firebase.auth().currentUser.email}</Text>


              <TouchableOpacity onPress={() => this.props.navigation.navigate("MyProfile")} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"white"} name="ios-person"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "white" }}>My Profile</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('http://thestarswithinreach.com')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"white"} name="ios-information-circle"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "white" }}>About Us</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('http://thestarswithinreach.com/privacy')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"white"} name="ios-paper"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "white" }}>Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity onPress={this.signOutUser} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={"white"} name="ios-log-out"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "white" }}>Logout</Text></TouchableOpacity>
             
            </View>

          </View>
        </Modal>

<View style={styles.header}>
          <View style={styles.linesContainer}>
          <TouchableOpacity style={{
              position: "absolute",
              left: 20,
            }} onPress={() => { console.log("Does it get here?"), this.toggle() }}><Ionicons size={36} color={"white"} name="ios-menu"></Ionicons></TouchableOpacity>
            {/* <TouchableOpacity style={{
              position: "absolute",
              left: 20,
            }} onPress={() => { this.props.navigation.navigate('Chat')}}><Ionicons size={36} color={"#3772ff"}  name="ios-arrow-round-back" ></Ionicons></TouchableOpacity> */}
            <Text style={styles.heading}>FIND CHAT</Text>
          
          </View>
        </View>
                <View style={styles.content}>
        
                    
                    {this.state.everyone.length !== 0 && <FlatList
                        style={styles.feed}
                     //   data={this.filterData(this.state.everyone, this.state.whoToSearchThrough)}
                         data={this.state.everyone}
                        renderItem={({ item }) => {
                            console.log("hi in crap format");
                            return this.renderUser(item);
                        }}
                        extraData={this.state.everyone}
                        showsVerticalScrollIndicator={false}
                    />}

                </View>
            </View>
        )


    }






}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        textAlignVertical: 'center',
        width: "100%",
    },
    header: {
        backgroundColor: "#fff",
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
        paddingTop: '8%',      
        flex: 6,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        width: "100%",
        backgroundColor: "white",
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
        color: "#3772ff",
      },
    
    feed: {
        height: 'auto',
        marginBottom: 0
    },
    showContainer: {
        flexDirection: "column",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    showAvatar: {
        height: 80,
        width: 80,
        borderRadius: 100,
        flexDirection: "column",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        marginBottom: 5,
    },
    showAvatarText: {
        fontSize: 25,
    },
    showName: {
        textTransform: "capitalize",
        fontSize: 24,
        fontWeight: "600",
        color: "black",
        marginVertical: 5,
    },
    showBio: {
        fontSize: 18,
        color: "#fff",
        textAlign: 'center'
    },
    showChat: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#000",
        marginVertical: 20,
        color: "white",
        fontSize: 16,
    },

})
