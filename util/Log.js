const colors = require('colors');

exports.success = info => {
    console.log(
        colors.italic(
            colors.underline(colors.bold(colors.cyan(info)))
        )
    );
};

exports.error = info => {
    console.log(
        colors.bgRed(
            colors.italic(
                colors.underline(
                    colors.bold(colors.brightWhite(info))
                )
            )
        )
    );
};
