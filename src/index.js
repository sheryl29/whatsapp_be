import mongoose from "mongoose";
import app from "./app.js";
import logger from "./configs/logger.config.js";

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
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    logger.info('connected to mongodb');
})

let server;

server = app.listen(PORT,()=>{
    logger.info(`server listening at ${PORT}`);
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