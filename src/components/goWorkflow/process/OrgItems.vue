<template>
  <div style="margin-top: 10px">
    <el-tag class="org-item" :type="org.type === 'dept'?'':'info'" v-for="(org, index) in _value" :key="index + '_org'"
      closable size="default" @close="removeOrgItem(index)">
      {{ org.name }}
    </el-tag>
  </div>
</template>

<script lang="ts">
  import {
    ref,
    toRefs,
    reactive,
    computed,
    onMounted,
    defineComponent,
    getCurrentInstance,
    ComponentInternalInstance
  } from 'vue';

  export default defineComponent({
    name: 'OrgItems',
    components: {},
    //
    props: {
      value: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    setup(props, {
      emit
    }) {
      const {
        appContext
      } = getCurrentInstance() as ComponentInternalInstance;
      const proxy = appContext.config.globalProperties;
      //
      const state = reactive({});
      //
      const _value = computed({
        get() {
          return props.value;
        },
        set(val) {
          emit("input", val);
        }
      });
      //
      const removeOrgItem = (index: number) => {
        _value.splice(index, 1)
      }
      // 页面加载时
      onMounted(() => {});
      return {
        proxy,
        ...toRefs(state),
        //
        _value,
        //
        removeOrgItem,
      };
    },
  });
</script>

<!-- <script>
export default {
  name: "OrgItems",
  components: {},
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    removeOrgItem(index) {
      this._value.splice(index, 1)
    }
  }
}
</script> -->

<style scoped>
  .org-item {
    margin: 5px;
  }
</style>