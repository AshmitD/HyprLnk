import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import * as firebase from 'firebase'
import Fire from '../Fire'
export default class LoadingScreen extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "App": "Auth")
        })
    }
    render() {
        return (
            <View style = {styles.container}><Text style = {{marginBottom: 15}}>Hang on for just a second... </Text><ActivityIndicator size = "large"></ActivityIndicator></View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
}) 