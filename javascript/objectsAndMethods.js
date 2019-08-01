let card = {
    drawAll: function () {
        $('#recordsContainer').empty()
        let queryURL = 'http://localhost:4000/entries'
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            //FOR EACH ENTRY
            for (j = 0; j < response.data.length; j++) {

                //CARD DRAW
                let card = $(`<div class='card m-2 shadow'></div>`)

                $(card).prepend(`<small class='p-3'>Status: ${response.data[j].status}</small>`)
                $(card).prepend(`<small class='p-3'>Applied: ${response.data[j].applicationSubmissionDate}</small><br/>`)
                $(card).prepend(`<h4 class='card-header row'><div>${response.data[j].companyName}</div></h4>`)

                let cardFooter = $(`<div class='card-footer text-right'></div>`)

                $(cardFooter).prepend(`<div class='deleteRecordButton text-center' id='${response.data[j]._id}'><i class="material-icons">delete</i></div>`)
                $(cardFooter).prepend(`<div class='editRecordButton text-center' data-toggle='modal' data-target='#editRecordModal' id='${response.data[j]._id}'><i class="material-icons">edit</i></div>`)
                $(cardFooter).prepend(`<div class='viewRecordButton text-center' data-toggle='modal' data-target='#viewRecordModal' id='${response.data[j]._id}'><i class="material-icons">zoom_in</i></div>`)

                $(card).append(cardFooter)

                $('#recordsContainer').addClass('row')
                $(card).addClass('col-lg-5 col-md-12 recordPreviewCard')
                $(card).attr('data-id', response.data[j]._id)
                $('#recordsContainer').append(card)
            }

            statistics.printAvgDesireLevel(response.data)
            statistics.printAvgConfidenceLevel(response.data)
            statistics.printOutstandingCount(response.data)
            graph.applicationsPerDay(response.data)

        });
    }
}

let statistics = {
    printAvgDesireLevel: function (resObj) {
        let x = 0;
        let recordCount = resObj.length
        for (i = 0; i < recordCount; i++) {
            x += parseInt(resObj[i].desireLevel)
        }
        let avgDesireLevel = (x / (recordCount)).toFixed(1);
        $('statsbox').append(`<p>Average Desire Level: ${avgDesireLevel}</p>`)
    },
    printAvgConfidenceLevel: function (resObj) {
        let x = 0;
        let recordCount = resObj.length
        for (i = 0; i < recordCount; i++) {
            x += parseInt(resObj[i].confidenceLevel)
        }
        let avgConfidenceLevel = (x / (recordCount)).toFixed(1);
        $('statsbox').append(`<p>Average Confidence Level: ${avgConfidenceLevel}</p>`)
    },
    printOutstandingCount: function (resObj) {
        let x = 0;
        let recordCount = resObj.length
        for (i = 0; i < recordCount; i++) {
            if (resObj[i].applicationWithdrawn == 'false' && resObj[i].deniedJob == 'false' && resObj[i].neverResponded == 'false') {
                x += 1
            }
        }
        $('statsbox').append(`<p>Outstanding/Total Ratio: ${x} out of ${recordCount}</p>`)
    }
}

let graph = {
    applicationsPerDay: function (resObj) {
        let x = 0;
        let last60DaysArray = pullLast60Days()
        let recordCount = resObj.length
        let compValsArr = []
        for (i = 0; i < last60DaysArray.length; i++) {
            let valueToInsert = 0;
            for (j = 0; j < recordCount; j++) {
                if (last60DaysArray[i] === resObj[j].applicationSubmissionDate) {
                    valueToInsert += 1
                }
            }
            compValsArr.push(valueToInsert)
        }
        console.log(last60DaysArray)
        console.log(compValsArr)

        //Create the new chart
        var ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last60DaysArray,
                datasets: [{
                    label: 'Share Value',
                    data: compValsArr,
                    backgroundColor:
                        'rgba(13, 193, 175, 0.5)'
                    ,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 1
                        }
                    }]
                }
            }
        });

    }
}