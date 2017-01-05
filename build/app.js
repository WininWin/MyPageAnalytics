/*! mymind 05-01-2017 */
var app=angular.module("MyPageAnalytics",["appControllers","FBServices","ui.router","ngMaterial","nvd3","angular-jqcloud","ngAnimate"]);app.config(["$stateProvider","$urlRouterProvider","$mdThemingProvider",function(a,b,c){c.theme("default").primaryPalette("light-blue",{default:"400","hue-1":"900","hue-2":"600"}).accentPalette("light-green",{default:"800","hue-1":"400"}).warnPalette("red",{default:"600"}).backgroundPalette("grey",{default:"A100"}),b.otherwise("/"),a.state("app",{url:"/",views:{header:{templateUrl:"partials/header.html"},main:{templateUrl:"partials/login.html"},footer:{templateUrl:"partials/footer.html"}}}).state("app.main",{url:"main",views:{"main@":{templateUrl:"partials/main.html"}}}).state("app.privacy",{url:"privacy",views:{"main@":{templateUrl:"partials/privacyinfo.html"}}})}]),app.run(["$rootScope","$window","$state",function(a,b,c){function d(b){console.log("2.statusChangeCallback"),"connected"===b.status?(a.token=b.authResponse.accessToken,c.go("app.main")):"not_authorized"===b.status?console.log("Please log into this app."):console.log("Please log into Facebook.")}b.fbAsyncInit=function(){FB.init({appId:"780261085443713",cookie:!0,xfbml:!0,version:"v2.8"}),FB.getLoginStatus(function(a){d(a)})},function(a){var b,c="facebook-jssdk",d=a.getElementsByTagName("script")[0];a.getElementById(c)||(b=a.createElement("script"),b.id=c,b.async=!0,b.src="//connect.facebook.net/en_US/sdk.js",d.parentNode.insertBefore(b,d))}(document)}]);var appControllers=angular.module("appControllers",[]);appControllers.controller("HeaderCtrl",["$rootScope","$state","$window","$scope","$http",function(a,b,c,d,e){}]),appControllers.controller("LoginCtrl",["$rootScope","$state","$window","$scope","$http",function(a,b,c,d,e){a.privacy&&(a.privacy=0,c.location.reload())}]),appControllers.controller("FooterCtrl",["$rootScope","$state","$window","$scope","$http",function(a,b,c,d,e){d.goback=function(){FB&&a.username?b.go("app.main"):(a.privacy=1,b.go("app"))}}]),appControllers.controller("MainCtrl",["$rootScope","$state","$scope","$window","$timeout","$http","FBapi",function(a,b,c,d,e,f,g){function h(){c.watcher=[!1,!1,!1,!1,!1,!1],c.$watch("watcher",function(a,b){a[0]&&(c.done_p_info=!0),a[1]&&(c.done_visited=!0),a[2]&&(c.done_profile=!0),a[3]&&(c.done_word=!0),a[4]&&(c.done_post=!0),a[5]&&(c.done_network=!0)},!0),c.data=[],c.num_names_appear=[],c.done_p_info=!1,c.done_visited=!1,c.done_profile=!1,c.done_word=!1,c.done_post=!1,c.done_network=!1,c.feed_network={nodes:[],links:[]},c.word_filter=["the","a","of","an","in","on","at","for","to","from","as","I","you","my","and"],c.final_network,c.profile_link={},c.word_data=[],c.most_likes_profile="",c.img_done=!1,c.number_of_events=[{key:"Number_of_events",bar:!0,values:[]}],c.data_about_me={name:"",total_people_in_feed:0,total_posts_in_feed:0,total_profile_update:0,person_appear_most:""},c.most_visitied_profile="",g.getGraphApi("/me",null).then(function(b){c.data_about_me.name=b.name,a.username=b.name},function(a){console.log(a)});var b=g.getGraphApi("/me/feed",{fields:"message,full_picture,story,created_time,from",limit:500,since:c.myDate.toDateString()});b.then(function(a){c.data=a.data,c.should_get_mode_data=!1,c.should_get_mode_data||j(c.data)},function(a){console.log(a)})}function i(a,b,c,d,e){a.nodes.push({name:d[e-1].key,group:b}),c?a.links.push({source:parseInt(e),target:c,value:parseInt(d[e-1].y)}):a.links.push({source:parseInt(e),target:0,value:parseInt(d[e-1].y)})}function j(a){var b=[],d={},e=0,f=[],h={},j=0;c.most_visited_id=0;var k=0,l=0,m=[];0===a.length&&(c.watcher[0]=!0,c.watcher[1]=!0,c.watcher[2]=!0,c.watcher[3]=!0,c.watcher[4]=!0,c.watcher[5]=!0,c.nopost=!0,c.noword=!0,c.noprofile=!0,c.img_done=!0);for(var n=0;n<a.length;n++){var o=a[n].created_time.split(/[^0-9]/),p=new Date(o[0],o[1],o[2]);if(b[n]=a[n].id,a[n].story===c.data_about_me.name+" updated his profile picture."||a[n].story===c.data_about_me.name+" updated her profile picture."){e++,c.profile_link[a[n].id]={},c.profile_link[a[n].id].id=a[n].id,c.profile_link[a[n].id].likes=0,c.profile_link[a[n].id].link=a[n].full_picture;var q=p.getFullYear()+"-"+p.getMonth()+"-"+p.getDate();c.profile_link[a[n].id].created_time=q}if(d[p.getTime()]?d[p.getTime()]++:d[p.getTime()]=1,a[n].message){var r=a[n].message.replace(/[&\/\\#+=~%.,-_:;*<>{}$()]/g,"");r=r.trim(),r=r.replace(/\s\s+/g," "),r=r.replace(/\r?\n|\r/g," ");var s=r.split(" ");m.push(s)}for(var t=0,u=0;u<c.num_names_appear.length;u++)if(a[n].from&&c.num_names_appear[u].key===a[n].from.name){c.num_names_appear[u].y++,k<=c.num_names_appear[u].y&&a[n].from.name!==c.data_about_me.name&&(k=c.num_names_appear[u].y,c.most_visited_id=a[n].from.id,c.data_about_me.person_appear_most=a[n].from.name),t=1;break}!t&&a[n].from&&a[n].from.name!==c.data_about_me.name&&(j++,c.num_names_appear.push({key:a[n].from.name,y:1})),c.most_visited_id||a[n].from.name===c.data_about_me.name||(c.most_visited_id=a[n].from.id),c.data_about_me.total_people_in_feed=j,l++}c.num_names_appear.sort(function(a,b){return a.y-b.y}),c.num_names_appear.reverse();var v,w,x,y;if(l===a.length){for(var z=0;z<c.num_names_appear.length+1;z++)if(0===z)c.feed_network.nodes.push({name:c.data_about_me.name,group:0});else{var A=0;c.num_names_appear[z-1].y>10?(A=1,i(c.feed_network,A,v,c.num_names_appear,z),v||(v=z)):c.num_names_appear[z-1].y<=10&&c.num_names_appear[z-1].y>6?(A=2,i(c.feed_network,A,w,c.num_names_appear,z),w||(w=z)):c.num_names_appear[z-1].y<=6&&c.num_names_appear[z-1].y>3?(gorup=3,i(c.feed_network,A,x,c.num_names_appear,z),x||(x=z)):(A=4,i(c.feed_network,A,y,c.num_names_appear,z),y||(y=z))}c.final_network=c.feed_network,c.watcher[5]=!0,g.getGraphApi("/"+c.most_visited_id+"/picture",{width:"200",height:"200"}).then(function(a){c.most_visitied_profile=a.data.url,c.img_done=!0});for(var B=0;B<m.length;B++)for(var z=0;z<m[B].length;z++)h[m[B][z]]?h[m[B][z]]++:h[m[B][z]]=1;for(var C in h)C.length<10&&h[C]>1&&" "!==C&&""!==C&&c.word_filter.indexOf(C)===-1&&c.word_data.push({text:C,weight:parseInt(h[C])});c.word_data.sort(function(a,b){return a.weight-b.weight}),0===c.word_data.length&&(c.noword=!0),c.data_about_me.total_posts_in_feed=a.length,c.data_about_me.total_profile_update=e,c.watcher[0]=!0,c.watcher[1]=!0,c.watcher[3]=!0}for(var C in d){var D=[];D[0]=parseInt(C),D[1]=d[C],c.number_of_events[0].values.push(D)}c.number_of_events[0].values.sort(function(a,b){return a[0]-b[0]});for(var E=0;E<c.number_of_events[0].values.length;E++)if(c.number_of_events[0].values[E+1]){var F=c.number_of_events[0].values[E+1][0]-c.number_of_events[0].values[E][0];F>2592e6&&c.number_of_events[0].values.splice(E+1,0,[c.number_of_events[0].values[E][0]+2592e6,0])}if(c.watcher[4]=!0,c.data_about_me.total_profile_update)for(var C in c.profile_link)g.getLikes(C).then(function(a){c.profile_link[a[1]].likes=a[0].summary.total_count,f.push(c.profile_link[a[1]]),f.length===e&&(f.sort(function(a,b){return a.likes-b.likes}),c.most_likes_profile=f[f.length-1].link,c.watcher[2]=!0)});else c.watcher[2]=!0,c.noprofile=!0,c.img_done=!0}c.refresh=function(){h()},c.data_name=["Personal Info","Visited People Chart","Profile Gallery","Words Chart","Post Chart","Social Graph"],c.options_one={chart:{type:"pieChart",height:500,x:function(a){return a.key},y:function(a){return a.y},showLabels:!0,duration:500,labelThreshold:.03,labelSunbeamLayout:!0,showLegend:!1}},c.options_three={chart:{type:"historicalBarChart",height:500,margin:{top:20,right:20,bottom:65,left:50},x:function(a){return a[0]},y:function(a){return a[1]},showValues:!0,valueFormat:function(a){return d3.format(",.1d")(a)},duration:100,xAxis:{axisLabel:"Dates",tickFormat:function(a){return d3.time.format("%x")(new Date(a))},rotateLabels:30,showMaxMin:!1},yAxis:{axisLabel:"Number of Posts",axisLabelDistance:-10,tickFormat:function(a){return d3.format(",.1d")(a)}},tooltip:{keyFormatter:function(a){return d3.time.format("%x")(new Date(a))}}}};var k=d3.scale.category20();c.options_four={chart:{type:"forceDirectedGraph",height:500,width:function(){return nv.utils.windowSize().width}(),margin:{top:20,right:20,bottom:20,left:20},duration:500,color:function(a){return k(a.group)},nodeExtras:function(a){a&&a.append("text").attr("dx",8).attr("dy",".35em").text(function(a){return a.name}).style("font-size","10px")},tooltip:{contentGenerator:function(a){var b=a.series[0],c=a.series[1];if(null!==b.value){var d="<tr><td class='key'>Group: </td><td class='x-value'>"+c.value+"</td></tr>",e="<thead><tr><td class='legend-color-guide'><div style='background-color: "+b.color+";'></div></td><td class='key'><strong>"+b.value+"</strong></td></tr></thead>";return"<table>"+e+"<tbody>"+d+"</tbody></table>"}}}}},c.myDate=new Date("2010/01/01"),d.setTimeout(function(){var b=0;a.token||(console.log("no Token"),b=100,FB.getLoginStatus(function(b){"connected"===b.status&&(a.token=b.authResponse.accessToken)})),d.setTimeout(function(){h()},b)},500)}]);var FBServices=angular.module("FBServices",[]);FBServices.factory("FBapi",["$http","$q","$window","$timeout",function(a,b,c,d){function e(a,c){if("undefined"!=typeof FB){var d=b.defer();return FB.api(a,"get",c,function(a){!a||a.error?d.reject("Error occured"):d.resolve(a)}),d.promise}}function f(a,c){if("undefined"!=typeof FB){var d=b.defer();return FB.api(a,function(a){!a||a.error?d.reject("Error occured"):d.resolve([a,c])}),d.promise}}return{getGraphApi:function(a,b){return e(a,b)},getLikes:function(a){return f("/"+a+"/likes?fields=total_count&summary=true",a)}}}]);