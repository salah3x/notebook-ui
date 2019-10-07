/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define([
  'ojs/ojcomposite',
  'text!./interpreter-cell-view.html',
  './interpreter-cell-viewModel',
  'text!./component.json',
  'css!./interpreter-cell-styles'
], function(Composite, view, viewModel, metadata) {
  Composite.register('interpreter-cell', {
    view: view,
    viewModel: viewModel,
    metadata: JSON.parse(metadata)
  });
});
