# node-obd2
Communication and data parsing with OBD-II connect, ELM327.

## WARNING
Alpha package, does not suggested for stable use!  
Stable version 1.x soon.

#### MODE and PID Support
| MODE | PID | Byte | Description                                               | Min     | Max      | Unit    | Slug name      |
|------|-----|------|-----------------------------------------------------------|---------|----------|---------|----------------|
| 01   | 00  | 4    | PIDs supported 00-20                                      |         |          | BIT     | pidsupp0       |
| 01   | 01  | 4    | Monitor status since DTCs cleared                         |         |          | BIT     | dtc_cnt        |
| 01   | 02  | 2    | DTC that caused required freeze frame data storage        |         |          | BIT     | dtcfrzf        |
| 01   | 03  | 2    | Fuel system 1 and 2 status                                |         |          | BIT     | fuelsys        |
| 01   | 04  | 1    | Calculated LOAD Value                                     | 0       | 100      | %       | load_pct       |
| 01   | 05  | 1    | Engine Coolant Temperature                                | -40     | 215      | °C      | temp           |
| 01   | 06  | 1    | Short Term Fuel Trim - Bank 1,3                           | -100    | 99.22    | %       | shrtft13       |
| 01   | 07  | 1    | Long Term Fuel Trim - Bank 1,3                            | -100    | 99.22    | %       | longft13       |
| 01   | 08  | 1    | Short Term Fuel Trim - Bank 2,4                           | -100    | 99.22    | %       | shrtft24       |
| 01   | 09  | 1    | Long Term Fuel Trim - Bank 2,4                            | -100    | 99.22    | %       | longft24       |
| 01   | 0A  | 1    | Fuel Rail Pressure (gauge)                                | 0       | 765      | kPa     | frp            |
| 01   | 0B  | 1    | Intake Manifold Absolute Pressure                         | 0       | 255      | kPa     | map            |
| 01   | 0C  | 2    | Engine RPM                                                | 0       | 16383.75 | r/m     | rpm            |
| 01   | 0D  | 1    | Vehicle Speed Sensor                                      | 0       | 255      | km/h    | vss            |
| 01   | 0E  | 1    | Ignition Timing Advance for #1 Cylinder                   | -64     | 63.5     | °       | sparkadv       |
| 01   | 0F  | 1    | Intake Air Temperature                                    | -40     | 215      | °C      | iat            |
| 01   | 10  | 2    | Air Flow Rate from Mass Air Flow Sensor                   | 0       | 655.35   | g/s     | maf            |
| 01   | 11  | 1    | Absolute Throttle Position                                | 0       | 100      | %       | throttlepos    |
| 01   | 12  | 1    | Commanded Secondary Air Status                            |         |          | BIT     | air_stat       |
| 01   | 13  |      |                                                           |         |          |         |                |
| 01   | 14  |      |                                                           |         |          |         |                |
| 01   | 15  |      |                                                           |         |          |         |                |
| 01   | 16  |      |                                                           |         |          |         |                |
| 01   | 17  |      |                                                           |         |          |         |                |
| 01   | 18  |      |                                                           |         |          |         |                |
| 01   | 19  |      |                                                           |         |          |         |                |
| 01   | 1A  |      |                                                           |         |          |         |                |
| 01   | 1B  |      |                                                           |         |          |         |                |
| 01   | 1C  | 1    | OBD requirements to which vehicle is designed             |         |          | BIT     | obdsup         |
| 01   | 1D  |      |                                                           |         |          |         |                |
| 01   | 1E  |      |                                                           |         |          |         |                |
| 01   | 1F  | 2    | Time Since Engine Start                                   | 0       | 65535    | sec     | runtm          |
| 01   | 20  | 4    | PIDs supported 21-40                                      |         |          | BIT     | pidsupp2       |
| 01   | 21  | 2    | Distance Travelled While MIL is Activated                 | 0       | 65535    | km      | mil_dist       |
| 01   | 22  | 2    | Fuel Rail Pressure relative to manifold vacuum            | 0       | 5177.265 | kPa     | frpm           |
| 01   | 23  | 2    | Fuel Rail Pressure (diesel)                               | 0       | 655350   | kPa     | frpd           |
| 01   | 24  |      |                                                           |         |          |         |                |
| 01   | 25  |      |                                                           |         |          |         |                |
| 01   | 26  |      |                                                           |         |          |         |                |
| 01   | 27  |      |                                                           |         |          |         |                |
| 01   | 28  |      |                                                           |         |          |         |                |
| 01   | 29  |      |                                                           |         |          |         |                |
| 01   | 2A  |      |                                                           |         |          |         |                |
| 01   | 2B  |      |                                                           |         |          |         |                |
| 01   | 2C  | 1    | Commanded EGR                                             | 0       | 100      | %       | edr_pct        |
| 01   | 2D  | 1    | EGR Error                                                 | -100    | 99.2     | %       | egr_err        |
| 01   | 2E  | 1    | Commanded Evaporative Purge                               | 0       | 100      | %       | eavp_pct       |
| 01   | 2F  | 1    | Fuel Level Input                                          | 0       | 100      | %       | fuellevel      |
| 01   | 30  | 1    | Number of warm-ups since diagnostic trouble codes cleared | 0       | 255      | pcs     | warm_ups       |
| 01   | 31  | 2    | Distance since diagnostic trouble codes cleared           | 0       | 65535    | km      | clr_dist       |
| 01   | 32  | 2    | Evap System Vapour Pressure                               | -8192   | 8192     | Pa      | evap_vp        |
| 01   | 33  | 1    | Barometric Pressure                                       | 0       | 255      | kPa     | baro           |
| 01   | 34  |      |                                                           |         |          |         |                |
| 01   | 35  |      |                                                           |         |          |         |                |
| 01   | 36  |      |                                                           |         |          |         |                |
| 01   | 37  |      |                                                           |         |          |         |                |
| 01   | 38  |      |                                                           |         |          |         |                |
| 01   | 39  |      |                                                           |         |          |         |                |
| 01   | 3A  |      |                                                           |         |          |         |                |
| 01   | 3B  |      |                                                           |         |          |         |                |
| 01   | 3C  | 2    | Catalyst Temperature Bank 1 / Sensor 1                    | -40     | 6513.5   | °C      | catemp11       |
| 01   | 3D  | 2    | Catalyst Temperature Bank 2 / Sensor 1                    | -41     | 6513.6   | °C      | catemp21       |
| 01   | 3E  | 2    | Catalyst Temperature Bank 1 / Sensor 2                    | -42     | 6513.7   | °C      | catemp12       |
| 01   | 3F  | 2    | Catalyst Temperature Bank 2 / Sensor 2                    | -43     | 6513.8   | °C      | catemp22       |
| 01   | 40  | 4    | PIDs supported 41-60                                      |         |          | BIT     | pidsupp4       |
| 01   | 41  | 4    | Monitor status this driving cycle                         |         |          | BIT     | monitorstatus  |
| 01   | 42  | 2    | Control module voltage                                    | 0       | 65535    | V       | vpwr           |
| 01   | 43  | 2    | Absolute Load Value                                       | 0       | 25700    | %       | load_abs       |
| 01   | 44  | 2    | Fuel/air Commanded Equivalence Ratio                      | 0       | 2        | (ratio) | lambda         |
| 01   | 45  | 1    | Relative Throttle Position                                | 0       | 100      | %       | throttlerel    |
| 01   | 46  | 1    | Ambient air temperature                                   | -40     | 215      | °C      | ambient        |
| 01   | 47  | 1    | Absolute Throttle Position B                              | 0       | 100      | %       | throttleposb   |
| 01   | 48  | 1    | Absolute Throttle Position C                              | 0       | 100      | %       | throttleposc   |
| 01   | 49  | 1    | Accelerator Pedal Position D                              | 0       | 100      | %       | accpedald      |
| 01   | 4A  | 1    | Accelerator Pedal Position E                              | 0       | 100      | %       | accpedale      |
| 01   | 4B  | 1    | Accelerator Pedal Position F                              | 0       | 100      | %       | accpedalf      |
| 01   | 4C  | 1    | Commanded Throttle Actuator Control                       | 0       | 100      | %       | tac_pct        |
| 01   | 4D  | 2    | Time run by the engine while MIL activated                | 0       | 65525    | min     | mil_time       |
| 01   | 4E  | 2    | Time since diagnostic trouble codes cleared               | 0       | 65525    | min     | clr_time       |
| 01   | 4F  |      |                                                           |         |          |         |                |
| 01   | 50  |      |                                                           |         |          |         |                |
| 01   | 51  | 1    | Fuel Type                                                 |         |          | BIT     | fuel_type      |
| 01   | 52  | 1    | Ethanol fuel %                                            | 0       | 100      | %       | alch_pct       |
| 01   | 53  | 2    | Absolute Evap system Vapor Pressure                       | 0       | 327.675  | kPa     | evap_press_abs |
| 01   | 54  | 2    | Evap system vapor pressure                                | -32767  | 32768    | Pa      | evap_press     |
| 01   | 55  |      |                                                           |         |          |         |                |
| 01   | 56  |      |                                                           |         |          |         |                |
| 01   | 57  |      |                                                           |         |          |         |                |
| 01   | 58  |      |                                                           |         |          |         |                |
| 01   | 59  |      |                                                           |         |          |         |                |
| 01   | 5A  | 1    | Relative accelerator pedal position                       | 0       | 100      | %       | accpedal_pos   |
| 01   | 5B  | 1    | Hybrid battery pack remaining life                        | 0       | 100      | %       | hybridbatt     |
| 01   | 5C  | 1    | Engine oil temperature                                    | -40     | 210      | °C      | oiltemp        |
| 01   | 5D  | 2    | Fuel injection timing                                     | -210.00 | 301.992  | °       | fuelinjection  |
| 01   | 5E  | 2    | Engine fuel rate                                          | 0       | 3212.75  | L/h     | fuelrate       |
| 01   | 5F  |      |                                                           |         |          |         |                |
| 01   | 60  | 4    | PIDs supported 61-80                                      |         |          | BIT     | pidsupp6       |
| 01   | 61  | 1    | Driver's demand engine percent torque                     | -125    | 125      | %       | demand_pct     |
| 01   | 62  | 1    | Actual engine percent torque                              | -125    | 125      | %       | torque_pct     |
| 01   | 63  | 2    | Engine reference torque                                   | 0       | 65535    | Nm      | torque         |
| 01   | 64  |      |                                                           |         |          |         |                |
| 01   | 65  |      |                                                           |         |          |         |                |
| 01   | 66  |      |                                                           |         |          |         |                |
| 01   | 67  |      |                                                           |         |          |         |                |
| 01   | 68  |      |                                                           |         |          |         |                |
| 01   | 69  |      |                                                           |         |          |         |                |
| 01   | 6A  |      |                                                           |         |          |         |                |
| 01   | 6B  |      |                                                           |         |          |         |                |
| 01   | 6C  |      |                                                           |         |          |         |                |
| 01   | 6D  |      |                                                           |         |          |         |                |
| 01   | 6E  |      |                                                           |         |          |         |                |
| 01   | 6F  |      |                                                           |         |          |         |                |
| 01   | 70  |      |                                                           |         |          |         |                |
| 01   | 71  |      |                                                           |         |          |         |                |
| 01   | 72  |      |                                                           |         |          |         |                |
| 01   | 73  |      |                                                           |         |          |         |                |
| 01   | 74  |      |                                                           |         |          |         |                |
| 01   | 75  |      |                                                           |         |          |         |                |
| 01   | 76  |      |                                                           |         |          |         |                |
| 01   | 77  |      |                                                           |         |          |         |                |
| 01   | 78  |      |                                                           |         |          |         |                |
| 01   | 79  |      |                                                           |         |          |         |                |
| 01   | 7A  |      |                                                           |         |          |         |                |
| 01   | 7B  |      |                                                           |         |          |         |                |
| 01   | 7C  |      |                                                           |         |          |         |                |
| 01   | 7D  |      |                                                           |         |          |         |                |
| 01   | 7E  |      |                                                           |         |          |         |                |
| 01   | 7F  |      |                                                           |         |          |         |                |
| 01   | 80  | 4    | PIDs supported 81-A0                                      |         |          | BIT     | pidsupp8       |
| 01   | 81  |      |                                                           |         |          |         |                |
| 01   | 82  |      |                                                           |         |          |         |                |
| 01   | 83  |      |                                                           |         |          |         |                |
| 01   | 84  |      |                                                           |         |          |         |                |
| 01   | 85  |      |                                                           |         |          |         |                |
| 01   | 86  |      |                                                           |         |          |         |                |
| 01   | 87  |      |                                                           |         |          |         |                |
| 01   | A0  | 4    | PIDs supported A1-C0                                      |         |          |         | pidsuppa       |
| 01   | C0  | 4    | PIDs supported C1-E0                                      |         |          |         | pidsuppc       |
| 01   | C3  |      |                                                           |         |          |         |                |
| 01   | C4  |      |                                                           |         |          |         |                |
|      |     |      |                                                           |         |          |         |                |
| 03   |     | 6    | Requested DTC                                             |         |          | BIT     | requestdtc     |
|      |     |      |                                                           |         |          |         |                |
| 04   |     |      | Clear Trouble Codes (Clear engine light)                  |         |          |         | cleardtc       |