import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Fire from '../Fire'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment'
import MyProjects from './MyProjects';
export default class JoinProject extends React.Component {

    // fillProjects = () => {
    //     const projects = {};
    //     const db = firebase.firestore();

    //     const onReceive = (querySnapshot) => {
    //         querySnapshot.forEach(function(doc) {
    //             // doc.data() is never undefined for query doc snapshots
    //             projects[doc.id] = doc.data();
    //         });
    //         this.setState({projects: projects})
    //     }
    //     db.collection("projects").get()
    //         .then(onReceive.bind(this));

    // }
   
    handleJoin = (projectID, project) => {
        Fire.shared.joinProject(projectID, project).then(() => {
            this.props.navigation.navigate("Projects")
        })

    }
    renderTopics = topic => {
        return (
            <View style={{ borderRadius: 5, paddingHorizontal: 15, backgroundColor: '#24305E', width: "100%", paddingVertical: 15, marginBottom: 15 }}>
                <Text style={{ alignSelf: 'center', color: "#F8E9A1", fontSize: 15, fontWeight: "600" }}>{topic}</Text>
            </View>
        )
    }

    renderProject = projectID => {
        const { params } = this.props.navigation.state;
        const projects = params ? params.otherParam : null;

        const project = projects[projectID]
      
        // const ref = firebase.storage().ref(post.image);
        //const url =  ref.getDownloadURL();
        return project && (
            <TouchableOpacity onPress={() => this.handleJoin(projectID, project)} style={{ marginTop: 15 }}>
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
                                    <View style = {{alignItems:'center', justifyContent:'center'}}><Text style = {{fontSize: 18, marginVertical: 5,alignSelf: 'center',fontWeight: '500',color: '#3772ff'}}>JOIN</Text>
                                    </View>
                            
                        


            </View>
            </TouchableOpacity>

    )
    }
    render() {
        LayoutAnimation.easeInEaseOut()
        const { params } = this.props.navigation.state;
        const projects = params ? params.otherParam : null;

        return (

            <View style={styles.container}>
  <View style={styles.header}>
          <View style={styles.linesContainer}>
            <TouchableOpacity style={{
              position: "absolute",
              left: 20,
            }} onPress={() => { this.props.navigation.navigate("Projects") }}><Ionicons size={36} color={"white"} name="ios-arrow-round-back"></Ionicons></TouchableOpacity>
            <Text style={styles.heading}>JOIN PROJECT</Text>
        
          </View>
        </View>
        <View style = {styles.content}>
        
                {projects && <FlatList
                    style={styles.feed}
                    data={Object.keys(projects)}
                    renderItem={(elem) => this.renderProject(elem.item)}
                    keyExtractor={elem => elem.item}
                    showsVerticalScrollIndicator={false}
                />}
</View>
                {/* <View style = {{width: 15}}>
                <TouchableOpacity style = {{backgroundColor: "lightgrey", position: "fixed", width: 24, height: 44, borderRadius: 16, alignItems: 'center', alignContent: 'center'}}>
                   <Ionicons name = "ios-add" onPress ={() => this.props.navigation.navigate("CreatePost")} style = {{alignSelf: 'center'}} size = {32} color = "black"></Ionicons>
                </TouchableOpacity>  
                </View> */}

            </View>

            /* <TouchableOpacity style ={{marginTop: 32}} onPress = {this.signOutUser}>
                <Text>Logout</Text>
            </TouchableOpacity> */

        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#24305E",
        flex: 1,
    },

    feed: {
        marginHorizontal: 16,

    },
    feedItem: {
        backgroundColor: "#F76C6C",
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
        width: wp('80%'),
        alignSelf: 'center'
    },
    name: {
        fontSize: 20,
        fontWeight: "500",
        color: "#F8E9A1",
        marginBottom: 5
    },
    timestamp: {
        fontSize: 15,
        fontWeight: "500",
        color: "#24305E"
    },

    postss: {
        marginTop: 16,
        fontSize: 14,
        color: "#24305E"
    },
    postImage: {
        height: 400,
        width: undefined,
        borderRadius: 5,

    },
    image: {
        width: undefined,
        height: 300,
        maxWidth: 500,
        marginVertical: 15,

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
    
    back: {
        position: "absolute",
        top: hp("8%"),
        left: wp("-20%"),
        width: wp("15%"),
        height: hp("7.5%"),
        borderRadius: 31,
        alignItems: 'center',

        backgroundColor: "rgba(21,22,48,0.1)",
        justifyContent: 'center'
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