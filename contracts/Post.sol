pragma solidity ^0.4.23;

contract Post{

// Variables for Tokens
uint public totalTokens;
uint public balanceTokens;
uint public tokenPrice;
uint public bountyTokens;

struct UserStruct {
  uint tokensBought;
  uint tokensUsed;
}

mapping(address => UserStruct) public userInfo;

//Variables for Bug Post
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
    uint tokenBet;
    uint postAccepted;
}

bytes32[] allTags;

mapping(address => TagStruct) adminTags;

mapping(uint8 => PostStruct) totalPosts;

uint8 postid;

constructor(uint _totalTokens, uint _bountyTokens, uint _tokenPrice) public {
       owner = msg.sender;
       totalTokens = _totalTokens;
       balanceTokens = _totalTokens;
       tokenPrice = _tokenPrice;
       bountyTokens= _bountyTokens;
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

function addUserPost(bytes32 tag,string post, string proofOfConcept,  uint tokens) public returns (bool success){

    uint availableTokens = userInfo[msg.sender].tokensBought - userInfo[msg.sender].tokensUsed;
    require(tokens <= availableTokens, "You dont have enough tokens");
    require(tokens <= 50,"You can bet Maximum 50 Tokens only");// Max Limit of 50 Tokens to bet
    PostStruct memory postContent;
    postContent.tokenBet=tokens;
    postContent.postTag= tag;
    postContent.post=post;
    postContent.proofOfConcept=proofOfConcept;
    postContent.user=msg.sender;
    totalPosts[postid]=postContent;
    postid+=1;
    userInfo[msg.sender].tokensUsed += tokens;
    balanceTokens += tokens;

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
    if(totalPosts[index].voteCount == 4){
        require(bountyTokens >= 5*totalPosts[index].tokenBet, "Bounty Tokens Not Available");
        require(balanceTokens >= totalPosts[index].tokenBet, "Insufficient Tokens");
        totalPosts[index].postAccepted=1;
        userInfo[totalPosts[index].user].tokensBought +=totalPosts[index].tokenBet;
        userInfo[totalPosts[index].user].tokensBought += (5*totalPosts[index].tokenBet);
        bountyTokens -= 5*totalPosts[index].tokenBet;
        balanceTokens -= totalPosts[index].tokenBet;
    }
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

// Functions for Tokens sale
function buy() payable public {
  uint tokensToBuy = msg.value / tokenPrice;
  require(tokensToBuy <= balanceTokens);
  userInfo[msg.sender].tokensBought += tokensToBuy;
  balanceTokens -= tokensToBuy;
}

function userDetails(address user) view public returns (uint, uint) {
  return (userInfo[user].tokensBought, userInfo[user].tokensUsed);
}

function tokensSold() public view returns (uint) {
  return totalTokens - balanceTokens;
}



}
