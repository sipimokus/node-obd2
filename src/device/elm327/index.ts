/// <reference path="../../typings/tsd.d.ts"/>

/// <reference path="../../serial/index.ts"/>

export namespace OBD2
{
	export module Device
	{
		export class ELM327
		{
			public connect = ( Serial : OBD2_SerialInterface, cb : any ) =>
			{
				// Set all to Defaults
				Serial.write("ATD");

				// Reset all
				Serial.write("ATZ");

				//Turns off echo.
				Serial.write("ATE0");

				//Turns off extra line feed and carriage return
				Serial.write("ATL0");

				//This disables spaces in in output, which is faster!
				Serial.write("ATS0");

				//Turns off headers and checksum to be sent.
				Serial.write("ATH0");

				//Turn adaptive timing to 2. This is an aggressive learn curve for adjusting the timeout. Will make huge difference on slow systems.
				Serial.write("ATAT2");

				//Set timeout to 10 * 4 = 40msec, allows +20 queries per second. This is the maximum wait-time. ATAT will decide if it should wait shorter or not.
				//this.write('ATST0A');

				//Set the protocol to automatic.
				Serial.write("ATSP0");

				// CallBack
				setTimeout( cb, 1000 );
			};

			public disconnect()
			{

			}

			public cmdWrite()
			{

			}

			public cmdRead()
			{

			}
		}

	}

}
