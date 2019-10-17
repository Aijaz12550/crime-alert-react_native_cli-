import React, { Component } from 'react'
import { View, Text,StyleSheet,TouchableHighlight,TouchableOpacity,Image,ScrollView,AsyncStorage } from 'react-native'
import { DrawerActions } from 'react-navigation-drawer';
import fb from '../config/fbase'

export default class DrawerContent extends Component {

    state={

    }
    componentDidMount(){
         AsyncStorage.getItem('user',(error,result)=>{
             console.log('>>>>>>>>>>------',result)
             this.setState({result:JSON.parse(result)})
        })
       
    }
    signout(){
        fb.auth().signOut().then(success=>{
            this.props.navigation.navigate('Login')
        })
    }
    render() {
        var {result} = this.state;
       console.log('>>',result)
        return (
            <TouchableOpacity activeOpacity={0.5}  style={styles.drawerTransparent}>
                 <TouchableOpacity  activeOpacity={1} style={styles.drawer}>
                <ScrollView>
                    
                    <View style={styles.header}>
                        <TouchableOpacity onPress={()=>this.props.navigation.dispatch(DrawerActions.closeDrawer())} style={{alignSelf:'flex-end',marginRight:15}}><Text style={[styles.text,{color:'white',fontSize:18}]}>{'X'}</Text></TouchableOpacity>
                        {result && <Image source={{uri:result.pic}} style={styles.headerImage} />}
                        {result &&  <Text style={[styles.text,{color:'white'}]}>{result.name}</Text>}
                    </View>

                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Home')} underlayColor={'coral'}>
                        <View style={styles.row}>
                        <Image style={[styles.headerImage,{height:25,width:25,backgroundColor:'coral'}]}  />
                        <Text  style={styles.text}>Home</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  underlayColor={'rgba(23,30,20,0.2)'}>
                        <View style={styles.row}>
                        <Image style={[styles.headerImage,{height:25,width:25,backgroundColor:'coral'}]}  />
                        <Text  style={styles.text}>All Robbed History</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  underlayColor={'rgba(23,30,20,0.2)'}>
                        <View style={styles.row}>
                        <Image style={[styles.headerImage,{height:25,width:25,backgroundColor:'coral'}]}  />
                        <Text  style={styles.text}>My Robbed History</Text>
                        </View>
                    </TouchableOpacity>
                    {/* _____________________________________________________________________ */}
                    <View style={styles.line}></View>
                    <TouchableHighlight onPress={()=>this.signout()} underlayColor={'rgba(0,0,0,0.2)'}>
                        <View style={styles.row}>
                        <Image style={[styles.headerImage,{height:25,width:25,backgroundColor:'coral'}]}  />
                        <Text  style={styles.text}>SignOut</Text>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    drawerTransparent:{
        flex:1,
        backgroundColor:'transparent'
    },
    drawer:{
        flex:1,
        // width:350,
        width:'100%',
        justifyContent:'center'
    },
    header:{
        width:'100%',
        height:200,
        // backgroundColor:'coral',
        backgroundColor:'#6195ff',
        alignItems:'center',
        justifyContent:'space-around'
    },
    headerImage:{
        height:100,
        width:100,
        backgroundColor:'white',
        borderRadius:50,
    },
    row:{
        flexDirection:'row',
        paddingVertical:15,
        paddingLeft:20,
    },
    menu:{
        width:10,
        height:10,
        backgroundColor:'red',
        borderRadius:50,
        alignSelf:'center',
    },
    text:{
        marginTop:5,
        fontWeight:'bold',
        marginLeft:15,
        color:'#111',
    },
    line:{
        width:'90%',
        alignSelf:'center',
        height:1,
        backgroundColor:'gray',
        margin:15,
    }
})