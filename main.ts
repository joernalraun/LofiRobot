/**
 * LOFI ROBOT — Bluetooth + Serial Extension
 *
 * Receives face-tracking data from the FaceRobot web app over EITHER
 * Bluetooth UART (mobile/desktop) OR USB serial (desktop). The user
 * picks one transport in the web app's connect menu.
 *
 * The Bluetooth and Serial paths are FULLY INDEPENDENT — separate init
 * blocks, separate "on data received" blocks, separate listeners. Each
 * captures its handler directly inside its closure so neither path
 * depends on shared mutable state.
 *
 * Payload layout (~10 Hz, terminated by \n):
 *   00-01 X       16 Roll        19-20 BrowDownLeft     29-30 GazeDownLeft
 *   02-03 Y       17 Smile       21-22 BrowDownRight    31-32 GazeDownRight
 *   04-05 Z       18 FaceVisible 23-24 BrowInnerUp      33-34 GazeUpLeft
 *   06-07 Yaw                    25-26 BrowOuterUpLeft  35-36 GazeUpRight
 *   08-09 Pitch                  27-28 BrowOuterUpRight 37-38 GazeInLeft
 *   10-11 Mouth                                         39-40 GazeInRight
 *   12-13 LeftEye
 *   14-15 RightEye
 */

enum RobotAppType {
    //% block="Face-App"
    //% block.loc.de="Face-App"
    //% block.loc.fr="Face-App"
    //% block.loc.es="Face-App"
    //% block.loc.it="Face-App"
    //% block.loc.el="Face-App"
    FaceApp,
    //% block="Control"
    //% block.loc.de="Control"
    //% block.loc.fr="Control"
    //% block.loc.es="Control"
    //% block.loc.it="Control"
    //% block.loc.el="Control"
    Control
}

