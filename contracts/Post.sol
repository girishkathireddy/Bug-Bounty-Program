pragma solidity ^0.4.23;

contract Post{

address public owner;

struct TagStruct{
   bytes32[] tagged;
}

struct PostStruct{
    bytes32 postTag;
    string post;
    string proofOfConcept;
    address user;
    address[] votedBy;
    uint8 voteCount;
}

bytes32[] allTags;

mapping(address => TagStruct) adminTags;

mapping(uint8 => PostStruct) totalPosts;

uint8 postid;

constructor() public {
       owner = msg.sender;
   }

 modifier onlyBy(address _account)
    {
        require(msg.sender == _account, "Sender not authorized.");
        // Do not forget the "_;"! It will
        // be replaced by the actual function
        // body when the modifier is used.
        _;
    }




function addTags(bytes32 tag) public onlyBy(owner) {
   allTags.push(tag);
}

function addTagsToAdmins(address adrs,bytes32 tag) public onlyBy(owner) {
   adminTags[adrs].tagged.push(tag);
}

function getTags() public view returns(bytes32[]){
   return allTags;
}

function addUserPost(bytes32 tag,string post, string proofOfConcept) public returns (bool success){
    PostStruct memory postContent;
    postContent.postTag= tag;
    postContent.post=post;
    postContent.proofOfConcept=proofOfConcept;
    postContent.user=msg.sender;
    totalPosts[postid]=postContent;
    postid+=1;
    return true;
}

function postCount() public view returns(uint8){
    return postid;
}

function readPostByIndex(uint8 index) public view returns(bytes32,string,address,address[],uint8, string){
    return( totalPosts[index].postTag,totalPosts[index].post,totalPosts[index].user,
    totalPosts[index].votedBy,totalPosts[index].voteCount,totalPosts[index].proofOfConcept);
}

function voteByAdmin(uint8 index) public returns(bool success){
    totalPosts[index].votedBy.push(msg.sender);
    totalPosts[index].voteCount+=1;
    return true;
}

function getTagsOfAdmin(address adrs) public view returns(bytes32[]){
   return adminTags[adrs].tagged;
}

function checkForOwner(address adrs) public view returns(bool success){
  if(adrs == owner)
      return true;
  else
      return false;
}




}
