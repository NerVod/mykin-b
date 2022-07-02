const { db } = require("../model/User");
const User = require("../model/User");
const secret = process.env.JWTPRIVATEKEY

exports.registerNewUser = async (req, res) => {
  try {
      // console.log('requete dans userHandler ?',req)
    let user = new User({
      prenom: req.body.prenom,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      photoProfile: null,
      invited: false
    });
    // console.log('req user ? :',req.body.name)
    user.password = await user.hashPassword(req.body.password);
    let createdUser = await user.save();
    res.status(200).json({
      message: "Nouvel utilisateur créé",
      data: createdUser,
    });
  } catch (err) {
    console.log("erreur de création de compte :", err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.loginUser = async (req, res) => {
  const login = {
      email: req.body.email,
      password: req.body.password
  }
  try {
      let user = await User.findOne({
          email: login.email
      });
      //check if user exit
      if (!user) {
          res.status(400).json({
              type: "Utilisateur introuvable",
              msg: "Vérifier les données saisies"
          })
          return
      }
      let match = await user.compareUserPassword(login.password, user.password);
      if (match) {
          let token = await user.generateJwtToken({
              user
          }, secret, {
              expiresIn: 604800
          })
          if (token) {
              res.status(200).json({
                  success: true,
                  token: token,
                  userCredentials: user
              })
          }
      } else {
          res.status(400).json({
              type: "Utilisateur introuvable",
              msg: "Vérifier les données saisies"
          })
      }
  } catch (err) {
      console.log(err)
      res.status(500).json({
          type: "Un problème est survenu",
          msg: err
      })
  }
}

exports.userData = async (req, res) => {
  // console.log('req  userhandler backend pour userData :',req) 
  const _User = req.userData.user;
  // console.log('donnes du user:', _User)
  res.json({
    user: _User
  })
}


exports.dataProtegee = async (req, res) => {
  // console.log('req  userhandler backend pour dataprotegee :',req)

  // const _User = req.userData.user['_id'];
  // console.log('nom du user :', _User)

  res.json({
    message: " protected Data : Pour utilisateur loggé only, quelle chance !"
  })
}


exports.updatePhoto = async(req, res) => {
  // console.log(req.body)
  const user = req.body.user;
  const photo = req.body.photoUrl
  // console.log('user ?:', user)
  // console.log('photo string ?:', photo)

  try {
    const activeUser = await User.findOne(
      {email: user}, (err, userFound) => {
        if(!err) {
          // console.log('userFound',userFound)

          User.updateOne(
            {email: user}, 
            {
              photoProfile: photo
            }, function (err, docs) {
              if(err) {
                console.log('erreur if updatephoto', err)
              } else {
                console.log("Photo de profil mise à jour", docs)
              }
            }
          )
        } else {
          console.log('erreur else findOne de updatephoto')

        }
      }
    )

  } catch {
    console.log("erreur maj photo")
  }
}



exports.hasPhoto = async (req, res) => {
  const user = req.body.user;
  const photo = [];
  // console.log(req.body);

  try {
    const photo = await User.findOne(
      {email: user}, (err, userFound) => {
        if(!err) {
          const photoProfile = userFound.photoProfile
          // console.log('userFound :', photoProfile)
          if(photoProfile !== null | undefined){
            res.json({photo: true})
          } else {
            res.json({photo: false})
          }
        }
      })
  } catch {
    console.log('pas de photo')
  }

}

exports.getPhoto = async (req, res) => {
  const user = req.body.user;
  const photo = [];
  // console.log(req.body);

  try {
    const photo = await User.findOne(
      {email: user}, (err, userFound) => {
        if(!err) {
          const photoProfile = userFound.photoProfile
          // console.log('userFound :', photoProfile)
          if(photoProfile !== null | undefined){
            res.json({photo: photoProfile})
          } else {
            res.json({photo: false})
          }
        }
      })
  } catch {
    console.log('no Photo')
  }
}

exports.deleteAccount = async (req, res) => {
  const activeUser= req.body.user

try {

  const allAccounts = await User.find()

  // console.log("allAccounts :", allAccounts)
  // console.log("activeUser :", activeUser)

  for( account of allAccounts) {
    const updatedAccount = account.email
    let invitAttente = account.invitEnAttente
    // console.log('invitAttente avant delete', invitAttente)
    let invitEnvoyees = account.invitEnvoyee
    // console.log('invitEnvoyee avant delete', invitEnvoyee)
    let amis = account.amis
    // console.log('Amis avant delete', amis)
    invitAttente = invitAttente.filter(element => element !== activeUser);
    invitEnvoyees= invitEnvoyees.filter(element => element !== activeUser);
    amis = amis.filter(element => element !== activeUser)
    // console.log(`${activeUser} deleted from ${updatedAccount} ${invitAttente}`, invitAttente )
    // console.log(`${activeUser} deleted from ${updatedAccount} ${invitEnvoyees}`, invitEnvoyees )
    // console.log(`${activeUser} deleted from ${updatedAccount} ${amis}`, amis )
    User.updateOne(
      {email: updatedAccount},
      {invitEnAttente : invitAttente}, function (err, doc) {
        if(err){
          console.log('err if updateOne delete account maj autres users')
        } else {
          console.log("user mis à jour", doc)
        }
      }
    )
    User.updateOne(
      {email: updatedAccount},
      {invitEnvoyee : invitEnvoyees},
       function (err, doc) {
        if(err){
          console.log('err if updateOne delete account maj autres users')
        } else {
          console.log("user mis à jour", doc)
        }
      }
    )
    User.updateOne(
      {email: updatedAccount},
      {amis: amis}, function (err, doc) {
        if(err){
          console.log('err if updateOne delete account maj autres users')
        } else {
          console.log("user mis à jour", doc)
        }
      }
    )
  }
  User.deleteOne(
    {email: activeUser}, function(err, obj) {
      if (err) throw error;
      console.log(`le compte du mail ${activeUser} a été supprimé`)
    }
  )



} catch {
  console.log("catch delete account ")
}

}

exports.updatePrenom = async (req, res) => {
  const prenom = req.body.prenom
  const activeUser = req.body.user
  console.log("nouveau prenom :", prenom)
  console.log("activeuser :", activeUser)

 try {
  User.findOne(
    {email: activeUser },
    (err, user) => {
      if(!err) {
        const prenomToChange = user.prenom;
        console.log("prenom to change :", prenomToChange)
        if(prenomToChange !== prenom){
          User.updateOne(
            {email: activeUser},
            {
              prenom: prenom
            },
            function (err, docs) {
              if(err) {
                console.log("erreur if maj prenom ", err)
              } else {
                console.log("prenom mis à jour", docs)
                res.json({msg: "prenom updated"})
              }
            }
          )
        }  else {
          res.json({msg: "prenom identique !"})
        }
      } else {
        console.log('erreur else update prenom')
      }
    }
  )
 } catch {
  console.log('catch update prenom')
 }
}

exports.updateNom = async (req, res) => {
  const nom = req.body.nom;
  const activeUser = req.body.user;
  // console.log("nom nouveau :", nom)
  // console.log("activeUser :", activeUser)

  try {
    User.findOne(
      {email: activeUser},
      (err, user) => {
        if(!err) {
          const nomToChange = user.name;
          // console.log('nom à changer :', nomToChange)
          if(nomToChange !== nom) {
            User.updateOne(
              {email: activeUser},
              {
                name: nom
              },
              function (err, docs) {
                if(err) {
                  console.log("erreur if update nom")
                } else {
                  console.log("nom mis à jour ", docs);
                  res.json({msg : 'nom updated'})
                }
              }
            )
          } else {
            res.json({msg: "nom identique !"})
          }
        } else {
          console.log('err else update nom')
        }
      }
    )

  } catch {
    console.log('catch update nom')
  }
}

exports.updateMail = async (req, res) => {
  const nouvEmail = req.body.email;
  const activeUser = req.body.user;
  // console.log("nom email :", nouvEmail)
  // console.log("activeUser :", activeUser);
  
  try{
    if(nouvEmail !== activeUser) {
    const allusers = await User.find()

    for(let oneUser of allusers){
      const attente = oneUser.invitEnAttente
      const newAttente=[]
      const envoyees = oneUser.invitEnvoyee
      const newenvoyees = []
      const friends = oneUser.amis
      const newfriend = []
      for( let invat of attente ){
        if(invat === activeUser){
          newAttente.push(nouvEmail)
        } else {
          newAttente.push(invat)
        }
      } 
      for( let envoy of envoyees){
        if(envoy === activeUser){
          newenvoyees.push(nouvEmail)
        } else {
          newenvoyees.push(envoy)
        }
      }
      for( let onefriend of friends){
        if(onefriend === activeUser) {
          newfriend.push(nouvEmail)
        } else {
          newfriend.push(onefriend)
        }
      }
      // console.log(`attente avant change de ${oneUser.email}`, attente)
      // console.log(`attente apres change ${oneUser.email}`, newAttente)
      // console.log(`envoyees avant change ${oneUser.email}`, envoyees)
      // console.log(`envoyees apres change ${oneUser.email}`, newenvoyees)
      // console.log(`amis avant change ${oneUser.email}`, friends)
      // console.log(`amis apres change ${oneUser.email}`, newfriend)

      User.updateOne(
        {email: oneUser.email},
        {
          invitEnAttente: newAttente,
          invitEnvoyee: newenvoyees,
          amis: newfriend
        },
        function (err, docs) {
          if(err){
            console.log("erreur dans if update oneuser of allUser", err)
          } else {
            console.log("oneUser of allusers mis a jour ")
          }
        }
      );
    }
    User.updateOne(
      {email: activeUser},
      {email: nouvEmail},
      function (err, docs) {
        if(err) {
          console.log("erreur dans if updateone email du user", err)
        } else {
          console.log('email du user mis à jour', docs)
          res.json({msg: "email du user mis à jour"})
        }
      }
    )
  } else {
    console.log("email identique !")
  }

  }catch {
    console.log("catch update email")
  }

}