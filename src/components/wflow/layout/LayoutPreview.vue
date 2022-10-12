<template>
	<div class="system-add-dic-container">
		<el-dialog title="预览" v-model="isShowDialog" width="800px" :close-on-click-modal="false">
		  <pre style="font-family: Monaco,Menlo,Consolas,Bitstream Vera Sans Mono,monospace;font-size: 14px;">{{ JSON.stringify(design, null, 4) }}</pre>
		</el-dialog>
	</div>
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
		name: 'systemAddDic',
		setup(props, {
			emit
		}) {
			const {
				appContext
			} = getCurrentInstance() as ComponentInternalInstance;

			const proxy = appContext.config.globalProperties;

			const state = reactive({
				isShowDialog: false,
				design: {}
			});
			// 打开弹窗
			const openDialog = (design : any) => {
				state.isShowDialog = true;
				state.design = Object.assign({}, design);
			};
			// 关闭弹窗
			const closeDialog = () => {
				state.isShowDialog = false;
			};
			return {
				openDialog,
				closeDialog,
				...toRefs(state),
			};
		},
	});
</script>