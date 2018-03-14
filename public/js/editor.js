/**
 * Created by Administrator on 2018/3/13 0013.
 */

var E = window.wangEditor;
var editor = new E('#editor');
editor.customConfig.uploadImgServer = '/uploadImg';
editor.customConfig.uploadFileName = 'images';

editor.create();

$("#submit").click(function(){
    console.log(editor.txt.html());
});