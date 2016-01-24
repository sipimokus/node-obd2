interface OBD2_SerialInterface
{
	// Base commands
	connect( port : string, options? : any );
	disconnect();
	read();
	write( data : string ) : void;

	// Event handler
	on( type : string, cb? : any );
	removeListener( type : string, cb? : any );
}