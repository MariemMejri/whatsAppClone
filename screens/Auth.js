import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native';
import firebase from "../config";
const auth = firebase.auth();

export default function Auth(props) {
  var email,pwd;
  return (
    <ImageBackground source={require("../assets/flower.jpg")} blurRadius={3} style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.textStyle}>Welcome</Text>
        <TextInput onChangeText={(txt)=>{
          email=txt;
        }} keyboardType='email-address' placeholder='email' style={styles.textInputStyle}></TextInput>
        <TextInput onChangeText={(txt)=>{
          pwd=txt;
        }} placeholder='password' secureTextEntry={true} style={styles.textInputStyle}></TextInput>
        <View style={styles.container2}>
           <Button 
           color={'#c6a3c6'}
           onPress={() => {
            
          auth.signInWithEmailAndPassword(email,pwd).then(() => {
            props.navigation.navigate("Home");
          })
          .catch((error) => {
            alert(error);
          });
          }}
           title ="submit"></Button>
           <Button color={'#c6a3c6'} title='Exit'></Button>
        </View>
        <Text onPress={()=>{
          props.navigation.navigate('NewUser');
        }} style={styles.textStyle1}>Create New User</Text>   
        </View>
        <StatusBar style="auto"/>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',  //align hor
    justifyContent: 'center', // vertical
  },
  container1: {
    backgroundColor:'#0002',
    height:300,
    marginBottom:10,
    width:'80%',
    alignItems:'center',
    justifyContent:'center',
},
container2: {
  flexDirection:'row',
  justifyContent:'center',
  gap:40,
  marginBottom:10,
},
textStyle :{
  //backgroundColor: 'white',
  fontSize:32,
  color:'#fff',
  marginBottom:10,

},
textStyle1 :{
  width:'100%',
  textAlign:'right',
  paddingRight:20,
  fontWeight:'bold',
  //backgroundColor: 'white',
  fontSize:15,
  color:'#fff',

},

  textInputStyle :{
    borderRadius:10,
    padding:10,
    height:45,
    width:"80%",
    marginBottom:10,
    backgroundColor:'#fff'
  }
  
});
