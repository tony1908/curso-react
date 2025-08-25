import loglevel from 'loglevel';

class Logger {
    private logger = loglevel.getLogger('Logger');
    private prefixMessage = '[' + new Date().toISOString() + ']: '

    constructor() {
        loglevel.setLevel('debug');
    }

    log(message: string) {
        this.logger.debug(this.prefixMessage, message);
    }

    error(message: string) {
        this.logger.error(this.prefixMessage, message);
    }
    
    info(message: string) {
        this.logger.info(this.prefixMessage, message);
    }     
}

export default Logger;