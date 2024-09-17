fx_version 'adamant'

game 'gta5'

ui_page 'ui/index.html'

client_scripts {
	'client.lua'
}

server_scripts {
    'server.lua'
}

files {
	'ui/index.html',
	'ui/*.css',
	'ui/*.js',
}

exports {
	'OpenDevice'
}