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
      '%js\nvar data = "SeriesA\\tSeriesB\\tSeriesC\\n1\\t2\\t3\\n4\\t5\\t6"\ndata'
      // '%js\nconsole.log("SeriesA\\tSeriesB\\tSeriesC\\n1\\t2\\t3\\n4\\t5\\t6")'
    );

    // Input validator
    self.validators = ko.pureComputed(function() {
      return [
        {
          type: 'regExp',
          options: {
            pattern: '%[a-zA-Z]+\\n[\\W\\w]+',
            messageDetail: 'Example:\n%js\n1 + 1;\n"Hello ".concat("world!");'
          }
        }
      ];
    });

    // The state of the request
    self.loading = ko.observable(false);

    // The excution result
    self.result = ko.observable(null);

    // Parsed result
    self.dataItems = ko.observableArray(null);
    self.dataProvider = new ArrayDataProvider(self.dataItems, {
      keyAttributes: 'id'
    });

    // The error message
    self.errors = ko.observableArray([]);
    self.messagesDataprovider = new ArrayDataProvider(self.errors);
    self.classObs = ko.observable();

    // Chart type
    self.chartType = ko.observable('bar');

    // Click handler
    self.execute = () => {
      if ($('#text-area')[0].valid !== 'valid') {
        return;
      }
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
          if (data.sessionId) self.sessionId(data.sessionId);
          // Parse data
          if (!self.result().success) {
            self.dataItems(null);
            return;
          }
          const rows = data.result.split('\n');
          const labels = rows.shift().split('\t');
          const dataItems = [];
          for (const [j, row] of rows.entries()) {
            const items = row.split('\t');
            const dataItem = {};
            for (const [i, label] of labels.entries()) {
              dataItem[label] = +items[i];
            }
            dataItem.id = j;
            dataItems.push(dataItem);
          }
          self.dataItems(dataItems);
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
