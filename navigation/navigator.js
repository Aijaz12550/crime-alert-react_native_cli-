import { createAppContainer,  } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'
import DrawerHeader from '../screens/drawerContent'
import * as Routes from '../screens/index'
import React from 'react'
import { Dimensions } from 'react-native'


const Login = createStackNavigator({
        Login:Routes.Login
    })
    const Home = createStackNavigator({
        Home:Routes.Home,
        Detail : Routes.Detail
    })
    const Detail = createStackNavigator({
        Detail : Routes.Detail
    })


const drawer = createDrawerNavigator({
    Login:{screen:Login},
    Home:{screen:Home},
    Detail:{screen:Detail},
},{
   initialRouteName:'',
   contentComponent:DrawerHeader,
   drawerPosition:'left',
//    drawerWidth:Dimensions.get('window').width,
// drawerBackgroundColor:'transparent'


}
)


const AppContainer =  createAppContainer(drawer)

export default class Nav extends React.Component{
    render(){
        return<AppContainer/>
    }
}