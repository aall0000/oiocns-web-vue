import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      userInfo:{},
      userToken:'',
    };
  },
  getters:{
    token:(state)=>'Bearer ' + state.userToken
  },
  actions: {
    updateUserInfo(data: object) {
      console.log(data);
      this.userInfo = data
      this.userToken = data.accessToken
    }
  }
});
