<template>
  <ul class='qqface-wrap'>
    <li v-for="(key, value ) in qqfaceMap" @click="handleChoose(key, value)" :key="value"
      :class="['qqface', `qqface${value}`, 'small']">
    </li>
  </ul>
</template>
<script lang='ts' setup>
import { qqfaceMap } from './config'
console.log('cs', qqfaceMap);


const emit = defineEmits('chooseFace')
const handleChoose = (key: string, value: string) => {
  console.log('key, value', key, value);
  value = key[0]
            .replace(/\[\:1\:\]/g, "[微笑]")
            .replace(/\[\:2\:\]/g, "[撇嘴]")
            .replace(/\[\:3\:\]/g, "[色]")
            .replace(/\[\:4\:\]/g, "[发呆]")
            .replace(/\[\:5\:\]/g, "[流泪]")
            .replace(/\[\:6\:\]/g, "[害羞]")
            .replace(/\[\:7\:\]/g, "[闭嘴]")
            .replace(/\[\:8\:\]/g, "[睡]")
            .replace(/\[\:9\:\]/g, "[大哭]")
            .replace(/\[\:10\:\]/g, "[尴尬]")
            .replace(/\[\:11\:\]/g, "[发怒]")
            .replace(/\[\:12\:\]/g, "[调皮]")
            .replace(/\[\:13\:\]/g, "[呲牙]")
            .replace(/\[\:14\:\]/g, "[惊讶]")
            .replace(/\[\:15\:\]/g, "[难过]")
            .replace(/\[\:16\:\]/g, "[囧]")
            .replace(/\[\:17\:\]/g, "[抓狂]")
            .replace(/\[\:18\:\]/g, "[吐]")
            .replace(/\[\:19\:\]/g, "[偷笑]")
            .replace(/\[\:20\:\]/g, "[愉快]")
            .replace(/\[\:21\:\]/g, "[白眼]")
            .replace(/\[\:22\:\]/g, "[傲慢]")
            .replace(/\[\:23\:\]/g, "[饥饿]")
            .replace(/\[\:24\:\]/g, "[困]")
            .replace(/\[\:25\:\]/g, "[惊恐]")
            .replace(/\[\:26\:\]/g, "[流汗]")
            .replace(/\[\:27\:\]/g, "[憨笑]")
            .replace(/\[\:28\:\]/g, "[悠闲]")
            .replace(/\[\:29\:\]/g, "[奋斗]")
            .replace(/\[\:30\:\]/g, "[咒骂]")
            .replace(/\[\:31\:\]/g, "[疑问]")
            .replace(/\[\:32\:\]/g, "[嘘]")
            .replace(/\[\:33\:\]/g, "[晕]")
            .replace(/\[\:34\:\]/g, "[疯了]")
            .replace(/\[\:35\:\]/g, "[衰]")
            .replace(/\[\:36\:\]/g, "[敲打]")
            .replace(/\[\:37\:\]/g, "[再见]")
            .replace(/\[\:38\:\]/g, "[擦汗]")
            .replace(/\[\:39\:\]/g, "[抠鼻]")
            .replace(/\[\:40\:\]/g, "[糗大了]")
            .replace(/\[\:41\:\]/g, "[坏笑]")
            .replace(/\[\:42\:\]/g, "[左哼哼]")
            .replace(/\[\:43\:\]/g, "[右哼哼]")
            .replace(/\[\:44\:\]/g, "[哈欠]")
            .replace(/\[\:45\:\]/g, "[鄙视]")
            .replace(/\[\:46\:\]/g, "[委屈]")
            .replace(/\[\:47\:\]/g, "[快哭了]")
            .replace(/\[\:48\:\]/g, "[阴险]")
            .replace(/\[\:49\:\]/g, "[亲亲]")
            .replace(/\[\:50\:\]/g, "[吓]")
            .replace(/\[\:51\:\]/g, "[可怜]")
            .replace(/\[\:52\:\]/g, "[得意]")
            .replace(/\[\:53\:\]/g, "[酷]")
            .replace(/\[\:54\:\]/g, "[鼓掌]")
            .replace(/\[\:55\:\]/g, "[拥抱]")
            .replace(/\[\:56\:\]/g, "[月亮]")
            .replace(/\[\:57\:\]/g, "[太阳]")
            .replace(/\[\:58\:\]/g, "[炸弹]")
            .replace(/\[\:59\:\]/g, "[骷髅]")
            .replace(/\[\:60\:\]/g, "[菜刀]")
            .replace(/\[\:61\:\]/g, "[猪头]")
            .replace(/\[\:62\:\]/g, "[西瓜]")
            .replace(/\[\:63\:\]/g, "[咖啡]")
            .replace(/\[\:64\:\]/g, "[饭]")
            .replace(/\[\:65\:\]/g, "[爱心]")
            .replace(/\[\:66\:\]/g, "[心碎]")
            .replace(/\[\:67\:\]/g, "[强]")
            .replace(/\[\:68\:\]/g, "[弱]")
            .replace(/\[\:69\:\]/g, "[握手]")
            .replace(/\[\:70\:\]/g, "[胜利]")
            .replace(/\[\:71\:\]/g, "[抱拳]")
            .replace(/\[\:72\:\]/g, "[勾引]")
            .replace(/\[\:73\:\]/g, "[OK]")
            .replace(/\[\:74\:\]/g, "[NO]")
            .replace(/\[\:75\:\]/g, "[拳头]")
            .replace(/\[\:76\:\]/g, "[差劲]")
            .replace(/\[\:77\:\]/g, "[爱你]")
            .replace(/\[\:78\:\]/g, "[嘴唇]")
            .replace(/\[\:79\:\]/g, "[玫瑰]")
            .replace(/\[\:80\:\]/g, "[凋谢]")
            .replace(/\[\:81\:\]/g, "[啤酒]")
            .replace(/\[\:82\:\]/g, "[篮球]")
            .replace(/\[\:83\:\]/g, "[乒乓]")
            .replace(/\[\:84\:\]/g, "[蛋糕]")
            .replace(/\[\:85\:\]/g, "[闪电]")
            .replace(/\[\:86\:\]/g, "[足球]")
            .replace(/\[\:87\:\]/g, "[刀]")
            .replace(/\[\:88\:\]/g, "[便便]")
            .replace(/\[\:89\:\]/g, "[瓢虫]")
            .replace(/\[\:90\:\]/g, "[礼物]")
            .replace(/\[\:91\:\]/g, "[跳跳]")
            .replace(/\[\:92\:\]/g, "[发抖]")
            .replace(/\[\:93\:\]/g, "[怄火]")
            .replace(/\[\:94\:\]/g, "[转圈]")
            .replace(/\[\:95\:\]/g, "[磕头]")
            .replace(/\[\:96\:\]/g, "[回头]")
            .replace(/\[\:97\:\]/g, "[跳绳]")
            .replace(/\[\:98\:\]/g, "[右太极]")
            .replace(/\[\:99\:\]/g, "[激动]")
            .replace(/\[\:100\:\]/g, "[乱舞]")
            .replace(/\[\:101\:\]/g, "[献吻]")
            .replace(/\[\:102\:\]/g, "[左太极]")
            .replace(/\[\:103\:\]/g, "[投降]")
            .replace(/\[\:104\:\]/g, "[爱情]")
            .replace(/\[\:105\:\]/g, "[飞吻]")
  emit('chooseFace', key, value)
}

</script>

<style lang='scss' scoped>
@import "./qqface.scss";

.qqface-wrap {
  .qqface {}
}
</style>
