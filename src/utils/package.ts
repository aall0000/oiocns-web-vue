import pako from 'pako'

export class StringPako {
    private static decoder: TextDecoder = new TextDecoder()
    private static encoder: TextEncoder = new TextEncoder()
    /**
     * 解压缩
     * @param input 输入字符串（明文）
     */
    public static inflate(input: string) {
        if(input.startsWith("^!:")){
            try {
                input = atob(input.substring(8, input.length - 5).replaceAll("*","="))
                let output = this.arrToString(pako.inflate(this.stringToArr(input)))
                return decodeURIComponent(output)
            } catch (err) {
                return input
            }
        }
        return input
    }
    /**
     * 压缩
     * @param input 输入字符串（密文）
     */
    public static deflate(input: string) {
        input = encodeURIComponent(input)
        let output = btoa(this.arrToString(pako.deflate(input)))
        return "^!:" + this.randomStr(5) + output.replaceAll("=", "*") + this.randomStr(5)
    }
    /**
     * 数组转字符串
     * @param arr 数组
     * @returns 字符串
     */
    private static arrToString(arr: Uint8Array) {
        var dataString = "";
        for (var i = 0; i < arr.length; i++) {
            dataString += String.fromCharCode(arr[i]);
        }
        return dataString
    }
    /**
     * 字符串转数组
     * @param str 字符串
     * @returns 数组
     */
    private static stringToArr(str: string) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        var tmpUint8Array = new Uint8Array(arr);
        return tmpUint8Array
    }
    /**
     * 生成随机字符串
     * @param num 长度
     * @returns 随机字符串
     */
    private static randomStr(len: number){
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var str = '';
        for (var i = 0, j = len; i < j; ++i) {
            str += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }
}