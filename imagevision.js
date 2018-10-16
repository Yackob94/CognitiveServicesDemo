const subscriptionKey = "";
const uriBase = "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze";

function processImage() {

    var params = {
        "visualFeatures": "Categories,Description",
        "details": "",
        "language": "en",
    };

    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    $.ajax({
        url: uriBase + "?" + $.param(params),
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        $("#responseDescription").text(data.description.captions[0].text);
        $("#responseTextArea").val(JSON.stringify(data,null,2));
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        var errorString = (errorThrown === "") ? "Error. " :
            errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" :
            jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
}