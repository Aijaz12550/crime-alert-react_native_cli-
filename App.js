import React, { Component } from 'react'
import {
View, Text, StyleSheet, 
} from 'react-native'

import Drawer from './navigation/navigator'

export default class App extends Component {

    render(){
        return(
            <View style={styles.container}>
                <Drawer/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})