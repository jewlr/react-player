'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YouTube = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _singlePlayer = require('../singlePlayer');

var _singlePlayer2 = _interopRequireDefault(_singlePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SDK_URL = 'https://www.youtube.com/iframe_api';
var SDK_GLOBAL = 'YT';
var SDK_GLOBAL_READY = 'onYouTubeIframeAPIReady';
var MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=/;
var MATCH_PLAYLIST = /list=([a-zA-Z0-9_-]+)/;

function parsePlaylist(url) {
  if (MATCH_PLAYLIST.test(url)) {
    var _url$match = url.match(MATCH_PLAYLIST),
        _url$match2 = _slicedToArray(_url$match, 2),
        playlistId = _url$match2[1];

    return {
      listType: 'playlist',
      list: playlistId
    };
  }
  return {};
}

var YouTube = exports.YouTube = function (_Component) {
  _inherits(YouTube, _Component);

  function YouTube() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, YouTube);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = YouTube.__proto__ || Object.getPrototypeOf(YouTube)).call.apply(_ref, [this].concat(args))), _this), _this.callPlayer = _utils.callPlayer, _this.onStateChange = function (_ref2) {
      var data = _ref2.data;
      var _this$props = _this.props,
          onPlay = _this$props.onPlay,
          onPause = _this$props.onPause,
          onBuffer = _this$props.onBuffer,
          onBufferEnd = _this$props.onBufferEnd,
          onEnded = _this$props.onEnded,
          onReady = _this$props.onReady,
          loop = _this$props.loop;
      var _window$SDK_GLOBAL$Pl = window[SDK_GLOBAL].PlayerState,
          PLAYING = _window$SDK_GLOBAL$Pl.PLAYING,
          PAUSED = _window$SDK_GLOBAL$Pl.PAUSED,
          BUFFERING = _window$SDK_GLOBAL$Pl.BUFFERING,
          ENDED = _window$SDK_GLOBAL$Pl.ENDED,
          CUED = _window$SDK_GLOBAL$Pl.CUED;

      if (data === PLAYING) {
        onPlay();
        onBufferEnd();
      }
      if (data === PAUSED) onPause();
      if (data === BUFFERING) onBuffer();
      if (data === ENDED) {
        var isPlaylist = !!_this.callPlayer('getPlaylist');
        if (loop && !isPlaylist) {
          _this.play(); // Only loop manually if not playing a playlist
        }
        onEnded();
      }
      if (data === CUED) onReady();
    }, _this.mute = function () {
      _this.callPlayer('mute');
    }, _this.unmute = function () {
      _this.callPlayer('unMute');
    }, _this.ref = function (container) {
      _this.container = container;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(YouTube, [{
    key: 'load',
    value: function load(url, isReady) {
      var _this2 = this;

      var _props = this.props,
          playing = _props.playing,
          muted = _props.muted,
          playsinline = _props.playsinline,
          controls = _props.controls,
          loop = _props.loop,
          config = _props.config,
          _onError = _props.onError;
      var _config$youtube = config.youtube,
          playerVars = _config$youtube.playerVars,
          embedOptions = _config$youtube.embedOptions;

      var id = url && url.match(MATCH_URL)[1];
      if (isReady) {
        if (MATCH_PLAYLIST.test(url)) {
          this.player.loadPlaylist(parsePlaylist(url));
          return;
        }
        this.player.cueVideoById({
          videoId: id,
          startSeconds: (0, _utils.parseStartTime)(url) || playerVars.start,
          endSeconds: (0, _utils.parseEndTime)(url) || playerVars.end
        });
        return;
      }
      (0, _utils.getSDK)(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY, function (YT) {
        return YT.loaded;
      }).then(function (YT) {
        if (!_this2.container) return;
        _this2.player = new YT.Player(_this2.container, _extends({
          width: '100%',
          height: '100%',
          videoId: id,
          playerVars: _extends({
            autoplay: playing ? 1 : 0,
            mute: muted ? 1 : 0,
            controls: controls ? 1 : 0,
            start: (0, _utils.parseStartTime)(url),
            end: (0, _utils.parseEndTime)(url),
            origin: window.location.origin,
            playsinline: playsinline
          }, parsePlaylist(url), playerVars),
          events: {
            onReady: _this2.props.onReady,
            onStateChange: _this2.onStateChange,
            onError: function onError(event) {
              return _onError(event.data);
            }
          }
        }, embedOptions));
        if (loop) {
          _this2.player.setLoop(true); // Enable playlist looping
        }
      }, _onError);
    }
  }, {
    key: 'play',
    value: function play() {
      this.callPlayer('playVideo');
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.callPlayer('pauseVideo');
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (!document.body.contains(this.callPlayer('getIframe'))) return;
      this.callPlayer('stopVideo');
    }
  }, {
    key: 'seekTo',
    value: function seekTo(amount) {
      this.callPlayer('seekTo', amount);
      if (!this.props.playing) {
        this.pause();
      }
    }
  }, {
    key: 'setVolume',
    value: function setVolume(fraction) {
      this.callPlayer('setVolume', fraction * 100);
    }
  }, {
    key: 'setPlaybackRate',
    value: function setPlaybackRate(rate) {
      this.callPlayer('setPlaybackRate', rate);
    }
  }, {
    key: 'setLoop',
    value: function setLoop(loop) {
      this.callPlayer('setLoop', loop);
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.callPlayer('getDuration');
    }
  }, {
    key: 'getCurrentTime',
    value: function getCurrentTime() {
      return this.callPlayer('getCurrentTime');
    }
  }, {
    key: 'getSecondsLoaded',
    value: function getSecondsLoaded() {
      return this.callPlayer('getVideoLoadedFraction') * this.getDuration();
    }
  }, {
    key: 'render',
    value: function render() {
      var style = _extends({
        width: '100%',
        height: '100%'
      }, this.props.style);
      return _react2['default'].createElement(
        'div',
        { style: style },
        _react2['default'].createElement('div', { ref: this.ref })
      );
    }
  }]);

  return YouTube;
}(_react.Component);

YouTube.displayName = 'YouTube';

YouTube.canPlay = function (url) {
  return MATCH_URL.test(url);
};

exports['default'] = (0, _singlePlayer2['default'])(YouTube);