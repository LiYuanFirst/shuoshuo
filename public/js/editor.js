/**
 * Created by Administrator on 2018/3/13 0013.
 */

// 创建编辑器
var E = window.wangEditor;
var editor = new E('#editor');
// 或者 var editor = new E( document.getElementById('editor') )
editor.customConfig.uploadImgServer = '/uploadImg';
editor.create();