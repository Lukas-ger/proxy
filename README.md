<h1 align="center">P R O X Y</h1>
<hr/>
This proxy script supports requests for **HTTP and WS requests**.<br/>
Incoming requests will be sent to **127.0.0.1** with the configured port or redirected to the given URL.<br/>
You can configure them in the config.json file.
<br/><br/>
"type" is the type of the action regarding the incoming request (see below).<br/>
"target" is either the port (type 0 and 2: int) or the URL (type 1: string).
<br/><br/>
**The different types of targets and their meanings are...**<br/>
0 = HTTP request (port as int)<br/>
1 = Redirect (url as string)<br/>
2 = WS request (port as int)
