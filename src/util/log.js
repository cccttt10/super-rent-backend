const colors = require('colors');

exports.success = info => {
    console.log(colors.italic(colors.underline(colors.bold(colors.cyan(info)))));
};

exports.info = info => {
    console.log(colors.green(info));
};

exports.error = info => {
    console.log(
        colors.bgRed(
            colors.italic(colors.underline(colors.bold(colors.brightWhite(info))))
        )
    );
};
