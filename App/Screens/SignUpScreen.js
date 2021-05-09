import React, { Component } from 'react';
import { View, Image } from 'react-native';
import TextInputComponent from '../Components/TextInputComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { SignUpUser } from '../Firebase/SignUp';
import { AddUser } from '../Firebase/Users';
import Firebase from '../Firebase/firebaseConfig';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';

class SignUp extends Component {
    state = {
        name: "",
        email: "",
        password: "",
        loader: false
    }

    SignUPtoFIrebase = async () => {
        if(!this.state.name)
        {
            return alert('Please Enter Name');
        }
        if(!this.state.email)
        {
            return alert('Please Enter Email');
        }
        if(!this.state.password)
        {
            return alert('Please Enter Password');
        }
        this.setState({ loader: true })
        SignUpUser(this.state.email, this.state.password).
            then(async (res) => {
                console.log('res', res);
                var userUID = Firebase.auth().currentUser.uid;
                AddUser(this.state.name, this.state.email, '', userUID).
                    then(async () => {
                        this.setState({ loader: false });
                        await AsyncStorage.setItem('UID', userUID);
                        this.props.navigation.navigate('Dashboard');
                    }).
                    catch((error) => {
                        this.setState({ loader: false });
                        alert(error);
                    })
                console.log(userUID);
            }).
            catch((err) => {
                this.setState({ loader: false });
                alert(err);
            })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../Assets/codehunger.png')} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 30 }} />
                <TextInputComponent placeholder="Enter Name" updateFields={(text) => this.setState({ name: text })} />
                <TextInputComponent placeholder="Enter Email" updateFields={(text) => this.setState({ email: text })} />
                <TextInputComponent placeholder="Enter Password" updateFields={(text) => this.setState({ password: text })} />
                <ButtonComponent title="Sign Up" onPress={() => { this.SignUPtoFIrebase() }} />
                <Spinner
                    visible={this.state.loader}
                />
            </View>
        )
    }
}




export default SignUp;