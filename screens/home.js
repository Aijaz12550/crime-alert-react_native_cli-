import React, { Component } from 'react'
import {
View, Text, StyleSheet, TextInput,TouchableOpacity,PermissionsAndroid, Modal, Image, Dimensions,Alert,
ActivityIndicator
} from 'react-native'

import MapView, { Marker } from 'react-native-maps'
import { DrawerActions } from 'react-navigation-drawer';
import Geolocation from '@react-native-community/geolocation' 
import fb , {crime_added} from '../config/fbase'
import { CameraKitCameraScreen } from 'react-native-camera-kit'
import { readDir, DocumentDirectoryPath,readFile,stat,writeFile } from 'react-native-fs'
import ImgIcon from '../assets/img.png'

export default class Home extends Component {

    state={
        modal:false,modal1:false,camera:false,uri:undefined,pic:'',img0:'',img1:'',img2:'',des:'',
        picArray:[],aI:false,
    }
    
    // CUSTOMIZATION OF STACK HEADER
    static navigationOptions = ({navigation}) => {
        return{

            title: 'Home',
            headerRight:<TextInput  
            style={{ height:35,width:300,backgroundColor:'white',alignSelf:"center",maxWidth:800,marginRight:10,borderRadius:10}}
            placeholder='Search places here..'
                 />,

                //  toggle
            headerLeft: 
            <TouchableOpacity onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())}
             style={{ display:'flex',flexDirection:'column',marginLeft:10,alignSelf:"center",}}>

        <Text style={{  width:30,height:2,backgroundColor:'white',alignSelf:"center", marginBottom:4}}></Text>
        <Text style={{  width:30,height:2,backgroundColor:'white',alignSelf:"center", marginBottom:4}}></Text>
        <Text style={{  width:30,height:2,backgroundColor:'white',alignSelf:"center", marginBottom:4}}></Text>
        <Text style={{  width:30,height:2,backgroundColor:'white',alignSelf:"center", marginBottom:4}}></Text>

         </TouchableOpacity>,
    //   toggle end

        headerStyle: {
            backgroundColor:'coral'
            // backgroundColor: '#946638',
        },
        headerTintColor: 'red',
        headerTitleStyle: {
            fontWeight: 'bold',
            color:'white'
        },
    }
 };
// _________________________________________________Getting_Location_________________________________________
      async _get_location () {
          try {

            // ...Taking Permission for location
              const permission = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  {
                      title:'Crime Alert App',
                      message:'Allow location permission to use the features of App.',
                      buttonNeutral:'Ask me later',
                      buttonNegative:'Cancel',
                      buttonPositive:'OK'
                  }
              )
            //   .........LOCATION PERMISSION END........

            // ...Getting location
            if( permission === PermissionsAndroid.RESULTS.GRANTED ){
                Geolocation.getCurrentPosition(position=>{
                    // console.log('position',position)
                    this.setState({
                        latlong : {
                            latitude:position.coords.latitude,
                            longitude:position.coords.longitude
                        }
                    })

                },
                (error)=>{console.log(error)},
                {enableHighAccuracy:false,timeout:20000}
                )
            }

            // ....Watching Position
            if( permission === PermissionsAndroid.RESULTS.GRANTED ){
                Geolocation.watchPosition(position=>{
                    // console.log('position',position)
                    this.setState({
                        latlong : {
                            latitude:position.coords.latitude,
                            longitude:position.coords.longitude
                        }
                    })

                },
                (error)=>{console.log(error)},
                {enableHighAccuracy:false,}
                )
            }
          } catch (error) {
              
          }
      }
// ________________________________________________Getting_location_end________________________________


// __________________________________________Marking and saving crime__________________________________
 async _crime_marked (uid,description='No description added'){
     let permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
     if(permission === PermissionsAndroid.RESULTS.GRANTED){
         Geolocation.getCurrentPosition(position=>{
             this.setState({
                 crimeMarker:{
                     latitude:position.coords.latitude,
                     longitude:position.coords.longitude,
                 }
             })
        crime_added({position,description,uid})
        this.setState({modal:false,modal1:false,aI:false})
         })
     }
 }
