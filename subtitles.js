let startBtn, stopBtn, hypothesisDiv, statusDiv, prevHypothesisDiv;
const formatOptions = 'Simple';
let SDK;
const language = 'en-GB';
const subscriptionKey = '';
let recognitionMode;
let recognizer;
let stopTheShow = false;

document.addEventListener("DOMContentLoaded", () => {

    createBtn = document.getElementById("createBtn");
    startBtn = document.getElementById("startBtn");
    stopBtn = document.getElementById("stopBtn");
    prevHypothesisDiv = document.getElementById("prevHypothesisDiv");
    hypothesisDiv = document.getElementById("hypothesisDiv");
    statusDiv = document.getElementById("statusDiv");

    startBtn.addEventListener("click", function () {
        if (!recognizer) {
            Setup();
        }

        hypothesisDiv.innerHTML = "";
        prevHypothesisDiv.innerHTML = "";
        startBtn.disabled = true;
        stopBtn.disabled = false;
        stopTheShow = false;
        RecognizerStart(recognizer);
    });

    stopBtn.addEventListener("click", function () {
        RecognizerStop(recognizer);
        startBtn.disabled = false;
        stopBtn.disabled = true;
        stopTheShow = true;
    });

    Initialize();

});


function Initialize() {
    if (!!window.SDK) {
        SDK = window.SDK;
        startBtn.disabled = false;
        recognitionMode = SDK.RecognitionMode.Interactive;
    }
}

// Setup the recognizer
function Setup() {
    if (recognizer != null) {
        RecognizerStop(recognizer);
    }
    recognizer = RecognizerSetup(SDK, recognitionMode.value, language, SDK.SpeechResultFormat[formatOptions], subscriptionKey);
}

function RecognizerSetup(SDK, format) {

    var recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode,
        language, // Supported languages are specific to each recognition mode. Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

    var authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

    return SDK.CreateRecognizer(recognizerConfig, authentication);
}

// Start the recognition
function RecognizerStart(recognizer) {
    recognizer.Recognize((event) => {

            switch (event.Name) {
                case "RecognitionTriggeredEvent":
                    UpdateStatus("Initializing");
                    break;
                case "ListeningStartedEvent":
                    UpdateStatus("Listening");
                    break;
                case "RecognitionStartedEvent":
                    UpdateStatus("Listening_Recognizing");
                    break;
                case "SpeechStartDetectedEvent":
                    UpdateStatus("Listening_DetectedSpeech_Recognizing");
                    console.log(JSON.stringify(event.Result)); // check console for other information in result
                    break;
                case "SpeechHypothesisEvent":
                    UpdateRecognizedHypothesis(event.Result.Text, false);
                    console.log(JSON.stringify(event.Result)); // check console for other information in result
                    break;
                case "SpeechFragmentEvent":
                    UpdateRecognizedHypothesis(event.Result.Text, true);
                    console.log(JSON.stringify(event.Result)); // check console for other information in result
                    break;
                case "SpeechEndDetectedEvent":
                    UpdateStatus("Processing_Adding_Final_Touches");
                    console.log(JSON.stringify(event.Result)); // check console for other information in result
                    break;
                case "SpeechSimplePhraseEvent":
                    ClearHypothesis();
                    break;
                case "RecognitionEndedEvent":
                    HypothesisCompleted();
                    UpdateStatus("Idle");
                    console.log(JSON.stringify(event)); // Debug information
                    break;
                default:
                    console.log(JSON.stringify(event)); // Debug information
            }
        })
        .On(() => {
                // The request succeeded. Nothing to do here.
            },
            (error) => {
                console.error(error);
            });
}

function RecognizerStop(recognizer) {
    recognizer.AudioSource.TurnOff();
}

function UpdateStatus(status) {
    statusDiv.innerHTML = status;
}

function UpdateRecognizedHypothesis(text, append) {
    if (append)
        hypothesisDiv.innerHTML += text + " ";
    else
        hypothesisDiv.innerHTML = text;

    var length = hypothesisDiv.innerHTML.length;
    if (length > 403) {
        hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length - 400, length);
    }
}

function ClearHypothesis() {
    prevHypothesisDiv.innerHTML = hypothesisDiv.innerHTML;
    hypothesisDiv.innerHTML = "";
}

function HypothesisCompleted() {
    if (stopTheShow) {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    } else {
        RecognizerStart(recognizer);
    }
}