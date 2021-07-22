import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import Contashants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import Fire from '../Fire'
import Oreo from '../Components/oreo.png'
import * as ImagePicker from 'expo-image-picker'
import firebase from 'firebase'
import AwesomeAlert from 'react-native-awesome-alerts';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// const firebase = require('firebase');
require("firebase/firestore");

export default class ProfilePage extends React.Component {
 
    state ={
        email: '',

    }
   
    forgotPassword = (email) => {
        firebase.auth().sendPasswordResetEmail(email)
          .then(function (user) {
           alert("Please check your email!!")
          }).catch(function (e) {
            alert(e)
          })
    }
    

    render() {
        return (
            <View style ={styles.container}>
                 <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate('Login')
                    }>
                        <Ionicons name="ios-arrow-round-back" size={34} color="black"></Ionicons>
                    </TouchableOpacity>
                   
                <View style = {{top: "20%"}}>
              
                    <Text style ={{fontSize: 23, color: "#3772ff",marginLeft: 27, alignSelf: 'center',lineHeight: 35,textAlign: 'center'}}>{`Forgot Your Password? \nDon't Worry.`}</Text>
                <View style={styles.inputContainer}>
                  
                    <TextInput autoFocus={true} style={{ width: "100%"}}placeholder="Please enter your email adress ... " autoCapitalize = {false} onChangeText={text => this.setState({ email:text })} value={this.state.email}></TextInput>

                </View>
                <TouchableOpacity  style ={{backgroundColor: "#3772ff", borderRadius: 5,width: "70%", marginVertical: 15,alignSelf: 'center',}}onPress={() => this.forgotPassword(this.state.email)}>
                        <Text style={{ textAlign: 'center',fontSize: 20, color: "#fff",fontWeight: "500", paddingVertical: 15}}>SEND EMAIL</Text>
                    </TouchableOpacity>
                
                    </View>
                   
                
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
       height: "100%",
       
        backgroundColor: "#fff"
    },
    back: {

        marginTop: 45,
        width: wp("10%"),
        height: hp("5%"),
        borderRadius: wp("10%"),
        alignItems: 'center',
        marginLeft: 15,
      
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