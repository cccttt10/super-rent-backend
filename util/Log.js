const colors = require('colors');

class Log {
    success(info) {
        console.log(
            colors.italic(
                colors.underline(colors.bold(colors.cyan(info)))
            )
        );
    }
}

module.exports = Log;
