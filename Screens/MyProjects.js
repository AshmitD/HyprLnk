import React from 'react';
import { View, Text, SafeAreaView, TextInput, ScrollView, StyleSheet, FlatList, Image, TouchableOpacity, LayoutAnimation, ShadowPropTypesIOS } from 'react-native'
import * as firebase from "firebase"
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import db from "firebase"
import Fire from '../Fire'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default class MyProjects extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            projectIDs: [],
            myProjects: []
        }
        this.fillMyProjects()

    }
    componentDidUpdate(prevProps) {
        console.log("this is props", prevProps)
        if (this.props.projects !== prevProps.projects) {
          this.fillMyProjects();
        }
    }
    fillMyProjects = () => {
        Fire.shared.getUserData(firebase.auth().currentUser.email).then(({ user }) => {
            this.setState({ projectIDs: user["projects"] })
        }).then(() => {
            const allProjects = []



           const allOfTheProjects = this.state.projectIDs.map((projectID => {
                
                const currProject = this.props.projects[projectID]
                const arrNames = []
                if(currProject == undefined) {
                    return 
                }
                currProject.id = projectID
                console.log("curr project user emails", currProject)
                const userNames = currProject['userEmails'].map((email => {
                   return (
                    Fire.shared.getUserData(email).then((user) => {
                        arrNames.push(user.user["name"])
                        console.log("This is array names",arrNames)
                    })
                   )
                }))
                return (
                Promise.all(userNames).then(() => {
                    console.log("this is arr names", arrNames)
                    currProject.names = arrNames
                    allProjects.push(currProject)
                    console.log("this is all projects", allProjects)
                })
                )
           
            }))
                Promise.all(allOfTheProjects).then(() => {
                    this.setState({ myProjects: allProjects })
                console.log('this.stateing', this.state)})


        })




    }

    //     // const projects = [];
    //     // const db = firebase.firestore();

    //     // const onReceive = (querySnapshot) => {
    //     //     querySnapshot.forEach(function (doc) {
    //     //         // doc.data() is never undefined for query doc snapshots
    //     //         projects[doc.id] = doc.data();
    //     //     });           
    //     // }
    //     // db.collection("projects").get()
    //     //     .then(onReceive.bind(this));

    //     Fire.shared.getUserData(firebase.auth().currentUser.email).then(({ user }) => {

    //         user['projects'].forEach(projectID => {
    //                 console.log("this is projectsss", projects)
    //                 const currProject =  projects[projectID]
    //                 console.log("This is currproject", currProject)
    //                 let arrNames = []
    //                 console.log("currproject", currProject.userEmails)
    //                 const userDataPromises = currProject.userEmails.map(email => {
    //                     console.log('INSIDE MAP CALLBACK')
    //                     return Fire.shared.getUserData(email).then(({user}) => {
    //                         arrNames.push(user["name"])
    //                         console.log("this is arr Names", arrNames)
    //                     })
    //                 })
    //                 Promise.all(userDataPromises).then(() => {
    //                     currProject.names = arrNames
    //                     myProjects.push({'id': projectID, 'project': currProject})
    //                     console.log('this is id', projects)
    //                     // const temp = this.state.projects
    //                     // temp.push(currProject)
    //                     // 
    //                     // console.log("this is projects", this.state.projects)
    //                 })

    //                 console.log("This is arr names before", myProjects)

    //             })
    //                 console.log("this is projects in state", this.state.projects)
    //                 this.setState({projects: myProjects}) 

    //         })


    // }

    renderProject = project => {
       
        
        // console.log("this is projects", project)
        // const ref = firebase.storage().ref(post.image);
        //const url =  ref.getDownloadURL();

        console.log("This is project", project)
            return project && (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OneProject', {
                    otherParam: project.id,
                })} style={{ marginTop: 15 }}>
                <View style={styles.projectCard}>
           
                                {project.topics[0].toLowerCase()== "math" && <View style={{marginVertical: 5,}}>
                                    <Ionicons name="ios-clipboard" size={60} color="#3772ff"></Ionicons>
                                </View>}
                                {project.topics[0].toLowerCase()== "science" && <View style={{marginVertical: 5,}}>
                                    <Ionicons name="ios-clipboard" size={60} color="#3772ff"></Ionicons>
                                </View>}
                                {project.topics[0].toLowerCase()== "technology" && <View style={{marginVertical: 5,}}>
                                    <Ionicons name="ios-clipboard" size={60} color="#3772ff"></Ionicons>
                                </View>}
                                {project.topics[0].toLowerCase()== "engineering" && <View style={{marginVertical: 5,}}>
                                    <Ionicons name="ios-clipboard" size={60} color="#3772ff"></Ionicons>
                                </View>}
                                {project.topics[0].toLowerCase()== "space" && <View style={{marginVertical: 5,}}>
                                    <Ionicons name="ios-clipboard" size={60} color="#3772ff"></Ionicons>
                                </View>}
    
                                <Text style={{fontSize: 24, textAlign: 'center', marginVertical: 5, textTransform: "uppercase", letterSpacing: 1,}}>{project.title}</Text>
                                
                                <View style={{marginVertical: 5,}}>
                                    <Text style={{fontSize: 14,}}>{project.names.slice(0,3).join(', ')} </Text>
                                </View>
                             
         

                                        <Ionicons name="ios-arrow-dropdown" size={30} color={"black"} style={{}} />

                                
                            
    
    
                </View>
                </TouchableOpacity>
    
        )
    }
    render() {
        LayoutAnimation.easeInEaseOut()
        return (

            <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.linesContainer}>
                <Text style={styles.heading}>Projects</Text>
                <View style={styles.plus}><TouchableOpacity onPress = {() => this.props.navigation.navigate('CreateProject')}><Ionicons name="md-add-circle-outline" size={32} color={"#fff"} /></TouchableOpacity></View>
              </View>
              <TouchableOpacity style={{ backgroundColor: '#fff', width: '80%', alignSelf: 'center', marginTop: '5%', height: '100%', paddingVertical: 15, borderRadius: 15 }} onPress = {()=> this.props.navigation.navigate("JoinProject", {otherParam: this.props.projects})}>
                <Text style={{ color: '#3772ff', textAlign: 'center', fontWeight: '500', fontSize: 21 }}>JOIN PROJECT</Text>
                </TouchableOpacity>
            </View> 
         
            <View style={styles.content}>   
              {this.state.projectIDs == 0 && <View style={{ alignSelf: 'center', flex: 5, }}>
                  <Text style={{ textAlign: 'center', color: "#F8E9A1", fontSize: 20, paddingHorizontal: 25, marginTop: "25%" }}>You aren't in any groups yet... Join a group!</Text>
              </View>}
              {<FlatList
                  style={styles.feed}
                  data={this.state.myProjects}
                  renderItem={({ item }) => this.renderProject(item)}
                  keyExtractor={item => item}

              />}
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
        backgroundColor: "#fff",
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
        paddingTop: 80,
        paddingBottom: 50,
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
      },
      heading: {
        fontSize: 30,
        textTransform: "uppercase",
        letterSpacing: 2,
        paddingHorizontal: 20,
       
        color: "#fff",
      },
      projectCard: {
        flexDirection: "column",
        width: "100%",
        borderBottomColor: "#000",
        borderBottomWidth: 2,
        padding: 10,
        alignItems: "center",
        justifyContent: "space-between",
      },
      button: {
        marginHorizontal: 30,


        borderRadius: 20,
        height: 52,

        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 25,
    },
})