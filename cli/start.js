exports.cli = {
    description: '这个是必须的，用来简单的描述命令所做的事情',
    options: [ 'hello', 'world:' ],
    main: function( args, opts ) {
        console.log( 'Arguments = ' + JSON.stringify( args ) );
        console.log( 'Options = ' + JSON.stringify( opts ) );
    }
};
