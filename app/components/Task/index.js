//Import de componentes
import {
  StyleSheet,
  ScrollView,
  View,
  Appearance,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native'
import React, { useState, useEffect } from 'react'

//********************************************Import de depêndencias e componentes***********************************************//
import cores from '../../Util/coresPadrao'
import WeekDays from '../../components/WeekDays'
import LabelAndHour from '../../components/LabelAndHour'
import InputLabel from '../InputLabel'


export default function Task({data, handleData, tasks}){
//**********************************************HOOKS**********************************************************************//
  const[dataTask, setDataTask] = useState({})
  const[name, setName] = useState("")
  const {width, height} = Dimensions.get('window')

  let days = Object.keys(data)
  console.log(dataTask)
  
//**********************************************Alteração automática de tema*****************************************************//
  const[colorScheme, setColorScheme] = useState(Appearance.getColorScheme())
  useEffect(() => {
    const listener = Appearance.addChangeListener(( scheme ) => {
      setColorScheme(scheme.colorScheme)
    })
    return () => listener.remove()
  }, [])

//************************************************FUNÇÕES**********************************************************************//

  useEffect(() =>{
    let keysOfTask = Object.keys(dataTask)
    keysOfTask.forEach(day =>{
      if(dataTask[day] && dataTask[day]['start']){
        let startTask = dataTask[day]['start']
        let endTask  = dataTask[day]['end']

        let startDay = data[day]['start']
        let endDay = data[day]['end']

        let hourStartTaks = new Date(`1970-01-01T${startTask}:00`)
        let hourEndTask = new Date(`1970-01-01T${endTask}:00`)
        let hourStartDay = new Date(`1970-01-01T${startDay}:00`)
        let hourEndtDay = new Date(`1970-01-01T${endDay}:00`)

        if( !(hourEndTask > hourEndtDay || hourStartTaks <  hourStartDay) && name !== "" ){
          tasks[name][day] = {"start": startTask, "end": endTask}
        }
      }
    })
    handleData(tasks)
    console.log(tasks)

  }, [dataTask])
//************************************************Variáveis**********************************************************************//

  let keys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
  if(days){
    let  newKeys = []
    keys.forEach(key => {
      if(days.includes(key)){
        newKeys.push(key)
      }
    });
    days = newKeys
  }
//**********************************************Animações**********************************************************************//

//***********************************************Estilos************************************************************************//
  const styles = StyleSheet.create({ 
    principal:{
      backgroundColor: colorScheme === "dark" ? cores.azulDark : cores.ghostWhite,
      height: "auto",
      paddingVertical:20,
      paddingHorizontal: PixelRatio.getPixelSizeForLayoutSize(15),
      borderRadius: PixelRatio.get() * 3,
    },
    
    styleContent:{
      justifyContent:"flex-start",
      gap: 0
    },

    scroll:{
      width:"100%",
      height: "auto",
    },

    scrollContent:{
      flexDirection:"row",
      justifyContent: "flex-start",
      gap:PixelRatio.get() * 5,
      paddingVertical: PixelRatio.get()*10,
      left:0
    },

    labels:{
      width: "100%",
      alignItems: "flex-start",
      justifyContent:  "space-around",
    },
  })
//***********************************************Tela****************************************************************************//
  return(
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }} 
    >
      <ScrollView style={styles.principal} contentContainerStyle={styles.styleContent}>
        <InputLabel label="Tarefa" typeInput="text" handleText={setName}/>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <WeekDays handleWeek={setDataTask}orientation={"column"} dias={days}/>

          <View style={styles.labels}>
            {days.map((component) => (
              <LabelAndHour 
                label1={"Início"} 
                label2={"Fim"} 
                handleData={setDataTask} 
                data={dataTask}
                isActived={component in dataTask}
                id={component}
              />
            ))}
          </View>
        </ScrollView>
      </ScrollView>

    </KeyboardAvoidingView>
  )
}