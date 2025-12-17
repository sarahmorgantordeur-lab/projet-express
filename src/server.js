const app = require("./app");
const PORT = process.env.PORT || 3000;
const AppDataSource = require("./config/data-source");
const ErrorHandler = require("./errors/errorHandler");



AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    })
  })

  .catch((error) =>  {
    console.error("Erreur lors de l'initialisation de la source de données :", error);
    process.exit(1)
    });






