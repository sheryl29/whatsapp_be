import app from "./app.js";
import logger from "./configs/logger.config.js";

const PORT = process.env.PORT || 8000;


let server = app.listen(PORT,()=>{
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