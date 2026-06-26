import {StyleSheet} from "react-native";
import { normalize } from "./util/UI/fontsUI";

export const THEME = {
  MAIN_COLOR: '#032237',
  BLUE_COLOR: '#60C1D4',
  LIGHTBLUE_COLOR: '#B7D9E4',
  BRIGHT_BLUE: '#193DBC',
  BRIGHT_GREEN: '#88DF19',
  ORANGE: '#F6C821',
  RED: '#F80505',
  ///
  GR_L: "#1488CC",
  GR_D: "#2B32B2",
  PRIMARY: "#205CBE",
  DARKBLUE: "#0F459C",
  MIDDLEBLUE: "#0F4AA9",
  BLUE: "#3D7DE5",
  REDERR: '#E73625',
  YELLOW: '#FFC700',

  //GREYS
  GREY50: "#FAFAFA",
  GREY100: "#F5F5F5",
  GREY200: "#EEEEEE",
  GREY300: "#E0E0E0",
  GREY400: "#BDBDBD",
  GREY500: "#9E9E9E",
  GREY600: "#757575",
  GREY700: "#616161",
  GREY800: "#424242",
  GREY900: "#212121",
}

export const mainstyles = {
  //TEXT
  text10R: {
    fontSize: normalize(10),
    fontWeight: '400',
    color: "#212121",
  },
  text32SB: {
    fontSize: normalize(32),
    fontWeight: '600',
    color: "#616161",
  },
  text28SB: {
    fontSize: normalize(28),
    fontWeight: '600',
    color: "#616161",
  },
  text28M: {
    fontSize: normalize(28),
    fontWeight: '500',
    color: "#616161",
  },
  text22L: {
    fontSize: normalize(22),
    fontWeight: '300',
    color: "#616161"
  },
  text22M: {
    fontSize: normalize(22),
    fontWeight: '500',
    color: "#616161"
  },
  text22SB: {
    fontSize: normalize(22),
    fontWeight: '600',
    color: "#616161"
  },
  text22B: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: "#616161"
  },
  text20R: {
    fontSize: normalize(20),
    fontWeight: '400',
    color: "#616161"
  },
  text20M: {
    fontSize: normalize(20),
    fontWeight: '500',
    color: "#616161"
  },
  text20B: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: "#616161"
  },
  text18R: {
    fontSize: normalize(18),
    fontWeight: '400',
    color: "#616161"
  },
  text18M: {
    fontSize: normalize(18),
    fontWeight: '500',
    color: "#616161"
  },
  text18SB: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: "#616161"
  },
  text18B: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: "#616161"
  },
  text17R: {
    fontSize: normalize(17),
    fontWeight: '400',
    color: "#616161"
  },
  text16L: {
    fontSize: normalize(16),
    fontWeight: '300',
    color: "#616161"
  },
  text16R: {
    fontSize: normalize(16),
    fontWeight: '400',
    color: "#616161",
    lineHeight: 24,
  },
  text16M: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: "#616161"
  },
  text16SB: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: "#616161"
  },
  text16B: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: "#616161"
  },
  text15R: {
    fontSize: normalize(15),
    fontWeight: '400',
    color: "#616161"
  },
  text14L: {
    fontSize: normalize(14),
    fontWeight: '300',
    color: "#616161"
  },
  text14R: {
    fontSize: normalize(14),
    fontWeight: '400',
    color: "#616161"
  },
  text14M: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: "#616161"
  },
  text14SB: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: "#616161"
  },
  text14B: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: "#616161"
  },
  text13R: {
    fontSize: normalize(13),
    fontWeight: '400',
    color: "#616161"
  },
  text13M: {
    fontSize: normalize(13),
    fontWeight: '500',
    color: "#616161"
  },
  text13SB: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: "#616161"
  },
  text12R: {
    fontSize: normalize(12),
    fontWeight: '400',
    color: "#616161"
  },
  text12M: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: "#616161"
  },
  text12SB: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: "#616161"
  },
  text11M: {
    fontSize: normalize(11),
    fontWeight: '500',
    color: "#616161"
  },
  // Thin 100
  // ExtraLight 200
  // Light 300
  // Regular 400
  // Medium 500
  // SemiBold 600
  // Bold 700
  // ExtraBold 800
  // Black 900

  //padding
  pV5: {
    paddingVertical: 5,
  },
  pV10: {
    paddingVertical: 10,
  },
  pV15: {
    paddingVertical: 15,
  },
  pH5: {
    paddingHorizontal: 5,
  },
  pH10: {
    paddingHorizontal: 10,
  },
  pH15: {
    paddingHorizontal: 15,
  },
  pH20: {
    paddingHorizontal: 20,
  },
  pH25: {
    paddingHorizontal: 25,
  },
  pB5: {
    paddingBottom: 5,
  },
  pB10: {
    paddingBottom: 10,
  },
  pB15: {
    paddingBottom: 15,
  },
  pB20: {
    paddingBottom: 20,
  },
  pB25: {
    paddingBottom: 25,
  },
  pB30: {
    paddingBottom: 30,
  },
  pR10: {
    paddingRight: 10,
  },
  pR15: {
    paddingRight: 15,
  }, 

  //margin
  mB15: {
    marginBottom: 15,
  },
  mB25: {
    marginBottom: 25,
  },
  mrChats: {
    marginTop: 5,
    marginBottom: 12,
    marginHorizontal: 15
  },

  //flex
  row: {
    flexDirection: 'row',
  },
  rowalCjcC: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowalCjcSb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowalFjcSb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rowalC: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alCjcC: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  //modals
  containerModalGgBl: {
    position: 'absolute', 
    top:0 ,
    left: 0, 
    width: '100%', 
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  //inputs
  inputL: {
    // backgroundColor: 'red',
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
    color: "#616161",
    fontSize: normalize(15),
    // lineHeight: 24,
    paddingBottom: 12,
    width: 295
  },
  inputBG: {
    // backgroundColor: 'red',
    borderWidth: 1,
    borderColor: "#BDBDBD",
    color: "#616161",
    fontSize: normalize(14),
    padding: 15,
    borderRadius: 20
  },

  //btn
  btnBorder: {
    borderRadius: 30,
    height: 36,
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingHorizontal: 15
  },
  btnAvaBorder: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  btnWhite: {
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 17,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  //lines
  botLineGr: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  botLineGr400: {
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
  },
  lineTop: {
    borderTopWidth:1,
    borderTopColor: THEME.GREY300,    
  },

  //prompts
  promptContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    width: '90%'
  },

  //bages
  msgCounter: {
    borderRadius: 15,
    minWidth: 10,
    minHeight: 10,
    padding: 2,
    // paddingHorizontal:2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EC5E51',
  },
  outlBage25: {
    borderWidth:2,
    borderColor: '#205CBE',
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagePriceContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  bagePriceBase: {
    borderColor: '#BDBDBD',
    backgroundColor: '#fff',
  },
  bagePriceAccept: {
    borderColor: '#A9E1B5',
    backgroundColor: '#A9E1B5',
  },
  bagePriceWait: {
    borderColor: '#FFE380',
    backgroundColor: '#FFE380',
  },
  bageCounterRound : {

  },
  shadowPr10: {
    shadowColor: "#021b9a",
    // shadowColor: "#205CBE",
    shadowOffset: {width: 2, height: 6},
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  shadowPrBtn: {
    shadowColor: "#021b9a",
    // shadowColor: "#205CBE",
    shadowOffset: {width: 2, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  shadowG5r8: {
    shadowColor: "#9E9E9E",
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shadowG5r5: {
    shadowColor: "#9E9E9E",
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  inputMultiline5: {
    minHeight: 120,
  },
} 


//old styles

export const SIZE = {
  small: normalize(14),
  normal: normalize(16),
  normal_m: normalize(18),
  medium: normalize(20)
}
export const flex = {
  flex: 1
}
//row
export const row = {
  flexDirection: 'row',
}
export const rowSBetween = {
  flexDirection: 'row',
  justifyContent: 'space-between'
}
export const rowSAround = {
  flexDirection: 'row',
  justifyContent: 'space-around'
}
//padding
export const padH15 = {
  paddingHorizontal: 15
}
export const padB15 = {
  paddingBottom: 15
}
export const padB20 = {
  paddingBottom: 20
}
export const padV5 = {
  paddingVertical: 5
}
export const padV10 = {
  paddingVertical: 10
}
//title
export const title = {
  fontSize: SIZE.medium,
  color: THEME.MAIN_COLOR,
  paddingVertical: 5
}
//width
export const qwe = {
  flexDirection: 'row'
}


//info text grey
export const greyInfoText = {
  color: '#7B7B7B',
}

//infBox 
export const infBox = {
  backgroundColor: '#CDEEB1',
  borderWidth: 1,
  borderColor: '#9ED172',
  borderRadius: 10,
  // paddingVertical: 10,
  // paddingHorizontal: 15,
}
export const infBoxtext = {
  color: '#9ED172'
}


//font style
//400 - нормальное
//500, 600- средне
//700 - полужирный
//800, 900 - жирный
export const titleSemiBold = {
  fontSize: normalize(16),
  color: '#032237',
  fontWeight: '600'
}
export const titleMediumBold = {
  fontSize: normalize(16),
  color: '#032237',
  fontWeight: '700'
}
export const titleBold = {
  fontSize: normalize(16),
  color: '#032237',
  fontWeight: '700'
}

// console.log('\x1b[43m%s %s\x1b[0m', 'uid', uid);
// console.log('\x1b[38m%s %s %s\x1b[0m',
//цвета для консль лога

  // console.log('\x1b[43m%s %s\x1b[0m', 'uid', uid);

  // black: '\033[30m',
  // red: '\033[31m',
  // green: '\033[32m',
  // yellow: '\033[33m',
  // blue: '\033[34m',
  // magenta: '\033[35m',
  // cyan: '\033[36m',
  // white: '\033[37m',

  //background color:

  // blackBg: '\033[40m',
  // redBg: '\033[41m',
  // greenBg: '\033[42m',
  // yellowBg: '\033[43m',
  // blueBg: '\033[44m',
  // magentaBg: '\033[45m',
  // cyanBg: '\033[46m',
  // whiteBg: '\033[47m'
// }


//---------bottomSheet
export const boxTextBS = {
  width: '50%',
  alignItems: 'center',
}
export const textBoxS = {
  fontSize: normalize(14),
  color: '#000'
}
export const textBoxM = {
  fontWeight: '900',
  fontSize: normalize(17),
  paddingVertical: 5,
}

//line
export const lineContent = {
  backgroundColor: '#E1E1E1', 
  width: '100%', 
  height: 1, 
  marginVertical: 10
}
export const textPadd = {
  textAlign: 'center',
  padding: 10
}

export const generalStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowSB: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowSBC: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowC: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})