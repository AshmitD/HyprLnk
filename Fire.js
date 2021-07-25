import FirebaseKeys from './Config'
import firebase from 'firebase'
import { Alert } from 'react-native'

class Fire {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp({});
        }
    }

    addPost = async ({ projectID, projectName, text, localUri, name }) => {
        let remoteUri;
        if (localUri) {

            remoteUri = await this.uploadPhotoAsync(localUri)
        }
        else {
            remoteUri = " "
        }


        return new Promise((res, rej) => {

            this.firestore.collection("posts").add({
                projectID: projectID,
                projectName: projectName,
                name: name,
                text: text,
                timestamp: this.timestamp,
                uid: this.uid,
                image: remoteUri,
                email: firebase.auth().currentUser.email,
            })
                .then(ref => {
                    res(ref)
                })
                .catch(error => {

                    rej(error)
                }).then(() => {
                    this.firestore.collection("projects").doc(projectID).collection("projectPosts").add({
                        name: name,
                        text: text,
                        timestamp: this.timestamp,
                        uid: this.uid,
                        imageLink: remoteUri,
                        email: firebase.auth().currentUser.email,
        
                    })
                        .then(ref => {
                            res(ref)
                        })
                        .catch(error => {
                            rej(error)
                        })
                })
        })

    }
    addComm = async ({ projectID, type, link }) => {


        return new Promise((res, rej) => {

            this.firestore.collection("projects").doc(projectID).collection("CommunicationLinks").add({
                type: type.label,
                link: link,

            })
                .then(ref => {
                    res(ref)
                })
                .catch(error => {

                    rej(error)
                })
        })

    }
    addDesign = async ({ text, localUri, projectID, name }) => {
        let remoteUri;
        if (localUri) {

            remoteUri = await this.uploadPhotoAsync(localUri)
        }
        else {
            remoteUri = " "
        }


        return new Promise((res, rej) => {

            this.firestore.collection("projects").doc(projectID).collection("projectPosts").add({
                name: name,
                text: text,
                timestamp: this.timestamp,
                uid: this.uid,
                imageLink: remoteUri,
                email: firebase.auth().currentUser.email,

            })
                .then(ref => {
                    res(ref)
                })
                .catch(error => {

                    rej(error)
                })
        })

    }
    getProjs = async (email) => {
        let allProjects = []
        return this.firestore.collection("projects").where("repEmail", "==", email)
                .get()
                .then(function (querySnapshot) {
                    //TODO MAKE THIS HANDLE THE CASE WHEN THERE ARE NO DOCUMENTS. IF YOU ARE ERRORING USING THIS METHOD, THAT MIGHT BE THE CAUSE.
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        
                        allProjects.push({proj: doc.data(), id: doc.id})
                    
                    });
                   return allProjects
                })
                .catch(function (error) {
                    rej("Error getting documents: ", error);
                });
    }
    delProj = async (proj) => {
        console.log('this is the projectolookin', proj)
        const projectID = proj.id
      
            this.getUserData(proj.proj.repEmail).then(({ user,id }) => {
                const indexOfProjectID = user['projects'].indexOf(projectID)
                
                const newArr = user['projects']
                if (indexOfProjectID>-1) {
                    newArr.splice(indexOfProjectID, 1)
                }
                const userDoc = this.firestore.collection("users").doc(id)
                userDoc.update({
                    projects: newArr
                });
        
    })
    console.log('here?')
    let userRef = firebase.database().ref('messages/specificChatss/' + proj.proj.groupChatID);
    userRef.remove()
    this.firestore.collection("projects").doc(proj.id).delete()
}
    getUserData = async (email) => {

        return new Promise((res, rej) => {
            this.firestore.collection("users").where("email", "==", email)
                .get()
                .then(function (querySnapshot) {
                    //TODO MAKE THIS HANDLE THE CASE WHEN THERE ARE NO DOCUMENTS. IF YOU ARE ERRORING USING THIS METHOD, THAT MIGHT BE THE CAUSE.
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        
                        res({ id: doc.id, user: doc.data() });
                    
                    });
                })
                .catch(function (error) {
                    rej("Error getting documents: ", error);
                });
        })
    }
    getProject = async (projID) => {
        console.log('this is projo id', projID.projID)
        return new Promise((res, rej) => {
            this.firestore.collection("projects").doc(projID.projID)
                .get()
                .then(function (doc) {
                        console.log("this is doc", doc.data())
                        res({ id: doc.id, user: doc.data() });
                    

                })
                .catch(function (error) {
                    rej("Error getting documents: ", error);
                });
        })
    }
    save = async ({name, shortBio, who, topics}) => {
        Fire.shared.getUserData(firebase.auth().currentUser.email).then(({id}) => {
            const userDoc = this.firestore.collection("users").doc(id)
            userDoc.update({
                name,
                shortBio,
                who,
                topics,
            });
        })
        
    }
    addUser = async ({ name, email, who, shortBio, projects, topics }) => {

        return new Promise((res, rej) => {

            this.firestore.collection("users").add({
                name: name,
                email: email,
                who: who,
                shortBio: shortBio,
                projects: projects,
                topics: [],
                block: [],
                messageIDs: []
            })
                .get().then(ref => {

                    this.getUserData(email).then(({ id }) => {
                        const userDoc = this.firestore.collection("users").doc(id)
                        userDoc.update({
                            topics: topics
                        });
                    })
                    res(ref)
                })
                .catch(error => {

                    rej(error)

                })
        })
    }
   
    addChat = async ({email1, email2 }) => {

        // TODO Add an alert if they already have a chat in common
        // This doesnt work for group chats
        // TODO CATCH IF ONE OF THE USERS HAS BLOCKED THE OTHER
        const { id: user1Id, user: user1 } = await this.getUserData(email1);
        const { id: user2Id, user : user2} = await this.getUserData(email2);

        const commonMessageArr = user1["messageIDs"].filter(messageID => {
            return user2["messageIDs"].includes(messageID)
        })

        // const groupchatsWithUser2 = user1["messageIDs"].filter(messageID => {
        //     return user2["messageIDs"].includes(messageID) && this chat is a group chat.
        // })
        //  && groupchatsWithUser2.length != 0
        if(commonMessageArr.length > 0) {
            return commonMessageArr[0];
        }
        
        const id = await firebase.database().ref('messages/specificChatss').push(
           { "email1": email1,
                "email2": email2,
            'groupChat': false}
        )
        const chatRef = JSON.stringify(id).split("specificChatss/")[1]
        const chatId = chatRef.split(`"`)[0]

    
        const user1MessageIds = user1["messageIDs"]

        user1MessageIds.push(chatId)
        const userDoc = this.firestore.collection("users").doc(user1Id)
        userDoc.update({
            messageIDs: user1MessageIds
        });
        

        const user2MessageIds = user2["messageIDs"]
        if (user2MessageIds.includes(chatId)) {
            Alert.alert("You already have a chat with this user.");
            throw new Error("You already have a chat with this user");
        } else {
            user2MessageIds.push(chatId)
            const userDoc = this.firestore.collection("users").doc(user2Id)
            userDoc.update({
                messageIDs: user2MessageIds
            });
            }
        console.log("This ihys id", chatId)
        
        return chatId
    }
    //CHAT SPECIFIC STARTS HERE

    //Create a chat id whenever someone starts a chat
    //With each user have an array that stores chat ids
    send = (messages, chatID, user) => {

        console.log('this is messages', messages)
        messages.forEach(item => {

            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: user
            }
            // if(firebase.database().ref(`messages/specificChatts/${chatID}/email1`) == user['email']) {
            //     firebase.database().ref(`messages/specificChatts/${chatID}`).set({
            //         email2MR: 1
            //     })
            // } else if(firebase.database().ref(`messages/specificChatts/${chatID}/email2`) == user['email']) {
            //     firebase.database().ref(`messages/specificChatts/${chatID}`).set({
            //         email1MR: 1
            //     })
            // }
   
            this.messageDB(chatID).push(message)
            this.currMessage(chatID).set({
                text: message['text'],
                timestamp: message['timestamp'],
                user: message['user']
            })
        })
    }
   
    currMessage(chatID) {
        return firebase.database().ref(`messages/specificChatss/${chatID}/newestMessage`)
    }
    messageDB(chatID) {

        return firebase.database().ref(`messages/specificChatss/${chatID}/actualChats`)
    }
    parse = message => {

        const {user, text,timestamp} = message.val();
        const {key: _id} = message;
        const createdAt = new Date (timestamp)

        return {
            _id,
            createdAt,
            text,
            user
        }   
    }

    get = (callback, chatID) => {
        this.messageDB(chatID).on("child_added", snapshot => {

            callback(this.parse(snapshot));
        } )
    }

    off(chatID) {
        this.messageDB(chatID).off()
    }

    // CHAT SPECIFIC ENDS HERE
    addBlock = email => {

        return this.getUserData(firebase.auth().currentUser.email).then(({ id, user: user1 }) => {
            this.getUserData(email).then(({user: user2}) => {
                console.log("This is user", user1)
                console.log("This is messageID", user1["messageIDs"])
                const messageIDs = user1['messageIDs']
                console.log("This is user2", user2)
                const commonMessageArr = messageIDs.filter(messageID => {
                    return user2["messageIDs"].includes(messageID)
                })
                if(commonMessageArr.length> 0) {
                    // commonMessageArr[0]
         
                    const currMessageIDs = user1["messageIDs"]
                    const everythingButBlockedUser = currMessageIDs.filter(messageID => {
                        return messageID != commonMessageArr[0]
                    })
                    const userDoc = this.firestore.collection("users").doc(id)
                    userDoc.update({
                        messageIDs: everythingButBlockedUser
                    });
    
                }
            }).then(() => {
                console.log("Do we get here?")
          
                const arr = user1["block"]
    
                if (arr.includes(email)) {
                    Alert.alert("You have already blocked this user.");
                    throw new Error("User has already been blocked");
                } else {
                    arr.push(email)
                    const userDoc = this.firestore.collection("users").doc(id)
                    userDoc.update({
                        block: arr
                    });
                }
            })
            })

    }
    joinProject = (projectId, project) => {
        console.log('this is projecto', project, projectId)
        return this.getUserData(firebase.auth().currentUser.email).then(({ id, user }) => {
            let arr = user["projects"]
            
            if (arr.includes(projectId)) {
                Alert.alert("You are already in this project.")
                return;
            } 
            // else if(user['messageIDs'].includes(project['groupChatID'])){

            // }else {
                else {
                let messages = []
                if(user['messageIDs'] !== undefined) {
                    messages = user['messageIDs']
                }
                messages.push(project['groupChatID'])
                
                arr.push(projectId)
                console.log('this is user', user)
                const userDoc = this.firestore.collection("users").doc(id)
                console.log("this is messages and arr", messages, arr)
                const currUsers = project["userEmails"]
                currUsers.push(firebase.auth().currentUser.email)
                const projectDoc = this.firestore.collection("projects").doc(projectId)
                return Promise.all(
                    userDoc.update({
                    messageIDs: messages,
                    projects: arr
                    }),
                    projectDoc.update({
                        userEmails: currUsers
                    })
                )
            }

        })

    }
    leaveChat = async(messageID) => {
        this.getUserData(firebase.auth().currentUser.email).then(({user, id}) => {
            console.log("message ID", messageID)
            const indexOfGroupChat = user['messageIDs'].indexOf(messageID)
            console.log("this is the index of group chat", indexOfGroupChat)
            let groupArr = user['messageIDs']
            if(indexOfGroupChat >-1) {
                groupArr.splice(indexOfGroupChat, 1)
            }
            const userDoc = this.firestore.collection("users").doc(id)
            console.log("this is group arr", groupArr)
            userDoc.update({
                messageIDs: groupArr
            });
        })
        // if not a group chat delete the chat
      
    }
    leaveProject = async(projectID, email) => {
       console.log("This is project id", projectID)
        this.getUserData(email).then(({ user,id }) => {
            const indexOfProjectID = user['projects'].indexOf(projectID)
            
            const newArr = user['projects']
            if (indexOfProjectID>-1) {
                newArr.splice(indexOfProjectID, 1)
            }
            const userDoc = this.firestore.collection("users").doc(id)
            userDoc.update({
                projects: newArr
            });
            Fire.shared.getProject({projID: projectID}).then(({user}) => {
                const projectDoc = this.firestore.collection("projects").doc(projectID)
                let emailsInProj = user['userEmails']
                const index = emailsInProj.indexOf(email)
                if(index >-1) {
                    emailsInProj.splice(index, 1)
                }
                projectDoc.update({
                    userEmails: emailsInProj
                })
                const groupChatID = user['groupChatID']
                console.log("this is group chat id", groupChatID)
                this.leaveChat(groupChatID)
            })
        })
    }
    addProject = async ({ title, descrip, topics, numStudents }) => {
    
return this.getUserData(firebase.auth().currentUser.email).then((user) =>{
            console.log("Do you get here?v4", user)
            const u = user.name
           return this.firestore.collection("projects").add({
                title: title,
                descrip: descrip,
                topics: topics,
                name: user.user.name,
                repEmail: firebase.auth().currentUser.email,
                numStudents:numStudents
            })  .catch(function (error) {
                alert("Error adding project, please try again later");
        })
})
       
                // .then((docRef) => {
                //     const chatRef = JSON.stringify(id).split("specificChatss/")[1]
                //     const chatId = chatRef.split(`"`)[0]
                //     firebase.database().ref(`messages/specificChatss/${chatId}`).set({
                //         name: title,
                //         projectID: docRef.id,
                //         groupChat: true
                //     })
                //     console.log("this is id", id)
                //     console.log("this is id", id)
                //      const userDoc = this.firestore.collection("projects").doc(docRef.id)
                //     return userDoc.update({
                //         groupChatID: chatId
                //     }).then(() => {
                //         console.log("this is chatId", chatId)
                //         return this.joinProject(docRef.id,  {groupChatID: chatId, userEmails: []} )  
                //     })
                   
                // })
                // .catch(function (error) {
                //     console.error("Error adding document: ", error);
                // });
    }
    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`

        return new Promise(async (res, rej) => {

            const response = await fetch(uri).catch(error => {
                rej(error)
            })

            const file = await response.blob().catch(error => {
                rej(error)
            })


            let upload = firebase.storage().ref(path).put(file)

            upload.on("state_changed", snapshot => { }, err => {

                rej(err)
            },
                async () => {

                    const url = await upload.snapshot.ref.getDownloadURL();

                    res(url)
                })
        })
    }
    get firestore() {
        return firebase.firestore()
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid
    }

    get timestamp() {
        return Date.now()
    }
}



Fire.shared = new Fire()
export default Fire