enum FaceValues {
    //% block="X"
    //% block.loc.de="X"
    //% block.loc.fr="X"
    //% block.loc.es="X"
    //% block.loc.it="X"
    //% block.loc.el="X"
    X,
    //% block="Y"
    //% block.loc.de="Y"
    //% block.loc.fr="Y"
    //% block.loc.es="Y"
    //% block.loc.it="Y"
    //% block.loc.el="Y"
    Y,
    //% block="Z"
    //% block.loc.de="Z"
    //% block.loc.fr="Z"
    //% block.loc.es="Z"
    //% block.loc.it="Z"
    //% block.loc.el="Z"
    Z,
    //% block="Yaw"
    //% block.loc.de="Drehen"
    //% block.loc.fr="Lacet"
    //% block.loc.es="Guiñada"
    //% block.loc.it="Imbardata"
    //% block.loc.el="Εκτροπή"
    Yaw,
    //% block="Pitch"
    //% block.loc.de="Nicken"
    //% block.loc.fr="Tangage"
    //% block.loc.es="Cabeceo"
    //% block.loc.it="Beccheggio"
    //% block.loc.el="Κλίση"
    Pitch,
    //% block="Mouth"
    //% block.loc.de="Mund"
    //% block.loc.fr="Bouche"
    //% block.loc.es="Boca"
    //% block.loc.it="Bocca"
    //% block.loc.el="Στόμα"
    Mouth,
    //% block="Left Eye"
    //% block.loc.de="Linkes Auge"
    //% block.loc.fr="Œil gauche"
    //% block.loc.es="Ojo izquierdo"
    //% block.loc.it="Occhio sinistro"
    //% block.loc.el="Αριστερό μάτι"
    LeftEye,
    //% block="Right Eye"
    //% block.loc.de="Rechtes Auge"
    //% block.loc.fr="Œil droit"
    //% block.loc.es="Ojo derecho"
    //% block.loc.it="Occhio destro"
    //% block.loc.el="Δεξί μάτι"
    RightEye,
    //% block="Brow Down Left"
    //% block.loc.de="Augenbraue Unten Links"
    //% block.loc.fr="Sourcil Bas Gauche"
    //% block.loc.es="Ceja Abajo Izquierda"
    //% block.loc.it="Sopracciglio Giù Sinistra"
    //% block.loc.el="Φρύδι Κάτω Αριστερά"
    BrowDownLeft,
    //% block="Brow Down Right"
    //% block.loc.de="Augenbraue Unten Rechts"
    //% block.loc.fr="Sourcil Bas Droit"
    //% block.loc.es="Ceja Abajo Derecha"
    //% block.loc.it="Sopracciglio Giù Destra"
    //% block.loc.el="Φρύδι Κάτω Δεξιά"
    BrowDownRight,
    //% block="Brow Inner Up"
    //% block.loc.de="Augenbraue Innen Oben"
    //% block.loc.fr="Sourcil Intérieur Haut"
    //% block.loc.es="Ceja Interior Arriba"
    //% block.loc.it="Sopracciglio Interno Su"
    //% block.loc.el="Φρύδι Εσωτερικό Πάνω"
    BrowInnerUp,
    //% block="Brow Outer Up Left"
    //% block.loc.de="Augenbraue Außen Oben Links"
    //% block.loc.fr="Sourcil Extérieur Haut Gauche"
    //% block.loc.es="Ceja Exterior Arriba Izquierda"
    //% block.loc.it="Sopracciglio Esterno Su Sinistra"
    //% block.loc.el="Φρύδι Εξωτερικό Πάνω Αριστερά"
    BrowOuterUpLeft,
    //% block="Brow Outer Up Right"
    //% block.loc.de="Augenbraue Außen Oben Rechts"
    //% block.loc.fr="Sourcil Extérieur Haut Droit"
    //% block.loc.es="Ceja Exterior Arriba Derecha"
    //% block.loc.it="Sopracciglio Esterno Su Destra"
    //% block.loc.el="Φρύδι Εξωτερικό Πάνω Δεξιά"
    BrowOuterUpRight,
    //% block="Gaze Down Left"
    //% block.loc.de="Blick Unten Links"
    //% block.loc.fr="Regard Bas Gauche"
    //% block.loc.es="Mirada Abajo Izquierda"
    //% block.loc.it="Sguardo Giù Sinistra"
    //% block.loc.el="Βλέμμα Κάτω Αριστερά"
    GazeDownLeft,
    //% block="Gaze Down Right"
    //% block.loc.de="Blick Unten Rechts"
    //% block.loc.fr="Regard Bas Droit"
    //% block.loc.es="Mirada Abajo Derecha"
    //% block.loc.it="Sguardo Giù Destra"
    //% block.loc.el="Βλέμμα Κάτω Δεξιά"
    GazeDownRight,
    //% block="Gaze Up Left"
    //% block.loc.de="Blick Oben Links"
    //% block.loc.fr="Regard Haut Gauche"
    //% block.loc.es="Mirada Arriba Izquierda"
    //% block.loc.it="Sguardo Su Sinistra"
    //% block.loc.el="Βλέμμα Πάνω Αριστερά"
    GazeUpLeft,
    //% block="Gaze Up Right"
    //% block.loc.de="Blick Oben Rechts"
    //% block.loc.fr="Regard Haut Droit"
    //% block.loc.es="Mirada Arriba Derecha"
    //% block.loc.it="Sguardo Su Destra"
    //% block.loc.el="Βλέμμα Πάνω Δεξιά"
    GazeUpRight,
    //% block="Gaze In Left"
    //% block.loc.de="Blick Innen Links"
    //% block.loc.fr="Regard Intérieur Gauche"
    //% block.loc.es="Mirada Interior Izquierda"
    //% block.loc.it="Sguardo Interno Sinistra"
    //% block.loc.el="Βλέμμα Εσωτερικό Αριστερά"
    GazeInLeft,
    //% block="Gaze In Right"
    //% block.loc.de="Blick Innen Rechts"
    //% block.loc.fr="Regard Intérieur Droit"
    //% block.loc.es="Mirada Interior Derecha"
    //% block.loc.it="Sguardo Interno Destra"
    //% block.loc.el="Βλέμμα Εσωτερικό Δεξιά"
    GazeInRight
}

