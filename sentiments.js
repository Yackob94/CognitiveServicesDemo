const subscriptionKey = '';

const uri = 'https://westeurope.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

function getSentiments() {
    let message = {
        'documents': [{
            'id': '1',
            'language': 'en',
            'text': "'" + $("#inputText").val() + "'"
        }]
    };

    $.ajax({
            url: uri,
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            type: "POST",
            data: JSON.stringify(message),
        }).done(function (data) {
            $("#responsePositive").text(data.documents[0].score * 100);
            $("#responseNegative").text(100 - data.documents[0].score * 100);

            $("#responseTextArea").val(JSON.stringify(data, null, 2));
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            var errorString = (errorThrown === "") ? "Error. " :
                errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
                jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });


}