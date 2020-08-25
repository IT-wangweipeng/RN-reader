# React Native ProgressHUD
## ScreenShots

 [ScreenShots](https://github.com/follyxing/react-native-progresshud)
 

## Install
```shell
npm install --save react-native-progresshud
```

## Usage
Using the HUD in your app will usually look like this:

```js
import ProgressHUD from 'react-native-progresshud';

class demo extends Component {
  render() {
    return (
      <View style={styles.container}>
      	...
        <ProgressHUD showHUD={true} showLoading ={true} text ='Loading...'/>
      </View>

    );
  }
}

```