enum ControlCommands {
    //% blockId="control_up" block="↑"
    //% block.loc.de="↑"
    //% block.loc.fr="↑"
    //% block.loc.es="↑"
    //% block.loc.it="↑"
    //% block.loc.el="↑"
    Up,
    //% blockId="control_down" block="↓"
    //% block.loc.de="↓"
    //% block.loc.fr="↓"
    //% block.loc.es="↓"
    //% block.loc.it="↓"
    //% block.loc.el="↓"
    Down,
    //% blockId="control_left" block="←"
    //% block.loc.de="←"
    //% block.loc.fr="←"
    //% block.loc.es="←"
    //% block.loc.it="←"
    //% block.loc.el="←"
    Left,
    //% blockId="control_right" block="→"
    //% block.loc.de="→"
    //% block.loc.fr="→"
    //% block.loc.es="→"
    //% block.loc.it="→"
    //% block.loc.el="→"
    Right,
    //% blockId="control_horn" block="🔊"
    //% block.loc.de="🔊"
    //% block.loc.fr="🔊"
    //% block.loc.es="🔊"
    //% block.loc.it="🔊"
    //% block.loc.el="🔊"
    Horn,
    //% blockId="control_stop" block="⏹"
    //% block.loc.de="⏹"
    //% block.loc.fr="⏹"
    //% block.loc.es="⏹"
    //% block.loc.it="⏹"
    //% block.loc.el="⏹"
    Stop,
    //% blockId="control_x" block="Slider1"
    //% block.loc.de="Slider1"
    //% block.loc.fr="Slider1"
    //% block.loc.es="Slider1"
    //% block.loc.it="Slider1"
    //% block.loc.el="Slider1"
    XCommand,
    //% blockId="control_c" block="Slider2"
    //% block.loc.de="Slider2"
    //% block.loc.fr="Slider2"
    //% block.loc.es="Slider2"
    //% block.loc.it="Slider2"
    //% block.loc.el="Slider2"
    CCommand
}

//% weight=20 color=#ff6900 icon=""
namespace LofiRobot {
    // Robot-Head Variables
    let x = 0
    let y = 0
    let z = 0
    let yaw = 0
    let pitch = 0
    let mouth = 0
    let left_eye = 0
    let right_eye = 0
    let roll = 0
    let smile = 0
    let face_visible = 0

    // Brow + gaze blendshape variables
    let brow_down_l = 0
    let brow_down_r = 0
    let brow_inner_up = 0
    let brow_outer_up_l = 0
    let brow_outer_up_r = 0
    let gaze_down_l = 0
    let gaze_down_r = 0
    let gaze_up_l = 0
    let gaze_up_r = 0
    let gaze_in_l = 0
    let gaze_in_r = 0

    let receivedString = ""
    let bluetoothStarted = false
    let serialStarted = false
    let bleListenerStarted = false
    let serialListenerStarted = false
    let controlHandlers: (() => void)[] = []

    // ========================================================================
    // CONNECTION SUBCATEGORY
    // ========================================================================

    /**
     * Initialize Bluetooth UART. Call once at the start of your program if
     * the FaceRobot app will connect via BLE.
     */
    //% block="Initialize Bluetooth"
    //% block.loc.de="Bluetooth initialisieren"
    //% block.loc.fr="Initialiser Bluetooth"
    //% block.loc.es="Inicializar Bluetooth"
    //% block.loc.it="Inizializza Bluetooth"
    //% block.loc.el="Αρχικοποίηση Bluetooth"
    //% weight=100
    //% subcategory="Connection"
    //% subcategory.loc.de="Verbindung"
    //% subcategory.loc.fr="Connexion"
    //% subcategory.loc.es="Conexión"
    //% subcategory.loc.it="Connessione"
    //% subcategory.loc.el="Σύνδεση"
    export function initializeBluetooth(): void {
        if (!bluetoothStarted) {
            bluetooth.startUartService()
            basic.showIcon(IconNames.Square)
            bluetoothStarted = true

            for (let i = 0; i < 3; i++) {
                led.plot(2, 2)
                basic.pause(200)
                led.unplot(2, 2)
                basic.pause(200)
            }
        }
    }

    /**
     * Initialize USB Serial. Call once at the start of your program if the
     * FaceRobot app will connect via Web Serial (USB cable).
     */
    //% block="Initialize Serial"
    //% block.loc.de="Serial initialisieren"
    //% block.loc.fr="Initialiser Serial"
    //% block.loc.es="Inicializar Serial"
    //% block.loc.it="Inizializza Serial"
    //% block.loc.el="Αρχικοποίηση Serial"
    //% weight=99
    //% subcategory="Connection"
    //% subcategory.loc.de="Verbindung"
    //% subcategory.loc.fr="Connexion"
    //% subcategory.loc.es="Conexión"
    //% subcategory.loc.it="Connessione"
    //% subcategory.loc.el="Σύνδεση"
    export function initializeSerial(): void {
        if (!serialStarted) {
            serial.setRxBufferSize(128)
            basic.showIcon(IconNames.Square)
            serialStarted = true

            for (let i = 0; i < 3; i++) {
                led.plot(2, 2)
                basic.pause(200)
                led.unplot(2, 2)
                basic.pause(200)
            }
        }
    }

