declare module obd2
{
    export interface OBD2_IOptions
    {
        delay	: number;
        device	: string;
        serial	: string;
        port	: string;
        baud	: number;
        cleaner	: boolean;
    }

    export interface OBD2_IReplyParseCommand
    {
        value	: string,
        name	: string,
        mode	: string,
        pid		: string,
        min		: number,
        max		: number,
        unit	: string,
    }

    export interface OBD2_SerialInterface
    {
        // Base commands
        connect?( callBack ) : void;
        disconnect?( callBack ) : void;
        write?( data : string, callBack? : any ) : void;
        drain?( data : string, callBack? : any ) : void;
        readWrite?( data : string, callBack : any, timeout? : number ) : void;

        onData?( callback : any );

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

}