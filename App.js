import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EventList from "./app/events/eventlist";
import HomeScreen from "./app/home";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Events" component={EventList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
