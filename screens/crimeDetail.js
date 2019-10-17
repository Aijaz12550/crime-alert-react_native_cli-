import React, {Component} from 'react'
import { View,TouchableOpacity, Text, Image, ScrollView} from 'react-native'
import MapView, {Marker} from 'react-native-maps';
import fb from '../config/fbase'

export default class CrimeDetail extends Component {
state={

}

 // CUSTOMIZATION OF STACK HEADER
 static navigationOptions = ({navigation}) => {
    return{

        title: 'Crime Detail',
    headerStyle: {
        backgroundColor:'coral'
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontWeight: 'bold',
        color:'white',
    },
}
  };

getting_crime_data(){
    let db = fb.firestore()
    let main_collection = db.collection('crime_alert').doc('robbery').collection('All');
    main_collection.onSnapshot((data)=>{
        data.forEach(val=>{
            let {navigation} = this.props;
            let id = navigation.getParam('id','no-id')
            console.log('~~~~~~!~~~~~',val.id)
            if(val.id === id){
                
                this.setState({crime_data_:val.data()})
            }
        })
    })
}
componentDidMount(){
this.getting_crime_data()
}
    render(){
        let { crime_data_ } = this.state
        console.log('~!!!!!!!!~~',crime_data_)
        return(
            <View style={{flex:1,justifyContent:'center'}}>
                <ScrollView>

                {crime_data_ &&
                 <MapView
                 style={{height:150}}
                 region={{
                     latitude:crime_data_.position.coords.latitude,
                     longitude:crime_data_.position.coords.longitude,
                     latitudeDelta:0.019,
                     longitudeDelta:0.019,
                    }}
                    >
                    <Marker
                    coordinate={{latitude:crime_data_.position.coords.latitude,
                        longitude:crime_data_.position.coords.longitude,}}
                        >

                    </Marker>
                </MapView>
                }
               {crime_data_ &&
               <ScrollView >
                   <View style={{display:'flex',flexDirection:'row',margin:8,flexWrap:'wrap'}}>


                   {crime_data_.description.picArray && crime_data_.description.picArray.map(v=>{
                       return(
                           <Image
                           style={{width:150,height:150,margin:10,borderColor:'coral',borderWidth:1}}
                           source={{uri:v}}
                           />
                           )
                        }) }

                        </View>
                   <Text style={{alignSelf:'center',margin:5}}>{crime_data_.description.des}</Text>
                   <View style={{display:'flex',height:50,backgroundColor:'coral',justifyContent:'center'}}>
                       <Text style={{color:'white',alignSelf:'center',textAlign:'center'}}>Developer: muhammadaijaz76@gmail.com</Text>
                   </View>
                        </ScrollView>
               
            }
                
               </ScrollView>
            </View>
        )
    }
}