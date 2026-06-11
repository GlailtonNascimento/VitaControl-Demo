const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist/VitaControl-Web/browser/index.html');
const zoneFilePath = path.join(__dirname, 'dist/VitaControl-Web/browser/zone.umd.min.js');

console.log('=== INTEGRAÇÃO COMPLETA E INLINE DO ZONE.JS ===');

if (!fs.existsSync(htmlPath)) {
  console.error('ERRO: index.html não encontrado!');
  process.exit(1);
}

// Garante o arquivo do zone para sugar o código dele
if (!fs.existsSync(zoneFilePath)) {
  console.log('Buscando arquivo base do Zone...');
  const { execSync } = require('child_process');
  execSync('curl -s https://cdnjs.cloudflare.com/ajax/libs/zone.js/0.14.4/zone.umd.min.js -o ' + zoneFilePath);
}

let html = fs.readFileSync(htmlPath, 'utf8');
const zoneCode = fs.readFileSync(zoneFilePath, 'utf8');

// Limpa injeções antigas
html = html.replace(/<script src=".*?zone.*?"><\/script>/g, '');
html = html.replace(/<script id="zone-inline">[\s\S]*?<\/script>/g, '');

const zoneInlineScript = `<script id="zone-inline">${zoneCode}</script>`;

const debugConsole = `
<div id="debug-log-panel" style="position:fixed;top:0;left:0;width:100%;height:45vh;background:#111;color:#00ff00;font-family:monospace;font-size:11px;overflow-y:auto;z-index:999999;padding:10px;border-bottom:4px solid #ff0055;box-sizing:border-box;">
  <div style="font-weight:bold;color:#ff0055;border-bottom:1px solid #333;padding-bottom:5px;margin-bottom:5px;display:flex;justify-content:space-between;">
    <span>🚀 VITA-CONTROL MONITOR (COMPLETO)</span>
    <button onclick="document.getElementById('debug-log-panel').style.display='none'" style="background:#ff0055;color:#fff;border:none;padding:2px 8px;border-radius:3px;font-size:10px;">Fechar</button>
  </div>
  <div id="debug-console-output"></div>
</div>
<script>
  (function() {
    var output = document.getElementById("debug-console-output");
    function printLog(msg, isError) {
      var line = document.createElement("div");
      line.style.color = isError ? "#ff4444" : "#00ffcc";
      line.style.borderBottom = "1px solid #222";
      line.style.padding = "2px 0";
      line.innerText = "[" + new Date().toLocaleTimeString() + "] " + msg;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }

    printLog("Monitor Inicializado. Zone.js injetado inline no HEAD com sucesso!", false);

    window.addEventListener("error", function(e) {
      printLog("ERRO CONSOLE: " + e.message, true);
    }, true);

    var originalLog = console.log;
    console.log = function() {
      printLog("LOG: " + Array.from(arguments).join(" "), false);
      originalLog.apply(console, arguments);
    };
    var originalError = console.error;
    console.error = function() {
      printLog("ERROR: " + Array.from(arguments).join(" "), true);
      originalError.apply(console, arguments);
    };
  })();
</script>
`;

if (html.includes('<head>')) {
  html = html.replace('<head>', `<head>${zoneInlineScript}`);
}
if (html.includes('<body')) {
  html = html.replace(/(<body[^>]*>)/, `$1${debugConsole}`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Zone.js e Monitor fundidos com sucesso no index.html!');
