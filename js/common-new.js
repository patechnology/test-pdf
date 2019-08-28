$(document).ready(function(){
  
      var result_json = $('#test_data').text().trim();
      result = JSON.parse(result_json);
      console.log(result);
      result = JSON.parse(result);
      console.log(result);
      var test = result.test;
      var recruiter = test.recruiter;
      var questions = test.questions;
      var candidates = result.candidates;
      var impTags = {
        'DIFFICULTY_LEVEL': {
          'class': 'badge-secondary'
        }
      };

			fillTestTopSection(test);
			fillRecruiterData(recruiter);
      fillQuestionTopSection(questions, impTags);
    	fillCandidatesTableTopSection(candidates);

    	// Result->Candidate Name & Details
      for (var i = 0; i < result.candidates.length; i++) {
        var tableBodyContent = '';
        var tableCSContent = '';
        var tableBugsContent = '';
        var totalBugs = 0;
        var codeSmellIssues = 0;
        var criticalViolations = 0;
        var blockerViolations = 0;

        candidate = result.candidates[i];
        candidate.questions.forEach(function(question, v) {
          var submission = question.submission;
          var testCasesPassedCount = 0;
          if (submission) {
            testCasesPassedCount = getPassedTestCasesCount(submission);
            var code_quality = submission.code_quality;
            if (code_quality) {

              //Start => Bugs Counting and HTML
              var bugs = code_quality.bugs;
              if (bugs) {
                tableBugsContent = appendBugsContent(bugs, tableBugsContent);
                totalBugs += bugs.total;
              }
              //End => Bugs Counting and HTML

              //Start => Codesmells
              var codesmells = code_quality.codesmells;
              if (codesmells) {
                tableCSContent = appendCodeSmellContent(codesmells, tableCSContent);  
                codeSmellIssues += codesmells.issues ? codesmells.issues.length : 0;
              }
              //End => Codesmells
            }
            
            if (submission.metrics && submission.metrics.component && submission.metrics.component.measures) {
              var measures = submission.metrics.component.measures;
              criticalViolations += measures.critical_violations;
              blockerViolations += measures.blocker_violations;
            }
          }
          
          tableBodyContent += '<tr>' + 
                                '<td>' + (v + 1) + '</td>' + 
                                '<td>' + question.displayTitle + '</td>' + 
                                '<td>' + question.options.length + '</td>' + 
                                '<td>' + testCasesPassedCount + '</td>' + 
                                '<td>' + question.last_quality_score + '/' + question.total_quality_score + '</td>' + 
                                '<td>' + question.last_score + '/' + question.points + '</td>' + 
                              '</tr>';
        });

        // result.candidates[0].questions[0].submissions[0]
        $('#eachCandidate').append('<div class="col-sm-12">'+
          '<div class="card card-yellow mt-4">'+
            '<h4 class="card-header font-weight-bold bg-yellow">'+
              '<span class="d-inline-block mt-1">' + candidate.name + '</span>'+
              '<small class="d-inline-block ml-5">CID: <span>' + candidate.id + '</span></small>'+
              '<div class="input-group" style="width: 280px; float: right;">'+
                '<div class="input-group-prepend"><span class="input-group-text">@</span></div>'+
                '<input type="text" class="form-control" placeholder="'+ candidate.email +'">'+
              '</div>'+
            '</h4>'+
            '<div class="card-body">'+
              '<div class="card">'+
                '<table class="table text-center table-hover table-head mb-0">'+
                  '<thead class="table-active">'+
                    '<tr>'+
                      '<th class="border-0">Question</th>'+
                      '<th class="border-0">Question Name</th>'+
                      '<th class="border-0">Total Tests</th>'+
                      '<th class="border-0">Tests Passed</th>'+
                      '<th class="border-0">Code Quality</th>'+
                      '<th class="border-0">Points</th>'+
                    '</tr>'+
                  '</thead>'+
                  '<tbody>' + tableBodyContent + '</tbody>'+
                '</table>'+
              '</div>'+
              '<div class="row">'+
                '<div class="col col-sm-6 col-md-3">'+
                  '<div class="card mt-4 bg-light">'+
                    '<div class="card-body">'+
                      '<div class="icon-cardbox icon-cardbox-bug"><svg class="icon"><use xlink:href="#icon_bugs"></use></svg></div>'+
                        '<p class="card-title mb-1" style="padding-left: 60px;">Bugs</p>'+
                        '<h4 class="card-subtitle mb-2 text-muted" style="padding-left: 60px;">' + totalBugs + '</h4>'+
                        '<hr>'+
                        '<p class="card-text" style="font-size: 14px">There are indicate that low age proficiency.</p>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+

                  '<div class="col col-sm-6 col-md-3">'+
                    '<div class="card mt-4 bg-light">'+
                      '<div class="card-body">'+
                        '<div class="icon-cardbox icon-cardbox-cv"><svg class="icon"><use xlink:href="#icon_exclamation"></use></svg></div>'+
                        '<p class="card-title mb-1" style="padding-left: 60px;">Critical Violations</p>'+
                        '<h4 class="card-subtitle mb-2 text-muted" style="padding-left: 60px;">' + criticalViolations + '</h4>'+
                        '<hr>'+
                        '<p class="card-text" style="font-size: 14px">There violations can load to edge case issues.</p>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+

                  '<div class="col col-sm-6 col-md-3">'+
                    '<div class="card mt-4 bg-light">'+
                      '<div class="card-body">'+
                        '<div class="icon-cardbox icon-cardbox-bv"><svg class="icon"><use xlink:href="#icon_bv"></use></svg></div>'+
                        '<p class="card-title mb-1" style="padding-left: 60px;">Blocker Violations</p>'+
                        '<h4 class="card-subtitle mb-2 text-muted" style="padding-left: 60px;">' + blockerViolations +'</h4>'+
                        '<hr>'+
                        '<p class="card-text" style="font-size: 14px">There violations can load to runtime application issues.</p>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+

                  '<div class="col col-sm-6 col-md-3">'+
                    '<div class="card mt-4 bg-light">'+
                      '<div class="card-body">'+
                        '<div class="icon-cardbox icon-cardbox-cs"><svg class="icon"><use xlink:href="#icon_query"></use></svg></div>'+
                        '<p class="card-title mb-1" style="padding-left: 60px;">Codesmells</p>'+
                        '<h4 class="card-subtitle mb-2 text-muted" style="padding-left: 60px;">' + codeSmellIssues +'</h4>'+
                        '<hr>'+
                        '<p class="card-text text-left" style="font-size: 14px">Code Smells indicate poor design concepts.</p>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                // ===============//
                
                '<div class="row">'+
                  '<div class="col-sm-12">'+
                    '<div class="card mt-4">'+
                      '<h5 class="card-header">Bugs</h5>'+
                      '<div class="card-body p-0">'+
                        '<div class="table-responsive">'+
                          '<table class="table table-head table-hover table-text14 table-truncate mb-0" width="100%">'+
                            '<thead>'+
                              '<tr class="border-0">'+
                                '<th class="border-0" style="width: 100px;"><div style="max-width: 100px;">Severity</div></th>'+ 
                                '<th class="border-0" style="width: 550px;"><div style="max-width: 550px;">Message</div></th>'+
                                '<th class="border-0" style="width: 450px;"><div style="max-width: 450px;">Component</div></th>'+
                              '</tr>'+
                            '</thead>'+
                            '<tbody>'
                              +tableBugsContent+               
                            '</tbody>'+
                          '</table>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-sm-12">'+
                    '<div class="card mt-4">'+
                      '<h5 class="card-header">Codesmells</h5>'+
                      '<div class="card-body p-0">'+
                        '<div class="table-responsive">'+
                          '<table class="table table-head table-hover table-text14 table-truncate mb-0" width="100%">'+
                            '<thead>'+
                              '<tr>'+
                                '<th class="border-0" style="width: 100px;"><div style="max-width: 100px;">Severity</div></th>'+                        
                                '<th class="border-0" style="width: 550px;"><div style="max-width: 550px;">Message</div></th>'+
                                '<th class="border-0" style="width: 450px;"><div style="max-width: 450px;">Component</div></th>'+
                              '</tr>'+
                            '</thead>'+
                            '<tbody>'
                              +tableCSContent+
                            '</tbody>'+
                          '</table>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                  // ==
                '</div>' + 
            '</div>'+
          '</div>'+
        '</div>');
        // console.log(result.candidates[i].questions[0]);
      }

      google.charts.load('visualization', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(drawLineChart);
      $('.loader').fadeOut();
});

function fillCandidatesTableTopSection(candidates) {
  for (var i = 0; i < candidates.length; i++) {
    var candidate = candidates[i];
    $('#candidates_Questions').append('<tr data-candidateindex="' + i + '">' +
      '<td>' + (i + 1) + '</td>' +
      '<td>' + candidate.name + '</td>' +
      '<td><div class="progress md-progress rounded-0" style="height:10px">' +
      '<div class="progress-bar" role="progressbar" style="width:' + candidate.last_score + '%; height:10px; background:#00bcd4"></div>' +
      '</div>' + candidate.last_score + '</td>' +
      '<td><div class="guage-box"><svg viewBox="0 0 36 36"><path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>' +
      '<path class="guage-circle" stroke-dasharray="' + candidate.last_quality_score + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>' +
      '<text x="18" y="23" class="guage-percentage">' + candidate.last_quality_score + '</text>' +
      '</svg></div></td>' +
      '<td>' + convertSeconds(candidate.time_taken) + ' </td>' +
      '<td>' + candidate.questions_attempted + '/' + candidate.total_questions + '</td>' +
      '</tr>');
  }
}

function fillQuestionTopSection(questions, impTags) {
  $('#test_QuestionsLength').html(questions.length);
  for (var i = 0; i < questions.length; i++) {
    var appandTo = 'chart_div_' + i;
    var question = questions[i];
    var impTagHtml = getImpTagsHtml(question, impTags);
    $('#test_Questions').append('<div class="col-sm-6 mb-4">' +
      '<div class="card bg-light">' +
      '<div class="card-body">' +
      '<h4 class="card-title text-success">' + question.displayTitle + '</h4>' +
      '<p class="card-text card-text-1rem text-muted min-h60">' + question.displayDescription + '</p>' +
      '<ul class="list-inline text-right mb-0">' +
      '<li class="list-inline-item font-weight-bold"><span class="p-2 px-3 badge badge-pill badge-success font-80p lspacing-1">' + parseInt(question.approxTime) / (60 * 60) + ' Hours</span></li>' +
      '<li class="list-inline-item font-weight-bold"><span class="p-2 px-3 badge badge-pill badge-info font-80p lspacing-1">' + question.points + ' Points</span></li>' +
      impTagHtml +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="col-sm-6">' +
      '<div id="' + appandTo + '"></div>' +
      '</div>' +
      '</div>');
  }
}

function getImpTagsHtml(question, impTags) {
  var tags = question.tags;
  var impTagHtml = '';
  if (tags) {
    for (let idx = 0; idx < tags.length; idx++) {
      const tag = tags[idx];
      const tagType = tag.tagType;
      if (impTags[tagType.name]) {
        var impTagMetadata = impTags[tagType.name];
        impTagHtml += '<li class="list-inline-item font-weight-bold"><span class="p-2 px-3 badge badge-pill ' + impTagMetadata.class + ' font-80p lspacing-1">' + tag.displayName + '<span></li>';
      }
    }
  }
  return impTagHtml;
}

function appendCodeSmellContent(codesmells, tableCSContent) {
  codesmells.issues.forEach(function (ind3, v) {
    var csType = '';
    var csMessage = '';
    var csComponent = '';
    if (ind3.severity == 'MAJOR') {
      csType = '<span class="badge badge-danger badge-w64 rounded-0">MAJOR</span>';
    }
    if (ind3.severity == 'MINOR') {
      csType = '<span class="badge badge-warning badge-w64 rounded-0">MINOR</span>';
    }
    if (ind3.severity == 'INFO') {
      csType = '<span class="badge badge-success badge-w64 rounded-0">INFO</span>';
    }
    csMessage = ind3.message;
    csComponent = ind3.component;
    tableCSContent += '<tr><td>' + csType + '</td><td><div>' + csMessage + '</div></td><td><div style="max-width:450px;">' + csComponent + '</div></td></tr>';
  });
  return tableCSContent;
}

function appendBugsContent(bugs, tableBugsContent) {
  bugs.issues.forEach(function (ind2, v) {
    var bugtype = '';
    var bugMessage = '';
    var bugComponent = '';
    if (ind2.severity == 'MAJOR') {
      bugtype = '<span class="badge badge-danger rounded-0">MAJOR</span>';
    }
    if (ind2.severity == 'MINOR') {
      bugtype = '<span class="badge badge-warning rounded-0">MINOR</span>';
    }
    bugMessage = ind2.message;
    bugComponent = ind2.component;
    tableBugsContent += '<tr><td>' + bugtype + '</td><td><div>' + bugMessage + '</div></td><td><div style="max-width:450px;">' + bugComponent + '</div></td></tr>';
  });
  return tableBugsContent;
}

function getPassedTestCasesCount(submission) {
  var passedTestCasesCount = 0;
  var resultMetadata = submission.result_metadata;
  if (resultMetadata) {
    resultMetadata = JSON.parse(resultMetadata);
    for (let idx = 0; idx < resultMetadata.length; idx++) {
      const testCase = resultMetadata[idx];
      if (testCase && testCase.status === 'True') {
        passedTestCasesCount++;
      }
    }
  }
  return passedTestCasesCount;
}

function fillRecruiterData(recruiter) {
  $('#test_recruiter_Name').html(recruiter.name);
  $('#test_recruiter_Email').html(recruiter.email);
}

function fillTestTopSection(test) {
  $('#test_Name').html(test.name);
  $('#test_Date').html((test.expiry_time).substring(0, 10));
  $('#test_Description').html(test.description);
  $('#test_Duration').html(parseInt(test.duration) / (60 * 60));
}

function drawLineChart() {
  var result_json = $('#test_data').text().trim();
  result = JSON.parse(result_json);
  console.log(result);
  result = JSON.parse(result);
  var test = result.test;
  var questions = test.questions;
  for (var i = 0; i < questions.length; i++) {
    var question = questions[i];
    var appandTo = 'chart_div_'+i;
    // Define an array and assign columns for the chart.
    var candidatesData = [['Name', 'Score',{ role: "style" }]];    
    // Loop through each data and populate the array.
    question.candidates.forEach(function (candidate, v) { 
      var color = '#0e7cda'; 
      candidatesData.push([candidate.name, candidate.score, color]);
    }); 
    // Set chart Options.
    var options = {
      title: '',
      bar: {groupWidth: "25%"},
      chartArea: {width: '45%'},
      legend: { position: "none" },
      hAxis: {
        title: 'Candidates',
        minValue: 0
      },
      vAxis: {
        title: 'Points'
      }
    };
    // Create DataTable and add the array to it.
    var figures = google.visualization.arrayToDataTable(candidatesData);
    // Define the chart type (LineChart) and the container (a DIV in our case).
    var chart = new google.visualization.ColumnChart(document.getElementById(appandTo));
    chart.draw(figures, options);      // Draw the chart with Options.
  }

}