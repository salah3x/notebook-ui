/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
define([
  'knockout',
  'jquery',
  'ojL10n!./resources/nls/interpreter-cell-strings',
  'ojs/ojarraydataprovider',
  'ojs/ojinputtext',
  'ojs/ojbutton',
  'ojs/ojprogress',
  'ojs/ojmessages',
  'ojs/ojchart'
], function(ko, $, componentStrings, ArrayDataProvider) {
  function ExampleComponentModel(context) {
    var self = this;

    //At the start of your viewModel constructor
    var busyContext = oj.Context.getContext(context.element).getBusyContext();
    var options = { description: 'CCA Startup - Waiting for data' };
    self.busyResolve = busyContext.addBusyState(options);

    self.composite = context.element;

    self.properties = context.properties;
    self.res = componentStrings['interpreter-cell'];

    // Session Id
    self.sessionId = ko.observable(null);

    // The input field
    self.code = ko.observable(
      '%js\nconsole.log("SeriesA\\tSeriesB\\tSeriesC\\n1\\t2\\t3\\n4\\t5\\t6")'
    );

    // Input validator
    self.validators = ko.pureComputed(function() {
      return [
        {
          type: 'regExp',
          options: {
            pattern: '%[a-zA-Z]+\\n[\\W\\w]+',
            messageDetail:
              'Example: %js<LINE BREAK>console.log("Hello world!"); ...'
          }
        }
      ];
    });

    // The state of the request
    self.loading = ko.observable(false);

    // The excution result
    self.result = ko.observable(null);

    // Parsed result data (Converted to the appropiate format and pushed to ChartData when chart type change)
    self.parsedResult = null;

    // Chart type
    self.chartType = ko.observable('bar');

    // Chart data
    self.chartData = ko.observableArray(null);
    self.dataProvider = new ArrayDataProvider(self.chartData, {
      keyAttributes: 'id'
    });

    // The error message
    self.errors = ko.observableArray([]);
    self.messagesDataprovider = new ArrayDataProvider(self.errors);
    self.classObs = ko.observable();

    // Click handler
    self.execute = () => {
      if ($('#text-area')[0].valid !== 'valid') return;
      self.loading(true);
      $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/execute',
        contentType: 'application/json',
        data: JSON.stringify({
          code: self.code(),
          sessionId: self.sessionId()
        }),
        success: data => {
          self.loading(false);
          self.result(data);
          self.classObs(
            data.success ? 'oj-panel oj-panel-alt1' : 'oj-panel oj-panel-alt4'
          );
          self.chartType('bar');
          if (data.sessionId) self.sessionId(data.sessionId);
          if (!self.result().success) {
            self.dataItems(null);
            return;
          }
          // Parse data
          const rows = data.result.trim().split('\n');
          const series = rows.shift().split('\t');
          const dataItems = [];
          let id = 0;
          for (const [j, row] of rows.entries()) {
            const items = row.split('\t');
            for (const [i, serie] of series.entries()) {
              const dataItem = {};
              dataItem.serie = serie;
              dataItem.group = j + 1;
              dataItem.value = +items[i] ? +items[i] : 0;
              dataItem.id = ++id;
              dataItems.push(dataItem);
            }
          }
          self.parsedResult = dataItems;
          // Send data to the chart
          self.chartData(dataItems);
        },
        error: err => {
          self.loading(false);
          self.result(null);
          const errMessage =
            err.status == 0 ? 'Connection failed' : err.responseJSON.message;
          self.errors.push({
            severity:
              err.status >= 500 || err.status == 0
                ? 'error'
                : err.status >= 400
                ? 'warning'
                : 'info',
            summary:
              err.status >= 500 || err.status == 0
                ? 'Server Error'
                : err.status >= 400
                ? 'Bad Request'
                : 'Error',
            detail: errMessage,
            autoTimeout: 5000
          });
        }
      });
    };

    // Chart type changed event handler (change data according to chart type)
    self.chartType.subscribe(chart => {
      if (chart === 'bar') self.chartData(self.parsedResult);
      else if (chart === 'pie') {
        let data = [];
        for (let item of this.parsedResult) {
          let d = data.find(i => i.serie === item.serie);
          if (d) d.value += item.value;
          else data.push({ ...item });
        }
        self.chartData(data);
      } else if (chart === 'scatter') {
        let data = [];
        let size = self.parsedResult.filter(i => i.group === 1).length;
        for (let i = 0; i < self.parsedResult.length; i += size * 2) {
          for (let j = 0; j < size; j++) {
            let d = {
              ...self.parsedResult[i + j],
              x: self.parsedResult[i + j].value,
              y:
                (self.parsedResult[size + i + j] &&
                  self.parsedResult[size + i + j].value) ||
                0,
              group: parseInt(self.parsedResult[i].group / 2) + 1
            };
            delete d.value;
            data.push(d);
          }
        }
        self.chartData(data);
      }
    });

    // Example for parsing context properties
    // if (context.properties.name) {
    //     parse the context properties here
    // }

    //Once all startup and async activities have finished, relocate if there are any async activities
    self.busyResolve();
  }

  //Lifecycle methods - uncomment and implement if necessary
  //ExampleComponentModel.prototype.activated = function(context){
  //};

  //ExampleComponentModel.prototype.connected = function(context){
  //};

  //ExampleComponentModel.prototype.bindingsApplied = function(context){
  //};

  //ExampleComponentModel.prototype.disconnect = function(context){
  //};

  //ExampleComponentModel.prototype.propertyChanged = function(context){
  //};

  return ExampleComponentModel;
});
