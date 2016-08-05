'use strict';

import request from 'request-promise';
import sha1 from 'sha1';

const APPID = 'wxed1c9924e6340f5e',
    APPSECRET = '656f2fc1a74d07cb44b9604608d759ba';

let cache = {
    keep: async function (name, json) {
        think.cache(name, () => {
            return json;
        });
    },
    get: async function (name) {
        let cacheJson = await think.cache(name);
        return cacheJson;
    }
}

export default class extends think.service.base {
  /**
   * init
   * @return {}         []
   */
    init (...args) {
        super.init(...args);
    }

    async getAccessTokenN () {

        let accessTokenName = 'accessTokenN';

        let accessToken = await cache.get(accessTokenName);

        if (accessToken) return accessToken;

        const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
        
        accessToken = await request(URL);
        accessToken = JSON.parse(accessToken);

        cache.keep(accessTokenName, accessToken);

        return accessToken;        

    }

    async createMenu () {

        let accessToken = await this.getAccessTokenN();

        let menuJson = {
            button: [{
                type: 'view',
                name: '特产礼包',
                url: 'http://www.duwonders.cn',                
            }, {
                type: 'view',
                name: '特产商城',
                url: 'http://www.duwonders.cn',
              }, {
                type: 'view',
                name: '我的订单',
                url: 'http://www.duwonders.cn',
            }]
        };

        const URL = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken.access_token}`;

        let res = await request({
            url: URL,
            method: 'POST',
            json: true,
            body: menuJson
        });

    }

    async getAccessTokenC (http, redirect_uri) {

        let accessTokenName = 'accessTokenC';
        let accessToken = await cache.get(accessTokenName);

        if (!accessToken) {
            let code = this.getCode();

            const GET_ACCESS_TOKEN_URL = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${APPSECRET}&code=${code}&grant_type=authorization_code`;

            accessToken = await request(GET_ACCESS_TOKEN_URL);

            cache.keep(accessTokenName, accessToken);

        } 

        return accessToken;

    }

    async getUserInf (type) {

        let accessToken = await this.getAccessTokenC();

        let GET_USER_INF_URL;

        if (type === 'UnionID') {
            GET_USER_INF_URL = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken.access_token}&openid=${accessToken.openid}&lang=zh_CN`;
        } else {
            GET_USER_INF_URL = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken.access_token}&openid=${accessToken.openid}&lang=zh_CN`;
        }

        let userInf = await request(GET_USER_INF_URL);

        return JSON.parse(userInf);

    }

    async getJSAPITicket () {

        let ticket = cache.get('jsTicket');

        if (ticket) return ticket;

        let accessToken = await this.getAccessTokenN();

        const GET_JS_TICKET_URL = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken.access_token}&type=jsapi`;

        ticket = await request(GET_JS_TICKET_URL);
        ticket = JSON.parse(ticket).ticket;

        cache.keep('jsTicket', ticket);

        return ticket;

    }

    async getJSSDK (url) {

        let obj = {
            timestamp: new Date().getTime(),
            nonceStr: 'Wm3WZYTPz0wzccnW',
            jsapi_ticket: await this.getJSAPITicket(),
            url: url
        };

        let arr = ['timestamp', 'nonceStr', 'jsapi_ticket', 'url'].sort();
        let str = '';

        arr.forEach((item) => {

            str += item + '=' + obj[item] + '&';

        });

        obj.signature = sha1(str.slice(0, -1));
        obj.appId = APPID;

        return obj;

    }

    getCode (http, redirect_uri) {

        if (typeof http !== 'object') throw 'http should be a object with get and res';

        console.log(redirect_uri);

        const WX_GET_CODE_URL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=%${UrlEncode(redirect_uri)}&response_type=code&scope=snsapi_base&state=null#wechat_redirect`;

        let code = http.get('code');

        if (!code) {

            http.res.writeHead(307, {
                'Location': WX_GET_CODE_URL
            });
            http.res.end();

        } else {

            return code;

        }

    }
    
}


function str2asc(str){
  return str.charCodeAt(0).toString(16);
}

function asc2str(str){
  return String.fromCharCode(str);
}

function UrlEncode(str){ 
    var ret = ""; 
    var strSpecial = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%"; 
    var tt = ""; 

    for (var i = 0, len = str.length; i < len; i++) { 
        var chr = str.charAt(i); 
        var c = str2asc(chr); 
        tt += chr + ":" + c + "n"; 
        if (parseInt("0x" + c) > 0x7f) { 
            ret += "%" + c.slice(0,2) + "%" + c.slice(-2); 
        } else { 
            if (chr == " ")  ret += "+"; 
            else if (strSpecial.indexOf(chr) != -1) ret += "%" + c.toString(16); 
            else  ret += chr; 
        } 
    } 

    return ret; 
} 