'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
    async indexAction(){
    //auto render template file index_index.html
        let wxService = think.service("wx");
        let wx = new wxService();

        let http = this.http;

        // let acc = { 
        //     access_token: 'FgnEqLTTNk8JEFMRf5GyUD1Wj3wvIFDec-KlK14wZIRPmQNt7u6gKwxqHC6NQ7fIuJ2UOHIyLK5TqBUZPkKWdPAJ7eX4RowME1He_iYevGs',
        //     expires_in: 7200,
        //     refresh_token: 'm92DZrP89WKjrzug6iYTbS_2cd_nLyvJzqqFzk1_ZX1O5zhodUSmucklIK17C3c7jCq1b0NfDd9uiF4IMXpx89p9fFW2JcSHkxCZlJvTAsE',
        //     openid: 'oDNUjwV7l6KYEaEaBlWWSSn4Nel4',
        //     scope: 'snsapi_userinfo' 
        // };

        await wx.getUserInf(
            false,
            http, 
            http.host + http.url.slice(0, -1)
        );

        let jsTicket = await wx.getJSSDK(http.host + http.url);
        console.log(jsTicket);
        this.assign('jsTicket', jsTicket);

        // await wx._getAccessTokenForUser(http);

        return this.display();
    }
}