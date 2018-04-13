/**
 * Created by Administrator on 2018/3/13 0013.
 */

var E = window.wangEditor;
var editor = new E('#editor');
editor.customConfig.uploadImgServer = '/uploadImg';
editor.customConfig.uploadFileName = 'images';

editor.create();

$("#submit").click(function(){
    let content = editor.txt.html();
    let title = $("#editor-title").val();
    let brief = $("#brief").val();
    let author = $("#author").text();
    console.log(author);
    $.post("/doUploadEditor",{"title":title,"brief":brief,"content":content,"authord":author},function(res){
      console.log(res);
    })
});
