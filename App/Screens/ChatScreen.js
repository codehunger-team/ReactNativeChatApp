import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, FlatList, Dimensions, } from 'react-native';
import AppHeader from '../Components/AppHeader';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { SendMessage, RecieveMessage } from '../Firebase/Message';
import firebase from '../Firebase/firebaseConfig';
import ImgToBase64 from 'react-native-image-base64';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
class Chat extends Component {
    state = {
        message: '',
        guestUid: '',
        currentUid: '',
        allMessages: [],
        image: ''
    }

    async componentDidMount() {
        const currentUid = await AsyncStorage.getItem('UID');
        const guestUid = this.props.navigation.getParam('guestUid');
        this.setState({ currentUid: currentUid, guestUid: guestUid });
        try {
            firebase.database().
                ref('messages').
                child(currentUid).
                child(guestUid).
                on("value", (dataSnapshot) => {
                    let message = [];

                    dataSnapshot.forEach((data) => {
                        message.push({
                            sendBy: data.val().messege.sender,
                            recieveBy: data.val().messege.reciever,
                            msg: data.val().messege.msg,
                            image: data.val().messege.image,
                            date: data.val().messege.date,
                            time: data.val().messege.time,
                        });
                        console.log('fff', data.val().messege.image)
                    })
                    this.setState({ allMessages: message.reverse() });
                    console.log('allMessages', this.state.allMessages)
                })
        } catch (error) {
            alert(error);
        }
    }

    openGallery() {
        launchImageLibrary('photo', (response) => {
            this.setState({ loader: true });
            ImgToBase64.getBase64String(response.uri)
                .then(async (base64String) => {
                    let source = "data:image/jpeg;base64," + base64String;
                    SendMessage(this.state.currentUid, this.state.guestUid, "", source).
                        then((res) => {
                            this.setState({ loader: false })
                        }).catch((err) => {
                            alert(err)
                        })

                    RecieveMessage(this.state.currentUid, this.state.guestUid, "", source).
                        then((res) => {
                            this.setState({ loader: false })
                        }).catch((err) => {
                            alert(err)
                        })
                })
                .catch(err => this.setState({ loader: false }));
        })
    }

    sendMessage = async () => {
        if (this.state.message) {
            SendMessage(this.state.currentUid, this.state.guestUid, this.state.message, "").
                then((res) => {
                    console.log(res);
                    this.setState({ message: '' })
                }).catch((err) => {
                    alert(err)
                })

            RecieveMessage(this.state.currentUid, this.state.guestUid, this.state.message, "").
                then((res) => {
                    console.log(res);
                    this.setState({ message: '' })
                }).catch((err) => {
                    alert(err)
                })
        }
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <AppHeader title={this.props.navigation.getParam('UserName')} navigation={this.props.navigation} onPress={() => this.logOut()} />
                <FlatList
                    inverted
                    style={{ marginBottom: 60 }}
                    data={this.state.allMessages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginVertical: 5, maxWidth: Dimensions.get('window').width / 2 + 10, alignSelf: this.state.currentUid === item.sendBy ? 'flex-end' : 'flex-start' }}>
                            <View style={{ borderRadius: 20, backgroundColor: this.state.currentUid === item.sendBy ? '#fff' : '#ccc' }}>
                                {item.image === "" ? <Text style={{ padding: 10, fontSize: 16, fontWeight: 'bold' }}>
                                    {item.msg} {"   "} <Text style={{ fontSize: 12 }}>{item.time}</Text>
                                </Text> :
                                    <View>
                                        <Image source={{ uri: item.image }} style={{ width: Dimensions.get('window').width / 2 + 10, height: 150, resizeMode: 'stretch', borderRadius: 30 }} />
                                        <Text style={{ fontSize: 12,position:'absolute',bottom:5,right:5 }}>{item.time}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    )}
                />
                <View style={{ bottom: 0, height: 50, width: '100%', position: 'absolute', flexDirection: 'row' }}>
                    <TouchableOpacity style={{ width: '10%', justifyContent: 'center', alignItems: 'center', marginRight: 5 }} onPress={() => this.openGallery()}>
                        <Icons name="camera" size={30} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ width: '75%', justifyContent: 'center' }}>
                        <TextInput value={this.state.message} onChangeText={(text) => this.setState({ message: text })} placeholder="Enter Message" placeholderTextColor="#000" style={{ height: 40, borderRadius: 20, backgroundColor: '#ccc' }} />
                    </View>
                    <TouchableOpacity style={{ width: '10%', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }} onPress={() => this.sendMessage()}>
                        <Icons name="send" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Spinner
                    visible={this.state.loader}
                />
            </View>
        )
    }
}




export default Chat;