import React, {Component} from 'react';
import {
  StyleSheet,
  Text, TouchableOpacity,
  View
} from "react-native";
import * as CELL from "../mine/MinePageCellConfig";
import {Config} from "../../config/Config";
import {setItem} from "../../utils/AsyncStorageManager";
import {KEY_FIRST_LAUNCH, KEY_PRIVACY} from "../../utils/AsyncStorageKey";

class PrivacyPage extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center'}}>
        <View
          removeClippedSubviews={false}
          overflow={'hidden'}
          style={styles.mainContainer}
        >
          <Text style={{fontSize: 18, color: '#1E252F', fontWeight: '500', marginTop: 20}}>
            {'隐私政策提示'}
          </Text>
          <Text style={{marginHorizontal: 15, marginTop: 20, color: '#878787', fontSize: 14, alignSelf: 'center', lineHeight: 20}}>
            {'欢迎使用热料小说，为了更好地保护您的隐私和个人信息安全，热料小说根据国家相关法律规定拟定了'}
            <Text
              style={{color: '#f85836',}}
              onPress={() => {
                const {hiddenModal, showModal} = this.props
                hiddenModal && hiddenModal();
                this.props.navigation.navigate('Web', {
                  url: `${Config.url.privacy()}`,
                  pageWillUnmountCallback:() => {
                    showModal && showModal();
                  }
                })
              }}
            >
              {'《隐私政策》'}
            </Text>
            <Text>
              {'、'}
            </Text>
            <Text
              style={{color: '#f85836',}}
              onPress={() => {
                const {hiddenModal, showModal} = this.props
                hiddenModal && hiddenModal();
                this.props.navigation.navigate('Web', {
                  url: `${Config.url.service()}`,
                  pageWillUnmountCallback:() => {
                    showModal && showModal();
                  }
                })
              }}
            >
              {'《用户协议》'}
            </Text>
            <Text>
              {'请您在使用前仔细阅读并同意。'}
            </Text>
          </Text>
          <TouchableOpacity
            underlayColor={'#ffffff'}
            style={styles.button}
            onPress={() => {
              const {hiddenModal, showActivityImage} = this.props
              hiddenModal && hiddenModal()
              setItem(KEY_PRIVACY, 'true')
              showActivityImage && showActivityImage()
            }}
          >
            <Text style={{fontWeight: "500", color: '#fff', fontSize: 16}}>
              {'同意'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            underlayColor={'#ffffff'}
            onPress={() => {
              const {hiddenModal, showActivityImage} = this.props;
              hiddenModal && hiddenModal();
              showActivityImage && showActivityImage();
            }}
          >
            <Text style={{color: '#878787', fontSize: 15, marginBottom: 25, marginTop: 20}}>
              {'再看看'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: 300,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#fff',
  },
  button: {
    height: 40,
    backgroundColor: '#f85836',
    borderRadius: 20,
    borderColor: '#f85836',
    width: 250,
    marginHorizontal: 30,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
})

export default PrivacyPage;
