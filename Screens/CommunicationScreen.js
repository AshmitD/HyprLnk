import React from 'react'
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import firebase from 'firebase'
import { ScrollView } from 'react-native-gesture-handler'
import Fire from '../Fire'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
export default class OneProjectScreen extends React.Component {
    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state;
        const currProjectID = params ? params.otherParam : null;
        const orderedDocs = []
        this.state = {
            projectID: currProjectID,
            type: "Google Classroom",
            link: "",
            arrLinks: []
        }
        firebase.firestore().collection("projects").doc(currProjectID).collection("CommunicationLinks")
            .get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    orderedDocs.push(doc.data())
                });
            })
            .then(() => {
                this.setState({ arrLinks: orderedDocs })
       
            })



    }
    handleAdd = () => {
        Fire.shared.addComm({ projectID: this.state.projectID, type: this.state.type, link: this.state.link })
            .then(userCredentials => {
                this.setState({ type: "Google Classroom", link: "" })
            })
            .catch(error => console.log("The error is", error)
            )
    }
    renderPost = link => {
        // const ref = firebase.storage().ref(post.image);
        //const url =  ref.getDownloadURL();
        return (

            <View style={styles.feedItem}>
                {/* <Image source={post.avatar} style={styles.avatar}></Image> */}
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                        <View>

                            <Text style={styles.name}>{link.type}</Text>
                        </View>
                        <Ionicons name="ios-more" size={24} color="#73788B" />
                    </View>
                    <Text style={styles.postss}>{link.link}</Text>



                </View>

            </View>
        )
    }

    render() {

        return (

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate('OneProject', {
                        otherParam: this.state.projectID,
                    })}>
                        <Ionicons name="ios-arrow-round-back" size={32} color="black"></Ionicons>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Communicate</Text>
                </View>

               { !this.state.arrLinks && <View style ={{alignSelf: 'center'}}>
                    <Text style ={{textAlign:'center', color: "#F8E9A1", fontSize: 20, paddingHorizontal: 25,marginTop: hp("15%")}}>There aren't any ways to communicate yet... Add a link!</Text>
                </View>}
              <FlatList
                    style={styles.feed}
                    data={this.state.arrLinks}
                    renderItem={({ item }) => this.renderPost(item)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
             
              
                <TouchableOpacity style = {styles.button} onPress={() => this.props.navigation.navigate('AddLink', {
                        otherParam: this.state.projectID,
                    })} >
                <Text style = {{color: "#F8E9A1", fontWeight: '500', fontSize: 15}}>ADD A LINK</Text>
               </TouchableOpacity>
        


               
            </View>
        )


    }

}
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#24305E',
        height: "100%"
    },
    // longText: {
    //     borderBottomColor: "#8a8F9E",
    //     borderBottomWidth: StyleSheet.hairlineWidth,
    //     height: 30,
    //     fontSize: 15,
    //     color: "#161F3D",
    // },
    feed: {
        marginHorizontal: 16,

    },
    header: {
        paddingTop: 64,
        paddingBottom: 16,
        backgroundColor: "#24305E",
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomColor: '#F76C6C',
        flexDirection: "row",
       
        paddingBottom: 5,
        marginBottom: 15,
        marginTop: -5,
        alignSelf: 'center'
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "500",
        alignSelf: 'center',
        color: "#F8E9A1",
        textTransform: 'uppercase',
       
    },
    back: {
        position: "absolute",
        top: hp("9%"),
        left: wp("-18%"),
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        backgroundColor: "rgba(21,22,48,0.1)",
        justifyContent: 'center'
    },
   
    button: {
        marginHorizontal: 30,
        marginBottom: hp("25%"),
        backgroundColor: "#F76C6C",
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
       
    },
    inputTitle: {
        color: "#F8E9A1",
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
        marginBottom: 15,
    },
    feedItem: {
        borderRadius: 5,
        padding: 8,
        flexDirection: 'row',
        marginVertical: 8,
      
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#F76C6C",
        textTransform: 'uppercase'
    },
    postss: {
        marginTop: 3,
        fontSize: 14,
        color: "#F8E9A1",
        marginBottom: 5,
        
    },



})