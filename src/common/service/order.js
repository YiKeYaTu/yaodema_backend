'use strict';

let wxService = think.service("wx");
let wx = new wxService();

export default class extends think.service.base {
  /**
   * init
   * @return {}         []
   */
    init(...args){
        super.init(...args);
    }
    /**
       * 添加一个订单
       * @itemType   商品的类别
       * @itemNumber 购买数量
       * @itemId     商品的ID
    */
    async addOrder () {

        let userInf = await _checkUserIsFollow();

        if (!userInf) return this.json();

        let itemType = this.post('item_type'),
            itemNumber = this.post('item_number'),
            itemId = this.post('item_id');

        let openid = userInf.openid;

    }

}

async function _checkUserIsFollow () {

    let userInf = await wx.getUserInf();

    if (userInf.subscribe == 1) {

        return userInf;
    } 

    return false;
}