module.exports = (function() {
  var css           = require("../css/avatar.css");

  var $             = require('jquery');
  var Cropper       = require('cropperjs');

  var verbose       = false;
  var imageSize     = null;
  var cropInstance  = null;
  var $container    = null;

  var template      = `
    <div id="avatar-cropper">
      <img id="avatar-cropper-picture" src="picture.jpg"  />
      <img id="avatar-cropper-mask"    src="mask.png"     />
    </div>
    <div id="avatar-cropper-crop">Erstellen</div>
  `

  function init(parameters) {
    _setupConfig(Object.assign({}, {
      verbose:      false,
      container:    null,
      imageSize:    300
    }, parameters));
    _render();
  }

  function _setupConfig(opts) {
    verbose     = opts['verbose'];
    imageSize   = opts['imageSize'];

    $container  = $(opts['container']);
  }

  function _setupDom() {
    $container.html($.parseHTML(template));

    $picture    = $container.find("#avatar-cropper-picture");
    $mask       = $container.find("#avatar-cropper-mask");
  }

  function _render() {
    if(verbose) console.log("Rendering to", $container);

    _setupDom();
    _setupCropper();
    _setupListeners();
  }

  function _setupCropper() {
    cropInstance = new Cropper($picture[0], {
      aspectRatio: 1,
      guides: false,
      center: false,
      crop: function(e) {
        var cropBox = $(".cropper-crop-box")[0];
        $mask.attr("style", $(cropBox).attr("style"));
      }
    });
  }

  function _setupListeners() {
    $("body").on("click", "#avatar-cropper-crop", function(event) {
      console.log("CROPPING");
    });
  }

  return {
    init: init
  }
})()