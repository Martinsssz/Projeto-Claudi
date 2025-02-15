//Import de componentes
import {
  View, Text,
  StyleSheet,
  Appearance,
  TextInput,
  PixelRatio,
  Dimensions,
} from 'react-native'

import React, { useState, useEffect } from 'react'
//********************************************COMPONENTES******************************************************************//
import cores from '../../Util/coresPadrao'

export default function LabelAndHour({ label1, label2, handleData, isActived, id, data }) {
  
//**********************************************Hooks**********************************************************************//

  const [valueAcordar, setValueAcordar] = useState("")
  const [valueDormir, setValueDormir] = useState("")

  useEffect(() => {
    if (data['days'][id] && !data['teachers']) {
      setValueAcordar(data['days'][id]['start'])
      setValueDormir(data['days'][id]['end'])
    }
  }, [data])

  const { width, height} = Dimensions.get("window")



  //********************************************Variáveis******************************************************************//



  //**********************************************Alteração automática de tema*****************************************************//
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())

  useEffect(() => {
    const listener = Appearance.addChangeListener((scheme) => {
      setColorScheme(scheme.colorScheme)
    })
    return () => listener.remove()
  }, [])

  //************************************************Funções**********************************************************************//  
  function formatar(text, handleInput, value) {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (value.length > text.length && text.length == 2 && value.includes(":")) {
      formatedText = text.slice(0, -1)
      handleInput(formatedText)

    } else if(text.length < 2 && parseInt(text) > 2){
      formatedText =  "0" + text + ":"
      handleInput(formatedText)

    }else if (text.length == 2 && !text.includes(":")) {
      formatedText = text + ":"
      handleInput(formatedText)

    } else if (text.length == 5 && !regex.test(text)) {
      handleInput("")

    } else if (text.length == 5 && regex.test(text)) {
      handleInput(text)
    } else {
      handleInput(text)
    }
  }

  function saveInJson() {
    let newValues = {
      "start": valueAcordar,
      "end": valueDormir
    }

    let copyOfData = { ...data }
    if (copyOfData['subjects']) {
      copyOfData['schoolTime'] = newValues
    } else {
      copyOfData['days'][id] = newValues
    }
    handleData(copyOfData)
  }

  useEffect(() => {
    if (valueAcordar.length == 5 && valueDormir.length == 5 && isActived) {
      const hour1 = new Date(`1970-01-01T${valueAcordar}:00`)
      const hour2 = new Date(`1970-01-01T${valueDormir}:00`)

      if (hour1 >= hour2) {
        setValueAcordar("")
        setValueDormir("")
        return
      }
      saveInJson()
    }
  }, [isActived, valueAcordar, valueDormir])


  //**********************************************Animações**********************************************************************//

  //***********************************************Estilos************************************************************************//
  const styles = StyleSheet.create({
    main: {
      width: data['schoolTime'] ? "100%" : "80%",
      flexDirection: "row",
      justifyContent: data['schoolTime'] ? "space-between" : "space-around",
    },
    
    inputArea: {
      width: data['schoolTime'] ? "50%" : "auto",
      flexDirection: "row",
      alignItems: "center",
    },
    
    input: {
      color: "black",
      backgroundColor: colorScheme === "dark" ? cores.azulClaroDark : cores.ghostWhite,
      backgroundColor: isActived ? 
      colorScheme === "dark" ? cores.azulClaroDark : cores.ghostWhite
      :colorScheme === "dark" ? '#77878877' : '#44434477',
      fontSize: 19,
      paddingVertical: 7,
      paddingHorizontal: width*0.01,
      borderRadius: 7,
      //borda
      borderWidth: 1,
      borderStyle: "solid",
      borderBlockColor: "black",
      //Fim da borda
    },
    text: {
      color: colorScheme == "dark" ? "white" : "black",
      marginRight: PixelRatio.get()* 2,
      fontSize: data['schoolTime'] ? PixelRatio.getFontScale() * 17 : 15
    }
  })
  //***********************************************Tela****************************************************************************//
  return (
    <View style={styles.main}>
      <View style={styles.inputArea}>
        <Text style={styles.text}>{label1}</Text>
        <TextInput
          placeholder='hh:mm'
          style={styles.input}
          keyboardType='number-pad'
          maxLength={5}
          editable={isActived}
          value={valueAcordar}
          onChangeText={(text) => formatar(text, setValueAcordar, valueAcordar)}
        />
      </View>

      <View style={styles.inputArea}>
        <Text style={styles.text}>{label2}</Text>
        <TextInput
          placeholder='hh:mm'
          style={styles.input}
          keyboardType='numeric'
          maxLength={5}
          editable={isActived}
          value={valueDormir}
          onChangeText={(text) => formatar(text, setValueDormir, valueDormir)}
        />
      </View>
    </View>
  )
}