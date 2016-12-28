var appControllers = angular.module('appControllers', []);

appControllers.controller('HeaderCtrl', ['$rootScope', '$state','$window', '$scope', '$http',
  function ($rootScope, $state,$window, $scope, $http) {



     }]);

appControllers.controller('LoginCtrl', ['$rootScope', '$state','$window', '$scope', '$http',
  function ($rootScope, $state,$window, $scope, $http) {

          if($rootScope.privacy){
            $rootScope.privacy = 0;
            $window.location.reload();
          }

     }]);



appControllers.controller('FooterCtrl', ['$rootScope', '$state','$window', '$scope', '$http',
  function ($rootScope, $state,$window, $scope, $http) {

      $scope.goback = function(){
        if(FB && $rootScope.username){
          $state.go('app.main');
        }

        else{
          $rootScope.privacy = 1;
          $state.go('app');
        }
        
      }


  	 }]);



appControllers.controller('MainCtrl', ['$rootScope', '$state', '$scope','$window', '$timeout' ,'$http','FBapi',
  function ($rootScope, $state, $scope,$window, $timeout, $http, FBapi) {


    //refresh button
    $scope.refresh = function(){
          init();
    }
    

    //data name
    $scope.data_name = ["Personal Info", "Visited People Chart", "Profile Gallery", "Words Chart", "Post Chart", "Social Graph"];
  

   
    
 
    //visited people chart
    $scope.options_one = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.03,
                labelSunbeamLayout: true,
                showLegend: false
            }
        };


        //historical number of event in feed chart
        $scope.options_three = {
            chart: {
                type: 'historicalBarChart',
                height: 500,

                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 50
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.1d')(d);
                },
                duration: 100,
                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(d))
                    },
                    rotateLabels: 30,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Number of Posts',
                    axisLabelDistance: -10,
                    tickFormat: function(d){
                        return d3.format(',.1d')(d);
                    }
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d3.time.format('%x')(new Date(d));
                    }
                },

            
            }
        };


        //feed_network
        var color = d3.scale.category20();
      $scope.options_four = {
        chart: {
            type: 'forceDirectedGraph',
            height: 500,
            width: (function(){ return nv.utils.windowSize().width })(),
            margin:{top: 20, right: 20, bottom: 20, left: 20},
            duration: 500,
            color: function(d){
                return color(d.group)
            },
            nodeExtras: function(node) {
                node && node
                  .append("text")
                  .attr("dx", 8)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.name })
                  .style('font-size', '10px');
            },
             tooltip: {
                contentGenerator: function (e) {
                  var name = e.series[0];
                 
                  var group = e.series[1];
                
                  if (name.value === null) return;
                  
                  var rows = 
                    "<tr>" +
                      "<td class='key'>" + 'Group: ' + "</td>" +
                      "<td class='x-value'>" + group.value + "</td>" + 
                    "</tr>";

                  var header = 
                    "<thead>" + 
                      "<tr>" +
                        "<td class='legend-color-guide'><div style='background-color: " + name.color + ";'></div></td>" +
                        "<td class='key'><strong>" +  name.value + "</strong></td>" +
                      "</tr>" + 
                    "</thead>";
                    
                  return "<table>" +
                      header +
                      "<tbody>" + 
                        rows + 
                      "</tbody>" +
                    "</table>";
                } 
              }
        }
    };


     $scope.myDate = new Date("2010/01/01");
    //init function
    function init(){

     

      //var since = $scope.myDate.getTime();
      //init values
      $scope.watcher = [false,false,false,false,false,false];

      //loading watcher
   $scope.$watch('watcher', function(newvalue, oldvalue) {
        // some value in the array has changed 
       
        if(newvalue[0]){
               $scope.done_p_info = true;
        }
        if(newvalue[1]){
              $scope.done_visited = true;
   
        }
        if(newvalue[2]){
              $scope.done_profile = true;
  
        }
        if(newvalue[3]){
              $scope.done_word = true;
  
        }

        if(newvalue[4]){
             $scope.done_post = true;
   
        }
        if(newvalue[5]){
            $scope.done_network = true;
    
        }

    }, true);

  

      $scope.data = [];
      $scope.num_names_appear = [];
      $scope.done_p_info = false;
      $scope.done_visited = false;
      $scope.done_profile = false;
      $scope.done_word = false;
      $scope.done_post = false;
      $scope.done_network = false;
           $scope.feed_network = {
          "nodes":[],
          "links":[] 
        };

     
        $scope.word_filter = ['the', 'a', 'of', 'an', 'in', 'on', 'at', 'for', 'to','from','as', 'I', 'you'];

      $scope.final_network;

      // $scope.nextpage;
      // $scope.should_get_mode_data

         $scope.profile_link = {};
         $scope.word_data = [];
         $scope.most_likes_profile = "";

        // $scope.done = false;
         $scope.img_done = false;



         $scope.number_of_events = [
            {
                "key" : "Number_of_events" ,
                "bar": true,
                "values" : []
              }];
         
          $scope.data_about_me = {

            name : "",
            total_people_in_feed : 0,
            total_posts_in_feed : 0,
            total_profile_update : 0, 
            person_appear_most : "" 
    };



      $scope.most_visitied_profile ='';
     

         FBapi.getGraphApi('/me', null).then(function(val){
             $scope.data_about_me.name = val.name;
              $rootScope.username = val.name;
             
           
        },function(Error) {
          console.log(Error);
        });
        var get_Data = FBapi.getGraphApi('/me/feed' , {fields:'message,full_picture,story,created_time' , limit : 500, since: $scope.myDate.toString() } );

        get_Data.then( function(val) {
           $scope.data = val.data;
           // $scope.nextpage = val.paging.next;
           $scope.should_get_mode_data = false; 
           

           if(!$scope.should_get_mode_data){
                 analyze_data($scope.data);
           }
        
           
          },function(Error) {
          console.log(Error);
        });

         
      
    }

    function analyze_data(data){

              var ids = [];
            
              var num_events = {};

              var profile_update_count = 0;
            
              var profile_picture_object = [];


              //get posts id
              for(var i = 0; i < data.length; i++){

                 var a = (data[i].created_time).split(/[^0-9]/);
                 var date = new Date(a[0],a[1]-1,a[2]);
               


                ids[i] = data[i].id; 
                if(data[i].story === ($scope.data_about_me.name + " updated his profile picture.")){
                  profile_update_count++;
                
                  $scope.profile_link[data[i].id] = {};
                  $scope.profile_link[data[i].id].id = data[i].id;
                   $scope.profile_link[data[i].id].likes = 0;
                    $scope.profile_link[data[i].id].link = data[i].full_picture;
                   
                   
                    var shortdate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
                  $scope.profile_link[data[i].id].created_time = shortdate;
                  
                }

                //get number of events
                if(num_events[date.getTime()]){

                  num_events[date.getTime()]++;
                }
                else{
               
                  num_events[date.getTime()] = 1;
                }
                

              }

              //update number of events chart
              for(var key in num_events){
                var arr = [];
                arr[0] = parseInt(key);
                arr[1] =(num_events[key]);
                $scope.number_of_events[0].values.push(arr);

              }

              $scope.number_of_events[0].values.sort(function(a,b){
                return a[0] - b[0];
              });

              for(var t = 0; t <  $scope.number_of_events[0].values.length;t++){
                if( $scope.number_of_events[0].values[t+1]){
                  var diff = $scope.number_of_events[0].values[t+1][0]-$scope.number_of_events[0].values[t][0];
                  if( diff > 2592000000){
                       $scope.number_of_events[0].values.splice(t+1,0, [ $scope.number_of_events[0].values[t][0]+2592000000, 0]);
                     
                   
                  }  
              
                }
                  
              }

              //done for getting number of events chart 
              $scope.watcher[4] = true;

              

              //get updated profile links 
              for(var key in $scope.profile_link){

                FBapi.getLikes(key).then(function(response){
                        
                    $scope.profile_link[response[1]].likes = response[0].summary.total_count;
                    profile_picture_object.push($scope.profile_link[response[1]]);

                    if(profile_picture_object.length === profile_update_count){
                       profile_picture_object.sort(function(a, b) {
                            return a.likes - b.likes;
                        });

                      $scope.most_likes_profile = profile_picture_object[profile_picture_object.length-1].link;
                    
                      
                        $scope.watcher[2] = true;
                        
                      
                      
                    }
                    
                  });
              }


              //update user info
              $scope.data_about_me.total_posts_in_feed = data.length;
              $scope.data_about_me.total_profile_update = profile_update_count;
            

             //postid/likes?fields=total_count&summary =true
               var message = {};
             var peoplecount = 0;
              $scope.most_visitied_id = 0;
              var visit_count = 0;
              var time_count = 0;
                var message_array = [];


                //get user messages
              for(var i = 0; i < ids.length; i++){
                FBapi.getGraphApi('/' + ids[i], {fields:'from,message'}).then(function(response){
                 

                    if(response.message){
                    
                       var words_array = response.message.split(" ");

                      message_array.push(words_array);
                    }
                  
                    var already_have = 0;
                  
                    //datas for visited people
                       for(var i = 0; i < $scope.num_names_appear.length; i++){
                          if(response.from && $scope.num_names_appear[i].key === response.from.name){

                            if(visit_count < $scope.num_names_appear[i].y && response.from.name !== $scope.data_about_me.name){
                              visit_count = $scope.num_names_appear[i].y;
                             $scope.most_visitied_id = response.from.id;
                             $scope.data_about_me.person_appear_most = response.from.name;

                            }

                            $scope.num_names_appear[i].y++;
                            already_have = 1;
                            break;
                          }
                    }

                    
                   
                    if(!already_have && response.from && response.from.name !== $scope.data_about_me.name){
                      peoplecount++;
                      $scope.num_names_appear.push({
                        key : response.from.name,
                        y : 1
                      });
                    }

                    $scope.data_about_me.total_people_in_feed = peoplecount;
                
                 time_count++;

                 if(time_count === ids.length){

                   
                    //make feed network
                    for(var n = 0; n < $scope.num_names_appear.length+1; n++){

                        if(n===0){
                           $scope.feed_network.nodes.push({
                              "name" : $scope.data_about_me.name,
                              "group" : 0
                            });
                           continue;

                        }


                        //grouping
                        var group = 0;
                        if($scope.num_names_appear[n-1].y > 12){
                              group = 1;
                        }
                        else if($scope.num_names_appear[n-1].y <= 12 && $scope.num_names_appear[n-1].y > 8){
                            group = 2;
                        }
                        else if($scope.num_names_appear[n-1].y <= 8 && $scope.num_names_appear[n-1].y > 4){
                            gorup = 3;
                        }
                        else{
                            group = 4;
                        }


                          $scope.feed_network.nodes.push({
                              "name" : $scope.num_names_appear[n-1].key,
                              "group" : group
                          });

                          $scope.feed_network.links.push(
                            {"source":parseInt(n),"target":0,"value": parseInt($scope.num_names_appear[n-1].y)}
                          );

                    }

                   
                    
                      //done for feed network
                     $scope.final_network = $scope.feed_network;
                     $scope.watcher[5] = true;

                   
                FBapi.getGraphApi('/'+ $scope.most_visitied_id + '/picture',{width:'200',height:'200'}).then(function(response){
                  $scope.most_visitied_profile = response.data.url;
                  
                   $scope.img_done = true;
                  
                  
                });

                for(var m = 0; m < message_array.length; m++){
                for(var n = 0; n < message_array[m].length;n++){
                    if(message[message_array[m][n]]){
                        message[message_array[m][n]]++;
                    }
                    else{
                      message[message_array[m][n]] = 1;
                    }
                }
              }

              //make words data
              for(var key in message){
                if(key.length < 10 && message[key] > 1 && key !== " " && key !== "" && $scope.word_filter.indexOf(key) === -1){
                  $scope.word_data.push({
                  text : key,
                  weight : parseInt(message[key])
                   });
                }
                
              }

              $scope.word_data.sort(function(a,b){
                  return a.y - b.y;
              });

                  //done for word cloud, user info, and visited people chart
                    $scope.watcher[0] = true;
                   $scope.watcher[1] = true;
                   $scope.watcher[3] = true;

                
              }
               
                   
                });



                
              }


             

             


    }



   $window.setTimeout(function(){
       var gettoken = 0; 
         if(!$rootScope.token){
              console.log("no Token");
              gettoken = 100;
                FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                // Logged into your app and Facebook.
                 $rootScope.token = response.authResponse.accessToken;
                    
               

              }
                });
             
          }

        $window.setTimeout(function(){
           init();
        }, gettoken);

       
   }, 500);
       

   
  


  }]);