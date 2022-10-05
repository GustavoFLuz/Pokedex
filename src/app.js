import express from "express";
import path from "path"

const routes = (app) => {
    app.route('/').get((req, res) => {
      res.status(200).sendFile(path.join(path.resolve()+'/public/index.html'));
    })
    app.use(
      express.static("public")
    )
  }
  
const app = express();
app.use(express.json())
routes(app);



export default app