function createFontElement(text, style) {
    var fontElement = document.createElement("font");
    fontElement.appendChild(document.createTextNode(text));
    fontElement.setAttribute("style", style);
    return fontElement.outerHTML;
}

const timeStyle = "color:blue;text-decoration:underline;size:7px;";
const msgFontSize = "size:7px;";
var logLines = document.body.innerText.split('\n');
document.body.innerText = "";
var lineDiv = null;
var msgStyle = msgFontSize + "color:black;";
var append = true;
for (var i = 0; i < logLines.length; i++) {
    var matched = logLines[i].match(/\[\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}:\d{2}\.\d{3,4}) CET\] \[(debug|info|warn|error)\] (\[pid:\d{1,5}\])?(.*)/);
    if (matched) {
        if (lineDiv) {
            document.body.appendChild(lineDiv);
        }
        var msg = matched[4];
        lineDiv = document.createElement("div");
        if (msg.match(/Download of .* processed:/)) {
            append = false;
            lineDiv.innerHTML = createFontElement('[' + matched[1] + ']', timeStyle) + createFontElement(msg, msgStyle);
        } else if (msg.match(/Output of rsync:/) || msg.match(/waiting for screen change:/)) {
            append = false;
        }
        else { // no match: (\d{1,2}\.\d)s, best candidate: ([\w-]* \([\d\.]*\))
            append = true;
            switch (matched[2]) {
                case "info":
                    msgStyle = msgFontSize + "color:green;";
                    break;
                case "warn":
                    msgStyle = msgFontSize + "color:orange;";
                    break;
                case "error":
                    msgStyle = msgFontSize + "color:red;";
                    break;
                default:
                    msgStyle = msgFontSize + "color:black;";
            };
            lineDiv.innerHTML = createFontElement('[' + matched[1] + ']', timeStyle) + createFontElement(msg, msgStyle);
        }
    } else if (append) {
        lineDiv.innerHTML += "<br>" + createFontElement(logLines[i], msgStyle);
    }
}