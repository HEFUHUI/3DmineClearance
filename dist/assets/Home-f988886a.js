import{u as d,o as n,c as o,a as e,F as _,r as u,t as a}from"./index-9fcdccc7.js";import{u as p}from"./game-7e941ad5.js";import{_ as f}from"./_plugin-vue_export-helper-c27b6911.js";const h={class:"home-container"},g={class:"difficulty-selection"},b={class:"difficulty-buttons"},y=["onClick"],k={__name:"Home",setup(v){const c=d(),r=p(),l=[{name:"beginner",label:"初级",description:"9×9 格子，10 个地雷",config:{width:9,height:9,mines:10}},{name:"intermediate",label:"中级",description:"16×16 格子，40 个地雷",config:{width:16,height:16,mines:40}},{name:"expert",label:"高级",description:"16×30 格子，99 个地雷",config:{width:30,height:16,mines:99}}],m=i=>{r.initializeGame(i.config),c.push("/game")};return(i,t)=>(n(),o("div",h,[t[1]||(t[1]=e("h1",{class:"title"},"3D扫雷",-1)),e("div",g,[t[0]||(t[0]=e("h2",null,"选择难度",-1)),e("div",b,[(n(),o(_,null,u(l,s=>e("button",{key:s.name,class:"difficulty-btn",onClick:x=>m(s)},[e("h3",null,a(s.label),1),e("p",null,a(s.description),1)],8,y)),64))])])]))}},H=f(k,[["__scopeId","data-v-007b2733"]]);export{H as default};
