import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js";

//env
const{ DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

//error mongodb
mongoose.connection.on('error', (err)=>{
    logger.error(`mongodb connection error : ${err}`);
    process.exit(1);
});

//mongodb debug
if(process.env.NODE_ENV !== "production"){
    mongoose.set("debug", true);
}

//mongodb connection
mongoose.connect(DATABASE_URL, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
}).then(()=>{
    logger.info('connected to mongodb');
})

let server;

server = app.listen(PORT,()=>{
    logger.info(`server listening at ${PORT}`);
});

//socket io
const io = new Server(server, {
    pingTimeout: 60000,
    cors:{
        origin:process.env.CLIENT_ENDPOINT,
    }
});

io.on("connection", (socket) => {
    logger.info("socket io conected successfully.");
    SocketServer(socket, io);
});

//handle error
const exitHandler = () => {
    if(server){
        logger.info("Server closed.");
        process.exit(1);
    }else{
        process.exit(1); 
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};
process.on("uncaughtEcpectation", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//sigterm
process.on("SIGTERM",() => {
    if(server){
        logger.info("Server closed.");
        process.exit(1);
    }
});