async componentDidMount(){
    this._get_location()
    // this.props.navigation.dispatch(DrawerActions.openDrawer())
    const sp = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    const dp = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    console.log('storage_permission..',sp,dp)

this.getting_crime_data()
  
}


// .....Capture Image
onBottomButtonPressed(event) {
    let { pic, picArray } = this.state;
    const captureImages = JSON.stringify(event.captureImages);
    let uri = event.captureImages[0].uri;
    let file = "file://"+uri
    if(pic === 0){this.setState({img0:file,camera:false})}
    if(pic === 1){this.setState({img1:file,camera:false})}
    if(pic === 2){this.setState({img2:file,camera:false})}
    

   
}
//Send pic ===========================================)

upLoadImage = async (uri) => {
   let { picArray } = this.state;
    const response = await fetch(uri);
    const blob = await response.blob();
   
    var ref = fb.storage().ref().child("crimeAlert/"+`${Math.random()*4}`);
    await ref.put(blob).on('state_changed',()=>{},()=>{},()=>ref.getDownloadURL().then(url=>{
      console.log('uuu',url)
      picArray.push(url)
      this.setState({picArray})

    }
   ));

  }

  pics_store(){
    let { img0,img1,img2 } =this.state;
    if(img0){this.upLoadImage(img0)}
    if(img1){this.upLoadImage(img1)}
    if(img2){this.upLoadImage(img2)}
  }


async _done () {
    this.setState({aI:true})
    await this.pics_store()
    setTimeout(()=>{
        let { des, picArray } = this.state;
let user = fb.auth().currentUser;
if(user){
    this._crime_marked(user.uid,{des,picArray})
}
    },10000)

 
}


