import {Dimensions} from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

// LoginScreen
export const LOGO_WIDTH_MD = WINDOW_WIDTH * 0.7;
export const LOGO_HEIGHT_MD = (LOGO_WIDTH_MD * 520) / 959;
export const APP_NAME_FONT_SIZE = WINDOW_WIDTH * 0.1655;
export const TITLE_FONT_SIZE = WINDOW_WIDTH * 0.0458;
