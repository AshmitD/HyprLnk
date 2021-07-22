import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import Contashants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import Fire from '../Fire'
import DropDownPicker from 'react-native-dropdown-picker';
import Mailer from 'react-native-mail';
import email from 'react-native-email'
import Oreo from '../Components/oreo.png'
import * as ImagePicker from 'expo-image-picker'
import firebase from 'firebase'
import AwesomeAlert from 'react-native-awesome-alerts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// const firebase = require('firebase');
require("firebase/firestore");

export default class Report extends React.Component {
    constructor(props) {
        super(props)
        const { params } = this.props.navigation.state;
        const currProjectID = params ? params.otherParam : null;

        this.state = {
            projectID: currProjectID,
            type: { label: 'Google Classroom', value: 'Google Classroom' },
            link: "",
        }

    }
    handleAdd = () => {
        Fire.shared.addComm({ projectID: this.state.projectID, type: this.state.type, link: this.state.link })
            .then(userCredentials => {
                this.setState({ type: [{label: "Google Classroom"}, {value: "Google Classroom"}], link: "" })
            })
            .catch(error => console.log("The error is", error)
            )
    }
    render() {
        return (
            <View style={styles.container}>
                  <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate('OneProject', {
                        otherParam: this.state.projectID,
                    })}
                    >
                        <Ionicons name="ios-arrow-round-back" size={34} color="black"></Ionicons>
                    </TouchableOpacity>
                <View style={{ marginTop: hp("15%"), marginBottom: 150 }}>
                    <View style={{ marginHorizontal: 25 }}>
                        <View style={{ alignSelf: 'center', marginBottom: 25, borderColor: '#F76C6C', padding: 5, borderBottomWidth: 5, width: "80%" }} ><Text style={styles.headerTitle}>ADD A LINK</Text></View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.inputTitle}>What platform is this link for?</Text>

                        </View>
                        <DropDownPicker style={{

                            borderRadius: 0, backgroundColor: "#F8E9A1", zIndex: 2031, position: 'absolute',
                        }}
                            items={[
                                { label: 'Google Classroom', value: 'Google Classroom' },
                                { label: 'Discord', value: 'Discord' },
                                { label: 'Google Hangouts', value: 'Google Hangouts' },
                                { label: 'Google Meet', value: 'Google Meet' },

                            ]}
                            defaultIndex={0}

                            containerStyle={{ height: 50 }}
                            onChangeItem={type => this.setState({ type })}
                        />
                    </View>
                    <View style={{ marginTop: 32, zIndex: -1, marginHorizontal: 25 }}>
                        <Text style={styles.inputTitle}>Insert the link here:</Text>
                        <TextInput
                            style={styles.longText}
                            autoCapitalize = {false}

                            onChangeText={link => this.setState({ link })}
                            value={this.state.link}
                        ></TextInput>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.handleAdd}>
                        <Text style={{ color: "#F8E9A1", fontWeight: '500', fontSize: 15 }}>ADD LINK</Text>
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
    longText: {
        borderBottomColor: "#8a8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 30,
        fontSize: 15,
        color: "#161F3D",
    },
    // header: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     paddingHorizontal: 32,
    //     paddingVertical: 12,

    //     marginTop: 35
    // },
    inputTitle: {
        color: "#24305E",
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
        marginBottom: 15,
    },
    button: {
        marginHorizontal: 30,
        marginTop: 15,
        backgroundColor: "#F76C6C",
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
       
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
    headerTitle: {
        fontSize: 30,
        fontWeight: "500",
        alignSelf: 'center',
        color: "#24305E",
        textTransform: 'uppercase',

    },


})