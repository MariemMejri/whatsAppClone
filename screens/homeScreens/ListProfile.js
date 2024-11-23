import { FlatList, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState,useEffect } from "react";
import { Image, ImageBackground, StyleSheet, Text } from "react-native";
import firebase from "../../config";
const data=[];
const database = firebase.database();
const ref_listProfile = database.ref('ListProfile');


export default function ListProfile(props) {
  const [data, setdata] = useState([]);
  useEffect(() => {
    ref_listProfile.on("value",(Snapshot)=>{
      var d=[];
      Snapshot.forEach((un_profil)=>{
        data.push(un_profil.val());
      });
      
    });
  
    return () => {
      ref_listProfile.off();
    }
  }, []);
  
  return (
    <ImageBackground
      source={require("../../assets/flower.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>List Profils</Text>
      <FlatList
       data ={data}
       renderItem={()=>{
        return <Text onPress={()=>{
          props.navigation.navigate("Chat");
        }}></Text>
       }}
       style={{ backgroundColor: "red", width: "95%" }}></FlatList>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "#07f",
    fontWeight: "bold",
  },
  container: {
    color: "blue",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
