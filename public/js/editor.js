/**
 * Created by Administrator on 2018/3/13 0013.
 */

// �����༭��
var E = window.wangEditor;
var editor = new E('#editor');
// ���� var editor = new E( document.getElementById('editor') )
editor.customConfig.uploadImgServer = '/uploadImg';
editor.create();