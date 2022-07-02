const express = require("express");
const router = express.Router();
const userHandler = require("./userHandler");
const auth = require("../middleware/auth");
const contactHandler= require("./contactHandler");
const wallpostHandler = require('./wallpostHandler');
const messageHandler = require('./messageHandler')




router.post("/register", userHandler.registerNewUser);
router.post("/login", userHandler.loginUser);
router.post("/updatephoto",  userHandler.updatePhoto);
router.post("/hasphoto", userHandler.hasPhoto);
router.post("/getPhoto", userHandler.getPhoto);
router.post("/updateprenom", userHandler.updatePrenom);
router.post("/updatenom", userHandler.updateNom);
router.post("/updatemail", userHandler.updateMail);
router.post("/deleteaccount", userHandler.deleteAccount);
router.post("/deletefriend", contactHandler.deleteFriend);
router.post("/contactslist", contactHandler.contactslistData );
router.post("/invitecontact", contactHandler.invitationContact );
router.post("/updatedemandeenvoyee", contactHandler.updatedemandeenvoyee);
router.post("/isinvited",contactHandler.isinvited);
router.post("/getinvitattente",  contactHandler.getInvitAttente);
router.post("/accepterami", contactHandler.acceptationAmi,  contactHandler.accepterAmi);
router.post("/pendinginvit", contactHandler.hasPendingInvit);
router.post("/getallfriends", contactHandler.getAllFriends);
router.post("/hasfriends",  contactHandler.hasFriends);
router.post("/createpost", wallpostHandler.createNewPost);
router.post("/getuserwallpost", wallpostHandler.getUserWallposts);
router.post("/haswallpost",  wallpostHandler.hasWallPost);
router.post("/createmessage",  messageHandler.createMessage);
router.post("/getusermessages",  messageHandler.getUserMessages);
router.post("/hasmessages",  messageHandler.hasMessage);
router.post("/deletemessage",  messageHandler.deleteMessage);


router.get("/logged", auth, userHandler.dataProtegee);
router.get("/contact", auth, userHandler.dataProtegee);
router.get("/user", auth, userHandler.userData);
router.get("/getinscrits", contactHandler.getInscrits);



module.exports = router;


