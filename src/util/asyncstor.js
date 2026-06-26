import AsyncStorage from "@react-native-async-storage/async-storage";

export const setToken = async (value) => {
  try {
    await AsyncStorage.setItem('token', value);
  } catch (e) {
    console.log('AsyncStorage err setToken', e)
    return e
  }
};

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      return value
    }
  } catch (e) {
    console.log('AsyncStorage err getToken', e)
    return null
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token')
  } catch(e) {
    console.log('AsyncStorage err removeToken', e)
    // remove error
  }

  console.log('Done.removeToken')
}