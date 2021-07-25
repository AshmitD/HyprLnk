import React from 'react'
import { View, Image, FlatList, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import Fire from '../Fire'

import { Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DropDownPicker from 'react-native-dropdown-picker';
export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      name: '',
      shortBio: '',
      who: '',
      topics: [],
      allProjects: [],
      defaultIndex: -1,

    }
    this.fillUser()
    this.getProjects()

  }

  getProjects = () => {
    Fire.shared.getProjs(firebase.auth().currentUser.email).then((projects) => {
      this.setState({ allProjects: projects })
    })
  }
  deleteProject = (proj) => {
    Alert.alert(
      'Delete Project?',
      'This action cannot be reverted',
      [

        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => Fire.shared.delProj(proj) }
      ],
      { cancelable: false }
    );

  }
  renderProj = (project) => {
    console.log("This is the project", project)
    return (
      <View style={{alignItems: 'center',width: '80%', paddingVertical: 15, borderBottomColor: '#3772ff', borderBottomWidth: 4,alignSelf: 'center',flexDirection: 'row',  }}><Text style={{ width: '70%',fontSize: 16, color: '#3772ff',}}>{project.proj.title}</Text><TouchableOpacity onPress={() => this.deleteProject(project.proj)}><Ionicons style = {{left: '300%'}}color = '#FA4D50' size = {25} name = "ios-close-circle-outline"></Ionicons></TouchableOpacity></View>
    )
  }

  fillUser = () => {
    Fire.shared.getUserData(firebase.auth().currentUser.email).then((user, id) => {
      console.log("this is th euser")
      this.setState(user)
      this.setState({ name: user.user['name'] })
      this.setState({ shortBio: user.user['shortBio'] })
      this.setState({ who: user.user['who'] })
      this.setState({ topics: user.user['topics'] })
      const allTopics = ['Organization', 'Professional', 'Student']
      const defaultI = allTopics.indexOf(user.user.who)
      console.log('this is default', defaultI)
      this.setState({ defaultIndex: defaultI })
    })
  }

  saveFromPfp = () => {
    console.log("This is who after drop", this.state.who)
    Fire.shared.save({ 'name': this.state.name, 'shortBio': this.state.shortBio, 'who': this.state.who.label, 'topics': this.state.topics })
  }

  signOutUser = () => {
    firebase.auth().signOut()
  }
  render() {
    console.log('this is the user', this.state.user, this.state.allProjects)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
      
         
                       

          <View style={styles.avatar}>
            <Text style={{ fontSize: 35, color: "#3772ff", textAlign: 'center', alignItems: 'center' }}>{this.state.name.charAt(0)}</Text><TouchableOpacity onPress ={() => this.props.navigation.navigate("AddClub", {ow: 5, hello: () => {console.log('bro'); return Promise.resolve()}})} style={{  paddingTop:25, left: "100%" }}><Ionicons size={36} style = {{fontWeight: "800"}}color={"#24305E"}  name="ios-add-circle-outline"></Ionicons></TouchableOpacity>
          </View>
          <TextInput style={styles.name} onChangeText={name => this.setState({ name })} value={this.state.name}></TextInput>
         
       


        </View>

        <View style={styles.content}>
       <Text style ={{fontSize: 24, color: '#3772ff', alignSelf: 'center', textTransform: 'uppercase'}}>My Clubs</Text>
        <FlatList 
        style = {{marginVertical: 25}}
        keyExtractor={item => item.id}
        data={this.state.allProjects}
        renderItem={({ item }) => this.renderProj(item)}
        showsVerticalScrollIndicator={false} />

<TouchableOpacity onPress={() => this.saveFromPfp()} style = {{backgroundColor: '#3772ff', width: '80%', alignSelf: 'center', marginBottom: 75,paddingVertical: 15, borderRadius: 15}}>

<Text style={{ color: 'white', textAlign: 'center', fontSize: 21 }}>SAVE</Text>
</TouchableOpacity>
        </View>
      

      </View>
      // <View style={styles.container}>
      //   <View style={styles.header}>
      //     <View style={styles.linesContainer}>
      //       <TouchableOpacity style={{
      //         position: "absolute",
      //         left: 20,
      //       }} onPress={() => { console.log("Does it get here?"), this.toggle() }}><Ionicons size={36} color={"white"} name="ios-menu"></Ionicons></TouchableOpacity>
      //       <Text style={styles.heading}>FEED</Text>
      //       <View style={styles.plus}><TouchableOpacity onPress={() => this.props.navigation.navigate('CreatePost')}><Ionicons name="md-add-circle-outline" size={32} color={"#fff"} /></TouchableOpacity></View>


      //     </View>
      //     <View style={styles.profile}>
      //       <View style={styles.avatar}>
      //         <Text style={styles.avatarText}>AS</Text>
      //       </View>
      //     </View>
      //     </View>
      //     <View style={styles.content}>
      //       <TextInput style={styles.type} onChangeText={who => this.setState({ who })} value={this.state.who}></TextInput>

      //     <View style={styles.bio}>
      //       <TextInput style={styles.bioContent} onChangeText={shortBio => this.setState({ shortBio })} value={this.state.shortBio}></TextInput>
      //     </View>


      /* <FlatList
        keyExtractor={item => item.id}
        data={this.state.allProjects}
        renderItem={({ item }) => this.renderProj(item)}
        showsVerticalScrollIndicator={false} />
      {this.state.defaultIndex !== -1 && <DropDownPicker
        items={[
          { label: 'Organization', value: 'Organization' },
          { label: 'Professional', value: 'Professional' },
          { label: 'Student', value: 'Student' },

        ]}
        defaultIndex={this.state.defaultIndex}
        containerStyle={{ height: 40 }}
        onChangeItem={who => this.setState({ who })}
      />} */
      /* <TouchableOpacity onPress={() => this.saveFromPfp()}>

        <Text style={{ color: 'white' }}>Save</Text>
      </TouchableOpacity>
      </View>
   
  </View> */
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3772ff",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  back: {
    width: 35,
    height: 35,
    alignItems: 'center',
    top: '10%',
    right: '20%'
},
  content: {
    flex: 6,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    width: "100%",
    backgroundColor: "#fff",
    position: "relative",
    zIndex: -1,
    paddingTop: 15,
  },
  header: {
    height: 380,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    alignSelf: 'center',

    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
 
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    marginTop: 25,
    fontSize: 28,
    color: "white",
    fontWeight: "600",
    alignSelf: 'center'
  },
  info: {
    fontSize: 16,
    color: "black",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "black",
    marginTop: 10,
    textAlign: 'center',
    zIndex: 5000
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
})