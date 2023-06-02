function getSelectedRadioValueDonut() {
    var radioButtons = document.getElementsByName("basic-infos");
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        var selectedValue = radioButtons[i].value;
        //console.log(selectedValue);
        return selectedValue;
      }
    }
};

updateDonut();

var radioButtons = document.getElementsByName("basic-infos");
/*console.log(radioButtons[0]);
console.log(radioButtons[1]);
console.log(radioButtons[2]);*/

for (var i = 0; i < radioButtons.length; i++) {
  radioButtons[i].addEventListener("change", updateDonut);
};

function updateDonut() {
  console.log("donut was updated");

  var selVal = getSelectedRadioValueDonut();
  console.log(selVal);

  var chartcontainer = document.getElementById('donut-div');
  chartcontainer.innerHTML = '&nbsp;';
  $('#donut-div').append('<canvas id="myChart"></canvas>');

  var ctx = document.getElementById('myChart').getContext('2d');

  if (selVal=="gender"){
    console.log("it's gender");

    let data = {
      labels: ['Women', 'Men'],
      datasets: [{
        label: 'Gender',
        data: [196, 208],
        backgroundColor: ['rgb(255, 20, 147)', 'rgb(0, 0, 255)'],
        hoverOffset: 4
      }],
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: data,

      options: {

        legend: {
                display: true,
                labels: {
                    fontSize: 25,
                    fontFamily: 'sans-serif'
                }
            },

          plugins: {
            tooltip: {
              titleFontSize: 25
            }
          }
      }

    });

  } else if (selVal=="race"){
    console.log("it's race");

    let data = {
      labels: ['Asian', 'Black', 'Caucasian', 'Latinx', 'Other'],
      datasets: [{
        label: 'Race',
        data: [102, 19, 218, 35, 30],
        backgroundColor: ['rgb(77, 0, 41)', 'rgb(153, 0, 82)', 'rgb(255, 20, 147)', 'rgb(255, 153, 206)', 'rgb(255, 230, 243)'],
        hoverOffset: 4
      }],
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: data,

      options: {

        legend: {
                display: true,
                labels: {
                    fontSize: 25
                }
            }
      }

    });
  } else if (selVal=='level') {
    console.log("it's level");

    let data = {
      labels: ['Bachelor', 'Master', 'PhD'],
      datasets: [{
        label: 'Field',
        data: [316, 79, 9],
        backgroundColor: ['rgb(0, 0, 255)', 'rgb(128, 128, 255)', 'rgb(230, 230, 255)'],
        hoverOffset: 4
      }],
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: data,

      options: {

        legend: {
                display: true,
                labels: {
                    fontSize: 25
                }
            }
      }

    });
  }
}
