//Import de componentes
import {
  View,Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Appearance,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { router } from 'expo-router'

//********************************************Import de depêndencias e componentes***********************************************//
import BackArrow from "../../../components/BackArrow"
import cores from '../../../Util/coresPadrao'
import WeekDays from '../../../components/WeekDays'
import LabelAndHour from '../../../components/LabelAndHour'
import Popup from '../../../components/Popup'


export default function TimelineDays(){
//**********************************************HOOKS**********************************************************************//
  const [dataWeek, setDataWeek] = useState({
    "sunday" : {"inicio": "05:00", "fim": "23:59"},
    "monday":  {"inicio": "05:00", "fim": "23:59"},
    "tuesday": {"inicio": "05:00", "fim": "23:59"},
    "wednesday": {"inicio": "05:00", "fim": "23:59"},
    "thursday": {"inicio": "05:00", "fim": "23:59"},
    "friday": {"inicio": "05:00", "fim": "23:59"},
    "saturday": {"inicio": "05:00", "fim": "23:59"}
  })

  const[popupVisibility, setPopupVisibility] = useState(false)
  const[popupText, setPopupText] = useState("")
  const[popupOption, setPopupOption] = useState([])
  const[popupColor, setPopupColor] = useState("")

  const {width, height} = Dimensions.get('window')
//**********************************************Alteração automática de tema*****************************************************//
  const[colorScheme, setColorScheme] = useState(Appearance.getColorScheme())
  useEffect(() => {
    const listener = Appearance.addChangeListener(( scheme ) => {
      setColorScheme(scheme.colorScheme)
    })
    return () => listener.remove()
  }, [])
  
//************************************************Funções**********************************************************************//  
  let numeroComponents = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

  function popup(text, options=null, color=null){
    setPopupVisibility(true)
    setPopupText(text)
  
    if(options){
      setPopupOption([... options])
    }
    if(color){
      setPopupColor(color)
    }
  }

  function nextStage(){
    let keysOfData = Object.keys(dataWeek)
    const hasNullValue = keysOfData.some(key => dataWeek[key] == null);

    if(hasNullValue){
      popup("Preencha todos os campos", null, "yellow")
      return
    }else if(keysOfData.length == 0){
      popup("Selecione ao menos um dia", null, "yellow")
      return
    }
    
    router.push({
      pathname: '../TaskList',
      params: {data:  JSON.stringify(dataWeek)}
    })
  }
//**********************************************Animações**********************************************************************//

//***********************************************Estilos************************************************************************//
  const styles = StyleSheet.create({ 
    principal:{
      backgroundColor: colorScheme === "dark" ? cores.azulEscuroDark : cores.azulClaro1Light,
      height: "100%",
      width:"100%",
      paddingVertical:20,
      paddingHorizontal:15,
    },
    
    styleContent:{
      justifyContent:"flex-start"
    },

    scroll:{
      width:"100%",
      height: "100%",
    },
    scrollContent:{
      flexDirection:"row",
      justifyContent: "flex-start",
      gap:10,
      paddingVertical:50,
      left:0
    },

    labels:{
      width: "100%",
      alignItems: "flex-start",
      justifyContent:  "space-around",
    },

    save: {
      padding: 15,
      backgroundColor: cores.azulDark,
      borderRadius: 10,
      zIndex: 2,
      position: "relative",
      alignSelf: "flex-end",
      bottom: 0,
    },
    text: {
      fontSize: 25,
      color: cores.ghostWhite
    },
  })
//***********************************************Tela****************************************************************************//
  return(
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }} 
      >
        <ScrollView style={styles.principal} contentContainerStyle={styles.styleContent}>
          <BackArrow link={"../../pagesWithHeader/ChoiceTimeline"}></BackArrow>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <WeekDays handleWeek={setDataWeek} orientation={"column"}/>

            <View style={styles.labels}>
              {numeroComponents.map((component) => (
                <LabelAndHour 
                  label1={"Início"} 
                  label2={"Fim"} 
                  handleData={setDataWeek} 
                  data={dataWeek}
                  isActived={component in dataWeek}
                  id={component}
                />
              ))}
            </View>


          </ScrollView>
            <Pressable style={styles.save} onPress={nextStage}>
              <Text style={styles.text}>Próxima</Text>
            </Pressable>
        </ScrollView>

      </KeyboardAvoidingView>

      {popupVisibility && (
        <Popup 
          message={popupText} 
          option= {popupOption.length !== 0 ? popupOption[0] : ""} 
          link= {popupOption.length !== 0 ? popupOption[1] : ""} 
          handle={setPopupVisibility}
        />
      )}
    </>
  )
  
}