module.exports = (function() {
  var css           = require("../css/avatar.css");
  var maskImage     = require("../img/mask.png");

  var $             = require('jquery');
  var Cropper       = require('cropperjs');

  var verbose       = false;
  var imageSize     = null;
  var cropper       = null;
  var $container    = null;

  var template      = `
    <div id="avatar-cropper">
      <img id="avatar-cropper-picture" src=""  />
      <img id="avatar-cropper-mask"    src="`+ maskImage +`"     />
      <a href="#" class="avatar-cropper-back" id="avatar-cropper-back-upload">&#8249;</a>
      <a href="#" id="avatar-cropper-crop">Avatar erstellen</a>

      <div id="avatar-cropper-upload">
        <div id="avatar-cropper-upload-cta">Erstelle Deinen eigenen <b>BTHVN2020 Avatar</b></div>
        <div id="avatar-cropper-samples"></div>
        <div id="avatar-cropper-upload-button">
          <input id="avatar-cropper-upload-file" type="file" />
          <label for="avatar-cropper-upload-file">Lade Dein Bild hoch</label>
        </div>
      </div>

      <div id="avatar-cropper-result">
        <canvas></canvas>
        <a href="#" class="avatar-cropper-back" id="avatar-cropper-back-crop">&#8249;</a>
        <a href="#" id="avatar-cropper-download">Avater herunterladen</a>
      </div>    
    </div>    
  `

  function init(parameters) {
    _setupConfig(Object.assign({}, {
      verbose:      false,
      container:    null,
      imageSize:    634
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
    cropper = new Cropper($picture[0], {
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
      event.preventDefault();
      _crop();
    });

    $("body").on("click", "#avatar-cropper-download", function(event) {
      _download(this);
    });

    $("body").on("change", "#avatar-cropper-upload-file", function(event) {
      _upload(this);
    });

    $("body").on("click", "#avatar-cropper-back-upload", function(event) {
      event.preventDefault();
      $("#avatar-cropper-upload").show();
    });

    $("body").on("click", "#avatar-cropper-back-crop", function(event) {
      event.preventDefault();
      $("#avatar-cropper-result").hide();
      $("#avatar-cropper-download").hide();
      $("#avatar-cropper-crop").show();
    });
  }

  function _upload(uploader) {
    var file      = uploader.files[0]
    var imageType = /image.*/;
    if (!file.type.match(imageType))
        return;
    var reader = new FileReader();
    reader.onload = function(event) {
      cropper.replace(event.target.result);
      $("#avatar-cropper-upload").hide();
    };
    reader.readAsDataURL(file);
  }

  function _crop() {
    var canvas = cropper.getCroppedCanvas({
      width: imageSize,
      height: imageSize
    });

    var ctx = canvas.getContext("2d");
    var mask = new Image();

    var mask = new Image();
    mask.onload = function () {
      ctx.drawImage(mask, 0, 0, imageSize, imageSize);
      $("#avatar-cropper-result").find("canvas").replaceWith(canvas);
      $("#avatar-cropper-result").show();
      $("#avatar-cropper-download").show();
      $("#avatar-cropper-crop").hide();
    }

    mask.src = $("#avatar-cropper-mask").attr("src");  
  }

  function _download(link) {
    link.href = $("#avatar-cropper-result").find("canvas")[0].toDataURL();
    link.download = "BTHVN2020-Avatar.png";
  }

  return {
    init: init
  }
})()