    /**
     * Scroll the Calliope mini's friendly BLE name on the LED matrix.
     */
    //% block="Calliope mini BLE-device-name"
    //% block.loc.de="Calliope mini BLE-Anzeigename"
    //% block.loc.fr="Nom d'affichage Calliope mini BLE"
    //% block.loc.es="Nombre de dispositivo Calliope mini BLE"
    //% block.loc.it="Nome visualizzato Calliope mini BLE"
    //% block.loc.el="Όνομα εμφάνισης Calliope mini BLE"
    //% weight=95
    //% subcategory="Connection"
    //% subcategory.loc.de="Verbindung"
    //% subcategory.loc.fr="Connexion"
    //% subcategory.loc.es="Conexión"
    //% subcategory.loc.it="Connessione"
    //% subcategory.loc.el="Σύνδεση"
    export function showDeviceName(): void {
        basic.showString(control.deviceName().toUpperCase())
    }

    // ========================================================================
    // FACE-APP SUBCATEGORY
    // ========================================================================

    /**
     * Run code each time a complete movement-data packet is received via
     * Bluetooth. Mirrors the original working LofiRobot 0.2.x extension.
     */
    //% block="on Bluetooth movement data received"
    //% block.loc.de="wenn Bluetooth-Bewegungsdaten empfangen"
    //% block.loc.fr="quand les données Bluetooth de mouvement sont reçues"
    //% block.loc.es="cuando se reciben datos Bluetooth de movimiento"
    //% block.loc.it="quando vengono ricevuti dati Bluetooth di movimento"
    //% block.loc.el="όταν λαμβάνονται δεδομένα κίνησης Bluetooth"
    //% weight=90
    //% subcategory="Face-App"
    export function onDataReceived(handler: () => void): void {
        if (!bleListenerStarted) {
            bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
                receivedString = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

                // Original 19-char fields
                x = parseFloat(receivedString.substr(0, 2))
                y = parseFloat(receivedString.substr(2, 2))
                z = parseFloat(receivedString.substr(4, 2))
                yaw = parseFloat(receivedString.substr(6, 2))
                pitch = parseFloat(receivedString.substr(8, 2))
                mouth = parseFloat(receivedString.substr(10, 2))
                left_eye = parseFloat(receivedString.substr(12, 2))
                right_eye = parseFloat(receivedString.substr(14, 2))
                roll = parseFloat(receivedString.substr(16, 1))
                smile = parseFloat(receivedString.substr(17, 1))
                face_visible = parseFloat(receivedString.substr(18, 1))

                // Brow + gaze (positions 19-40, present when payload is the
                // newer 41-char format)
                if (receivedString.length >= 41) {
                    brow_down_l      = parseFloat(receivedString.substr(19, 2))
                    brow_down_r      = parseFloat(receivedString.substr(21, 2))
                    brow_inner_up    = parseFloat(receivedString.substr(23, 2))
                    brow_outer_up_l  = parseFloat(receivedString.substr(25, 2))
                    brow_outer_up_r  = parseFloat(receivedString.substr(27, 2))
                    gaze_down_l      = parseFloat(receivedString.substr(29, 2))
                    gaze_down_r      = parseFloat(receivedString.substr(31, 2))
                    gaze_up_l        = parseFloat(receivedString.substr(33, 2))
                    gaze_up_r        = parseFloat(receivedString.substr(35, 2))
                    gaze_in_l        = parseFloat(receivedString.substr(37, 2))
                    gaze_in_r        = parseFloat(receivedString.substr(39, 2))
                }

                handler()

                for (let i = 0; i < controlHandlers.length; i++) {
                    if (controlHandlers[i]) {
                        controlHandlers[i]()
                    }
                }
            })
            bleListenerStarted = true
        }
    }

    /**
     * Run code each time a complete movement-data packet is received via
     * USB Serial.
     */
    //% block="on Serial movement data received"
    //% block.loc.de="wenn Serial-Bewegungsdaten empfangen"
    //% block.loc.fr="quand les données Serial de mouvement sont reçues"
    //% block.loc.es="cuando se reciben datos Serial de movimiento"
    //% block.loc.it="quando vengono ricevuti dati Serial di movimento"
    //% block.loc.el="όταν λαμβάνονται δεδομένα κίνησης Serial"
    //% weight=89
    //% subcategory="Face-App"
    export function onSerialDataReceived(handler: () => void): void {
        if (!serialListenerStarted) {
            serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
                receivedString = serial.readUntil(serial.delimiters(Delimiters.NewLine))

                x = parseFloat(receivedString.substr(0, 2))
                y = parseFloat(receivedString.substr(2, 2))
                z = parseFloat(receivedString.substr(4, 2))
                yaw = parseFloat(receivedString.substr(6, 2))
                pitch = parseFloat(receivedString.substr(8, 2))
                mouth = parseFloat(receivedString.substr(10, 2))
                left_eye = parseFloat(receivedString.substr(12, 2))
                right_eye = parseFloat(receivedString.substr(14, 2))
                roll = parseFloat(receivedString.substr(16, 1))
                smile = parseFloat(receivedString.substr(17, 1))
                face_visible = parseFloat(receivedString.substr(18, 1))

                if (receivedString.length >= 41) {
                    brow_down_l      = parseFloat(receivedString.substr(19, 2))
                    brow_down_r      = parseFloat(receivedString.substr(21, 2))
                    brow_inner_up    = parseFloat(receivedString.substr(23, 2))
                    brow_outer_up_l  = parseFloat(receivedString.substr(25, 2))
                    brow_outer_up_r  = parseFloat(receivedString.substr(27, 2))
                    gaze_down_l      = parseFloat(receivedString.substr(29, 2))
                    gaze_down_r      = parseFloat(receivedString.substr(31, 2))
                    gaze_up_l        = parseFloat(receivedString.substr(33, 2))
                    gaze_up_r        = parseFloat(receivedString.substr(35, 2))
                    gaze_in_l        = parseFloat(receivedString.substr(37, 2))
                    gaze_in_r        = parseFloat(receivedString.substr(39, 2))
                }

                handler()

                for (let i = 0; i < controlHandlers.length; i++) {
                    if (controlHandlers[i]) {
                        controlHandlers[i]()
                    }
                }
            })
            serialListenerStarted = true
        }
    }

    /**
     * Show a bar graph for the selected face-tracking value.
     */
    //% block="show bar graph for movement data value %valueType"
    //% block.loc.de="zeige Säulendiagramm für Bewegungsdaten vom Wert %valueType"
    //% block.loc.fr="afficher graphique en barres pour les données de mouvement de la valeur %valueType"
    //% block.loc.es="mostrar gráfico de barras para datos de movimiento del valor %valueType"
    //% block.loc.it="mostra grafico a barre per dati di movimento del valore %valueType"
    //% block.loc.el="εμφάνιση γραφήματος στηλών για δεδομένα κίνησης της αξίας %valueType"
    //% weight=70
    //% subcategory="Face-App"
    export function showRobotHeadBarGraph(valueType: FaceValues): void {
        led.plotBarGraph(getRobotHeadValue(valueType), 100)
    }

    /**
     * Returns the selected face-tracking value (0–99 in most cases).
     */
    //% block="movement data from value %value"
    //% block.loc.de="Bewegungsdaten vom Wert %value"
    //% block.loc.fr="données de mouvement de la valeur %value"
    //% block.loc.es="datos de movimiento del valor %value"
    //% block.loc.it="dati di movimento del valore %value"
    //% block.loc.el="δεδομένα κίνησης από την αξία %value"
    //% weight=60
    //% subcategory="Face-App"
    export function getRobotHeadValue(value: FaceValues): number {
        switch (value) {
            case FaceValues.X:                return x
            case FaceValues.Y:                return y
            case FaceValues.Z:                return z
            case FaceValues.Yaw:              return yaw
            case FaceValues.Pitch:            return pitch
            case FaceValues.Mouth:            return mouth
            case FaceValues.LeftEye:          return left_eye
            case FaceValues.RightEye:         return right_eye
            case FaceValues.BrowDownLeft:     return brow_down_l
            case FaceValues.BrowDownRight:    return brow_down_r
            case FaceValues.BrowInnerUp:      return brow_inner_up
            case FaceValues.BrowOuterUpLeft:  return brow_outer_up_l
            case FaceValues.BrowOuterUpRight: return brow_outer_up_r
            case FaceValues.GazeDownLeft:     return gaze_down_l
            case FaceValues.GazeDownRight:    return gaze_down_r
            case FaceValues.GazeUpLeft:       return gaze_up_l
            case FaceValues.GazeUpRight:      return gaze_up_r
            case FaceValues.GazeInLeft:       return gaze_in_l
            case FaceValues.GazeInRight:      return gaze_in_r
            default:                          return 0
        }
    }

    // ========================================================================
    // CONTROL-APP SUBCATEGORY
    // ========================================================================

    /**
     * Check if a specific control command is currently active.
     */
    //% block="Control command received %command"
    //% block.loc.de="Steuerbefehl empfangen %command"
    //% block.loc.fr="Commande de contrôle reçue %command"
    //% block.loc.es="Comando de control recibido %command"
    //% block.loc.it="Comando di controllo ricevuto %command"
    //% block.loc.el="Εντολή ελέγχου ελήφθη %command"
    //% command.fieldEditor="gridpicker"
    //% command.fieldOptions.columns=4
    //% command.fieldOptions.width="300"
    //% command.fieldOptions.maxRows=2
    //% weight=65
    //% advanced=true
    //% subcategory="Control-App"
    export function isControlCommand(command: ControlCommands): boolean {
        switch (command) {
            case ControlCommands.Up:       return receivedString == "up"
            case ControlCommands.Down:     return receivedString == "down"
            case ControlCommands.Left:     return receivedString == "left"
            case ControlCommands.Right:    return receivedString == "right"
            case ControlCommands.Horn:     return receivedString == "horn"
            case ControlCommands.Stop:     return receivedString == "stop"
            case ControlCommands.XCommand: return receivedString.charAt(0) == "c"
            case ControlCommands.CCommand: return receivedString.charAt(0) == "x"
            default:                       return false
        }
    }

    /**
     * Run code when a specific control command is received. Works for
     * either Bluetooth or Serial — register a corresponding "on … data
     * received" block first so the underlying listener is up.
     */
    //% block="When control command %command is received"
    //% block.loc.de="Wenn Steuerbefehl %command empfangen wird"
    //% block.loc.fr="Quand la commande de contrôle %command est reçue"
    //% block.loc.es="Cuando se recibe el comando de control %command"
    //% block.loc.it="Quando viene ricevuto il comando di controllo %command"
    //% block.loc.el="Όταν λαμβάνεται εντολή ελέγχου %command"
    //% command.fieldEditor="gridpicker"
    //% command.fieldOptions.columns=4
    //% command.fieldOptions.width="300"
    //% command.fieldOptions.maxRows=2
    //% weight=64
    //% subcategory="Control-App"
    export function onControlCommand(command: ControlCommands, handler: () => void): void {
        controlHandlers.push(function () {
            if (isControlCommand(command)) {
                handler()
            }
        })
    }

    /**
     * Get the Slider1 value (commands starting with 'c').
     */
    //% block="Slider1 value"
    //% block.loc.de="Slider1 Wert"
    //% block.loc.fr="valeur Slider1"
    //% block.loc.es="valor Slider1"
    //% block.loc.it="valore Slider1"
    //% block.loc.el="αξία Slider1"
    //% weight=57
    //% subcategory="Control-App"
    export function getXCommandValue(): number {
        if (receivedString.charAt(0) == "c") {
            return parseFloat(receivedString.substr(1, 3))
        }
        return 0
    }

    /**
     * Get the Slider2 value (commands starting with 'x').
     */
    //% block="Slider2 value"
    //% block.loc.de="Slider2 Wert"
    //% block.loc.fr="valeur Slider2"
    //% block.loc.es="valor Slider2"
    //% block.loc.it="valore Slider2"
    //% block.loc.el="αξία Slider2"
    //% weight=56
    //% subcategory="Control-App"
    export function getCCommandValue(): number {
        if (receivedString.charAt(0) == "x") {
            return parseFloat(receivedString.substr(1, 3))
        }
        return 0
    }

    // ========================================================================
    // ERWEITERT (advanced) SUBCATEGORY
    // ========================================================================

    /**
     * Returns the most recently received raw string.
     */
    //% block="received string"
    //% block.loc.de="empfangener Text"
    //% block.loc.fr="chaîne reçue"
    //% block.loc.es="cadena recibida"
    //% block.loc.it="stringa ricevuta"
    //% block.loc.el="ληφθείσα συμβολοσειρά"
    //% weight=50
    //% advanced=true
    //% subcategory="Erweitert"
    export function getReceivedString(): string {
        return receivedString
    }
}
