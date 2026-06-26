import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { THEME, mainstyles } from '../theme';

// SVG / Icon components
import IconHomeDriver from './Svg/IconHomeDriver';
import IconHomeClient from './Svg/IconHomeClient';
import IconBurgerMenu from './Svg/IconBurgerMenu';
import IconClientTnd from './Svg/IconClientTnd';
import IconRoutes from './Svg/IconRoutes';
// import Entypo from '@react-native-vector-icons/Entypo';
import Icon from '@react-native-vector-icons/entypo';

const ICONS = {
  driver: {
    SearchTab:  IconHomeDriver,
    ActiveDriverTendersTab: (p) => <Icon name="direction" size={20} {...p} />,
    RoutesTab: IconRoutes,
    ProfileTab: IconBurgerMenu,
  },
  client: {
    CreateTab: IconHomeClient,
    TendersTab: IconClientTnd,
    ActiveTendersTab: (p) => <Icon name="direction" size={20} {...p} />,
    ProfileTab: IconBurgerMenu,
  },
};

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  const safe = useSafeAreaInsets();
  // const ICONS =[]

  const {role} = useSelector((state) => state.login)
  const showWelcomeCarousel = useSelector((state) => state.login.showWelcomeCaurusel);
  const firstOpen = useSelector((state) => state.login.firstOpen);
  // console.log('CustomTabBar role', role)
  // ‑‑ скрываем таб‑бар, если нужно показать welcome‑карусель и т. п.
  if (showWelcomeCarousel || (role === 'driver' && firstOpen)) {
    return null;
  }

  const containerStyle = [
    styles.container,
    descriptors[state.routes[state.index].key].options.tabBarStyle, // наследуем кастомные стили из‑под экранов
    { paddingBottom: safe.bottom },
  ];

  return (
    <View style={containerStyle}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const color = isFocused ? THEME.PRIMARY : THEME.GREY400;

        // const onPress = () => navigation.navigate(route.name);
        const onPress = () => {
         // 1) эмитим tabPress, чтобы сработали listeners у Tab.Screen
         const event = navigation.emit({
           type: 'tabPress',
           target: route.key,
           canPreventDefault: true,
         });
         // 2) если кто‑то в listener не отменил поведение — обычный navigate
         if (!event.defaultPrevented) {
            navigation.navigate(route.name);
         }
        };

        // Выбираем иконку по роли и имени вкладки
        const IconComp = ICONS[role]?.[route.name];
        // console.log('TABS',role,route.name);
        // console.log('TABS',ICONS[role]?.[route.name]);
        

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.barItem}
          >
            {/* бейдж, если передан */}
            {options?.tabBarBadge ? (
              <View style={styles.badge}>
                <Text style={[mainstyles.text12R, styles.badgeText]}>
                  {options.tabBarBadge}
                </Text>
              </View>
            ) : null}

            {IconComp ? <IconComp color={color} /> : null}
            <Text style={[mainstyles.text12R, { color, marginTop: 2 }]}>
              {options.tabBarLabel ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    borderTopWidth: 2,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  barItem: {
    flex: 1,            // одинаковая ширина для всех кнопок
    alignItems: 'center',
    paddingTop: 5,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: '30%',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(231,54,37,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    lineHeight: 14,
  },
});
