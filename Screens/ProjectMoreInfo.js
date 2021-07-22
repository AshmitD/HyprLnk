import React, { useReducer } from 'react'
import { View, Modal, TouchableHighlight, FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import firebase from 'firebase'
import Fire from '../Fire'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { ScrollView } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class ProjectMoreInfo extends React.Component {
    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state;
        const projectContent = params ? params.otherParam : null;

     
        this.state = {
            project: projectContent,
            projectUsers: []
        }
        var i;
       console.log("This is state", this.state.project)
       for(i = 0; i<this.state.project.userEmails.length; i++) {
        Fire.shared.getUserData(this.state.project.userEmails[i]).then((user) => {
            this.setState({projectUsers: this.state.projectUsers.concat(user)})
            console.log("this is userre", user)
         })
         console.log("This is i", i)

       
       }
      
       
    }

    
    handleChat = (email, name) => {
        // this.state.user.email
        // firebase.auth().current.user.email

        Fire.shared.addChat({ "email1": email, "email2": firebase.auth().currentUser.email }).then((thisID) => {

            this.props.navigation.navigate('ChatScreen', {
                "id": thisID, "name": name
            })
        })


    }

    renderTopics = user => {
        {   console.log("this is user", this.state.projectUsers)}

        return (
      
            <View style={{ borderRadius: 5, paddingHorizontal: 15, width: "100%", paddingVertical: 15, marginBottom: 15, flexDirection: 'row'}}>
         <TouchableOpacity  style = {{width: "85%"}} onPress={() => this.props.navigation.navigate('ViewProfile', {
                    otherParam: user.user})}><Text style={{ width: "100%", alignSelf: 'center', color: "#24305E", fontSize: 22, fontWeight: "600" }}>{user["user"].name.toUpperCase()}</Text></TouchableOpacity> 
                
                <TouchableOpacity style ={{left: 15}}onPress ={() => this.handleChat(user.user.email, user.user.name)}><Ionicons name="ios-chatboxes" size={32} color="black"></Ionicons></TouchableOpacity>
            </View>
        )
    }
    render() {

        return (

            <View style={styles.container}>
                <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate("Projects")}>
                    <Ionicons name="ios-arrow-round-back" size={32} color="black"></Ionicons>
                </TouchableOpacity>
                <View style={{ marginHorizontal: 35, backgroundColor: "#F8E9A1", top: "20%", borderRadius: 25 }}>
                    <Text style={{ fontSize: 35, color: "#F76C6C", marginVertical: 15, textAlignVertical: 'center', alignSelf: 'center' }}>{this.state.project.title.toUpperCase()}</Text>
                    <Text style={{ color: "#24305E", textAlignVertical: 'center', alignSelf: 'center' }}>{this.state.project.descrip}</Text>
                    <Text style={{ textAlignVertical: 'center', alignSelf: 'center' }}>{this.state.project.endGoal}</Text>
                         <FlatList
                            listKey={moment().valueOf().toString()}
                            data={this.state.projectUsers}
                            renderItem={({ item }) => this.renderTopics(item)}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={true}
                        />

                </View>
            </View>
        )


    }






}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#24305E",

        textAlignVertical: 'center'
    },
    back: {
        position: "absolute",
        top: hp("6%"),
        left: "5%",
        width: wp("15%"),
        height: hp("7.5%"),
        borderRadius: 31,
        alignItems: 'center',
        backgroundColor: "rgba(21,22,48,0.1)",
        justifyContent: 'center'
    },


})