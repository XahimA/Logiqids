import { Dimensions, Platform } from "react-native";
//responsiveness
export const DP = (temp) => (SCREEN_WIDTH / (MOCKUP_WIDTH / temp));
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const HEADER_HEIGHT = 60;
export const MOCKUP_WIDTH = 375;
export const CHANGE_BY_MOBILE_DPI = (temp) => (SCREEN_WIDTH / (MOCKUP_WIDTH / temp));

export const BUTTON_OPACITY = 1;

export const IS_ANDROID = () => { if (Platform.OS === 'android') { return true } else { return false } }
const { height, width } = Dimensions.get('window')

export const SIZES = {
    base: 8,
    font: 14,
    radius: 30,
    padding: 8,
    padding2: 12,
    padding3: 16,

    // FONTS Sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,

    // App Dimensions
    width,
    height,
}