/**
 * LOFI ROBOT Bluetooth Extension
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
    //% block="Roll"
    //% block.loc.de="Rollen"
    //% block.loc.fr="Roulis"
    //% block.loc.es="Balanceo"
    //% block.loc.it="Rollio"
    //% block.loc.el="Κύλιση"
    Roll,
    //% block="Smile"
    //% block.loc.de="Lächeln"
    //% block.loc.fr="Sourire"
    //% block.loc.es="Sonrisa"
    //% block.loc.it="Sorriso"
    //% block.loc.el="Χαμόγελο"
    Smile,
    //% block="Face Visible"
    //% block.loc.de="Gesicht sichtbar"
    //% block.loc.fr="Visage visible"
    //% block.loc.es="Cara visible"
    //% block.loc.it="Viso visibile"
    //% block.loc.el="Πρόσωπο ορατό"
    FaceVisible
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

//% weight=20 color=#ff6900 icon="\uf118"
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

    let receivedString = ""
    let bluetoothStarted = false
    let controlHandlers: (() => void)[] = []
    let uartListenerStarted = false

    /**
     * Initialize Bluetooth
     */
    //% block="Initialize Bluetooth"
    //% block.loc.de="Bluetooth initialisieren"
    //% block.loc.fr="Initialiser Bluetooth"
    //% block.loc.es="Inicializar Bluetooth"
    //% block.loc.it="Inizializza Bluetooth"
    //% block.loc.el="Αρχικοποίηση Bluetooth"
    //% weight=100
    export function initializeBluetooth(): void {
        if (!bluetoothStarted) {
            bluetooth.startUartService()
            basic.showIcon(IconNames.Square)
            bluetoothStarted = true
            
            // Blink center LED 3 times to indicate initialization
            for (let i = 0; i < 3; i++) {
                led.plot(2, 2)
                basic.pause(200)
                led.unplot(2, 2)
                basic.pause(200)
            }
        }
    }

    /**
     * Process movement data when received via Bluetooth
     * @param handler Code to be executed after processing movement data
     */
    //% block="Bewegungsdaten verarbeiten"
    //% block.loc.de="Bewegungsdaten verarbeiten"
    //% block.loc.fr="Traiter les données de mouvement"
    //% block.loc.es="Procesar datos de movimiento"
    //% block.loc.it="Elabora dati di movimento"
    //% block.loc.el="Επεξεργασία δεδομένων κίνησης"
    //% weight=90
    export function onDataReceived(handler: () => void): void {
        if (!uartListenerStarted) {
            bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
                receivedString = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
                
                // Process robot head data first
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
                
                // Then execute user handler
                handler()
                
                // Execute control handlers
                for (let i = 0; i < controlHandlers.length; i++) {
                    if (controlHandlers[i]) {
                        controlHandlers[i]()
                    }
                }
            })
            uartListenerStarted = true
        }
    }

    /**
     * Shows a bar graph with the selected Robot-Head value
     * @param valueType Choose the Robot-Head value to display
     */
    //% block="show bar graph for movement data value %valueType"
    //% block.loc.de="zeige Säulendiagramm für Bewegungsdaten vom Wert %valueType"
    //% block.loc.fr="afficher graphique en barres pour les données de mouvement de la valeur %valueType"
    //% block.loc.es="mostrar gráfico de barras para datos de movimiento del valor %valueType"
    //% block.loc.it="mostra grafico a barre per dati di movimento del valore %valueType"
    //% block.loc.el="εμφάνιση γραφήματος στηλών για δεδομένα κίνησης της αξίας %valueType"
    //% weight=70
    export function showRobotHeadBarGraph(valueType: FaceValues): void {
        let valueToShow = 0
        let maxValue = 100

        switch (valueType) {
            case FaceValues.X:
                valueToShow = x
                break
            case FaceValues.Y:
                valueToShow = y
                break
            case FaceValues.Z:
                valueToShow = z
                break
            case FaceValues.Yaw:
                valueToShow = yaw
                break
            case FaceValues.Pitch:
                valueToShow = pitch
                break
            case FaceValues.Mouth:
                valueToShow = mouth
                break
            case FaceValues.LeftEye:
                valueToShow = left_eye
                break
            case FaceValues.RightEye:
                valueToShow = right_eye
                break
            case FaceValues.Roll:
                valueToShow = roll
                break
            case FaceValues.Smile:
                valueToShow = smile
                break
            case FaceValues.FaceVisible:
                valueToShow = face_visible
                break
        }

        led.plotBarGraph(valueToShow, maxValue)
    }

    /**
     * Returns the selected Robot-Head value
     * @param value Choose the value to return
     */
    //% block="movement data from value %value"
    //% block.loc.de="Bewegungsdaten vom Wert %value"
    //% block.loc.fr="données de mouvement de la valeur %value"
    //% block.loc.es="datos de movimiento del valor %value"
    //% block.loc.it="dati di movimento del valore %value"
    //% block.loc.el="δεδομένα κίνησης από την αξία %value"
    //% weight=60
    export function getRobotHeadValue(value: FaceValues): number {
        switch (value) {
            case FaceValues.X:
                return x
            case FaceValues.Y:
                return y
            case FaceValues.Z:
                return z
            case FaceValues.Yaw:
                return yaw
            case FaceValues.Pitch:
                return pitch
            case FaceValues.Mouth:
                return mouth
            case FaceValues.LeftEye:
                return left_eye
            case FaceValues.RightEye:
                return right_eye
            case FaceValues.Roll:
                return roll
            case FaceValues.Smile:
                return smile
            case FaceValues.FaceVisible:
                return face_visible
            default:
                return 0
        }
    }

    /**
     * Check if specific control command was received
     * @param command Choose the control command to check for
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
    export function isControlCommand(command: ControlCommands): boolean {
        switch (command) {
            case ControlCommands.Up:
                return receivedString == "up"
            case ControlCommands.Down:
                return receivedString == "down"
            case ControlCommands.Left:
                return receivedString == "left"
            case ControlCommands.Right:
                return receivedString == "right"
            case ControlCommands.Horn:
                return receivedString == "horn"
            case ControlCommands.Stop:
                return receivedString == "stop"
            case ControlCommands.XCommand:
                return receivedString.charAt(0) == "c"
            case ControlCommands.CCommand:
                return receivedString.charAt(0) == "x"
            default:
                return false
        }
    }

    /**
     * Execute code when specific control command is received
     * @param command Choose the control command to listen for
     * @param handler Code to execute when the command is received
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
    export function onControlCommand(command: ControlCommands, handler: () => void): void {
        // Automatically start UART listener if not already started
        if (!uartListenerStarted) {
            bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
                receivedString = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
                
                // Execute control handlers
                for (let i = 0; i < controlHandlers.length; i++) {
                    if (controlHandlers[i]) {
                        controlHandlers[i]()
                    }
                }
            })
            uartListenerStarted = true
        }
        
        controlHandlers.push(function () {
            if (isControlCommand(command)) {
                handler()
            }
        })
    }

    /**
     * Get Slider1 value (for commands starting with 'c')
     */
    //% block="Slider1 value"
    //% block.loc.de="Slider1 Wert"
    //% block.loc.fr="valeur Slider1"
    //% block.loc.es="valor Slider1"
    //% block.loc.it="valore Slider1"
    //% block.loc.el="αξία Slider1"
    //% weight=57
    export function getXCommandValue(): number {
        if (receivedString.charAt(0) == "c") {
            return parseFloat(receivedString.substr(1, 3))
        }
        return 0
    }

    /**
     * Get Slider2 value (for commands starting with 'x')
     */
    //% block="Slider2 value"
    //% block.loc.de="Slider2 Wert"
    //% block.loc.fr="valeur Slider2"
    //% block.loc.es="valor Slider2"
    //% block.loc.it="valore Slider2"
    //% block.loc.el="αξία Slider2"
    //% weight=56
    export function getCCommandValue(): number {
        if (receivedString.charAt(0) == "x") {
            return parseFloat(receivedString.substr(1, 3))
        }
        return 0
    }

    /**
     * Returns the received string from Bluetooth (hidden from UI)
     */
    //% block="received string"
    //% block.loc.de="empfangener Text"
    //% block.loc.fr="chaîne reçue"
    //% block.loc.es="cadena recibida"
    //% block.loc.it="stringa ricevuta"
    //% block.loc.el="ληφθείσα συμβολοσειρά"
    //% weight=50
    //% advanced=true
    export function getReceivedString(): string {
        return receivedString
    }
}
