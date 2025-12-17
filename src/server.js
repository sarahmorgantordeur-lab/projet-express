const app = require("./app");
const PORT = process.env.PORT || 3000;
const AppDataSource = require("./config/data-source");
const ErrorHandler = require("./errors/errorHandler");
const passport = require('passport');


// Importer et exécuter la configuration en lui passant l'instance passpport
require('./config/passport')(passport);


AppDataSource.initialize()
  .then(() => {
    // Initialiser passport 
    app.use(passport.initialize());
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    })
  })

  .catch((error) =>  {
    console.error("Erreur lors de l'initialisation de la source de données :", error);
    process.exit(1)
    });






