import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EmployeeListScreen from './screens/EmployeeListScreen';
import CreateEmployeeScreen from './screens/CreateEmployeeScreen';
import EditEmployeeScreen from './screens/EditEmployeeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EmployeeList">
        <Stack.Screen 
          name="EmployeeList" 
          component={EmployeeListScreen} 
          options={{ title: "Employees" }}
        />
        <Stack.Screen 
          name="CreateEmployee" 
          component={CreateEmployeeScreen} 
          options={{ title: "Create Employee" }}
        />
        <Stack.Screen 
          name="EditEmployee" 
          component={EditEmployeeScreen} 
          options={{ title: "Edit Employee" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}