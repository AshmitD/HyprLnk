import firebase from 'firebase';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image, 
  TextInput
} from 'react-native';
import filter from 'lodash.filter';
import { topic } from 'firebase-functions/lib/providers/pubsub';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
        userList: ["ASTRONOMY", "COMPUTER SCIENCE", "DEBATE","ENGINEERING","MED","SOCIAL IMPACT", "SPORTS"],
        everyone: [],
        whoToSearchThrough: [],
        filteredData: [],
        keepData: [],
        modalVisible2: false,
        modalForSideBar: false,
        showModalArr: [],
        isModalVisible: false,
        isOpen: true,
        name: '',
        query: '',
        setQuery: '',
        fullData:[],
        setFullData: [],
        isLoading:false,
        error: null,
        setData: [],
        colorOnClick: ['white', 'white', 'white', 'white', 'white', 'white', 'white'],
        arrWithAllTopics: []
    }
    this.fillUsers()
}
  fillUsers = () => {
    let everyone = []
    let setData = []
    const db = firebase.firestore();
   
    const onReceive = (querySnapshot) => {
        querySnapshot.forEach(function (doc) {
            everyone.push({ 'projects': doc.data(), 'id': doc.id })
            // doc.data() is never undefined for query doc snapshots
        });
       setData = everyone;
        this.setState({ everyone, setData })

    }
    db.collection("projects").get()
        .then(onReceive.bind(this));
}
handleSearch = text => {
  
  let t = text
console.log("This is t", t)
  console.log("these is query", this.state.setQuery)
  const filteredData = filter(this.state.everyone, club => {
    return this.contains(club.projects, t);
  });
  this.setState({setData: filteredData, setQuery:text})
 
 
};
contains = ({ title, descrip, topics }, text) => {
  
  const formattedQuery = (text.toLowerCase());
console.log("this is name and formatted query", descrip, formattedQuery)
  if (title.toLowerCase().includes(formattedQuery) || descrip.toLowerCase().includes(formattedQuery) || topics.toString().toLowerCase().includes(formattedQuery)) {
    return true;
  }
  console.log("these is contains query", this.state.setQuery)
  return false;
};
// onClick=(index) => {
//   let a = this.state.colorOnClick
//   let newColor = ''
//   if(a[index]=='white') {
//     newColor = 'green'
//   }
//   else {
//     newColor = 'white'
//   }
//   a[index] = newColor
//   this.setState({colorOnClick: a})
//   this.addToTopics()
// }
// addToTopics=() =>{
//   let fullArr = []
//   for (let i = 0; i < this.state.colorOnClick.length; i++) {
//     if(this.state.colorOnClick[i]=='green'){
//       fullArr.push(this.state.userList[i])
    
//     }
//   }
//   console.log("this is full Arr", fullArr)
//   this.setState({arrWithAllTopics:fullArr})
//   console.log("this is arr all topics v4 baby", this.state.arrWithAllTopics)
//   this.handleFilter()
// }
// handleFilter=()=> {
   


//     const filteredData = filter(this.state.setData, club => {
//       console.log("this is arrsbaby", this.state.arrWithAllTopics)
//       return club.projects.topics.some(r=> this.state.arrWithAllTopics.indexOf(r) >= 0)
//     });

//     console.log("this is filtered data", filteredData)
//     this.setState({setData: filteredData})
    
   
// }

renderHeader= () => {

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 20,
        width: '100%'
      }}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={true}
        clearButtonMode="always"
        value={(this.state.setQuery)}
        onChangeText={text => this.handleSearch(text)}
        placeholder="Search"
        style={{ backgroundColor: '#fff', paddingHorizontal: 20, width:300 }}
      />
      <View>
      {/* <View style={styles.container}>
     <TouchableOpacity style={{backgroundColor: this.state.colorOnClick[0]}}  onPress={() => this.onClick(0)}><Text>Click me</Text></TouchableOpacity>
     <TouchableOpacity style={{backgroundColor: this.state.colorOnClick[1]}}  onPress={() => this.onClick(1)}><Text>Click me</Text></TouchableOpacity>
     <TouchableOpacity style={{backgroundColor: this.state.colorOnClick[2]}}  onPress={() => this.onClick(2)}><Text>Click me</Text></TouchableOpacity>
    </View> */}
          

      </View>
    </View>
  );
}
  render() {

  
  
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5500dc" />
        </View>
      );
    }
  
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18}}>
            Error fetching data... Check your network connection!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
      <Text style={styles.text}>Clubs</Text>
      
      <FlatList
      ListHeaderComponent={this.renderHeader}

        data={this.state.setData}
        keyExtractor={item => item.first}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {/* <Image
              source={{ uri: item.picture.thumbnail }}
              style={styles.coverImage}
            /> */}
            <View style={styles.metaInfo}>
              {console.log("this is item", item)}
              <Text style={styles.title}>{`${item.projects.title}
              `}</Text>
            </View>
          </View>
        )}
      />
    </View>
  
    )

  }
}
const styles = StyleSheet.create({
  container: {
   flex:1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center', 
    width: '100%'
  },
  text: {

    fontSize: 20,
    color: '#101010',
    marginTop: 60,
    fontWeight: '700',
    width: '100%'
  },
  listItem: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%'
  },
  listItemText: {
    flex:1,
    fontSize: 18,
    width: '100%'
  }
})