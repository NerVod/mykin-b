const { db } = require("../model/User");
const User = require("../model/User");

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
          }, "secret", {
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







// exports.photoprofile = async (req, res)=> {
//   console.log('req userhandlerbackend',req.params.id)
//   let email= req.params.id

// /////////////////////////////////////////////////////
//   // faire recherche de la photo dans mongo ici
// /////////////////////////////////////////////////////



//   res.json({
//     msg : `route photoprofile ${email}`
//   })
// }

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
    console.log(`${activeUser} deleted from ${updatedAccount} ${invitAttente}`, invitAttente )
    console.log(`${activeUser} deleted from ${updatedAccount} ${invitEnvoyees}`, invitEnvoyees )
    console.log(`${activeUser} deleted from ${updatedAccount} ${amis}`, amis )
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