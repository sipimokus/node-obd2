interface OBD2_SerialInterface
{
	//Serial 	: any;
	//port 	: string;
	//options	: any;
	//opened	: boolean;

	// Base commands
	connect?( callBack ) : void;
	disconnect?( callBack ) : void;
	write?( data : string, callBack? : any ) : void;
	drain?( data : string, callBack? : any ) : void;
	readWrite?( data : string, callBack : any, timeout? : number ) : void;

	onData?(callback:any);

	setSerial?( serial : any ) : void;
	getSerial?() : any;

	setPort?( port : string ) : void;
	getPort?() : string;

	setOptions?( options : any ) : void;
	getOptions?() : any;


	isOpen?() : boolean;
	// Event handler
	on?( type : string, cb? : any );
	//removeListener?( type : string, cb? : any );
}