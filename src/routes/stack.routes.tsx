import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colors from "../styles/colors";
import { Welcome } from "../pages/Welcome";
import { UserIdentification } from "../pages/UserIdentification";
import { Confirmation } from "../pages/Confirmation";
import { PlantSave } from "../pages/PlantSave";
import AuthRoutes from "./tab.routes";

const stackRoutes = createNativeStackNavigator();

const AppRoutes: React.FC = () => (

    <stackRoutes.Navigator
        screenOptions={{ headerShown: false }}
    >
        <stackRoutes.Screen
            name="Welcome"
            component={Welcome}
        />
        <stackRoutes.Screen
            name="UserIdentification"
            component={UserIdentification}
        />
        <stackRoutes.Screen
            name="Confirmation"
            component={Confirmation}
        />
        <stackRoutes.Screen
            name="PlantSelect"
            component={AuthRoutes}
        />
        <stackRoutes.Screen
            name="PlantSave"
            component={PlantSave}
        />
        <stackRoutes.Screen
            name="MyPlants"
            component={AuthRoutes}
        />
    </stackRoutes.Navigator>
)

export default AppRoutes;