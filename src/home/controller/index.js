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

        wx.getCode(
            http, 
            'http://' + http.host + http.url
        );

        return this.display();
    }
}