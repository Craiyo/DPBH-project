var speak = function(str) {
    var msg = new SpeechSynthesisUtterance(str);
    var voices = window.speechSynthesis.getVoices();
    console.log(voices)
    msg.voice = voices[0];
    return msg;
}