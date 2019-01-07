// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */
 import post_artifacts from '../../build/contracts/Post.json'

 var Post = contract(post_artifacts);
 var allTags = {};
 var userPostCount=0;
 var account = web3.eth.accounts[0];



window.App = {
  start: function() {
    Post.setProvider(web3.currentProvider);
   var self = this;
   self.readTag();
   self.readUserPost();
  },




  //Read tag starts
  readTag:function(){
          var self = this;
          Post.deployed().then(function(contractInstance) {
                 contractInstance.getTags.call().then(function(values) {
                   Object.keys(values).forEach(function (value) {
                    allTags[value]= web3.toUtf8(values[value]);
                    $("#tag-available").append("<tr><td>" + web3.toUtf8(values[value])+ "</td></td></tr>");
                   });

                   self.setupDropDown();
                 });

          });
  },
  //Read tag ends

     // autofill dropdown
     setupDropDown: function() {
            Object.keys(allTags).forEach(function (tag) {
             $("#dropdownlist").append("<option value="+ allTags[tag]+">"+ allTags[tag]+"</option>");
            });
    }, // autofill dropdown ends

    // add user post
      addUserPost:function(){
        var self = this;
        let post = $("#postContent").val();
        let tag= $("#dropdownlist").val();
        let proofOfConcept=$("#proofOfConcept").val();
        console.log("In addUserPost" + tag);
        console.log("In addUserPost" + post);
        Post.deployed().then(function(contractInstance) {
            contractInstance.addUserPost(tag,post,proofOfConcept,{from: web3.eth.accounts[0],gas: 1400000}).then(function(v) {
            self.populateTablePosts(userPostCount);
                return;
         });

        });
      },
      // add user post ends

      // Read user Posts
      readUserPost:function(){
              var self = this;
              console.log("read user post count "+userPostCount);
              Post.deployed().then(function(contractInstance) {
                     contractInstance.postCount.call().then(function(count) {
                     userPostCount=count;
                     // console.log("post count "+userPostCount);
                      $("#userPostTable tr").remove();
                       for(var i=0; i< userPostCount;i++){
                         self.populateTablePosts(i);
                       }

                     });
              });
      },
      // Read User Post ends

      //Populate table Posts
      populateTablePosts:function(post){
              var self = this;
              console.log("read post "+post);
              Post.deployed().then(function(contractInstance) {
                   var serialNumber=Number(post)+1;
                   console.log("read serial "+serialNumber);
                     contractInstance.readPostByIndex.call(post).then(function(results) {
                       console.log(account);
                        if(account==results[2]) {
                            $("#userPostTable").append("<tr class='accordion-toggle' data-toggle='collapse' data-target='.child"+serialNumber+"'><td><i class='fa fa-caret-square-o-right' aria-hidden='true' style='color:#e76f34'></i></i> "+serialNumber+"<p style='font-size:8px;'>#Click to Expand</p></td><td>"+results[1]+"</td><td>"+results[4]+"</td></tr><tr class='accordion-body  collapse child"+serialNumber+"'><td colspan='3'> "+results[5]+"</td></tr>");
                             return;
                          }
                     });

              });
      },
      //Populate table Posts  ends

      //Check for Admin
      checkAdmin:function(){
              var self = this;
              Post.deployed().then(function(contractInstance) {
                     contractInstance.getTagsOfAdmin.call(account).then(function(ret) {
                        console.log("checkAdmin  "+ret.length +" "+ account);
                        if(ret.length == 0){
                            $('.admin').css("display","none");
                            self.checkOwner();
                        } else {
                          $('.admin').css('display','block');
                        }

                     });
              });
      },
      //Check for Admin Ends

      //Check for Owner
      checkOwner:function(){
              var self = this;
              Post.deployed().then(function(contractInstance) {
                     contractInstance.checkForOwner.call(account).then(function(ret) {
                        console.log("checkOwner  "+ret+" ");
                        if(!ret){
                            $('.admin').css("display","none");
                        } else {
                          $('.admin').css('display','block');
                        }

                     });
              });
      },
      //Check for Owner Ends


};

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }


    App.start();
    App.checkAdmin();

    var accountInterval = setInterval(function() {
        if (web3.eth.accounts[0] !== account) {
          account = web3.eth.accounts[0];
          App.readUserPost();
          App.checkAdmin();
        }
      }, 100);


});
