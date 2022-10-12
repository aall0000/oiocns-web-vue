<template>
  <!-- <div class="base-setup" @click="showIconSelect = false">
    <el-form ref="baseSetting" :model="setup" label-position="top" label-width="80px">
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="setup" size="default"></el-input>
      </el-form-item>
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="setup" size="default"></el-input>
      </el-form-item>
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="setup" size="default"></el-input>
      </el-form-item>
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="setup" size="default"></el-input>
      </el-form-item>
    </el-form>
  </div> -->
</template>

<script lang="ts">
  import {
    ref,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance,
    reactive,
    toRefs,
  } from 'vue';

  export default defineComponent({
    name: 'FormBaseSetting',
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;

      const proxy = appContext.config.globalProperties;

      const state = reactive({
        
      });

      // 预览
      const preview = () => {
        // this.$emit('preview')
        emit('preview', true);
      };
      // 发布
      const publish = () => {
        emit('publish');
      };

      return {
        preview,
        publish,
        ...toRefs(state),
      };
    },
  });

  // import OrgPicker from "@/components/common/OrgPicker";
  // import {getFormGroups, updateGroup} from '@/api/design'
  // import iconfont from '@/assets/iconfont/iconfont.json'

  // export default {
  //   name: "FormBaseSetting",
  //   components: {OrgPicker},
  //   data() {
  //     return {
  //       nowUserSelect: null,
  //       showIconSelect: false,
  //       select: [],
  //       newGroup: '',
  //       fromGroup: [],
  //       notifyTypes:[
  //         {type:'APP',name:'应用内通知'},
  //         {type:'EMAIL',name:'邮件通知'},
  //         {type:'SMS',name:'短信通知'},
  //         {type:'WX',name:'微信通知'},
  //         {type:'DING',name:'钉钉通知'},
  //       ],
  //       colors: [
  //         '#ff4500',
  //         '#ff8c00',
  //         '#ffd700',
  //         '#90ee90',
  //         '#00ced1',
  //         '#1e90ff',
  //         '#c71585',
  //         'rgba(255, 69, 0, 0.68)',
  //         'rgb(255, 120, 0)',
  //         'hsl(181, 100%, 37%)',
  //         'hsla(209, 100%, 56%, 0.73)',
  //         '#c7158577'
  //       ],
  //       icons: [
  //         'el-icon-delete-solid',
  //         'el-icon-s-tools',
  //         'el-icon-s-goods',
  //         'el-icon-warning',
  //         'el-icon-circle-plus',
  //         'el-icon-camera-solid',
  //         'el-icon-s-promotion',
  //         'el-icon-s-cooperation',
  //         'el-icon-s-platform',
  //         'el-icon-s-custom',
  //         'el-icon-s-data',
  //         'el-icon-s-check',
  //         'el-icon-s-claim',
  //       ],
  //       rules:{
  //         formName:[{}],
  //         groupId: [],
  //       }
  //     }
  //   },
  //   computed: {
  //     setup() {
  //       return this.$store.state.appwfConfig.design;
  //     }
  //   },
  //   created() {
  //     this.loadIconfont()
  //   },
  //   mounted(){
  //     this.getGroups()
  //   },
  //   methods: {
  //     getRule(msg){
  //       return [{ required: true, message: msg, trigger: 'blur' }]
  //     },
  //     loadIconfont(){
  //       if (iconfont && iconfont.id){
  //         iconfont.glyphs.forEach(icon => {
  //           this.icons.push(`${iconfont.font_family} ${iconfont.css_prefix_text}${icon.font_class}`)
  //         })
  //       }
  //     },
  //     getGroups(){
  //       getFormGroups().then(rsp => {
  //         this.fromGroup = rsp.data
  //       }).catch(err => this.$message.error('获取分组异常'))
  //     },
  //     addGroup() {
  //       if (this.newGroup.trim() !== '') {
  //         updateGroup({name: this.newGroup.trim()}, 'post').then(rsp => {
  //           this.$message.success(rsp.data)
  //           this.getGroups()
  //         }).catch(err => this.$message.error(err.response.data))
  //       }
  //     },
  //     selected(select) {
  //       this.$set(this.setup.settings, this.nowUserSelect, select)
  //       //this.setup[this.nowUserSelect] = select
  //     },
  //     selectUser(key) {
  //       this.select = this.setup.settings[key]
  //       this.nowUserSelect = key
  //       this.$refs.orgPicker.show()
  //     },
  //     validate(){
  //       this.$refs.baseSetting.validate()
  //       let err = []
  //       if (!this.$isNotEmpty(this.setup.formName)){
  //         err.push('表单名称未设置')
  //       }
  //       if (!this.$isNotEmpty(this.setup.groupId)){
  //         err.push('表单分组未设置')
  //       }
  //       if (this.setup.settings.notify.types.length === 0){
  //         err.push('审批消息通知方式未设置')
  //       }
  //       return err
  //     }
  //   }
  // }
</script>

<style lang="scss" scoped>
  .el-select-dropdown {
    display: none;
  }

  .icon-select {
    display: flex;
    flex-wrap: wrap;

    i {
      cursor: pointer;
      font-size: large;
      padding: 10px;
      max-width: 38px !important;

      &:hover {
        box-shadow: 0 0 10px 2px #C2C2C2;
      }
    }
  }

  .select-u {
    width: 100%;
  }

  .base-setup {
    overflow: auto;
    margin: 0 auto;
    width: 600px;
    height: calc(100vh - 105px);
    background: #ffffff;
    margin-top: 10px;
    padding: 15px 20px;

    i:first-child {
      position: relative;
      cursor: pointer;
      font-size: xx-large;
      color: #ffffff;
      border-radius: 10px;
      padding: 10px;
    }

    .change-icon {
      margin-left: 20px;

      span {
        font-size: small;
        color: #7a7a7a;
        margin-right: 15px;
      }

      i {
        cursor: pointer;
        color: #7a7a7a;
        font-size: x-large;
      }
    }

    .el-form-item__label {
      padding: 0;
      font-weight: bold;
    }

    .el-form-item {
      margin-bottom: 5px;
    }
  }

  .group {
    .el-select {
      width: calc(100% - 130px);
    }

    .el-button {
      margin-left: 10px;
      width: 120px;
    }
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: #f8f8f8;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 16px;
    background-color: #e8e8e8;
  }
</style>