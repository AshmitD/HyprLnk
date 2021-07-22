import React from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import Contashants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import Fire from '../Fire'
import Mailer from 'react-native-mail';
import email from 'react-native-email'
import Oreo from '../Components/oreo.png'
import * as ImagePicker from 'expo-image-picker'
import firebase from 'firebase'
import AwesomeAlert from 'react-native-awesome-alerts';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// const firebase = require('firebase');
require("firebase/firestore");

export default class Report extends React.Component {
    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state;
        const post = params ? params.otherParam : null;
        

        this.state = {
            thisPost: post,
            email: "",
            text: ""
        }
        this.getUser()
    }


    getUser = () => {
        Fire.shared.getUserData(firebase.auth().currentUser.email).then(({ user }) => {
            this.setState({ email: user["email"] })
        })
    }

    handleSend = () => {
        const post = this.state.thisPost
        console.log("This is the post", post)
        const to = ['thestarswithinreach@email.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            cc: [''], // string or array of email addresses
            bcc: '', // string or array of email addresses
            subject: "Report from " + this.state.email,
            body: "The post was from " + post['name'] + `\n\n` + `This is what I had to say about the post: \n` + this.state.text
        }).catch(console.error)
    }

    render() {
        return (
        <KeyboardAvoidingView style ={styles.container} 
        behavior="padding">
                 <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate('Home')
                    }>
                        <Ionicons name="ios-arrow-round-back" size={34} color="black"></Ionicons>
                    </TouchableOpacity>
                   
                <View style = {{top: "20%"}}>
                    <Text style ={{fontSize: 27, color: "#F76C6C",marginLeft: 27, alignSelf: 'center',lineHeight: 35,textAlign: 'center'}}>{`What's wrong with this post?`}</Text>
                <View style={styles.inputContainer}>
                    <TextInput autoFocus={true} multiline={true} numberOfLines={4}  autoCapitalize = {true} style={{width: "100%", height: 50}}placeholder="Type your answer here ... " onChangeText={text => this.setState({ text:text })} value={this.state.text}></TextInput>
                </View>
                <TouchableOpacity  style ={{backgroundColor: "#F76C6C", borderRadius: 15,width: "70%", marginVertical: 15,alignSelf: 'center',}}onPress={() => this.handleSend()}>
                        <Text style={{ textAlign: 'center',fontSize: 20, color: "#F8E9A1",fontWeight: "500", paddingVertical: 15}}>SUBMIT</Text>
                    </TouchableOpacity>
                
                    </View>
                   
                

        </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
       height: "100%",
       
        backgroundColor: "#F8E9A1"
    },
    back: {

        marginTop: 45,
        width: wp("10%"),
        height: hp("5%"),
        borderRadius: wp("10%"),
        alignItems: 'center',
        marginLeft: 15,
        backgroundColor: "rgba(21,22,48,0.1)",
        justifyContent: 'center'
    },
    // header: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     paddingHorizontal: 32,
    //     paddingVertical: 12,
        
    //     marginTop: 35
    // },
    inputContainer: {
        width: "70%",
      alignSelf: 'center',
      marginVertical: 35,
      fontSize: 20,
      paddingBottom: 15,
      borderBottomColor: '#24305E',
      borderBottomWidth: 2
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        color: "#F76C6C"
    },
    error: {
        color: "#F76C6C",
        fontSize: 13,
        fontWeight: "600", 
        textAlign: "center"
    },
 
})