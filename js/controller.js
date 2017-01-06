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
    //waiting until get fb sdk 
   $window.setTimeout(function(){
       var gettoken = 0; 
       //if there is no token
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

          //wait until get token
        $window.setTimeout(function(){
           init();
        }, gettoken);

       
   }, 600);
       

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


      function distribute_group(feednetwork, group_num, group_lead,people_array, index){
          feednetwork.nodes.push({
                              "name" : people_array[index].key,
                              "group" : group_num
                          });
        if(group_lead){
            feednetwork.links.push(
                            {"source":group_lead,"target":index,"value": people_array[index].y}
                             );
        }
        else{
            feednetwork.links.push(
                            {"source": 0,"target":index,"value": people_array[index].y}
                             );
        }
    } // dist group




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

     
        $scope.word_filter = ['the', 'a', 'of', 'an', 'in', 'on', 'at', 'for', 'to','from','as', 'I', 'you', 'my','and'];

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
        var get_Data = FBapi.getGraphApi('/me/feed' , {fields:'message,story,created_time,from,picture' , limit : 500, since: $scope.myDate.toDateString() } );

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

         
      
    } //init

   
    function analyze_data(data){

              var ids = [];
            
              var num_events = {};

              var profile_update_count = 0;
            
              var profile_picture_object = [];

                var message = {};
             var peoplecount = 0;
              $scope.most_visited_id = 0;
              var visit_count = 0;
              var time_count = 0;
                var message_array = [];

                //no data
                if(data.length === 0){
                    $scope.watcher[0] = true;
                   $scope.watcher[1] = true;
                   $scope.watcher[2] = true;
                    $scope.watcher[3] = true;
                   $scope.watcher[4] = true;
                   $scope.watcher[5] = true;
                   $scope.nopost = true;
                   $scope.noword = true;
                   $scope.noprofile = true;
                   $scope.img_done = true;

                }

              //get posts id
              for(var i = 0; i < data.length; i++){

                 var a = (data[i].created_time).split(/[^0-9]/);
                 var date = new Date(a[0],a[1],a[2]);
               


                ids[i] = data[i].id; 
                if(data[i].story === ($scope.data_about_me.name + " updated his profile picture.") || data[i].story === ($scope.data_about_me.name + " updated her profile picture.")){
                  profile_update_count++;
                
                  $scope.profile_link[data[i].id] = {};
                  $scope.profile_link[data[i].id].id = data[i].id;
                   $scope.profile_link[data[i].id].likes = 0;

                   if(data[i].picture){
                      $scope.profile_link[data[i].id].link = data[i].picture;
                   }
                  
                   
                   
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




                 if(data[i].message){
                      
                      var filtered = data[i].message.replace(/[&\/\\#+=~%.,-_:;*<>{}$()]/g, '');

                        filtered = filtered.trim();
                        //prevent too many spaces
                        filtered = filtered.replace(/\s\s+/g, ' ');

                        //remove next lines
                        filtered = filtered.replace(/\r?\n|\r/g, ' ');
                        
                        //lower case
                        filtered = filtered.toLowerCase();

                       var words_array = filtered.split(" ");

                      message_array.push(words_array);
                    }
                  
                    var already_have = 0;
                  
                    //datas for visited people
                       for(var j = 0; j < $scope.num_names_appear.length; j++){
                          if(data[i].from && $scope.num_names_appear[j].key === data[i].from.name){

                            $scope.num_names_appear[j].y++;

                            if(visit_count <= $scope.num_names_appear[j].y && data[i].from.name !== $scope.data_about_me.name){
                              visit_count = $scope.num_names_appear[j].y;
                             $scope.most_visited_id = data[i].from.id;
                             $scope.data_about_me.person_appear_most = data[i].from.name;

                            }

                            
                            already_have = 1;
                            break;
                          }
                    }

                    
                   
                    if(!already_have && data[i].from && data[i].from.name !== $scope.data_about_me.name){
                      peoplecount++;
                      $scope.num_names_appear.push({
                        key : data[i].from.name,
                        y : 1
                      });
                    }

                    //
                    if(!$scope.most_visited_id && data[i].from.name !== $scope.data_about_me.name){
                     $scope.most_visited_id = data[i].from.id;
                    }

                    $scope.data_about_me.total_people_in_feed = peoplecount;
                
                 time_count++;


               if(time_count === data.length){
                  $scope.num_names_appear.sort(function(a,b){
                      return a.y - b.y;
                    });
                    $scope.num_names_appear.reverse();

                    var g1_lead;
                    var g2_lead;
                    var g3_lead;
                    var g4_lead;
                    
                     $scope.feed_network.nodes.push({
                          "name" : $scope.data_about_me.name,
                          "group" : 0
                      });
                    //make feed network
                    for(var n = 0; n < $scope.num_names_appear.length; n++){

                        //grouping
                        var group;
                        if($scope.num_names_appear[n].y > 10){
                              group = 1;
                              distribute_group($scope.feed_network, group, g1_lead, $scope.num_names_appear, n);
                              if(!g1_lead){
                                g1_lead = n;  
                              }
                        }
                        else if($scope.num_names_appear[n].y <= 10 && $scope.num_names_appear[n].y > 6){
                            group = 2;
                            distribute_group($scope.feed_network, group, g2_lead, $scope.num_names_appear, n);
                             if(!g2_lead){
                              g2_lead = n;
                            }
                        }
                        else if($scope.num_names_appear[n].y <= 6 && $scope.num_names_appear[n].y > 3){
                            gorup = 3;                            
                            distribute_group($scope.feed_network, group, g3_lead, $scope.num_names_appear, n);
                            if(!g3_lead){
                              g3_lead = n;
                            }
                        }
                        else{
                            group = 4;
                            distribute_group($scope.feed_network, group, g4_lead, $scope.num_names_appear, n);
                            if(!g4_lead){
                              g4_lead = n;
                            }
                        }                        

                        }

                    

                    
                    
                      //done for feed network
                     $scope.final_network = $scope.feed_network;
                     $scope.watcher[5] = true;

                   
                FBapi.getGraphApi('/'+ $scope.most_visited_id + '/picture',{width:'200',height:'200'}).then(function(response){
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
                if(key.length < 10 && key.length > 2 && message[key] > 1 && key !== " " && key !== "" && $scope.word_filter.indexOf(key) === -1 && !($scope.data_about_me.name.includes(key))){
                  $scope.word_data.push({
                  text : key,
                  weight : parseInt(message[key])
                   });
                }
                
              }


              $scope.word_data.sort(function(a,b){
                  return a.weight - b.weight;
              });

             
              if($scope.word_data.length === 0){
                $scope.noword = true;
              }

              $scope.data_about_me.total_posts_in_feed = data.length;
              $scope.data_about_me.total_profile_update = profile_update_count;
              
                
                  //done for word cloud, user info, and visited people chart
                    $scope.watcher[0] = true;
                   $scope.watcher[1] = true;
                   $scope.watcher[3] = true;

                
              

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
              if( $scope.data_about_me.total_profile_update){
                for(var key in $scope.profile_link){

                FBapi.getLikes(key).then(function(response){
                        
                  if(response && response[0] && response[1] && $scope.profile_link[response[1]]){
                     $scope.profile_link[response[1]].likes = response[0].summary.total_count;
                    profile_picture_object.push($scope.profile_link[response[1]]);

                       profile_picture_object.sort(function(a, b) {
                            return a.likes - b.likes;
                        });

                      $scope.most_likes_profile = profile_picture_object[profile_picture_object.length-1].link;
                    
                  
                   
                    }
                  });
              }

                    $scope.watcher[2] = true;
              }
              else{
                   $scope.watcher[2] = true;
                   $scope.noprofile = true;
                   $scope.img_done = true;
              }
              
            } // if data.length == timecount

            } // data for loop


} // analyze

            




   
  


  }]);