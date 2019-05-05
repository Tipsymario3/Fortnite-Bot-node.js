const request = require("request-promise");
const EGClient = require('epicgames-client').Client;
const Fortnite = require('epicgames-fortnite-client');
const EInputType  = require('epicgames-client').EInputType;

var _ = require('lodash');

accountid = 'y';
status = 'deez-nuts';

let eg = new EGClient({
    email: 'botaccountemail',
    password: 'botaccountpw',
    debug: console.log
});

(async _ => {
    
    var c_party;

    if(!await eg.init() || !await eg.login())
        throw 'Cannot connect to Epic Games servers...';
    
    let communicator = eg.communicator;
    let fortnite = await eg.runGame(Fortnite);
    
    communicator.updateStatus(status);

    communicator.on('friend:request', async data => {
        if(data.friend.id != accountid){
            eg.acceptFriendRequest(data.friend.id).then(async (ac_result) => {
                /*adding friend ops was seccessful*/
            });
        }
    });

    fortnite.communicator.on('party:invitation', async invitation => {

        c_party = invitation.party;
        
        invitation.party.me.setBRCharacter('/Game/Athena/Items/Cosmetics/Characters/CID_029_Athena_Commando_F_Halloween.CID_029_Athena_Commando_F_Halloween');
        
        await invitation.accept();
        
        invitation.party.me.setBattlePass(true, 100, 12000, 120000);

    });

    fortnite.communicator.on('friend:message', async data => {

        if(data.message == 'help'){
              communicator.sendMessage(data.friend.id, 'Commands: !skin, !emote, !backbling, !banner, !stop');
        }
        
      var args = data.message.split(" ");
      if (args[0] == "!skin"){
		  console.log("skin command called");
          c_party.members.forEach(async member => {
              try{
                    member.clearEmote(member.jid);
					member.setBRCharacter("/Game/Athena/Items/Cosmetics/Characters/" + args[1] + "." + args[1], member.jid);
              }catch(e){
                  communicator.sendMessage(data.friend.id, 'Cant set skin because it is invalid skin!');
              }
          });
      }
      if (args[0] == "!status"){
		  console.log("status change attempted")
            fortnite.communicator.updateStatus(args[1] + args[2] + args[3]);
            communicator.updateStatus(args[1] + args[2] + args[3]);
      }
      if (args[0] == "!emote"){
		  console.log("emote attempted")
          c_party.members.forEach(async member => {
              try{
                    member.setEmote("/Game/Athena/Items/Cosmetics/Dances/" + args[1] + "." + args[1], member.jid);
              }catch(e){
                  communicator.sendMessage(data.friend.id, 'Cant set emote because it is invalid emote!');
              }
          });
      }
     
      if (args[0] == "!backbling"){
		  console.log("attempted changing backbling")
          c_party.members.forEach(async member => {
              try{
                    member.setBackpack("/Game/Athena/Items/Cosmetics/Backpacks/" + args[1] + "." + args[1], member.jid);
              }catch(e){
                  communicator.sendMessage(data.friend.id, 'Cant set backbling because it is invalid backbling!');
              }
          });
      }
     
      if (args[0] == "!epicbanner"){
          args = data.message.split(" ").toUpperCase;
          c_party.members.forEach(async member => {
              try{
                    member.setBRBanner("Otherbanner28", "defaultcolor1", 12, member.jid)
              }catch(e){
                  communicator.sendMessage(data.friend.id, 'Cant set banner because it is some error!');
              }
          });
      }
        
        
      if(args[0] == "!ready"){
          if(args[1] == "up" || args[1] == "down") {
             c_party.members.forEach(async member => {
              try{
                    member.setReady(args[1] == "up" ? true : false, member.jid);
              }catch(e){
                  communicator.sendMessage(data.friend.id, 'Cant set ready because it is unknown error!');
              }
             }); 
          }else{
              communicator.sendMessage(data.friend.id, 'Cant set ready because it is invalid switch!');
          }
      }
     
      if(args[0] == "!stop"){
        c_party.members.forEach(async member => {
          member.clearEmote(member.jid);
        });
      }
 
    });

    /* rest of your code goes here */
})();
