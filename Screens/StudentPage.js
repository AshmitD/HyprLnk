import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import firebase from 'firebase'
export default class StudentPage extends React.Component{

    render() {
        console.log("this is student page")
        return (
            <View style = {styles.container}>
                <Text>This is the page for the students</Text>

                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})