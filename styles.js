import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  

  downIn: {
    flexDirection: 'row',  // Aligns children in a horizontal line
    alignItems: 'center',  // Aligns children vertically in the center
    justifyContent: 'space-between', // Adjust this to space the buttons as needed
     // Adjust the padding as needed
    // Adjust the margin as needed
    // Add other styling like padding, margin, etc., as required
  },

  dziambo: {
    backgroundColor: 'white',
    width: deviceWidth * 0.90,
    height: deviceHeight * 0.35,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  dziambo2: {
    backgroundColor: 'white',
    width: deviceWidth * 0.3,
    height: deviceHeight * 0.15,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  selectList:{
    width: deviceWidth - 100,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,    
  },
  selectList2:{
    width: deviceWidth - deviceWidth * 0.20,
    padding: 10,
    
    
  },
  textList: {
    marginBottom: 5,
    paddingBottom: 5,
    marginTop: 10,
    fontSize: 14,
    
    textAlign: 'center', // Center text horizontally
    
  },
  backToMain:{
     width: deviceWidth
  },
  textContainer: {
    alignItems: 'center', // Center child elements vertically
  },
  text3: {
    marginBottom: 5,
    paddingBottom: 5,
    marginTop: 10,
    fontSize: 14,
    minWidth: 300,
    textAlign: 'center', // Center text horizontally
    paddingHorizontal: 20, // Adjust the padding as needed
  },
  
  inputCategory:{
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    height: deviceHeight * 0.06,
    width: deviceWidth * 0.50,
    marginBottom: 10,

  },

  inputCategory5:{
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    height: deviceHeight * 0.055,
    width: deviceWidth * 0.60,
    marginBottom: 10,

  },

  inputCategory2:{
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,

  },
  sectionContainer: {
    marginTop: 70,
    paddingHorizontal: 24,
  },
  colorPicker:{
    width: 200,
    height:  200,
    flex: 0.3,
    marginBottom: 150,
  },
  colorPicker2:{
    width: deviceWidth,
    height:  200,
    flex: 0.3,
    marginTop:20,
    marginBottom: 50,
  },
 
//  Login And Register Styles
  loginContainer: {
    flex: 1,
    backgroundColor: '#fefefa',
    alignContent: 'center',
    alignItems  : 'center',
    justifyContent: 'center',
  },

  loginContainer2: {
    flex: 1,
    backgroundColor: '#fefefa',
      
    alignItems  : 'center',
    
  },
  containerSvg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceHeight * 0.4,
    width: deviceWidth * 0.95,
    borderColor: 'black',
    backgroundColor: 'green',
    borderWidth: 1,
    marginLeft: 10,
    marginBottom: 20
  },

  svgContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceHeight * 0.4,
    width: deviceWidth * 0.95,
    borderColor: 'black',
    backgroundColor: 'lightblue',
    borderWidth: 1,
    marginLeft: 10,
    marginBottom: 20
  },
  clearButton: {
    marginTop: 10,
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: 'white',
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
   marginRight: 10,
   marginLeft: 10,
  },
  clearButton2: {
    marginTop: 10,
    borderColor: 'blue',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
   marginRight: 10,
   marginLeft: 10,
  },
  clearButton3: {
    marginTop: 10,
    
    borderColor: 'green',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
   marginRight: 10,
   marginLeft: 10,
  },
  clearButton4: {
    
    
    borderColor: 'green',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
   marginRight: 10,
   marginLeft: 10,
  },
  clearButtonText: {
    
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonTextL: {
    color:'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flashcardContainer: {
    justifyContent: 'center',
    backgroundColor: '#fefefa',
    
    alignItems  : 'center',
    alignContent: 'center',
    display: 'flex',
    position: 'relative',
    
  },

  flashcardText:{
    fontSize: 25,
    
    textAlign: 'center',
    color: 'black',
    alignItems: 'center',
    display: 'flex',
    position: 'relative',
  },

  inputContainerLogin:{
    width:'80%',
  },
  inputL:{
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    borderColor: 'black',
    borderWidth: 1,
    minHeight: deviceHeight * 0.055,

  },

  buttonLoginContainer:{
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  buttonRegisterContainer:{
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonLogin:{
    backgroundColor: '#100c08',
    
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    
    borderWidth: 1,
  },

  errorM:{
    color: 'red',
    fontSize: 15,
  },

  buttonRegister : {
    backgroundColor: 'white',
    
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#100c08',
    borderWidth: 1,
  
  },

  buttonLoginText:{
    color: 'white',
  }
,
  buttonRegisterText:{
    color: 'white',
  },

  addButton: {
    // Background color with opacity for a glassy effect
    borderRadius: 20, // Make it round (adjust the value for the desired roundness)
    padding: 10, // Adjust the padding as needed
    alignItems: 'center', // Center text horizontally
    margin: 10, // Adjust the margin as needed
    borderRadius: 10,
   
  },

  buttonText: {
    color: 'black', // Text color
    fontSize: 16, // Adjust the font size as needed
  },


  // MainScreen Styles
  modal: {
    height: deviceHeight,
    width: deviceWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  },
  modalText: {
    fontSize: 18,
    color: 'white',
    margin: 20
  },
  
  slideDown: {
    height: 0.90 * deviceHeight,
    width: deviceWidth,
    backgroundColor: '#fefefa',
    
    alignItems: 'center',
  },
    slideDownBot:{
      borderTopWidth: 1,  // Adjust the width as needed
    borderTopColor: '#100c08', // Change the color as needed
      height: 0.10 * deviceHeight,
      width: deviceWidth,
      backgroundColor: '#fefefa',
      justifyContent: 'center',
      alignItems: 'center',
    },

    item: {
     
      width: deviceWidth, // Take up 100% of the parent container width
      height: 50, // Fixed height
      color: 'black', // Text color
      flexDirection: 'row',
      fontSize: 18, // Bigger font size
      padding : 10,
       // Adjust the padding as needed
       backgroundColor: '#fefefa', // Background color of the item
      resizeMode: 'contain'
      
      
    },

    flash:{
      marginRight: 10,
      
      
    },
    sectionHeader: {
     
     width: deviceWidth, // Take up 90% of the screen width
     backgroundColor: '#fefefa' , // Background color of the section headers
      fontSize: 23,
      padding: 10,
      
      alignSelf: 'center', // Center the text within the section header
      paddingVertical: 5, // Adjust the spacing as needed
    
      fontWeight: 'bold', // Text style
      
    },

    
    
    
    
    container: {
      flex: 1,
      backgroundColor: '#fefefa',
    },
    topFlex:{
      flex: 0.10,
     
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: '#100c08',
      backgroundColor: '#fefefa',
     
      
      
    },
  
    middleFlex:{
      flex: 0.73,
      backgroundColor: '#fefefa',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    bottomFlex:{
      flex: 0.17,
     
          //dark grey color
      borderTopColor: '#100c08',
      backgroundColor: '#fefefa',
      flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5, // You can adjust this value as needed
    },

    logoStyle: {
      width: 200, // Adjust this value as needed
      height: 200, // Adjust this value while maintaining the aspect ratio
      resizeMode: 'contain'
    },

    iconStyle:{
        width: 50,
        height: 60,
        marginBottom: 20,
    },
    iconStyle2:{
      width: 30,
      height: 30,
      
  },

  iconStyle3:{
    width: 30,
    height: 30,
    transform: [{ rotate: '45deg' }],
    
      },

      iconStyle4:{
        width: 30,
        height: 30,
        transform: [{ rotate: '45deg' }],
        
          },
    button: {
        backgroundColor: 'white', // Background color of the button
        padding: 10, // Adjust the padding as needed
        borderRadius: 18, // Adjust the border radius as needed
        borderWidth: 1.8,
        borderColor: '#100c08',
        alignItems: 'center', // Center button contents horizontally
        justifyContent: 'center', // Center button contents vertically
        minHeight: deviceHeight * 0.06,
        minWidth: deviceWidth * 0.30,
       
      },
      // card: {
      //   width: 200,
      //   height: 300,
      //   backgroundColor: 'lightblue',
      //   justifyContent: 'center',
      //   alignItems: 'center',
      //   backfaceVisibility: 'hidden',
      //   position: 'absolute',
        
      // },
      // backCard: {
       
      //   transform: [{ rotateY: '180deg' }],
      // },
      containerCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      modalContent: {
        backgroundColor: '#fefefa',
        width: '80%',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        width: deviceWidth * 0.84,
        height: deviceHeight * 0.55 ,
      },
      closeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#fff',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
      },
      closeButtonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
      },
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 2,
        
        justifyContent: 'center',
      },

      checkboxContainerForTablets: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 2,
        
        justifyContent: 'center',
      },
      checkbox: {
        zIndex: 2,
        width: 30,
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        marginLeft: 10,
        backgroundColor: 'white',
        paddingHorizontal: 5,
        marginRight: 10,
      },

      checkboxForTablets: {
        zIndex: 2,
        width: 50,
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        marginLeft: 10,
        backgroundColor: 'white',
        paddingHorizontal: 5,
        marginRight: 10,
      },
      
      startButtonText: {
        color: 'white',
        textAlign: 'center',
      },

      buttonHolder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth * 0.50,
        height: deviceHeight * 0.50 ,
        marginBottom: 40,
      },

      touchable: {
        backgroundColor: 'white',
        padding: 10,
        margin: 30,
        borderRadius: 10,
        width: deviceWidth * 0.70,
        height: deviceHeight * 0.10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
      },
     
  });

  export default styles