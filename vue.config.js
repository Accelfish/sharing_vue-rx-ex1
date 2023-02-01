module.exports = {
    devServer: {
        proxy: {
            '/wiki': {
                target: 'https://en.wikipedia.org',
                ws: false,
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/wiki': ''
                }
            },
        },
    },
};