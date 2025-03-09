/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 *
 * This plugin requires the following libraries, they can include with CDN services.
 * The sample file "fileupload_jQuery_MySQL.html" of INTER-Mediator located
 * "INTER-Mediator/samples/Sample_webpage/" includes the loading code ot them.
 *
 * Bootstrap (http://getbootstrap.com/)
 * JQuery (https://jquery.com/)
 * jQuery UI (https://api.jqueryui.com/)
 * Blueimp jQuery File Upload (https://github.com/blueimp/jQuery-File-Upload)
 */
// Developping chart plug-in.
IMParts_Catalog.chartjs = {
  requiredParameters: 5,
  parameter: [],
  ids: [],
  size: [500,500],
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
  /*
  **** A sample of options ****
  * c.f. https://stackoverflow.com/questions/27910719/in-chart-js-set-chart-title-name-of-x-axis-and-y-axis
  IMParts_Catalog.chartjs.options = scales: {
    y: {
      title: {
        display: true,
        text: 'Total Sales'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Customer'
      }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
  }
}
   */

  instantiate: function (targetNode, params) {
    INTERMediator.setIdValue(targetNode)
    this.ids.push(targetNode.id)
    this.parameter.push(params)
  },

  finish: function () {
    const maxIds = this.ids.length
    for (let index = 0; index < maxIds; index += 1) {
      const target = document.getElementById(this.ids[index])
      const canvas = document.createElement("canvas")
      canvas.style.width = `${this.size[0]}px`
      canvas.style.height = `${this.size[1]}px`
      target.appendChild(canvas)
      // const canvas = target.querySelector("canvas")
      const param = this.parameter[index]
      const contextName = param[0]
      const chartType = param[1]
      const labelField = param[2]
      const dataName = param[3].split(',')
      const dataFields = param[4].split(',')
      const targetContext = IMLibContextPool.getNearestContext(target, contextName)
      if (targetContext) {
        const keys = Object.keys(targetContext.store)
        const labelArray = []
        const dataArray = []
        for (const key of keys) {
          const label = targetContext.store[key][labelField]
          labelArray.push(label)
          const oneData = {x: label}
          for (const field of dataFields) {
            oneData[field] = targetContext.store[key][field]
          }
          dataArray.push(oneData)
        }
        const dataSetArray = []
        let ix = 0;
        for (const field of dataFields) {
          const dataLabel = dataName[ix] ? dataName[ix] : dataName[0]
          dataSetArray.push({label: dataLabel, data: dataArray, parsing: {yAxisKey: field}})
          ix += 1
        }
        console.log(dataSetArray)
        new Chart(canvas, {
          type: chartType,
          data: {
            labels: labelArray,
            datasets: dataSetArray
          },
          options: this.options[contextName] ?? this.options ?? {}
        });
      }
    }
  }
}
