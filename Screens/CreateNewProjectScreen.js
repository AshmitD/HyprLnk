import React from 'react'
import { View, Image, FlatList, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import Fire from '../Fire'
import Contants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DropDownPicker from 'react-native-dropdown-picker';
export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state;
    const project = params ? params.otherParam : null;

    this.state = {
        defaultText: 'hi',
      project: project,
      title: project.proj.title,
      descrip: project.proj.descrip,
      image: project.proj.image
    }
   


  }
  componentDidMount() {
    this.getPhotoPermissions()

}

pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [10,10]
    })

    if (!result.cancelled) {
        this.setState({ image: result.uri })
    }
}

  getPhotoPermissions = async () => {
    if (Contants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

        if (status != "granted") {
            // alert("We need permissions to access your camera roll")
        }
    }
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

  saveFromPfp = () => {
    
    Fire.shared.save({ 'title': this.state.title, 'descrip': this.state.descrip, 'id': this.state.project.id, image: this.state.image })
  }

  signOutUser = () => {
    firebase.auth().signOut()
  }
  render() {
    console.log('this is the projeco', this.state.project)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          
        <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.navigate('Home')
                    }>
                        <Ionicons name="ios-arrow-round-back" size={24} color="#24305e"></Ionicons>
                    </TouchableOpacity>

           <TouchableOpacity style = {styles.avatar} onPress={this.pickImage}>   
           {!this.state.image && <View style={styles.avatar}><Ionicons name="ios-add" size={60}></Ionicons></View>}
          {this.state.image && <Image source={{ uri: this.state.image }} style={styles.avatar}></Image>
               
                 /* {this.state.projectNames.length !== 0 &&   <DropDownPicker style={{
                            backgroundColor: '#3772ff',padding: 25, width: '100%',
                            }}
                            items={this.state.projectNames}
                                containerStyle={{height: 40, width: '55%'}}
                                onChangeItem={selectedProjectName => this.setState({ selectedProjectName })}
                            />} */}
                            
            

          </TouchableOpacity>
          <TextInput style={styles.name} onChangeText={title => this.setState({ title })} value={this.state.title}></TextInput>
          <TextInput style={styles.description} scrollEnabled = {true}  onChangeText={descrip => this.setState({ descrip })} value={this.state.descrip}></TextInput>
       
 
        </View>

        <View style={styles.content}>
       
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
