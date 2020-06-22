// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const request = require( 'request' );

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "manholeofthisday" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('manholeofthisday.show', function () {
		// The code you place here will be executed every time your command is executed
		var option = {
          url: 'https://manholemap.juge.me/motd',
          method: 'GET'
        };
        request( option, ( err0, res0, body0 ) => {
          if( err0 ){
            console.log( 'error', err0 );
		    vscode.window.showInformationMessage( JSON.stringify( err0 ) );
          }else{
            body0 = JSON.parse( body0 );
            if( body0 && body0.status ){
              var motd = body0.motd;  //. { id: id, text: text }
			  //vscode.window.showInformationMessage( JSON.stringify( motd ) );
			  
			  //. https://code.visualstudio.com/api/extension-guides/webview
			  var panel = vscode.window.createWebviewPanel(
				'motd',
				'Manhole of this day',
				vscode.ViewColumn.One,
				{}
			  );

			  var html = getWebviewContent( motd );
			  panel.webview.html = html;
			}else{
              console.log( 'error', body0 );
		      vscode.window.showInformationMessage( 'error' );
			}
          }
        });

		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from manholeOfThisDay!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;


// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}


function getWebviewContent( motd ){
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Manhole of this day</title>
</head>
<body>
<a href="https://manholemap.juge.me/page?id=` + motd.id + `">
<img src="https://manholemap.juge.me/get?id=` + motd.id + `" title="` + motd.m + `月` + motd.d + `日: ` + motd.text + `"/></a><br/>
` + motd.m + `月` + motd.d + `日: ` + motd.text + `
</body>
</html>`;
}
