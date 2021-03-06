import React, { Component} from 'react';
import { Image, Button, StyleSheet, Text, View, StatusBar } from 'react-native';
import { AuthSession } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';


const FB_APP_ID = '148707542402172';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';

export default class Home extends Component {
    state = {
        userInfo: null,
      };
    
      render() {
        return (
        <Container>  
          <StatusBar translucent={false} barStyle="light-content" />
          <Logo />  
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {!this.state.userInfo ? (
              <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={this._handlePressAsync}>
              Login with Facebook
            </Icon.Button>
            ) : (
              this._renderUserInfo()
            )}
          </View>
         </Container> 
        );
      }
    
      _renderUserInfo = () => {
        return (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: this.state.userInfo.picture.data.url }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={{ fontSize: 20 }}>{this.state.userInfo.name}</Text>
            <Text>ID: {this.state.userInfo.id}</Text>
          </View>
        );
      };
    
      _handlePressAsync = async () => {
        let redirectUrl = AuthSession.getRedirectUrl();
    
        // You need to add this url to your authorized redirect urls on your Facebook app
        console.log({ redirectUrl });
    
        // NOTICE: Please do not actually request the token on the client (see:
        // response_type=token in the authUrl), it is not secure. Request a code
        // instead, and use this flow:
        // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
        // The code here is simplified for the sake of demonstration. If you are
        // just prototyping then you don't need to concern yourself with this and
        // can copy this example, but be aware that this is not safe in production.
    
        let result = await AuthSession.startAsync({
          authUrl:
            `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
            `&client_id=${FB_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
        });
    
        if (result.type !== 'success') {
          alert('Uh oh, something went wrong');
          return;
        }
    
        let accessToken = result.params.access_token;
        let userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        this.setState({ userInfo });
      };
    
} 