getting_crime_data(){
    let db = fb.firestore()
    let main_collection = db.collection('crime_alert').doc('robbery').collection('All');
    main_collection.onSnapshot((data)=>{
        let crime_data_ = []
        data.forEach(val=>{
            console.log('~~~~~~!~~~~~',val.data())
            crime_data_.push({data:val.data(),id:val.id})
            this.setState({crime_data_})
        })
    })
}

    render(){
        let { latlong, crimeMarker, modal, modal1, camera, img0,img1,img2, aI, crime_data_ } = this.state
        
        return(
<View style={styles.container}>
                {!camera ?
            <View style={styles.container}>
                <MapView
                style={styles.map}
                region={{
                    latitude: latlong ?latlong.latitude:67.23,
                    longitude:latlong ?latlong.longitude:23.34,
                    latitudeDelta:0.019,
                    longitudeDelta:0.019,
                }}
                >
                    {
                        latlong != null &&
                        <Marker
                        title='This is Aijaz'
                        description='This is description'
                        coordinate={latlong}>
                            <View style={styles.markerContainer}>
                            <Text style={styles.marker}></Text>
                        </View>
                        </Marker>
                    }

                {crime_data_ && crime_data_.map((v,i)=>{
                    console.log('iii',v.id)
                    return(
                        <TouchableOpacity>
                            
                        <Marker
                       onPress={()=>this.props.navigation.navigate('Detail',{id:v.id})}
                        title={'Crime'}
                        description={' Press for Detail'}
                        coordinate={{latitude:v.data.position.coords.latitude,longitude:v.data.position.coords.longitude}}
                        >
                            <TouchableOpacity >

                            <View   style={styles.crime_marker_container}>
                                <Text style={styles.crime_marker_text}>Crime</Text>
                                <Text style={styles.crime_marker}></Text>
                            </View>
                            </TouchableOpacity>
                        </Marker>
                        </TouchableOpacity>
                    )
                })}
                </MapView>

                {/* Robbed_Button */}
                <TouchableOpacity style={styles.robbedButton} onLongPress={()=>this.setState({modal:true})}>
                    <Text style={styles.robbedButtonText}>Robbed</Text>
                </TouchableOpacity>

                {/* ..Crime Detail Modal */}
                <Modal animationType = {"slide"} transparent = {true} visible={modal} >
                    <View  style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',}}>
                    <View style={styles.modal}> 
                        <Text>Would you like to add Crime detail?</Text>
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:15,}}>
                        <TouchableOpacity onPress={()=>this._crime_marked()} style={styles.tl}>
                            <Text style={styles.tlb}>Later</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({modal:false,modal1:true})} style={styles.ty}>
                            <Text style={styles.tyb}>Yes</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    </View>
                </Modal>

                {/* modal 1 */}
                <Modal animationType = {"slide"} transparent = {true} visible={modal1} >
                    <View  style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',}}>
{!aI ?
    <View style={styles.modal}> 
                        <Text>Crime Description</Text>
                        <TextInput  multiline={true} value={this.state.des} style={styles.crimeDescription} onChange={(event)=>this.setState({des:event.nativeEvent.text})} />

                        <View style={styles.images}>
                           
                            <TouchableOpacity onPress={()=>this.setState({camera:true,pic:0})}>
                            <Image style={styles.img} source={img0?{uri:img0}:require('../assets/img.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.setState({camera:true,pic:1})}>
                            <Image style={styles.img} source={img1?{uri:img1}:require('../assets/img.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.setState({camera:true,pic:2})}>
                            <Image style={styles.img} source={img2?{uri:img2}:require('../assets/img.png')} />
                            </TouchableOpacity>
                            
                        </View>

                        <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:15,}}>
                        <TouchableOpacity onPress={()=>this._done()}  style={styles.ty}>
                            <Text  style={styles.tyb}>Done</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
: <ActivityIndicator size="large" color="#0000ff" />}

                    </View>
                </Modal>

</View>
                :
                <CameraKitCameraScreen
                style={{flex:1}}
                actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
                onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
                flashImages={{
                    on: require('./../assets/images/flashOn.png'),
                    off: require('./../assets/images/flashOff.png'),
                    auto: require('./../assets/images/flashAuto.png')
                }}
                cameraFlipImage={require('./../assets/images/cameraFlipIcon.png')}
                captureButtonImage={require('./../assets/images/cameraButton.png')}
                />
            }
                    </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    map:{
       width:Dimensions.get('window').width ,
       height:Dimensions.get('window').height
    },
    robbedButton:{
        position:'absolute',
        top:50,
        right:0,
        backgroundColor:'red',
        padding:10,
        borderBottomLeftRadius:20,
        borderTopLeftRadius:20,
    },
    robbedButtonText:{
        color:'white',
        borderColor:'white',
        borderBottomWidth:1,
        borderTopWidth:1,
        padding:2,
    },
    markerContainer:{
        width:40,
        height:40,
        backgroundColor:'rgba(0,0,255,0.2)',
        justifyContent:'center',
        borderRadius:20,
        zIndex:100
    },
    marker:{
        width:15,
        height:15,
        backgroundColor:'blue',
        textAlign:'center',
        alignSelf:'center',
        borderRadius:20
    },
    modal:{
        backgroundColor:'white',
        width:330,
        justifyContent:'center',
        borderRadius:5,
        padding:15,
    },
    tl:{backgroundColor:'black',padding:8,width:80,margin:5},tlb:{color:'white',textAlign:'center'},
    ty:{backgroundColor:'coral',padding:8,width:80,margin:5},tyb:{color:'white',textAlign:'center'},
    crimeDescription:{
        borderWidth:1,
        margin:3,
        maxHeight:150,
        borderColor:'lightgray',

    },
            images:{
                display:'flex',
                flexDirection:'row',
                justifyContent:"center",
                alignSelf:'center'
            }
            ,
            img:{
                backgroundColor:'lightgray',
                height:80,
                width:80,
                margin:10,
            },
            crime_marker_container:{
               
                justifyContent:'center'
            },
            crime_marker:{
                width:20,
                height:20,
                backgroundColor:'red',
                alignSelf:'center',
                zIndex:50,
                borderRadius:10
            },
            crime_marker_text:{
                fontSize:15,
                backgroundColor:'coral',
                alignSelf:'center',
                // borderBottomStartRadius:5,
                zIndex:200,
                opacity:1,
                color:'white',
                paddingLeft:5,
                paddingRight:5,
                borderWidth:1,
                borderBottomStartRadius:15,
                borderBottomEndRadius:10,
                borderRadius:7
            }
})