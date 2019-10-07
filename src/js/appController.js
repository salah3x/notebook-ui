/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define([
  'ojs/ojresponsiveutils',
  'ojs/ojresponsiveknockoututils',
  'knockout',
  'ojs/ojknockout'
], function(ResponsiveUtils, ResponsiveKnockoutUtils, ko) {
  function ControllerViewModel() {
    var self = this;

    // Media queries for repsonsive layouts
    var smQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
    );
    self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

    // Application Name used in Branding Area
    self.appName = ko.observable('Interactive Notebook');
  }

  return new ControllerViewModel();
});
