import React from 'react'
import { View, Modal, TouchableHighlight,FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import firebase from 'firebase'
import Fire from '../Fire'

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class OneProjectScreen extends React.Component {
    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state;
        const currProjectID = params ? params.otherParam : null;
        const orderedDocs = []
       // ADD MULTI MODAL CRAP HERE
        this.state = {
            orderedDocs: [],
            projectID: currProjectID,
            projectContent: {},
            showModalArr: []
        }
        firebase.firestore().collection('projects').doc(currProjectID).get().then((doc) => {
            this.setState({ projectContent: doc.data() })

        })
        Fire.shared.getUserData(firebase.auth().currentUser.email)
        .then(({ user }) => {
          const blockArr = user["block"];
  
          // TODO MOVE THIS LOGIC TO THE FIRE CLASS DONT BE GARBGE
          firebase.firestore().collection("projects").doc(currProjectID).collection("projectPosts").orderBy("timestamp", "desc")
            .get().then((querySnapshot) => {
  
              const promises = querySnapshot.docs.map((doc, i) => {
                const design = doc.data()
  
                return Fire.shared.getUserData(design["email"])
                  .then(({ user }) => {
                    design.user = user

                    orderedDocs[i] = { ...design, id: doc.id }
  
                  })
                })
                console.log("This is promises", promises)
                return Promise.all(promises)
              })
              .then(() => {
  
                const filtereddesigns = orderedDocs.filter((design) => {
                  this.state.showModalArr.push(false)
                  return !blockArr.includes(design["email"]);
                });
  
                const withKey = filtereddesigns.map(design => ({
  
                  ...design,
                  key: design.id
                }));
                this.setState({ orderedDocs: withKey });
  
  
              // doc.data() is never undefined for query doc snapshots
  
  
            });
  
        })
  
  

    }
    blockUser = (email) => {
        Fire.shared.addBlock(email)
            .then(userCredentials => {
               alert(`User blocked`)
            })
            .catch(error => console.log("The error is", error)
            )
    }
    setModalVisible = (visible, index) => {
      const arr = this.state.showModalArr
      arr[index] = visible
      this.setState({ showModalArr: arr });
    }
    renderdesign = (design, index) => {
      console.log('this is the designing', design)
      let chars = design.name.split(" ")[0].substring(0, 1)
      if (design.name.split(" ").length > 1) {
        chars += design.name.split(' ')[1].substring(0, 1)
      }
      const modalVisible2 = this.state.showModalArr[index];
        // const ref = firebase.storage().ref(design.image);
        //const url =  ref.getDownloadURL();
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
                    otherParam: design.user
                  })}><Text style={{
                    fontSize: 20,
                    fontWeight: "500",
                    color: '#3772ff',
                    marginBottom: 5
                  }}>{design.name}</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewProfile', {
                    otherParam: design.user
                  })}></TouchableOpacity>
                </View>
  
                <Text style={styles.timestamp}>{moment(design.timestamp).fromNow()}</Text>
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
                        otherParam: design,
                      })}>
                        <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 5, fontWeight: "700", color: "#F76C6C", overflow: "hidden", borderRadius: 10, backgroundColor: "#F8E9A1", paddingVertical: 15, textAlignVertical: 'center', width: 250, }}>REPORT THIS design</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginTop: 15 }} onPress={() => {
  
                        this.props.navigation.navigate('ReportUser', {
                          otherParam: design,
                        })
                      }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 5, fontWeight: "700", color: "#F76C6C", overflow: "hidden", borderRadius: 10, backgroundColor: "#F8E9A1", paddingVertical: 15, textAlignVertical: 'center', width: 250, }}>REPORT THIS USER</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginTop: 15 }} onPress={() => this.blockUser(design["email"])}>
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
            {/* design */}
            {design.image != " " &&
  
              <Image
                style={styles.image}
                source={{
                  uri: design.image
                }}
              />
  
            }
  
  
            {/* design content /text */}
            <View style={{ position: "relative", flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start', height: "auto", width: "100%", position: 'relative' }}>
              <View style={{ height: "auto", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", }}>
                <Image style={{ width: 40, height: 40, marginRight: 20, }} source={require('../Components/rocketing.png')}></Image>
                {/* <Ionicons name="ios-rocket" size={30} color="pink" style={{ marginRight: 16 }} /> */}
              </View>
  
              <Text style={{ width: "80%", color: "#24305E", fontSize: 16 }}>{design.text}</Text>
  
            </View>
            {/* <LinearGradient
      colors={['#24305E', '#F76C6C']}
      start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
      style={{ marginTop: 15,height: 0.75, width: "98%", alignSelf: 'center',alignItems: 'center', justifyContent: 'center'}}
  ></LinearGradient> */}
  
  
  
          </View>
        )
    }
    render() {
      console.log("this is the state", this.state)
      const title = this.state.projectContent.title;
        return (

            <View style={styles.container}>
                {/* <View style={styles.header}>

                    <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate("Projects")}>
                        <Ionicons name="ios-arrow-round-back" size={32} color="black"></Ionicons>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{this.state.projectContent.title}</Text>
                </View> */}
           <View style={styles.header}>
          
          <View style={styles.linesContainer}>
          <View style={styles.plus}><TouchableOpacity onPress={() => this.props.navigation.navigate('Projects')}><Ionicons name="ios-arrow-round-back" size={32} color={"#fff"} /></TouchableOpacity></View>
                    {title !== undefined && title.length >20 &&  <Text style={styles.heading}>{this.state.projectContent.title.substring(0,20)}...</Text>}
           {title !== undefined && title.length<=20 && <Text style={styles.heading}>{this.state.projectContent.title}</Text>}
         
          </View>
        </View>
        <View style = {styles.content}>
                <View style = {{flexDirection: 'row', marginVertical: 15,backgroundColor: '#fff'}}>
                <TouchableOpacity onPress={() =>  this.props.navigation.navigate('ChatScreen', {
                "id": this.state.projectContent.groupChatID, "name": this.state.projectContent.title
         })} style = {{width: "50%",borderRadius: 15, textAlign: 'center', alignItems: 'center', justifyContent: 'center', }}>
            
                    <Text style = {{textAlign: 'center', fontSize: 20,fontWeight: "500",color: "#fff",overflow: "hidden", borderRadius: 10, backgroundColor: '#3772ff',paddingVertical: 15,textAlignVertical: 'center',width: wp("30%")}}>CHAT</Text>

                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => this.props.navigation.navigate('CreatePost', {
                        otherParam: {project: this.state.projectContent, "id": this.state.projectID},
                    })} style = {{width: "50%",borderRadius: 15, textAlign: 'center', alignItems: 'center', justifyContent: 'center', }}>
            
                    <Text style = {{fontSize: 20, fontWeight: "500", color: "#fff", textAlign: 'center', overflow: "hidden", borderRadius: 10, backgroundColor: "#3772ff",paddingVertical: 15,textAlignVertical: 'center',width: wp("30%")}}>SHARE</Text>

                    </TouchableOpacity>
               
                
                {/* <TouchableOpacity style = {{width: "50%", justifyContent: 'center', height: 50}} onPress={() => this.props.navigation.navigate("CreateProject")} >
                <Text style = {{textAlign: 'center',borderRadius: 10, overflow: 'hidden', textAlignVertical: "center", backgroundColor: "#F8E9A1", paddingVertical: 15, width: 150}}>Create</Text>
                </TouchableOpacity> */}
            </View>
       
         
               

                {/* <View style = {{flexDirection: 'row',padding: 5, marginBottom: 5,alignSelf: 'center'}}>
                     <Text style = {styles.headerTitle2}>Group Designs</Text>

                    <TouchableOpacity style = {{backgroundColor: "#F8E9A1", left: 50,width: 36, top:30,height: 36, borderRadius: 18}}>
                    <Ionicons name = "ios-add" onPress={() => this.props.navigation.navigate('UploadDesign', {
                                otherParam: this.state.projectID,
                                })} style = {{alignSelf: 'center',}} size = {32} color = "#24305E"></Ionicons>
                  </TouchableOpacity> 
                </View>  */}
               
{console.log('this is ordereddocs', this.state.orderedDocs)}
                <FlatList
                    style={{height: '100%'}}
                    data={this.state.orderedDocs}
                    renderItem={({ item, index }) => this.renderdesign(item, index)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />

  </View>

            </View>
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
    paddingVertical: 45,
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
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
    top: -30,
    height: '100%'
  },
  heading: {
    fontSize: 25,
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingHorizontal: 20,
    marginBottom: 5,
    color: "#fff",
    textAlign:'center'
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
        
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        bottom: 25,
        left: 80
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
    headerTitle: {
        fontSize: 30,
        fontWeight: "500",
        alignSelf: 'center',
        color: "#F8E9A1",

    },
    back: {
      width: 35,
      height: 35,
      alignSelf: 'baseline',
      top: '28%',
      left: '5%'
  },


    feed: {
        marginHorizontal: 16,
        paddingHorizontal: 15,
        
    },
    feedItem: {
        alignSelf: 'center',
        backgroundColor: "#F8E9A1",
        borderRadius: 15,
        padding: 8,
        flexDirection: 'row',
        marginVertical: 15,
        textAlign: 'left',
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: "500",
        color: "#F76C6C",
        marginBottom: 5
    },
    timestamp: {
        fontSize: 15,
        fontWeight: "500",
        color: "#24305E"
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
    designss: {
        marginTop: 16,
        fontSize: 14,
        color: "#24305E"
    },
    designImage: {
        width: wp("80%"),
        height: hp("40%"),
        borderRadius: 5,
        marginVertical: 16
    },
   
})