function HtmlWebpackUrlPlugin(options) {

}

HtmlWebpackUrlPlugin.prototype.apply = function(compiler) {
    debugger;
    compiler.plugin('compilation', function(compilation) {
        console.log('The compiler is starting a new compilation...');

        compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
            console.log('html-webpack-plugin-before-html-generation');
            debugger;
            callback(null, htmlPluginData);
          });

        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            console.log('html-webpack-plugin-before-html-processing');
            debugger;
            callback(null, htmlPluginData);
        });

        compilation.plugin('html-webpack-plugin-alter-asset-tags', function(htmlPluginData, callback) {
            console.log('html-webpack-plugin-alter-asset-tags');
            debugger;
            callback(null, htmlPluginData);
        });

        compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
            console.log('html-webpack-plugin-after-html-processing');
            debugger;
            callback(null, htmlPluginData);
        });

        compilation.plugin('html-webpack-plugin-after-emit', function(htmlPluginData, callback) {
            console.log('html-webpack-plugin-after-emit');
            debugger;
            callback(null, htmlPluginData);
        });

    });
}

module.exports = HtmlWebpackUrlPlugin;
