import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  PixelRatio,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Appearance } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import { Link, router, useGlobalSearchParams } from "expo-router";

import { ScrollView } from "moti";

//**************************************COMPONENTES***********************************************************************/
import ip from "../../../Util/localhost";
import Popup from "../../../components/Popup";
import PasswordInput from "../../../components/PasswordInput";
import Logo from "../../../components/Logo";
import cores from "../../../Util/coresPadrao";
import { checkPassword } from "../../../Util/checkData";
import { sendToken } from "../../../Util/sendToken";

export default function ResetPassword() {
  //**********************************************Alteração automática de tema***************************************************//
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const listener = Appearance.addChangeListener((scheme) => {
      setColorScheme(scheme.colorScheme);
    });
    return () => listener.remove();
  }, []);

  //**********************************************Animações**********************************************************************//
  const { email } = useGlobalSearchParams();

  //**********************************************HOOKS**********************************************************************//

  //************************************************Funções**********************************************************************/
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { width, height } = Dimensions.get("window");

  const [popupVisibility, setPopupVisibility] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupOption, setPopupOption] = useState([]);
  const [popupColor, setPopupColor] = useState("");
  const [title, setTitle] = useState("")

  async function handleSubmit() {
    let passwordVerification = checkPassword(newPassword, confirmPassword);

    if (passwordVerification.validate) {
      try {
        const response = await fetch(`${ip}/resetPasswordConfirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            password: newPassword,
          }),
        });
        const data = await response.json();

        if (response.status === 200) {
          popup(
            "Sucesso",
            "Senha alterada com sucesso",
            ["Fazer login", "../Login"],
            "green"
          );
        } else {
          popup(null, "Código inválido", null, "red");
        }
      } catch (error) {
        popup(null, "Erro no sistema, tente novamente mais tarde", null, "orange");
      }
    } else {
      popup(null, passwordVerification.message, null, "red");
    }
  }

  function popup(title, text, options = null, color = null) {
    setPopupVisibility(true);
    setPopupText(text);
    setTitle(title || "Erro")

    if (options) {
      setPopupOption([...options]);
    }

    if (color) {
      setPopupColor(color);
    }
  }

  function reSendCode() {
    sendToken(email);
  }

  //***********************************************Estilos************************************************************************//
  const styles = StyleSheet.create({
    keyboard: {
      backgroundColor:
        colorScheme === "dark" ? cores.azulEscuroDark : cores.azulClaro1Light,
      height: height,
    },
    scroll: {
      height: height,
      backgroundColor:
        colorScheme === "dark" ? cores.azulEscuroDark : cores.azulClaro1Light,
      paddingHorizontal: 20,
    },

    header: {
      backgroundColor: colorScheme === "dark" ? cores.azulDark : "#99B8D5",
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },

    contentContainer: {
      height: height * 0.9,
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: PixelRatio.get() * 5,
    },

    title: {
      marginTop: 50,
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFFF",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: 10,
      backgroundColor:
        colorScheme === "dark" ? cores.azulClaroDark : cores.ghostWhite,
      color: "black",
      paddingLeft: 7,
      fontSize: 19,
      //borda
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "black",
      borderRadius: 7,
      marginTop: 20,
      alignSelf: "center",
    },

    button: {
      text: {
        color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
        textAlign: "center",
        fontSize: 19,
      },
      backgroundColor:
        colorScheme === "dark" ? cores.azulDark : cores.azulLight,
      padding: 13,
      borderRadius: 7,
      width: "100%",
      marginTop: 40,
    },

    opcoesAlternativasText: {
      fontSize: 20,
      color: colorScheme == "dark" ? "white" : "black",
      textDecorationLine: "underline",
      marginTop: "5%",
      textAlign: "center",
    },
  });

  //***********************************************Tela***************************************************************************//
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <Pressable>
            <Link replace href={"../changePassword"}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </Link>
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.contentContainer}>
            <Logo />
            <Text style={styles.title}>
              Confirmação de redefinição de senha
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Código"
              value={token}
              onChangeText={(text) => setToken(text)}
            />

            <PasswordInput
              placeHolder={"Digite sua nova senha"}
              handleText={setNewPassword}
              style={styles.input}
            />

            <PasswordInput
              placeHolder={"Repita sua nova senha"}
              handleText={setConfirmPassword}
              style={styles.input}
            />

            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.button.text}>Redefinir senha</Text>
            </Pressable>

            {email && (
              <Pressable onPress={reSendCode}>
                <Text style={styles.opcoesAlternativasText}>
                  Reenviar código
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {popupVisibility && (
        <Popup
          title={title}
          message={popupText}
          cor={popupColor}
          option={popupOption.length !== 0 ? popupOption[0] : ""}
          link={popupOption.length !== 0 ? popupOption[1] : ""}
          handle={setPopupVisibility}
        />
      )}
    </>
  );
}
