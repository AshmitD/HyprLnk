import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

export default class Group extends React.Component{
    render() {
        return (
            <View style = {styles.container}>
                <TouchableOpacity style ={{backgroundColor: "#24305E", borderRadius: 15,padding: 25,marginTop: 32}} onPress = {this.signOutUser}>
                <Text style={styles.headerTitle}>Logout</Text>
                </TouchableOpacity> 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 25,
        color: "#F76C6C",
        
    }
})