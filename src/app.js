const http = require("http");
const Parser = require("./utils/parser"); // my custom parser

const Io = require("./utils/Io"); // Class which contains write() and read() methods
const Posts = new Io("./db/posts.json"); // instance of Io
const Users = new Io("./db/users.json"); // instance of Io

const Post = require("./model/Post"); // Post class in model file

const User = require("./model/User"); // User class in model file

http
  .createServer(async (req, res) => {
    res.setHeader("Content-type", "aplication/json");
    const postsData = await Posts.read();
    const usersData = await Users.read();

    const urlID = req.url.split("/").at(-1); // getting id from url

    const findUser = postsData.find((el) => el.id == urlID); // it finds the exact user by comparing the ID of the user with urlID

    //----- Register -------------------------------------------------------||
    if (req.url === "/auth/register" && req.method === "POST") {
      const reqBody = await Parser(req);
      const { name, password } = reqBody;

      const findUser = usersData.find((el) => el.name === name);

      if (findUser) {
        res.writeHead(403);
        return res.end(JSON.stringify({ message: "User already exists" }));
      } else {
        const id = (usersData[usersData.length - 1]?.id || 0) + 1;

        const newUser = new User(id, name, password);

        const data = [...usersData, newUser];
        Users.write(data);
        res.writeHead(200);
        return res.end(JSON.stringify({ message: "success" }));
      }
    }

    //for Postman:
    // method: "POST"
    // url = "http://localhost:1000/auth/register"
    // request: 
    // { 
    //   "username": "any name",
    //   "password": "any password"
    // }
    //----------------------------------------------------------------------||


    //----- Login ----------------------------------------------------------||
    if (req.url === "/auth/login" && req.method === "POST") {
      const reqBody = await Parser(req);
      const { name } = reqBody;

      const findUser = usersData.find((el) => el.name === name);

      if (!findUser) {
        res.writeHead(403);
        return res.end(JSON.stringify({ message: "User not found" }));
      } else {
        res.writeHead(200);
        return res.end(JSON.stringify({ token: findUser.id }));
      }
    }

    //for Postman:
    // method: "POST"
    // url = "http://localhost:1000/auth/login"
    // request: 
    // { 
    //   "username": "any name",
    //   "password": "any password"
    // }
    //----------------------------------------------------------------------||



    //<<------------------------- CRUD ------------------------------------->>


    //----- CREATE && POST method ------------------------------------------||
    if (req.url === "/posts" && req.method === "POST") {
      const reqBody = await Parser(req);
      const { text } = reqBody;

      const id = (postsData[postsData.length - 1]?.id || 0) + 1;
      const date = new Date();
      const newPost = new Post(id, text, date);

      const data = postsData.length ? [...postsData, newPost] : [newPost];

      Posts.write(data);

      res.writeHead(201);
      res.end(JSON.stringify({ message: "success" }));
    }

    //for Postman:
    // method: "POST"
    // url = "http://localhost:1000/posts"
    // request: 
    // { 
    //   "text": "any text"
    // }
    //----------------------------------------------------------------------||


    //----- READ && GET method ---------------------------------------------||
    if (req.url === "/posts" && req.method === "GET") {
      res.end(JSON.stringify(postsData));
    }

    //for Postman:
    // method: "GET"
    // url = "http://localhost:1000/posts"
    // no request
    //----------------------------------------------------------------------||


    //----- UPDATE || PUT method -------------------------------------------||
    if (findUser && req.method === "PUT") {
      const bodyParser = await Parser(req);
      const { text } = bodyParser;

      const untarget = postsData.filter((el) => el.id != urlID);
      postsData.forEach((el) => {
        if (el.id == urlID) {
          el.text = text;
          el.date = new Date();
          return [untarget, el];
        }
      });
      Posts.write(postsData);

      res.writeHead(200);
      return res.end(JSON.stringify({ message: "success" }));
    }

    //for Postman:
    // method: "PUT"
    // url = "http://localhost:1000/posts/anyID"
    // request: 
    // { 
    //   "text": "the edited text"
    // }
    //----------------------------------------------------------------------||


    //----- DELETE method --------------------------------------------------||
    if (findUser && req.method === "DELETE") {
      const undeletedData = postsData.filter((el) => el.id != urlID);
      Posts.write(undeletedData);

      res.writeHead(200);
      return res.end(JSON.stringify({ message: "success" }));
    }

    //for Postman:
    // method: "DELETE"
    // url = "http://localhost:1000/posts"
    // no request
    //----------------------------------------------------------------------||

    
  })
  .listen(1000);
console.log("iwladi");
