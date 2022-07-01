const User = require('../model/User')
const MessagePrive = require('../model/Message')


exports.createMessage = async (req, res) => {
    try{
        // console.log("req.body create message :", req.body)
        let message = new MessagePrive({
            title: req.body.title,
            message: req.body.message,
            author: req.body.author,
            nameUser: req.body.nameUser,
            prenomUser: req.body.prenomUser,
            destinataire: req.body.ami
        });

        let createdMessage = await message.save();
        res.status(200).json({
            message: "nouveau message enregistré",
            data: createdMessage,
        });
    } catch (err) {
        console.log("catch create message", err);
        res.status(500).json({
            error: err
        });
    };
};


exports.getUserMessages = async ( req, res ) => {
    // console.log("req.body", req.body)
    const destinataireCible = req.body.destinataire
    const userMessages = []

    try{
        // console.log("req body getusermessages :", destinataireCible)
        const allMessages = await MessagePrive.find();
        // console.log("all messages :", allMessages);
        
        for(let oneMessage of allMessages) {
            // console.log("destinataireCible :", destinataireCible);
            // console.log("all messages :", oneMessage);
            if(oneMessage.destinataire === destinataireCible){
                userMessages.push(oneMessage)
            }
        }
        // console.log("Messages pour le destinataire", userMessages)
        const reversedUserMessages = userMessages.reverse();
        res.json(reversedUserMessages)


    } catch {
        console.log("catch get user messages")
        res.json({msg: false})
    }

}


exports.hasMessage = async (req, res) => {
    // console.log('req.body.destinataire :', req.body.destinataire)
    const destinataireCible = req.body.destinataire
    const userMessages = []
    try {
        const allMessages = await MessagePrive.find();
        // console.log('messages :', allMessages)

        for(let oneMessage of allMessages) {
            if(oneMessage.destinataire === destinataireCible) {
                userMessages.push(oneMessage)
            }
        }
        if(userMessages.length > 0) {
            res.json({hasmessages: true})
        } else {
            res.json({hasmessages: false})
        }

    }catch {
        console.log("pas de message")
        res.json({msg: false})
    }
}

exports.deleteMessage = async (req, res) => {
    // console.log('req.body.messageId :', req.body.MessageId)
    const messageToDelete = req.body.MessageId
    try {
        MessagePrive.findOne(
            {_id: messageToDelete}, (err, message) => {
                if(!err){
                    // console.log('message à supprimer',message)
                    MessagePrive.deleteOne({_id: messageToDelete}, function(err, message) {
                        if(err) throw err
                        // console.log("message supprimé");
                        res.json({msg: 'message deleted'})
                    })
                } else {
                    console.log('pas de message à supprimer !')
                }
            }
        )

    } catch {
        console.log('catch delete message')
    }
}