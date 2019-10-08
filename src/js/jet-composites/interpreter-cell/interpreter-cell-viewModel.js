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
  'ojs/ojmessages'
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

    // The input field
    self.code = ko.observable(
      '%js\nvar data = "SeriesA\\tSeriesB\\tSeriesC\\n1\\t2\\t3\\n4\\t5\\t6"\ndata'
    );

    // The state of the request
    self.loading = ko.observable(false);

    // The excution result
    self.result = ko.observable({});

    // The error message
    self.errors = ko.observableArray([]);
    self.messagesDataprovider = new ArrayDataProvider(self.errors);

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
          code: self.code()
        }),
        success: data => {
          self.loading(false);
          console.log(data);
        },
        error: err => {
          self.loading(false);
          let errMessage =
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
