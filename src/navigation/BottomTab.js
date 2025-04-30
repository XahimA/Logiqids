import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { Colors, ScreenNames } from '../global';
import Icon, { Icons } from '../global/Icons';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

const TabArr = [
  { route: ScreenNames.HOME_SCREEN, label: 'Home', type: Icons.Ionicons, activeIcon: 'grid', inActiveIcon: 'grid-outline', component: HomeScreen },

  { route: ScreenNames.PROFILE_SCREEN, label: 'Profile', type: Icons.FontAwesome, activeIcon: 'user-circle',
   inActiveIcon: 'user-circle-o', component: ProfileScreen  },
];
const Tab = createBottomTabNavigator();
const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  useEffect(() => {
    if (focused) {
      viewRef.current.animate({0: {scale: .5, rotate: '0deg'}, 1: {scale: 1.5, rotate: '0deg'}});
    } else {
      viewRef.current.animate({0: {scale: 1.5, rotate: '0deg'}, 1: {scale: 1, rotate: '0deg'}});
    }
  }, [focused])
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={1000}
        style={styles.container}>
        <Icon type={item.type} name={focused ? item.activeIcon : item.inActiveIcon} color={focused ? Colors.PRIMARY : Colors.SECONDARY} />
      </Animatable.View>
    </TouchableOpacity>
  )
}
export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 50,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16
        }
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen key={index} name={item.route} component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})