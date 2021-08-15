import React from 'react';

import { View, TouchableHighlight, Modal, Text, SafeAreaView, TextInput, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity, LayoutAnimation, ShadowPropTypesIOS } from 'react-native'
import firebase from "firebase"
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import Fire from '../Fire'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Alert } from 'react-native'
//TODO Add sorting for the messages, enable push notifications
export default class HomeScreen extends React.Component {


  constructor() {
    super()

    this.state = {
      chats: [],
      modalVisible: false,
      numReadMessages: [],
    }
    Fire.shared.getUserData(firebase.auth().currentUser.email).then(({ user }) => {
      console.log("hi", firebase.auth().currentUser.email)
      const chatIDs = user["messageIDs"]
      console.log("this is chatids", chatIDs)
      this.getEmail(chatIDs).then(() => {
        console.log("Do you get here")
        this.sort()
      })
      console.log("Do you get here")
     
    })
  }

  // TODO RENAME THIS METHOD need to change this logic im dumb
  getEmail = chatIDs => {
    const promises = [];
    console.log("is it getting here?")
    for (let i = 0; i < chatIDs.length; i++) {
      // Problem with i for multichats
      const chatID = chatIDs[i]
      console.log("This is one id", chatID)
      const promise = firebase.database().ref('/messages/specificChatss/' + chatID).once('value').then((snapshot) => {
        var everything = (snapshot.val()) || 'Anonymous'
        if(everything['groupChat'] == true) {
          this.setState({ chats: this.state.chats.concat({ id: chatID, newestMessage: everything['newestMessage'], name: everything['name'] }) })
        } else {
        const email1 = everything["email1"]
        console.log("this is the email", email1, "this is chatttt", chatIDs[i])
        if (email1 != firebase.auth().currentUser.email) {
          return Fire.shared.getUserData(email1).then(({ user }) => {
            this.setState({ chats: this.state.chats.concat({ id: chatID, newestMessage: everything['newestMessage'], name: user["name"] }) })
          })
        } else {
          return Fire.shared.getUserData(everything["email2"]).then(({ user }) => {
            this.setState({ chats: this.state.chats.concat({ id: chatID, name: user.name, newestMessage: everything['newestMessage'] }) })
          })
        }
      }

      }).catch(() => {
        console.log("this is the erroror")
      })
      promises.push(promise);
    }

    return Promise.all(promises);
  }
  fillReadMessages = () => {
    let arr = []
    this.state.chats.forEach(chat => {
      everyone.push({ 'projects': doc.data(), 'id': doc.id })
      // doc.data() is never undefined for query doc snapshots
  });
  }
  sort = () => {
    const temp = this.state.chats
    console.log('himh', temp)
    temp.sort((a, b) => {
      console.log("This is aa", a, '\n this is bb', b)
      if(a.newestMessage == undefined) {
        return 1
      }
      if(b.newestMessage == undefined) {
        return -1
      }
      if (a.newestMessage.timestamp > b.newestMessage.timestamp) {
        return -1
      }
      else {
        return 1
      }
    })
    console.log('tempowawy', temp)
    this.setState({ chats: temp })

  }
  signOutUser = () => {
    firebase.auth().signOut()
  }
  renderChat = chat => {
    console.log("this is chat not owrking", chat)

    let chars = chat.name.split(" ")[0].substring(0, 1)
    if (chat.name.split(" ").length > 1) {
      chars += chat.name.split(' ')[1].substring(0, 1)
    }
    return (
      <View style={styles.feedItem}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatScreen', {
          "id": chat["id"], "name": chat["name"], "newestMessage": {chat}
        })} style={{ marginTop: 0 }}>
          <View style={styles.chatContainer}>
            <View style={styles.chatProfile}>
              <View style={{
                height: 60,
                width: 60,
                backgroundColor: "#3772ff",
                borderRadius: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#080708"
              }}><Text style={{ color: "white", fontSize: 20, }}>{chars}</Text></View>
            </View>
            <View style={styles.chatContent}>
              <Text style={styles.name}>{chat['name']}</Text>
             {chat.newestMessage !== undefined && <Text style={styles.message}>{chat.newestMessage.text}</Text>}
            </View>
            <View style={styles.chatNotifications}>
             {chat["newestMessage"]["user"]["email"] !== firebase.auth().currentUser.email &&  chat["newestMessage"]["seenByUserThatDidntSend"]== false &&  <View style={{
                alignItems: "center",
                justifyContent: "center",
                height: 30,
                width: 30,
                backgroundColor: "#3772ff",
                borderRadius: "100%",
              }}>
               <Text style={styles.chatNotificationsText}>1</Text>
              </View> }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {

    LayoutAnimation.easeInEaseOut()
  

    LayoutAnimation.easeInEaseOut()
   
    return (
      <View style={styles.container}>
        <View style={styles.header}>
     
          <View style={styles.linesContainer}>
            <Text style={styles.heading}>Chat</Text>
          
          </View>
        </View>

        <View style={styles.mainContainer}>
             {/* <TouchableOpacity onPress={this.signOutUser} style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp("5%") }}><Ionicons size={35} color={""} name="ios-log-out"></Ionicons><Text style={{ marginLeft: wp('5%'), fontSize: 20, color: "#24305E" }}>Logout</Text></TouchableOpacity> */}
          {this.state.chats.length == 0 && <View style={{ alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', color: "#F8E9A1", fontSize: 20, paddingHorizontal: 25, marginTop: "25%" }}>"Click on anyone's name to start                         chat!!"</Text>
          </View>}
          {this.state.chats && <FlatList
            style={styles.feed}
            data={this.state.chats}
            renderItem={({ item }) => this.renderChat(item)}
            keyExtractor={item => item}
            showsVerticalScrollIndicator={false}
          />}

        </View>
      </View>
    )

  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row-reverse",
  
   alignSelf: "center",
   marginTop: hp(5),
   position: 'relative',
   padding: 10,
   borderBottomColor: '#222',
   borderBottomWidth: 2, 
   width: wp(40),
   alignItems: 'center',
   justifyContent: 'space-between',
   paddingHorizontal: 40,
   marginHorizontal: "auto",
   marginBottom: 20,
  },
  linesContainer: {
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  plus: {
    position: "absolute",
    right: 20,
  },
  mainContainer: {
    width: "100%",
  },
  heading: {
    fontSize: 22,
    color: '#101010',
    fontWeight: '700',
    width: "100%",
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  chatContainer: {
    borderBottomWidth: 2,
    borderColor: "#080708",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 100,
    position: "relative",
  },
  chatProfile: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  chatContent: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 18,
    marginVertical: 5,
  },
  message: {
    fontSize: 14,
    marginVertical: 5,
  },
  chatNotifications: {
    position: "absolute",
    right: 20,
  },

  chatNotificationsText: {
    color: "#fff",
  },
})