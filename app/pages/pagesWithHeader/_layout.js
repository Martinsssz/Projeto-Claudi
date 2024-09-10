import { View, Text} from "react-native";
import Header from "../../components/Header";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <>
      <Header/>
      <Slot/>
    </>
  );
}
