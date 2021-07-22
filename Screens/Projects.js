import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import firebase from 'firebase'
import Fire from '../Fire'
import StudentPage from '../Screens/StudentPage'
import AstronautSpaceEnthusiastPage from '../Screens/AstronautSpaceEnthusiastPage'

export default class Projects extends React.Component {
   
  
    render() {


        return (
            <AstronautSpaceEnthusiastPage navigation={this.props.navigation} />
        );
    }
}
