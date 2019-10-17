import React, { Component } from 'react'
import {
View, Text, StyleSheet, TextInput, TouchableOpacity, PermissionsAndroid,Alert,AsyncStorage
} from 'react-native'
import fb, { fbLogin, user_register } from '../config/fbase'

import { DrawerActions } from 'react-navigation-drawer';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { LoginButton, AccessToken,LoginManager } from 'react-native-fbsdk';
import Drawer from './drawerContent'

export default class Login extends Component {
state={}

     
    // CUSTOMIZATION OF STACK HEADER
    static navigationOptions = ({navigation}) => {
        return{

            title: 'Crime Alert',
        headerStyle: {
            backgroundColor:'coral'
        },
        headerTintColor: 'red',
        headerTitleStyle: {
            fontWeight: 'bold',
            color:'white',
        },
    }
      };
     
      async _fblogin(){
        LoginManager.logInWithPermissions(["public_profile"]).then(
        (result) => {
            if (result.isCancelled) {
              console.log("Login cancelled");
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  // console.log(data.accessToken.toString(),data)
                  const { accessToken } = data
                  let token = accessToken
                  fetch('https://graph.facebook.com/v2.5/me?fields=email,name,picture.type(large),friends&access_token=' + token)
                  .then((response) => response.json())
                  .then((json) => {
           fbLogin(token).then(suc=>{
            console.log('fbl',suc.user.uid)
            user_register(suc.user.uid,{name:json.name,pic:json.picture.data.url})
            this.setState({pic:json.picture.data.url,user:json})
            Alert.alert('Welcome \n'+json.name+' in Crime Alert.')
            AsyncStorage.setItem('user',JSON.stringify({name:json.name,pic:json.picture.data.url}))
            this.props.navigation.navigate('Home',{uid:suc.user.uid})
          })
                   
                  })
                  .catch(() => {
                    console.log('ERROR GETTING DATA FROM FACEBOOK')
                  })
                }
              )
              console.log(
                "Login success with permissions: " +
                  result.grantedPermissions.toString(),result
              );
            }
          },
          function(error) {
            console.log("Login fail with error: " + error);
          }
        );
      }
      
      componentDidMount(){
        setTimeout(()=>{

          let user = fb.auth().currentUser
          if(user){
            this.props.navigation.navigate('Home',{uid:user.uid})
          }
        },5000)
      }

    render(){
        return(
            <View style={styles.container}>
             
                 <TouchableOpacity style={styles.textCont} onPress={()=>this._fblogin()}>
                   <Text style={styles.txt}>Facebbok login</Text>
                 </TouchableOpacity>
               
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'#29666678'
    },
    textCont:{
      alignSelf:'center',backgroundColor:'navy',
      height:50,
      width:200,
      borderRadius:5,
      justifyContent:'center',
    },
    txt:{
      color:'white',
      fontSize:18,
      textAlign:'center'
      
    }
})